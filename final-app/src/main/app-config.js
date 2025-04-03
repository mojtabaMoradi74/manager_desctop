const { app } = require("electron");
const path = require("path");
const fs = require("fs-extra");
const Logger = require("./shared/logger");

class AppConfig {
	constructor() {
		this.logger = new Logger("AppConfig");
		this.configPath = path.join(app.getPath("userData"), "app-config.json");
		this.defaults = {
			role: null,
			server: {
				port: 4000,
				hostname: os.hostname(),
			},
			client: {
				autoReconnect: true,
			},
		};
		this.data = { ...this.defaults };
	}

	async load() {
		try {
			if (await fs.pathExists(this.configPath)) {
				this.data = await fs.readJson(this.configPath);
			}
		} catch (error) {
			this.logger.error("Failed to load config", error);
		}
	}

	async save() {
		try {
			await fs.ensureDir(path.dirname(this.configPath));
			await fs.writeJson(this.configPath, this.data);
		} catch (error) {
			this.logger.error("Failed to save config", error);
		}
	}

	get(key) {
		return key.split(".").reduce((obj, k) => (obj || {})[k], this.data);
	}

	set(key, value) {
		const keys = key.split(".");
		let obj = this.data;

		for (let i = 0; i < keys.length - 1; i++) {
			if (!obj[keys[i]]) obj[keys[i]] = {};
			obj = obj[keys[i]];
		}

		obj[keys[keys.length - 1]] = value;
	}

	reset() {
		this.data = { ...this.defaults };
	}
}

module.exports = AppConfig;
