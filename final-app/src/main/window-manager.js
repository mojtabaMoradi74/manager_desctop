const { BrowserWindow, dialog } = require("electron");
const path = require("path");
const Logger = require("./shared/logger");

class WindowManager {
	constructor() {
		this.logger = new Logger("WindowManager");
		this.mainWindow = null;
	}

	async createMainWindow(role) {
		if (this.mainWindow) {
			this.mainWindow.focus();
			return this.mainWindow;
		}

		const window = new BrowserWindow({
			width: 1000,
			height: 700,
			webPreferences: {
				nodeIntegration: false,
				contextIsolation: true,
				preload: path.join(__dirname, "../preload/main-preload.js"),
			},
			title: role === "server" ? "سرور چت" : "کلاینت چت",
		});

		await this.loadContent(window, role);
		this.setupWindowEvents(window);

		this.mainWindow = window;
		return window;
	}

	async loadContent(window, role) {
		const indexPath = app.isPackaged ? path.join(__dirname, `../../renderer/${role}/index.html`) : `http://localhost:3000/${role}`;

		await window.loadURL(indexPath);

		if (!app.isPackaged) {
			window.webContents.openDevTools({ mode: "bottom" });
		}
	}

	async showServerPrompt() {
		const { response } = await dialog.showMessageBox({
			type: "question",
			buttons: ["بله، تبدیل به سرور شو", "خیر، دوباره تلاش کن"],
			message: "سروری یافت نشد",
			detail: "آیا مایلید این دستگاه به عنوان سرور عمل کند؟",
		});

		return response === 0;
	}

	setupWindowEvents(window) {
		window.on("ready-to-show", () => window.show());
		window.on("closed", () => (this.mainWindow = null));
	}
}

module.exports = WindowManager;
