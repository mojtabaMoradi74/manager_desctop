const os = require("os");
const { exec } = require("child_process");
const { promisify } = require("util");
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

// const os = require("os");
// const sudo = require("sudo-prompt");
// const { promisify } = require("util");

// async function getRealWindowsArch() {
// 	const { exec } = require("child_process");
// 	const execPromise = promisify(exec);
// 	try {
// 		// از PowerShell برای دریافت معماری واقعی استفاده می‌کنیم
// 		const { stdout } = await execPromise('powershell.exe -Command "(Get-WmiObject Win32_OperatingSystem).OSArchitecture"');
// 		const arch = stdout.trim().toLowerCase();

// 		// اگر ۶۴ بیتی باشه
// 		if (arch.includes("64")) return "x64";
// 		// اگر ۳۲ بیتی باشه
// 		if (arch.includes("32")) return "x86";
// 		return "unknown"; // در صورت عدم تطابق
// 	} catch (error) {
// 		console.error("Error checking Windows architecture:", error);
// 		return "unknown";
// 	}
// }

// // تابع تشخیص معماری سیستم
// export default async function detectSystemArchitecture() {
// 	let arch = process.arch;
// 	const platform = process.platform;

// 	// تشخیص دقیق‌تر برای مک‌های M1/M2
// 	if (platform === "darwin" && os.cpus()[0].model.includes("Apple")) {
// 		return "arm64";
// 	}

// 	if (platform === "win32") {
// 		// بررسی معماری واقعی ویندوز
// 		const realArch = await getRealWindowsArch();
// 		return realArch === "unknown" ? arch : realArch;
// 	}

// 	return arch;
// }
