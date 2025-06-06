// import { contextBridge, ipcRenderer } from "electron";
const { contextBridge, ipcRenderer } = require("electron");


console.log("✅✅✅ preload.js LOADED");

contextBridge.exposeInMainWorld("electronAPI", {
	selectDirectory: () => ipcRenderer.invoke("dialog:openDirectory"),
	checkDatabase: () => ipcRenderer.invoke("db:check"),
	installDatabase: async () => ipcRenderer.invoke("db:install"),
	manageDatabase: async () => ipcRenderer.invoke("db:manage"),
	startDatabase: () => ipcRenderer.invoke("db:start"),
	configDatabaseUser: () => ipcRenderer.invoke("db:user-config"),
	preparingDatabase: () => ipcRenderer.invoke("db:preparing-db"),
	saveConfig: (config) => ipcRenderer.invoke("config:save", config),
	getConfig: () => ipcRenderer.invoke("config:get"),
	discoverServers: () => ipcRenderer.invoke("discoverServers"),
	onServerDiscovered: (callback) => ipcRenderer.on("server:discovered", callback),
	getServerUrl: () => ipcRenderer.invoke("get-server-url"),
	webSpeech: () => ipcRenderer.invoke("lib:web-speech"),
	reloadApp: () => ipcRenderer.send("app:reload"),
});
