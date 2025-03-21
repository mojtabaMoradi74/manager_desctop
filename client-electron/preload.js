const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api", {
	getServerIp: () => ipcRenderer.invoke("getServerIp"),
});
