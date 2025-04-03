import { Server } from "socket.io";
import Database from "./database/database";
import NetworkManager from "./network/network-manager";
import ChatService from "./services/chat-service";
import Logger from "../../shared/lib/logger";

export default class ServerCore {
	constructor(windowManager) {
		this.windowManager = windowManager;
		this.logger = new Logger("ServerCore");
		this.services = {};
	}

	async initialize() {
		try {
			this.logger.info("Initializing server core...");

			// 1. راه‌اندازی دیتابیس
			this.database = new Database();
			await this.database.connect();

			// 2. راه‌اندازی شبکه
			this.network = new NetworkManager();
			await this.network.start();

			// 3. راه‌اندازی سرویس‌ها
			this.services.chat = new ChatService(this.database);

			// 4. راه‌اندازی Socket.IO
			this.setupSocketServer();

			this.logger.info("Server core initialized successfully");
		} catch (error) {
			this.logger.error("Server initialization failed", error);
			throw error;
		}
	}

	setupSocketServer() {
		this.io = new Server({
			cors: {
				origin: "*",
				methods: ["GET", "POST"],
			},
			connectionStateRecovery: {
				maxDisconnectionDuration: 120000, // 2 دقیقه
			},
		});

		this.io.on("connection", (socket) => {
			this.handleSocketConnection(socket);
		});
	}

	handleSocketConnection(socket) {
		this.logger.info(`New client connected: ${socket.id}`);

		// هندلرهای رویدادهای سوکت
		socket.on("message:send", (data) => {
			this.services.chat
				.handleNewMessage(data)
				.then((message) => {
					socket.emit("message:ack", { id: data.id, status: "delivered" });
					this.io.emit("message:new", message);
				})
				.catch((error) => {
					socket.emit("message:ack", { id: data.id, status: "failed", error });
				});
		});

		socket.on("disconnect", () => {
			this.logger.info(`Client disconnected: ${socket.id}`);
		});
	}

	cleanup() {
		this.logger.info("Cleaning up server resources...");
		if (this.io) this.io.close();
		if (this.network) this.network.stop();
		if (this.database) this.database.disconnect();
	}
}
