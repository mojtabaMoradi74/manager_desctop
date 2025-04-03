const { app, BrowserWindow, ipcMain } = require("electron");
const { io } = require("socket.io-client");
const mdns = require("multicast-dns")();

// Config
const MDNS_SERVICE_NAME = "myapp.local";
const SERVER_PORT = 4000;
const MAX_RETRIES = 5;
const RETRY_DELAY = 2000; // 2s

let mainWindow;
let SERVER_IP = null;
let socket = null;
let retryCount = 0;
let isDiscovering = false;
let isConnected = false;
let isConnecting = false;

// --- Server Discovery (mDNS) ---
function discoverServer() {
	if (isDiscovering || SERVER_IP || isConnected) return console.log("🔴 Discovering server return..."); // 🔴 از اتصال مجدد جلوگیری می‌کند

	isDiscovering = true;
	console.log("🔍 Discovering server...");

	mdns.query({
		questions: [{ name: MDNS_SERVICE_NAME, type: "A" }],
	});

	// Timeout if no response
	const discoveryTimeout = setTimeout(() => {
		if (!SERVER_IP && retryCount < MAX_RETRIES) {
			retryCount++;
			console.log(`🔄 Retrying... (${retryCount}/${MAX_RETRIES})`);
			discoverServer();
		} else if (!SERVER_IP) {
			console.error("❌ Server not found after max retries!");
			isDiscovering = false;
			isConnecting = false;
		}
	}, RETRY_DELAY);

	mdns.on("response", (response) => {
		response.answers.forEach((answer) => {
			if (answer.type === "A" && answer.name === MDNS_SERVICE_NAME) {
				console.error("❌ clearTimeout retries!");
				clearTimeout(discoveryTimeout);
				SERVER_IP = answer.data;
				console.log(`✅ Server found at: ${SERVER_IP}`);
				connectToServer();
				isDiscovering = false;
			}
		});
	});
}

// --- Socket.io Connection ---
function connectToServer() {
	if (isConnected) return; // 🔴 اگر قبلاً متصل شده، کاری نکند
	isConnecting = true;

	if (socket) socket.disconnect(); // Clear old connection

	console.log(`🔗 Connecting to server at ${SERVER_IP}...`);
	socket = io(`http://${SERVER_IP}:${SERVER_PORT}`, {
		reconnection: true,
		reconnectionAttempts: 3,
		reconnectionDelay: 1000,
	});

	socket.on("connect", () => {
		console.log("🌐 Connected to server!");
		isConnected = true; // 🔴 وضعیت اتصال را ثبت می‌کند
		isConnecting = false;
	});

	socket.on("connect_error", (err) => {
		isConnected = false; // 🔴 وضعیت اتصال را ثبت می‌کند
		console.error("⚠️ Connection failed:", err.message);
		if (!SERVER_IP) discoverServer(); // Retry discovery
	});

	socket.on("receive_message", (data) => {
		console.log("📩 New message:", data);
		if (mainWindow) mainWindow.webContents.send("new_message", data);
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

	// Start discovery
	discoverServer();
});

// --- Cleanup on Exit ---
app.on("window-all-closed", () => {
	if (socket) socket.disconnect();
	app.quit();
});

// --- API for React (Get Server IP) ---
ipcMain.handle("getServerIp", () => SERVER_IP);
