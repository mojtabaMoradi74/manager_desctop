const mdns = require("multicast-dns")();
const Logger = require("../shared/logger");

class NetworkManager {
	constructor() {
		this.logger = new Logger("Network");
		this.mdns = mdns;
	}

	startMDNSService(serviceName) {
		const localIp = this.getLocalIp();

		this.mdns.on("query", (query) => {
			query.questions.forEach((q) => {
				if (q.name === serviceName) {
					this.mdns.respond({
						answers: [
							{
								name: serviceName,
								type: "A",
								ttl: 300,
								data: localIp,
							},
						],
					});
				}
			});
		});
	}

	async discoverServer(serviceName, timeout = 5000) {
		return new Promise((resolve) => {
			const timer = setTimeout(() => resolve(null), timeout);

			this.mdns.on("response", (response) => {
				response.answers.forEach((answer) => {
					if (answer.type === "A" && answer.name === serviceName) {
						clearTimeout(timer);
						resolve(answer.data);
					}
				});
			});

			this.mdns.query({
				questions: [{ name: serviceName, type: "A" }],
			});
		});
	}

	getLocalIp() {
		const interfaces = require("os").networkInterfaces();
		for (const iface of Object.values(interfaces)) {
			for (const config of iface) {
				if (config.family === "IPv4" && !config.internal) {
					return config.address;
				}
			}
		}
		return "127.0.0.1";
	}
}

module.exports = NetworkManager;
