// const { app, BrowserWindow, ipcMain, dialog } = require("electron");
// const isDev = true; // require("electron-is-dev");
// const path = require("path");
// const fs = require("fs");
// const { default: Store } = require("electron-store");
// const { checkMySQLInstalled, startMySQLService, preparingDatabase } = require("./utilities/dbCore/dbChecker.js");
// const { installMySQL } = require("./utilities/dbCore/dbInstaller");
// const { configMySQLUser, checkMySQLUser } = require("./utilities/dbCore/dbUser.js");
// const { randomUUID } = require("crypto");

import { app, BrowserWindow, ipcMain, dialog } from "electron";
import path from "path";
import fs from "fs";
import Store from "electron-store";
import {
	checkMySQLInstalled,
	startMySQLService,
	preparingDatabase
} from "./utilities/dbCore/dbChecker.js";
import MySQLManager from "./utilities/dbCore/MySQLManager.js";
import {
	configMySQLUser,
	checkMySQLUser
} from "./utilities/dbCore/dbUser.js";
import { randomUUID } from "crypto";
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// محاسبه __dirname با استفاده از import.meta.url
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const systemDrive = process.env.SystemDrive;
console.log("Windows is installed on:", systemDrive);

// console.log("* * * store :", Store);
const isDev = true; // import isDev from "electron-is-dev";
let mysqlInstaller
const store = new Store();
const firstConf = store.get("appConfig")
console.log({ firstConf });

if (firstConf?.isServer) {
	mysqlInstaller = new MySQLManager();
	mysqlInstaller.initialize()
}
let mainWindow;



ipcMain.on("app:reload", () => {
	const win = BrowserWindow.getAllWindows()[0];
	if (win) {
		// win.reload(); // Reload renderer (HTML + JS)
		app.relaunch();
		app.exit(0);
	}
});

ipcMain.handle("db:manage", async () => {
	mysqlInstaller = new MySQLManager();

	return await mysqlInstaller.initialize();
});
ipcMain.handle("db:check", async () => checkMySQLInstalled());
ipcMain.handle("db:start", async () => startMySQLService());
// ipcMain.handle("db:install", async () => {
// 	// const mysqlInstaller = new DatabaseInstaller('mysql');
// 	// return await mysqlInstaller.install();

// 	const mysqlInstaller = new DatabaseInstaller();
// 	return await mysqlInstaller.initialize();

// });
ipcMain.handle("db:user-check", async () => checkMySQLUser());
ipcMain.handle("db:user-config", async () => configMySQLUser());
ipcMain.handle("db:preparing-db", async () => preparingDatabase());

ipcMain.handle("dialog:openDirectory", async () => {
	const { canceled, filePaths } = await dialog.showOpenDialog({
		properties: ["openDirectory"],
	});
	return canceled ? null : filePaths[0];
});

ipcMain.handle("config:save", (_, config) => {
	config = config || {}
	config.isServer = config.type == "server"
	config.id = config.id || randomUUID();
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

			const serverInfo = response.answers.find((answer) => answer.type === "TXT" && answer.name.includes("system-server"));
			console.log("* * * serverInfo :", serverInfo);

			if (serverInfo) {
				console.log("Server Info:", serverInfo);
				console.log("Server Info data:", serverInfo.data);
				console.log("Server Info 2:", JSON.parse(serverInfo.data));
				servers.push(JSON.parse(serverInfo.data));
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

	mainWindow.on("closed", () => {
		if (mysqlInstaller) mysqlInstaller.stop()
		mainWindow = null
	});
}

app.whenReady().then(() => {
	const config = store.get("appConfig");
	if (config?.type === "client") {
		import("./clinet.js").then(() => createWindow("/"));
	} else if (config?.type === "server") {
		import("./server.js").then(() => createWindow("/"));
	} else {
		createWindow("/setup");
	}
});

app.on("window-all-closed", () => {

	if (process.platform !== "darwin") {
		app.quit();
	}
});
app.on('before-quit', async () => {
	if (mysqlInstaller) mysqlInstaller.stop()
});
app.on("activate", () => {
	if (mainWindow === null) {
		createWindow();
	}
});
