const { app, BrowserWindow, ipcMain } = require("electron");
const { io } = require("socket.io-client");
const os = require("os");
const path = require("path");

// require('dotenv').config(); // Load .env file

let mainWindow;
// Peyda kardan IP dar LAN
function getLocalIp() {
	const interfaces = os.networkInterfaces();
	for (const interfaceName in interfaces) {
		for (const iface of interfaces[interfaceName]) {
			if (iface.family === "IPv4" && !iface.internal) {
				return iface.address;
			}
		}
	}
	return null;
}
let SERVER_IP = getLocalIp(); // IP LAN
const SERVER_PORT = 4000;

console.log({ SERVER_IP });
function getServerHostname() {
	return os.hostname(); // be hostname server dastresi peyda mikonad
}
const serverHostname = getServerHostname();
SERVER_IP = serverHostname;
console.log({ SERVER_IP });
const socket = io(`http://${SERVER_IP}:${SERVER_PORT}`, {
	transports: ["websocket", "polling"],
	// withCredentials: true, // Check kon ke azam be onvan credential nemifreste
});

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

	// console.log("path: ", `file://${__dirname}/renderer/index.html`);
	mainWindow.loadURL(`file://${__dirname}/renderer/dist/index.html`);
	// mainWindow.loadURL(path.join(__dirname, "renderer", "dist", "index.html"));
	// mainWindow.loadURL("http://localhost:5173"); // **React App ro Load Kon**
});
// app.applicationSupportsSecureRestorableState = () => true;

// API baraye ferestad IP server be React
ipcMain.handle("getServerIp", async () => {
	return SERVER_IP;
});
// Listen for new messages from server
socket.on("receive_message", (data) => {
	console.log("New Message Received:", data);
});
