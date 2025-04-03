import os from "os";

export default class NetworkUtils {
	static getLocalIPs() {
		const interfaces = os.networkInterfaces();
		const ips = [];

		for (const iface of Object.values(interfaces)) {
			for (const config of iface) {
				if (config.family === "IPv4" && !config.internal) {
					ips.push(config.address);
				}
			}
		}

		return ips;
	}

	static isPrivateIP(ip) {
		const parts = ip.split(".").map((part) => parseInt(part));

		return parts[0] === 10 || (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) || (parts[0] === 192 && parts[1] === 168);
	}
}
