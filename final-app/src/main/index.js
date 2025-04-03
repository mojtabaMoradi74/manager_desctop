const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const path = require("path");
const NetworkManager = require("./core/network-manager");
const Database = require("./core/database");
const Logger = require("./shared/logger");

class ChatApplication {
	constructor() {
		this.logger = new Logger("Main");
		this.config = {
			role: null,
			serverPort: 4000,
			serviceName: "myapp.local",
		};
		this.database = new Database();
		this.network = new NetworkManager();
		this.mainWindow = null;
		this.socketServer = null;
		this.socketClient = null;
	}

	async initialize() {
		try {
			await this.database.connect();
			await this.determineRole();
			await this.setupNetwork();
			this.createWindow();
		} catch (error) {
			this.logger.error("Initialization failed", error);
			process.exit(1);
		}
	}

	async determineRole() {
		// اگر نقش از قبل تنظیم شده
		if (this.config.role) return;

		const { response } = await dialog.showMessageBox({
			type: "question",
			buttons: ["سرور", "کلاینت"],
			title: "انتخاب نقش",
			message: "این دستگاه چگونه باید عمل کند؟",
			detail: "سرور: میزبان چت روم\nکلاینت: به سرور متصل می‌شود",
		});

		this.config.role = response === 0 ? "server" : "client";
	}

	async setupNetwork() {
		if (this.config.role === "server") {
			await this.startServer();
		} else {
			await this.connectToServer();
		}
	}

	async startServer() {
		this.logger.info("Starting as server...");

		// راه‌اندازی mDNS
		this.network.startMDNSService(this.config.serviceName);

		// راه‌اندازی Socket.IO سرور
		const { createServer } = require("http");
		const express = require("express");
		const { Server } = require("socket.io");

		const expressApp = express();
		const httpServer = createServer(expressApp);
		this.socketServer = new Server(httpServer, {
			cors: { origin: "*" },
		});

		this.socketServer.on("connection", (socket) => {
			this.handleSocketConnection(socket);
		});

		httpServer.listen(this.config.serverPort, () => {
			this.logger.info(`Server running on port ${this.config.serverPort}`);
		});
	}

	async connectToServer() {
		this.logger.info("Starting as client...");

		// کشف سرور با mDNS
		const serverIp = await this.network.discoverServer(this.config.serviceName);

		if (!serverIp) {
			const { response } = await dialog.showMessageBox({
				type: "question",
				buttons: ["تبدیل به سرور", "تلاش مجدد"],
				message: "سروری یافت نشد",
				detail: "آیا مایلید این دستگاه به عنوان سرور عمل کند؟",
			});

			if (response === 0) {
				this.config.role = "server";
				return this.startServer();
			}
			return this.connectToServer();
		}

		// اتصال به سرور
		const { io } = require("socket.io-client");
		this.socketClient = io(`http://${serverIp}:${this.config.serverPort}`);

		this.socketClient.on("connect", () => {
			this.logger.info("Connected to server");
		});

		this.socketClient.on("connect_error", (err) => {
			this.logger.error("Connection failed", err);
			setTimeout(() => this.connectToServer(), 2000);
		});
	}

	handleSocketConnection(socket) {
		this.logger.info(`New client connected: ${socket.id}`);

		// ارسال تاریخچه چت
		this.database.getMessages().then((messages) => {
			socket.emit("load_messages", messages);
		});

		// دریافت پیام جدید
		socket.on("new_message", async (data) => {
			await this.database.saveMessage(data);
			this.socketServer.emit("receive_message", data);

			// نمایش در پنجره اصلی
			if (this.mainWindow) {
				this.mainWindow.webContents.send("new_message", data);
			}
		});
	}

	createWindow() {
		this.mainWindow = new BrowserWindow({
			width: 1000,
			height: 700,
			webPreferences: {
				nodeIntegration: false,
				contextIsolation: true,
				preload: path.join(__dirname, "preload.js"),
			},
		});

		this.mainWindow.loadFile(path.join(__dirname, "../renderer", this.config.role, "index.html"));

		if (process.env.NODE_ENV === "development") {
			this.mainWindow.webContents.openDevTools();
		}
	}
}

// راه‌اندازی برنامه
app.whenReady().then(() => {
	const chatApp = new ChatApplication();
	chatApp.initialize();
});

app.on("window-all-closed", () => {
	if (process.platform !== "darwin") app.quit();
});
