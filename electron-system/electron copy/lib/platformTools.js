// const os = require("os");
// const { exec } = require("child_process");
// const { promisify } = require("util");
// const execAsync = promisify(exec);
import os from "os";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

// Cache برای جلوگیری از اجرای مکرر
const architectureCache = new Map();

async function getWindowsArchitecture() {
	try {
		const { stdout } = await execAsync('powershell.exe -Command "(Get-WmiObject Win32_OperatingSystem).OSArchitecture"', { timeout: 5000 });

		return stdout.trim().toLowerCase().includes("64") ? "x64" : "x86";
	} catch (error) {
		console.warn("Failed to detect Windows architecture via WMI:", error.message);

		// Fallback به روش‌های جایگزین
		if (process.env.PROCESSOR_ARCHITECTURE === "AMD64") return "x64";
		if (os.arch() === "x64") return "x64";

		return "x86"; // Safe default
	}
}

function isAppleSilicon() {
	try {
		return process.platform === "darwin" && /Apple (M1|M2|M3|Silicon)/i.test(os.cpus()[0].model);
	} catch {
		return false;
	}
}

export async function detectSystemArchitecture() {
	const cacheKey = `${process.platform}-${process.arch}`;
	if (architectureCache.has(cacheKey)) {
		return architectureCache.get(cacheKey);
	}

	let architecture;

	switch (process.platform) {
		case "darwin":
			architecture = isAppleSilicon() ? "arm64" : process.arch;
			break;

		case "win32":
			architecture = await getWindowsArchitecture();
			break;

		default:
			architecture = process.arch;
	}

	// اعتبارسنجی نهایی
	const validArchitectures = new Set(["arm", "arm64", "x64", "x86", "ia32"]);
	architecture = validArchitectures.has(architecture) ? architecture : "unknown";

	architectureCache.set(cacheKey, architecture);
	return architecture;
}
function checkSystemRequirements() {
	const os = require('os');
	const totalMem = os.totalmem() / (1024 * 1024); // MB
	const cpuCores = os.cpus().length;

	if (totalMem < 2048 || cpuCores < 2) {
		console.log('سیستم ضعیف است - پیشنهاد: SQLite');
		return 'SQLite';
	} else if (totalMem < 4096) {
		console.log('سیستم متوسط - پیشنهاد: MySQL');
		return 'MySQL';
	} else {
		console.log('سیستم قوی - پیشنهاد: PostgreSQL');
		return 'PostgreSQL';
	}
}

