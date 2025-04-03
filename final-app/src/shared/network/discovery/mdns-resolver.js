import mdns from "multicast-dns";
import { EventEmitter } from "events";
import Logger from "../../lib/logger";

export default class MDNSResolver extends EventEmitter {
	constructor(options = {}) {
		super();
		this.logger = new Logger("MDNSResolver");
		this.serviceType = options.serviceType || "_chat._tcp.local";
		this.timeout = options.timeout || 5000;
		this.mdns = mdns(options);
	}

	discover() {
		return new Promise((resolve) => {
			const discoveredServices = [];
			const timer = setTimeout(() => {
				this.mdns.removeListener("response", responseHandler);
				resolve(discoveredServices);
			}, this.timeout);

			const responseHandler = (response) => {
				response.answers.forEach((answer) => {
					if (answer.type === "SRV" && answer.name.includes(this.serviceType)) {
						const service = this.parseService(answer, response);
						discoveredServices.push(service);
						this.emit("discovered", service);
					}
				});
			};

			this.mdns.on("response", responseHandler);
			this.mdns.query({
				questions: [
					{
						name: this.serviceType,
						type: "SRV",
					},
				],
			});
		});
	}

	parseService(srvRecord, fullResponse) {
		const aRecord = fullResponse.additionals.find((r) => r.type === "A");
		const txtRecord = fullResponse.additionals.find((r) => r.type === "TXT");

		return {
			type: "chat-service",
			protocol: "mdns",
			name: srvRecord.name.replace(`.${this.serviceType}`, ""),
			ip: aRecord ? aRecord.data : null,
			port: srvRecord.data.port,
			metadata: txtRecord ? this.parseTXT(txtRecord.data) : {},
			discoveredAt: new Date(),
		};
	}

	parseTXT(data) {
		return data.reduce((acc, item) => {
			const [key, value] = item.toString().split("=");
			if (key && value) acc[key] = value;
			return acc;
		}, {});
	}

	cleanup() {
		this.mdns.destroy();
	}
}
