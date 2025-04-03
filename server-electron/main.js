const { app, BrowserWindow, ipcMain } = require("electron");
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const mdns = require("multicast-dns")();
const os = require("os");
const Database = require("./database");

// Config
const SERVER_PORT = 4000;
const MDNS_SERVICE_NAME = "myapp.local";
let SERVER_IP = getLocalIp(); // LAN IP
let mainWindow;

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

// --- Express & Socket.io Setup ---
const expressApp = express();
const httpServer = http.createServer(expressApp);
const io = new Server(httpServer, {
	cors: { origin: "*", methods: ["GET", "POST"] },
});

// --- Database Setup ---
const db = new Database();

// --- Socket.io Events ---
io.on("connection", (socket) => {
	console.log(`🔌 Client Connected: ${socket.id}`);

	// Load previous messages
	db.getMessages().then((messages) => {
		socket.emit("load_messages", messages);
	});

	// Handle new messages
	socket.on("new_message", async (data) => {
		await db.saveMessage(data);
		io.emit("receive_message", data); // Broadcast
	});

	socket.on("disconnect", () => {
		console.log(`❌ Client Disconnected: ${socket.id}`);
	});
});

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
});

// --- API for React (Get Server IP) ---
ipcMain.handle("getServerIp", () => SERVER_IP);

// --- Start Server ---
httpServer.listen(SERVER_PORT, () => {
	console.log(`🚀 Server Running → http://${SERVER_IP}:${SERVER_PORT}`);
});
