const { app, BrowserWindow, ipcMain } = require("electron");
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");
const Database = require("./database");
const os = require("os");

let mainWindow;
const expressApp = express();
const server = http.createServer(expressApp);
const io = new Server(server, {
	cors: {
		origin: "*",
		methods: ["GET", "POST"],
	},
});

function getServerHostname() {
	return os.hostname(); // be hostname server dastresi peyda mikonad
}

function getLocalIp() {
	const interfaces = os.networkInterfaces();
	for (const interfaceName in interfaces) {
		for (const iface of interfaces[interfaceName]) {
			if (iface.family === "IPv4" && !iface.internal) {
				return iface.address;
			}
		}
	}
	return "127.0.0.1"; // Agar IP peyda nashod
}
let SERVER_IP = getLocalIp(); // IP LAN
const SERVER_PORT = 4000;
console.log({ getServerHostname: getServerHostname() });
const serverHostname = getServerHostname();
SERVER_IP = serverHostname;
console.log({ SERVER_IP });

// Setup database
const db = new Database();

// Electron Window
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

	// Load `index.html` az build shode Vite
	mainWindow.loadURL(`file://${__dirname}/renderer/dist/index.html`);
	mainWindow.webContents.openDevTools(); // Debug Kon	// mainWindow.loadURL("http://localhost:5173"); // **React App ro Load Kon**
});
// app.applicationSupportsSecureRestorableState = () => true;

// WebSocket Connection
io.on("connection", (socket) => {
	console.log("New Client Connected:", socket.id);

	// Send stored messages to new client
	db.getMessages().then((messages) => {
		socket.emit("load_messages", messages);
	});

	// Receive new message from client
	socket.on("new_message", async (data) => {
		await db.saveMessage(data);
		io.emit("receive_message", data); // Broadcast to all clients
	});
});

// Express Route (Test)
expressApp.get("/", (req, res) => {
	res.send("Server is running...");
});
// API baraye ferestad IP server be React
ipcMain.handle("getServerIp", async () => {
	return SERVER_IP;
});
// Start Server on LAN
server.listen(SERVER_PORT, () => {
	console.log(`🚀 Server running on http://${SERVER_IP}:${SERVER_PORT}`);
});
