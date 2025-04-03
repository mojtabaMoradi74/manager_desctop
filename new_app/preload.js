const { contextBridge, ipcRenderer } = require("electron");

// ایجاد یک کانال امن برای ارتباط بین renderer و main process
contextBridge.exposeInMainWorld("electronAPI", {
	networkStatus: (callback) => ipcRenderer.on("network-status", callback),
	requestServerStart: () => ipcRenderer.invoke("request-server-start"),
	getNetworkInfo: () => ipcRenderer.invoke("get-network-info"),
	validateConnection: (config) => ipcRenderer.invoke("validate-connection", config),
});

// جلوگیری از دسترسی مستقیم به Node.js API
contextBridge.exposeInMainWorld("environment", {
	platform: process.platform,
	isProduction: process.env.NODE_ENV === "production",
});
