const path = require("path");
const { app, BrowserWindow, ipcMain } = require("electron");
const mdns = require("multicast-dns")();
const os = require("os");
const log = require("electron-log");
const { default: Store } = require("electron-store");
// require("../src/backend/server");
const { spawn } = require("child_process");
const isDev = true; //process.env.NODE_ENV === "development";

let serverProcess;
const backendPath = isDev
	? path.join(__dirname, "../../src/backend/server.js")
	: path.join(process.resourcesPath, "../../src", "backend", "server.js");
serverProcess = spawn(process.execPath, [backendPath]);
serverProcess.stdout.on("data", (data) => {
	console.log(`stdout: ${data}`);
});
serverProcess.stderr.on("data", (data) => {
	console.error(`stderr: ${data}`);
});
serverProcess.on("close", (code) => {
	console.log(`child process exited with code ${code}`);
});
// --- Electron Setup ---
const isMac = process.platform === "darwin";
const isWin = process.platform === "win32";
const isLinux = process.platform === "linux";
const appName = app.getName();
const appVersion = app.getVersion();
const appId = app.getAppPath().split(path.sep).pop();
const appPath = app.getAppPath();
const appDataPath = app.getPath("userData");
const appDataDir = path.join(appDataPath, appName);
const appDataDirPath = path.join(appDataPath, appName, appVersion);
const appDataDirPath2 = path.join(appDataPath, appName, appId);
const appDataDirPath3 = path.join(appDataPath, appName, appId, appVersion);
const deviceName = os.hostname();

console.log(`deviceName: ${deviceName}`);
console.log(`isDev: ${isDev}`);
console.log(`isMac: ${isMac}`);
console.log(`isWin: ${isWin}`);
console.log(`isLinux: ${isLinux}`);
console.log(`App Name: ${appName}`);
console.log(`App Version: ${appVersion}`);
console.log(`App ID: ${appId}`);
console.log(`App Path: ${appPath}`);
console.log(`App Data Path: ${appDataPath}`);
console.log(`App Data Dir: ${appDataDir}`);
console.log(`App Data Dir Path: ${appDataDirPath}`);
console.log(`App Data Dir Path 2: ${appDataDirPath2}`);
console.log(`App Data Dir Path 3: ${appDataDirPath3}`);
console.log(`App Data Dir Path 4: ${backendPath}`);
console.log(`App Data Dir Path 5`);

const store = new Store();
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
const appConfig = store.get("appConfig");
const MDNS_SERVICE_NAME = `${appConfig.id}.local`;
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
	console.log("🔍 mDNS Query:", query);
	console.log(
		"🔍 mDNS check:",
		query.questions.map((q) => q.type === "A" && q.name.includes("system-server"))
	);

	query.questions.forEach((q) => {
		if (q.name === MDNS_SERVICE_NAME || q.name.includes("system-server")) {
			console.log(`📶 mDNS Query: Responding with IP ${SERVER_IP}`);
			logToFile(`📶 mDNS Query: Responding with IP ${SERVER_IP}`);

			mdns.respond({
				answers: [
					{
						name: q.name,
						type: "A",
						ttl: 300,
						data: SERVER_IP,
					},
					{
						name: q.name,
						type: "TXT",
						ttl: 300,
						data: JSON.stringify({
							ip: SERVER_IP,
							id: appConfig.id,
							name: appConfig.name,
							version: appConfig.version,
							type: appConfig.type,
							platform: appConfig.platform,
							architecture: appConfig.architecture,
							hostname: appConfig.hostname,
							appName: appConfig.appName,
							appVersion: appConfig.appVersion,
							appId: appConfig.appId,
						}),
					},
				],
			});
		}
	});
});

// --- API for React (Get Server IP) ---
ipcMain.handle("getServerIp", () => SERVER_IP);
