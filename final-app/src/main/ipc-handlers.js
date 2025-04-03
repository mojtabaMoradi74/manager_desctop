// src/main/ipc-handlers.js
const { ipcMain } = require("electron");
const logger = require("../shared/lib/logger");

class IpcHandlers {
	constructor(appState, windowManager, serverCore) {
		this.appState = appState;
		this.windowManager = windowManager;
		this.serverCore = serverCore;
		this.registerHandlers();
	}

	registerHandlers() {
		ipcMain.handle("get-app-role", () => this.appState.getAppRole());
		ipcMain.handle("get-server-info", () => this.serverCore.getServerInfo());
		ipcMain.handle("send-message", (_, message) => this.handleSendMessage(message));
		// سایر هندلرها...
	}

	async handleSendMessage(message) {
		try {
			if (this.appState.isServer()) {
				return await this.serverCore.chatService.sendMessage(message);
			} else {
				return await this.serverCore.socketClient.sendMessage(message);
			}
		} catch (error) {
			logger.error("Failed to send message", error);
			throw error;
		}
	}
}

module.exports = IpcHandlers;
