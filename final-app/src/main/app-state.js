import { app } from "electron";
import fs from "fs";
import path from "path";
import Logger from "../shared/lib/logger";

export default class AppState {
	constructor() {
		this.logger = new Logger("AppState");
		this.configPath = path.join(app.getPath("userData"), "app-config.json");
		this.state = {
			role: null,
			serverInfo: null,
		};
	}

	async initialize() {
		try {
			await this.loadConfig();

			if (!this.state.role) {
				this.state.role = await this.determineRole();
				await this.saveConfig();
			}
		} catch (error) {
			this.logger.error("Failed to initialize app state", error);
			throw error;
		}
	}

	async autoDetectRole() {
		// 3. منطق تشخیص خودکار هوشمند
		const network = new NetworkDiscovery();
		const servers = await network.findServers("chat-service");

		if (servers.length > 0) {
			return "client"; // اگر سرور دیگری در شبکه وجود دارد
		}

		return "server"; // در غیر این صورت به عنوان سرور عمل کند
	}

	async determineRole() {
		// 1. اول از تنظیمات ذخیره شده می‌خواند
		if (this.state.role) return this.state.role;

		// 2. اگر اولین اجراست، از کاربر می‌پرسد
		const { response } = await dialog.showMessageBox({
			type: "question",
			buttons: ["سرور", "کلاینت", "تشخیص خودکار"],
			title: "نوع اجرا",
			message: "نقش این دستگاه را انتخاب کنید:",
		});

		switch (response) {
			case 0:
				return "server";
			case 1:
				return "client";
			default:
				return this.autoDetectRole();
		}
	}

	async loadConfig() {
		try {
			if (fs.existsSync(this.configPath)) {
				const data = await fs.promises.readFile(this.configPath, "utf8");
				this.state = JSON.parse(data);
			}
		} catch (error) {
			this.logger.warn("Failed to load config, using defaults", error);
		}
	}

	async saveConfig() {
		try {
			await fs.promises.writeFile(this.configPath, JSON.stringify(this.state, null, 2));
		} catch (error) {
			this.logger.error("Failed to save config", error);
		}
	}

	getAppRole() {
		return this.state.role;
	}

	setAppRole(role) {
		this.state.role = role;
		return this.saveConfig();
	}
}
