const { dialog } = require("electron");
const NetworkScanner = require("./network/scanner");
const Logger = require("../shared/logger");

class RoleManager {
	constructor(config) {
		this.config = config;
		this.logger = new Logger("RoleManager");
		this.scanner = new NetworkScanner();
	}

	async promptUserForRole() {
		const { response } = await dialog.showMessageBox({
			type: "question",
			buttons: ["سرور", "کلاینت"],
			title: "انتخاب نقش سیستم",
			message: "این دستگاه چگونه باید عمل کند؟",
			detail: "سرور: میزبان چت روم خواهد بود\nکلاینت: به سرور موجود متصل می‌شود",
			cancelId: 1,
		});

		const role = response === 0 ? "server" : "client";
		this.config.set("role", role);
		await this.config.save();

		return role;
	}

	async checkForOtherServers() {
		try {
			const servers = await this.scanner.findServers();
			return servers.length > 0;
		} catch (error) {
			this.logger.error("Failed to scan for servers", error);
			return false;
		}
	}

	async validateServerRole() {
		const hasOtherServers = await this.checkForOtherServers();
		if (hasOtherServers) {
			const { response } = await dialog.showMessageBox({
				type: "warning",
				buttons: ["ادامه به عنوان سرور", "تبدیل به کلاینت"],
				message: "سرور دیگری در شبکه وجود دارد",
				detail: "ادامه دادن به عنوان سرور ممکن است باعث مشکلاتی شود",
			});

			if (response === 1) {
				return "client";
			}
		}
		return "server";
	}
}

module.exports = RoleManager;
