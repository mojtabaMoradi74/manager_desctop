const fs = require("fs");
const path = require("path");
const { app, BrowserWindow, ipcMain } = require("electron");
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const mdns = require("multicast-dns")();
const os = require("os");
const Database = require("./database");
const log = require("electron-log");

const logFilePath = path.join("server_logs.txt");
log.transports.file.resolvePathFn = () => path.join(app.getPath("userData"), "server_logs.txt");

console.log(app.getPath("userData"));

function logToFile(message) {
	const logMessage = `${new Date().toISOString()} - ${message}\n`;
	// fs.appendFileSync(logFilePath, logMessage);
	log.info(logMessage);
	// log.info
}
// Now write to the log file
logToFile(`Log entry at ${new Date().toISOString()}\n`);

// Config
const SERVER_PORT = 4000;
const MDNS_SERVICE_NAME = "myapp.local";
let SERVER_IP = getLocalIp(); // LAN IP
let mainWindow;
let server, io;

// --- Helper Functions ---
function getLocalIp() {
	const interfaces = os.networkInterfaces();
	for (const iface of Object.values(interfaces).flat()) {
		if (iface.family === "IPv4" && !iface.internal) {
			return iface.address;
		}
	}
	throw new Error("No valid LAN IP found!");
}

// --- mDNS Setup (Service Discovery) ---
mdns.on("query", (query) => {
	query.questions.forEach((q) => {
		if (q.name === MDNS_SERVICE_NAME) {
			console.log(`📶 mDNS Query: Responding with IP ${SERVER_IP}`);
			logToFile(`📶 mDNS Query: Responding with IP ${SERVER_IP}`);

			mdns.respond({
				answers: [
					{
						name: MDNS_SERVICE_NAME,
						type: "A",
						ttl: 300,
						data: SERVER_IP,
					},
				],
			});
		}
	});
});

// --- Database Setup ---
const db = new Database();

// --- Start Express & Socket.io ---
function startServer() {
	const expressApp = express();
	server = http.createServer(expressApp);
	io = new Server(server, {
		cors: { origin: "*", methods: ["GET", "POST"] },
	});

	// --- Socket.io Events ---
	io.on("connection", (socket) => {
		logToFile(`🔌 Client Connected: ${socket.id}`);

		console.log(`🔌 Client Connected: ${socket.id}`);

		// Load previous messages
		db.getMessages().then((messages) => {
			socket.emit("load_messages", messages);
		});

		// Handle new messages
		socket.on("new_message", async (data) => {
			logToFile(`🚀 new message ${JSON.stringify(data)}`);

			// await db.saveMessage(data);
			logToFile(`🚀 new message saved in db`);

			io.emit("receive_message", data); // Broadcast
			logToFile(`🚀 new message sended`);
		});
		socket.on("connect_error", (err) => {
			console.log("Socket connection error:", err);
		});
		socket.on("disconnect", () => {
			console.log(`❌ Client Disconnected: ${socket.id}`);
			log.info("server_logs.txt", `🚀 Server Running → http://${SERVER_IP}:${SERVER_PORT}\n`);
		});
	});

	// Start server
	server.listen(SERVER_PORT, () => {
		console.log(`🚀 Server Running → http://${SERVER_IP}:${SERVER_PORT}`);
		log.info("server_logs.txt", `🚀 Server Running → http://${SERVER_IP}:${SERVER_PORT}\n`);
	});
}

// --- Electron Window ---
app.whenReady().then(() => {
	mainWindow = new BrowserWindow({
		width: 800,
		height: 600,
		webPreferences: {
			nodeIntegration: false,
			contextIsolation: true,
			preload: __dirname + "/preload.js",
		},
	});

	mainWindow.loadURL(`file://${__dirname}/renderer/dist/index.html`);
	// if (process.env.NODE_ENV === "development")
	mainWindow.webContents.openDevTools();
	startServer(); // ✅ استارت سرور داخل خود Electron
});

// --- API for React (Get Server IP) ---
ipcMain.handle("getServerIp", () => SERVER_IP);
