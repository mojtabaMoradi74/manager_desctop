import { io } from "socket.io-client";
import NetworkDiscovery from "../../shared/network/discovery/network-discovery";
import ConnectionManager from "./network/connection-manager";
import Logger from "../../shared/lib/logger";

export default class ClientCore {
	constructor(windowManager) {
		this.windowManager = windowManager;
		this.logger = new Logger("ClientCore");
		this.connection = new ConnectionManager();
		this.discovery = new NetworkDiscovery();
	}

	async initialize() {
		try {
			this.logger.info("Initializing client core...");

			// 1. کشف سرورهای موجود
			await this.discovery.start();

			// 2. اتصال به سرور
			const server = await this.findBestServer();
			await this.connection.connect(server);

			// 3. راه‌اندازی هندلرهای رویداد
			this.setupEventHandlers();

			this.logger.info("Client core initialized successfully");
		} catch (error) {
			this.logger.error("Client initialization failed", error);
			throw error;
		}
	}

	// async findBestServer() {
	// 	const servers = await this.discovery.findServers("chat-service");

	// 	if (servers.length === 0) {
	// 		throw new Error("No chat servers found on network");
	// 	}

	// 	// انتخاب سرور با کمترین ping
	// 	return servers.reduce((best, current) => (current.ping < best.ping ? current : best));
	// }

	async findBestServer() {
		// 1. از شبکه محلی سرورها را کشف می‌کند
		const servers = await this.discovery.findServers("chat-service");

		// 2. معیارهای انتخاب بهترین سرور:
		const bestServer = servers.sort((a, b) => {
			// اولویت‌بندی بر اساس:
			// - پینگ کمتر
			// - نسخه جدیدتر
			// - تعداد کاربران کمتر
			return a.ping - b.ping || b.version.localeCompare(a.version) || a.users - b.users;
		})[0];

		if (!bestServer) {
			throw new Error("هیچ سرور فعالی در شبکه یافت نشد");
		}

		return bestServer;
	}

	setupEventHandlers() {
		this.connection.on("message:new", (message) => {
			this.windowManager.sendToRenderer("message:new", message);
		});

		this.connection.on("disconnect", () => {
			this.windowManager.showReconnectUI();
		});
	}

	cleanup() {
		this.logger.info("Cleaning up client resources...");
		this.connection.disconnect();
		this.discovery.stop();
	}
}
