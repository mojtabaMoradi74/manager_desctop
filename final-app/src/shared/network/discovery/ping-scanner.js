import net from "net";
import { EventEmitter } from "events";
import Logger from "../../lib/logger";
import IPRange from "../utils/ip-range";

export default class PingScanner extends EventEmitter {
	constructor(options = {}) {
		super();
		this.logger = new Logger("PingScanner");
		this.port = options.port || 4000;
		this.timeout = options.timeout || 1000;
		this.networkRange = options.networkRange || IPRange.getLocalNetworkRange();
		this.concurrentLimit = options.concurrentLimit || 50;
	}

	async discover() {
		this.logger.info(`Scanning network ${this.networkRange} for chat services`);
		const ips = IPRange.expandRange(this.networkRange);
		const discoveredServices = [];

		for (let i = 0; i < ips.length; i += this.concurrentLimit) {
			const batch = ips.slice(i, i + this.concurrentLimit);
			const results = await Promise.all(batch.map((ip) => this.checkService(ip)));
			discoveredServices.push(...results.filter(Boolean));
		}

		return discoveredServices;
	}

	async checkService(ip) {
		return new Promise((resolve) => {
			const socket = new net.Socket();
			socket.setTimeout(this.timeout);

			socket.on("connect", () => {
				socket.end();
				const service = {
					type: "chat-service",
					protocol: "tcp",
					ip,
					port: this.port,
					discoveredAt: new Date(),
				};
				this.emit("discovered", service);
				resolve(service);
			});

			socket.on("timeout", () => {
				socket.destroy();
				resolve(null);
			});

			socket.on("error", () => {
				resolve(null);
			});

			socket.connect(this.port, ip);
		});
	}

	cleanup() {
		// هیچ منبعی نیاز به پاکسازی ندارد
	}
}
