import MDNSResolver from "./mdns-resolver";
import PingScanner from "./ping-scanner";
import EventEmitter from "events";
import Logger from "../../lib/logger";

export default class NetworkDiscovery extends EventEmitter {
	constructor() {
		super();
		this.logger = new Logger("NetworkDiscovery");
		this.resolvers = [new MDNSResolver({ serviceType: "_mychat._tcp.local" }), new PingScanner({ port: 4000 })];
		this.services = new Map();
	}

	async start() {
		this.logger.info("Starting network discovery");

		await Promise.all(
			this.resolvers.map((resolver) => {
				resolver.on("discovered", (service) => this.addService(service));
				return resolver.discover();
			})
		);
		//   // هر 30 ثانیه شبکه را اسکن می‌کند
		//   setInterval(() => this.scanNetwork(), 30000);

		//   // همچنین روی تغییرات شبکه واکنش نشان می‌دهد
		//   networkMonitor.on('network-changed', () => {
		// 	this.logger.info('تغییر شبکه تشخیص داده شد');
		// 	this.scanNetwork();
		//   });
	}

	stop() {
		this.logger.info("Stopping network discovery");
		this.resolvers.forEach((resolver) => resolver.cleanup());
	}

	addService(service) {
		const key = `${service.type}-${service.ip}:${service.port}`;

		if (!this.services.has(key)) {
			this.services.set(key, service);
			this.emit("service:added", service);
			this.logger.debug(`Discovered new service: ${service.name} at ${service.ip}:${service.port}`);
		}
	}

	async findServers(type) {
		return Array.from(this.services.values())
			.filter((service) => service.type === type)
			.sort((a, b) => a.ping - b.ping);
	}
}
