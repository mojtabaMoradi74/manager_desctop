const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const MulticastDNS = require("multicast-dns");
// این خط مهم است - mdns یک تابع سازنده است
const mdns = MulticastDNS(); // اینجا () فراموش نشود
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const os = require("os");
const path = require("path");
const Database = require("./database");

// Config
const CONFIG = {
	SERVICE_NAME: "myapp._tcp.local", // استاندارد mDNS برای سرویس‌های TCP
	PORT: 4000,
	MAX_RETRIES: 5,
	RETRY_DELAY: 2000,
	ENCRYPTION_KEY: process.env.ENCRYPTION_KEY || "default-dev-key", // در تولید باید تغییر کند
};
const SERVICE_CONFIG = {
	name: "my-chat-server",
	type: "tcp",
	port: 4000,
	protocol: "tcp",
	txt: {
		version: "1.0",
		auth: "simple-auth",
	},
};

let mainWindow;
let server = null;
let ioServer = null;
let isServer = false;
let serverIp = null;

// تابع برای دریافت IP محلی
function getLocalIp() {
	const interfaces = os.networkInterfaces();
	for (const iface of Object.values(interfaces).flat()) {
		if (iface.family === "IPv4" && !iface.internal && iface.address !== "127.0.0.1") {
			return iface.address;
		}
	}
	return "127.0.0.1";
}

// انتشار سرویس با mDNS
function advertiseService() {
	const ip = getLocalIp();

	mdns.on("query", (query) => {
		query.questions.forEach((q) => {
			if (q.name === `${SERVICE_CONFIG.name}.${SERVICE_CONFIG.type}.local`) {
				console.log("Responding to mDNS query");
				mdns.respond({
					answers: [
						{
							name: `${SERVICE_CONFIG.name}.${SERVICE_CONFIG.type}.local`,
							type: "SRV",
							data: {
								port: SERVICE_CONFIG.port,
								weight: 0,
								priority: 10,
								target: os.hostname() + ".local",
							},
						},
						{
							name: `${SERVICE_CONFIG.name}.${SERVICE_CONFIG.type}.local`,
							type: "TXT",
							data: SERVICE_CONFIG.txt,
						},
					],
					additionals: [
						{
							name: os.hostname() + ".local",
							type: "A",
							ttl: 300,
							data: ip,
						},
					],
				});
			}
		});
	});

	// انتشار دوره‌ای سرویس
	setInterval(() => {
		mdns.query({
			questions: [
				{
					name: `${SERVICE_CONFIG.name}.${SERVICE_CONFIG.type}.local`,
					type: "PTR",
				},
			],
		});
	}, 60000);
}

// شروع سرور
advertiseService();
console.log("Server advertising via mDNS...");

// --- Helper Functions ---
function getNetworkInfo() {
	const interfaces = os.networkInterfaces();
	const result = {
		ip: null,
		mac: null,
		netmask: null,
	};

	for (const iface of Object.values(interfaces).flat()) {
		if (iface.family === "IPv4" && !iface.internal) {
			result.ip = iface.address;
			result.mac = iface.mac;
			result.netmask = iface.netmask;
			break;
		}
	}

	if (!result.ip) throw new Error("No valid network interface found");
	return result;
}

// --- Server Initialization ---
async function initializeServer() {
	try {
		const { ip } = getNetworkInfo();
		serverIp = ip;
		isServer = true;

		const expressApp = express();
		server = http.createServer(expressApp);

		// Socket.io با تنظیمات امنیتی
		ioServer = new Server(server, {
			cors: {
				origin: "*",
				methods: ["GET", "POST"],
				allowedHeaders: ["x-auth-token"],
				credentials: true,
			},
			connectionStateRecovery: {
				maxDisconnectionDuration: 2 * 60 * 1000, // 2 دقیقه
				skipMiddlewares: true,
			},
			allowEIO3: true, // برای سازگاری با نسخه‌های قدیمی
		});

		// Database initialization

		async function initializeServer() {
			try {
				const db = new Database();
				await db.init();

				// بقیه کدهای راه‌اندازی سرور...
			} catch (error) {
				console.error("Server initialization failed:", error);
				process.exit(1);
			}
		}
		initializeServer();
		// mDNS Advertisement (با استاندارد SRV برای سرویس‌های TCP)
		mdns.on("query", (query) => {
			query.questions.forEach((q) => {
				if (q.name === CONFIG.SERVICE_NAME) {
					mdns.respond({
						answers: [
							{
								name: CONFIG.SERVICE_NAME,
								type: "SRV",
								data: {
									port: CONFIG.PORT,
									weight: 0,
									priority: 10,
									target: os.hostname() + ".local",
								},
							},
							{
								name: CONFIG.SERVICE_NAME,
								type: "TXT",
								data: ["version=1.0", `auth=${CONFIG.ENCRYPTION_KEY}`],
							},
						],
						additionals: [
							{
								name: os.hostname() + ".local",
								type: "A",
								ttl: 300,
								data: serverIp,
							},
						],
					});
				}
			});
		});

		// Socket.io Events
		ioServer.on("connection", async (socket) => {
			console.log(`New connection from ${socket.handshake.address}`);

			// احراز هویت اولیه
			if (socket.handshake.auth.token !== CONFIG.ENCRYPTION_KEY) {
				socket.disconnect(true);
				return;
			}

			// ارسال اطلاعات اولیه
			socket.emit("server-info", {
				ip: serverIp,
				port: CONFIG.PORT,
				protocol: "http",
				serverTime: new Date().toISOString(),
			});

			// مدیریت رویدادها
			socket.on("message", handleIncomingMessage);
			socket.on("disconnect", handleDisconnection);
		});

		server.listen(CONFIG.PORT, () => {
			console.log(`Server running on http://${serverIp}:${CONFIG.PORT}`);
			if (mainWindow) {
				mainWindow.webContents.send("network-status", {
					mode: "server",
					ip: serverIp,
					port: CONFIG.PORT,
					status: "ready",
				});
			}
		});
	} catch (error) {
		console.error("Server initialization failed:", error);
		if (mainWindow) {
			mainWindow.webContents.send("network-status", {
				status: "error",
				message: error.message,
			});
		}
	}
}

// --- Client Discovery ---
// async function discoverNetworkServices() {
// 	return new Promise((resolve) => {
// 		const services = [];
// 		let timeout;

// 		const discovery = mdns({
// 			multicast: true,
// 			interface: getNetworkInfo().ip,
// 		});

// 		discovery.on("response", (response) => {
// 			response.answers.forEach((answer) => {
// 				if (answer.type === "SRV" && answer.name === CONFIG.SERVICE_NAME) {
// 					const txtRecord = response.answers.find((a) => a.type === "TXT" && a.name === CONFIG.SERVICE_NAME);
// 					const aRecord = response.additionals.find((a) => a.type === "A");

// 					if (aRecord) {
// 						services.push({
// 							ip: aRecord.data,
// 							port: answer.data.port,
// 							hostname: answer.data.target,
// 							version: txtRecord?.data.find((d) => d.startsWith("version="))?.split("=")[1],
// 							requiresAuth: txtRecord?.data.includes("auth="),
// 						});
// 					}
// 				}
// 			});
// 		});

// 		discovery.query({
// 			questions: [
// 				{
// 					name: CONFIG.SERVICE_NAME,
// 					type: "SRV",
// 				},
// 			],
// 		});

// 		timeout = setTimeout(() => {
// 			discovery.destroy();
// 			resolve(services);
// 		}, CONFIG.RETRY_DELAY);
// 	});
// }

async function discoverNetworkServices() {
	return new Promise((resolve) => {
		const services = [];
		let timeout;

		// دیگر نیازی به ایجاد نمونه جدید نیست، از همان mdns استفاده کنید
		mdns.on("response", (response) => {
			response.answers.forEach((answer) => {
				if (answer.type === "SRV" && answer.name === CONFIG.SERVICE_NAME) {
					const txtRecord = response.answers.find((a) => a.type === "TXT" && a.name === CONFIG.SERVICE_NAME);
					const aRecord = response.additionals.find((a) => a.type === "A");

					if (aRecord) {
						services.push({
							ip: aRecord.data,
							port: answer.data.port,
							hostname: answer.data.target,
							version: txtRecord?.data.find((d) => d.startsWith("version="))?.split("=")[1],
							requiresAuth: txtRecord?.data.includes("auth="),
						});
					}
				}
			});
		});

		mdns.query({
			questions: [
				{
					name: CONFIG.SERVICE_NAME,
					type: "SRV",
				},
			],
		});

		timeout = setTimeout(() => {
			mdns.destroy();
			resolve(services);
		}, CONFIG.RETRY_DELAY);
	});
}

// --- Electron App Lifecycle ---
app.whenReady().then(async () => {
	try {
		// Create window first for better UX
		mainWindow = new BrowserWindow({
			width: 1000,
			height: 800,
			webPreferences: {
				nodeIntegration: false,
				contextIsolation: true,
				sandbox: true,
				preload: path.join(__dirname, "preload.js"),
			},
			show: false,
		});

		mainWindow.on("ready-to-show", () => mainWindow.show());
		mainWindow.loadFile(path.join(__dirname, "renderer/dist/index.html"));

		// Start discovery process
		const services = await discoverNetworkServices();

		if (services.length > 0) {
			// Connect to first available server
			const selectedServer = services[0];
			mainWindow.webContents.send("network-status", {
				mode: "client",
				ip: selectedServer.ip,
				port: selectedServer.port,
				status: "connected",
			});
		} else {
			// Prompt for server creation
			const { response } = await dialog.showMessageBox(mainWindow, {
				type: "question",
				buttons: ["Run as Server", "Try Again", "Exit"],
				title: "Network Service",
				message: "No available servers found",
				detail: "Would you like to start a new server instance?",
			});

			if (response === 0) {
				await initializeServer();
			} else if (response === 1) {
				// Retry logic
			} else {
				app.quit();
			}
		}
	} catch (error) {
		console.error("Application startup failed:", error);
		app.quit();
	}
});

// Cleanup
app.on("window-all-closed", () => {
	if (server) server.close();
	app.quit();
});
