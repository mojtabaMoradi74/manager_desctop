const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const isDev = true; // require("electron-is-dev");
const path = require("path");
const fs = require("fs");
const { default: Store } = require("electron-store");
const { checkPostgresInstalled, startPostgresService, ensureDatabaseExists, preparingDatabase } = require("./utilities/dbCore/dbChecker");
const { installPostgreSQL } = require("./utilities/dbCore/dbInstaller");
const { configPostgresUser, checkPostgresUser } = require("./utilities/dbCore/dbUser");
const { randomUUID } = require("crypto");

// console.log("* * * store :", Store);

const store = new Store();
let mainWindow;
ipcMain.on("app:reload", () => {
	const win = BrowserWindow.getAllWindows()[0];
	if (win) {
		// win.reload(); // Reload renderer (HTML + JS)
		app.relaunch();
		app.exit(0);
	}
});

ipcMain.handle("db:check", async () => checkPostgresInstalled());
ipcMain.handle("db:start", async () => startPostgresService());
ipcMain.handle("db:install", async () => installPostgreSQL());
ipcMain.handle("db:user-check", async () => checkPostgresUser());
ipcMain.handle("db:user-config", async () => configPostgresUser());
ipcMain.handle("db:preparing-db", async () => preparingDatabase());

ipcMain.handle("dialog:openDirectory", async () => {
	const { canceled, filePaths } = await dialog.showOpenDialog({
		properties: ["openDirectory"],
	});
	return canceled ? null : filePaths[0];
});

ipcMain.handle("config:save", (_, config) => {
	config.id = config?.id || randomUUID();
	store.set("appConfig", config);
	return true;
});

ipcMain.handle("config:get", () => {
	return store.get("appConfig");
});
ipcMain.handle("config:reset", () => {
	return store.set("appConfig", false);
});
// store.set("appConfig", false);
ipcMain.handle("discoverServers", async () => {
	// استفاده از multicast-dns برای کشف سرورها
	const mdns = require("multicast-dns")();
	const servers = [];

	return new Promise((resolve) => {
		mdns.on("response", (response) => {
			console.log("* * * response :", response);
			// let serverIp, serverInfo;

			const serverInfo = response.answers.find((answer) => answer.type === "TXT" && answer.name === "system-server._tcp.local");
			// if (answer.type === "A" && answer.name === "system-server._tcp.local") {
			// 	serverIp = answer.data;
			// 	console.log("Server IP:", serverIp);
			// 	// serverInfo = answer;
			// }
			// if (answer.type === "TXT" && answer.name === "system-server._tcp.local") {
			// 	serverInfo = answer.data;
			// 	console.log("Server Info:", serverInfo);
			// }
			// const a = response.answers.find((ans) => ans.type === "A" && ans.name.includes("system-server"));
			// const txt = response.answers.find((ans) => ans.type === "TXT");
			console.log("Server Info:", serverInfo);

			if (serverInfo?.data) {
				servers.push({
					...(serverInfo.data ? JSON.parse(serverInfo.data) : {}),

					// name: serverInfo.name.replace(".local", ""),
				});
			}
		});

		mdns.query({
			questions: [
				{
					name: "system-server._tcp.local",
					type: "TXT",
				},
			],
		});

		setTimeout(() => {
			mdns.destroy();
			resolve(servers);
		}, 5000);
	});
});

ipcMain.handle("get-server-url", () => {
	const config = store.get("appConfig");
	return config?.type === "client" ? `http://${config.serverIp}:5000` : "http://localhost:5000";
});

function createWindow(route = "/") {
	mainWindow = new BrowserWindow({
		width: 1200,
		height: 800,
		webPreferences: {
			nodeIntegration: false,
			contextIsolation: true,
			// enableRemoteModule: false,
			webSecurity: false, // فقط برای محیط توسعه
			allowRunningInsecureContent: true, // فقط برای محیط توسعه
			preload: path.join(__dirname, "preload.js"),
		},
	});
	const appConfig = store.get("appConfig");
	console.log("* * * appConfig :", appConfig);

	mainWindow.loadURL(isDev ? `http://localhost:3000${route}` : `file://${path.join(__dirname, "../src/dist/index.html")}#${route}`);
	mainWindow.webContents.on("did-fail-load", () => {
		mainWindow.loadURL(isDev ? `http://localhost:3000${route}` : `file://${path.join(__dirname, "../src/dist/index.html")}#${route}`);
	});
	if (isDev) {
		mainWindow.webContents.openDevTools();
	}
	// console.log("* * * mainWindow :", mainWindow);
	// console.log("* * * mainWindow.webContents :", mainWindow.webContents);
	// console.log("* * * mainWindow.webContents.session :", mainWindow.webContents.session);

	mainWindow.on("closed", () => (mainWindow = null));
}

app.whenReady().then(() => {
	const config = store.get("appConfig");
	if (config?.type === "client") {
		require("./clinet");
		createWindow("/");
	} else if (config?.type === "server") {
		require("./server");
		createWindow("/");
	} else {
		createWindow("/setup");
	}
});
app.on("window-all-closed", () => {
	if (process.platform !== "darwin") {
		app.quit();
	}
});

app.on("activate", () => {
	if (mainWindow === null) {
		createWindow();
	}
});
