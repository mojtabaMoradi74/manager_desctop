import dgram from "dgram";
import { EventEmitter } from "events";
import Logger from "../../lib/logger";

export default class SSDPResolver extends EventEmitter {
	constructor(options = {}) {
		super();
		this.logger = new Logger("SSDPResolver");
		this.searchTarget = options.searchTarget || "urn:schemas-upnp-org:service:chat:1";
		this.port = options.port || 1900;
		this.multicastAddress = options.multicastAddress || "239.255.255.250";
		this.timeout = options.timeout || 3000;
		this.socket = dgram.createSocket("udp4");
	}

	discover() {
		return new Promise((resolve) => {
			const discoveredServices = [];
			const timer = setTimeout(() => {
				this.socket.removeListener("message", messageHandler);
				resolve(discoveredServices);
			}, this.timeout);

			const messageHandler = (msg, rinfo) => {
				const service = this.parseSSDPResponse(msg.toString(), rinfo);
				if (service) {
					discoveredServices.push(service);
					this.emit("discovered", service);
				}
			};

			this.socket.on("message", messageHandler);

			const searchMessage = [
				"M-SEARCH * HTTP/1.1",
				`HOST: ${this.multicastAddress}:${this.port}`,
				`MAN: "ssdp:discover"`,
				`MX: ${Math.floor(this.timeout / 1000)}`,
				`ST: ${this.searchTarget}`,
				"",
				"",
			].join("\r\n");

			this.socket.send(searchMessage, 0, searchMessage.length, this.port, this.multicastAddress);
		});
	}

	parseSSDPResponse(response, rinfo) {
		const lines = response.split("\r\n");
		if (lines[0] !== "HTTP/1.1 200 OK") return null;

		const headers = {};
		lines.slice(1).forEach((line) => {
			const [key, value] = line.split(":");
			if (key && value) headers[key.trim()] = value.trim();
		});

		return {
			type: "chat-service",
			protocol: "ssdp",
			name: headers["SERVER"],
			ip: rinfo.address,
			port: parseInt(headers["PORT"]),
			metadata: {
				location: headers["LOCATION"],
				usn: headers["USN"],
			},
			discoveredAt: new Date(),
		};
	}

	cleanup() {
		this.socket.close();
	}
}
