const dns = require("dns");
const net = require("net");
const Logger = require("../../shared/logger");

class NetworkScanner {
	constructor() {
		this.logger = new Logger("NetworkScanner");
		this.SERVICE_PORT = 4000;
		this.SERVICE_NAME = "_chat._tcp.local";
	}

	async findServers() {
		try {
			// روش 1: جستجوی mDNS
			const mdnsServers = await this.scanMDNS();
			if (mdnsServers.length > 0) return mdnsServers;

			// روش 2: اسکن IPهای محلی
			return await this.scanLocalIPs();
		} catch (error) {
			this.logger.error("Network scan failed", error);
			return [];
		}
	}

	async scanMDNS() {
		return new Promise((resolve) => {
			const servers = [];
			const mdns = require("multicast-dns")();

			const timeout = setTimeout(() => {
				mdns.destroy();
				resolve(servers);
			}, 5000);

			mdns.on("response", (response) => {
				response.answers.forEach((answer) => {
					if (answer.type === "SRV" && answer.name.includes(this.SERVICE_NAME)) {
						const ip = response.additionals.find((a) => a.type === "A")?.data;
						if (ip) {
							servers.push({
								ip,
								port: answer.data.port,
								hostname: answer.name.replace(`.${this.SERVICE_NAME}`, ""),
							});
						}
					}
				});
			});

			mdns.query({
				questions: [
					{
						name: this.SERVICE_NAME,
						type: "SRV",
					},
				],
			});
		});
	}

	async scanLocalIPs() {
		const localIP = await this.getLocalIP();
		const baseIP = localIP.split(".").slice(0, 3).join(".");
		const servers = [];

		for (let i = 1; i <= 254; i++) {
			if (i === parseInt(localIP.split(".")[3])) continue;

			const ip = `${baseIP}.${i}`;
			if (await this.checkPort(ip, this.SERVICE_PORT)) {
				servers.push({ ip, port: this.SERVICE_PORT });
			}
		}

		return servers;
	}

	async getLocalIP() {
		return new Promise((resolve) => {
			dns.lookup(os.hostname(), (err, addr) => {
				resolve(err ? "127.0.0.1" : addr);
			});
		});
	}

	async checkPort(ip, port, timeout = 2000) {
		return new Promise((resolve) => {
			const socket = new net.Socket();
			socket.setTimeout(timeout);

			socket.on("connect", () => {
				socket.destroy();
				resolve(true);
			});

			socket.on("timeout", () => {
				socket.destroy();
				resolve(false);
			});

			socket.on("error", () => resolve(false));
			socket.connect(port, ip);
		});
	}
}

module.exports = NetworkScanner;
