import NetworkUtils from "./network-utils";

export default class IPRange {
	static getLocalNetworkRange() {
		const localIP = NetworkUtils.getLocalIPs()[0];
		if (!localIP) return "192.168.1.1/24";

		const parts = localIP.split(".");
		return `${parts[0]}.${parts[1]}.${parts[2]}.1/24`;
	}

	static expandRange(range) {
		const [base, mask] = range.split("/");
		const baseParts = base.split(".").map(Number);
		const count = Math.pow(2, 32 - parseInt(mask)) - 2;

		const ips = [];
		for (let i = 1; i <= count; i++) {
			const ipParts = [...baseParts];
			ipParts[3] += i;

			if (ipParts[3] > 255) {
				ipParts[2] += Math.floor(ipParts[3] / 256);
				ipParts[3] %= 256;
			}

			ips.push(ipParts.join("."));
		}

		return ips;
	}
}
