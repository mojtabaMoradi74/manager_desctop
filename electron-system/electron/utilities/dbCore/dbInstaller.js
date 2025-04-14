const sudo = require("sudo-prompt");
const { promisify } = require("util");
const os = require("os");

// کلاس خطای سفارشی برای مدیریت بهتر خطاها
class InstallationError extends Error {
	constructor(message, type = "installation", isRecoverable = false) {
		super(message);
		this.type = type;
		this.isRecoverable = isRecoverable;
		this.name = "InstallationError";
	}
}

async function getRealWindowsArch() {
	const { exec } = require("child_process");
	const execPromise = promisify(exec);
	try {
		// از PowerShell برای دریافت معماری واقعی استفاده می‌کنیم
		const { stdout } = await execPromise('powershell.exe -Command "(Get-WmiObject Win32_OperatingSystem).OSArchitecture"');
		const arch = stdout.trim().toLowerCase();

		// اگر ۶۴ بیتی باشه
		if (arch.includes("64")) return "x64";
		// اگر ۳۲ بیتی باشه
		if (arch.includes("32")) return "x86";
		return "unknown"; // در صورت عدم تطابق
	} catch (error) {
		console.error("Error checking Windows architecture:", error);
		return "unknown";
	}
}

// تابع تشخیص معماری سیستم
async function detectArchitecture() {
	const arch = process.arch;
	const platform = process.platform;

	// تشخیص دقیق‌تر برای مک‌های M1/M2
	if (platform === "darwin" && os.cpus()[0].model.includes("Apple")) {
		return "arm64";
	}
	// if (platform === "win32") {
	// 	// بررسی معماری واقعی ویندوز
	// 	const realArch = await getRealWindowsArch();
	// 	arch = realArch === "x64" ? "x64" : "x86";
	// }

	return arch;
}

// تابع تشخیص نسخه ویندوز
async function detectWindowsVersion() {
	try {
		const { stdout } = await runCommand('powershell -command "(Get-ComputerInfo).WindowsVersion"', "win32");
		const version = parseFloat(stdout.trim());
		return isNaN(version) ? "unknown" : version;
	} catch (error) {
		try {
			const { stdout } = await runCommand("ver", "win32");
			const match = stdout.match(/\[Version (\d+\.\d+)\]/);
			return match ? parseFloat(match[1]) : "unknown";
		} catch {
			return "unknown";
		}
	}
}

// تابع تشخیص نسخه macOS
async function detectMacOSVersion() {
	try {
		const { stdout } = await runCommand("sw_vers -productVersion", "darwin");
		return stdout.trim();
	} catch (error) {
		return "unknown";
	}
}

// تابع اجرای دستورات با sudo
function runSudoCommand(command, options = { name: "PostgreSQL Installer" }) {
	return new Promise((resolve, reject) => {
		sudo.exec(command, options, (error, stdout, stderr) => {
			if (error) {
				reject({ message: error.message || error, stderr });
			} else {
				resolve(stdout);
			}
		});
	});
}

// تابع اصلی اجرای دستورات
async function runCommand(command, platform, useSudo = false) {
	try {
		if (useSudo && platform !== "linux") {
			const stdout = await runSudoCommand(command, {
				name: "PostgreSQL Installer",
			});
			return { success: true, stdout };
		} else {
			const { exec } = require("child_process");
			const execPromise = promisify(exec);
			const shell = platform === "win32" ? "powershell.exe" : "/bin/bash";
			const { stdout } = await execPromise(command, { shell });
			return { success: true, stdout };
		}
	} catch (error) {
		return {
			success: false,
			error: error.message || error,
			stderr: error.stderr || "",
		};
	}
}

// تابع نصب Homebrew با پشتیبانی از ARM64 و Intel
async function ensureBrewInstalled() {
	const arch = detectArchitecture();
	const brewPath = arch === "arm64" ? "/opt/homebrew/bin/brew" : "/usr/local/bin/brew";
	const shellConfig = arch === "arm64" ? "~/.zshrc" : "~/.bash_profile";

	console.log("Checking for Homebrew...");
	const brewCheck = await runCommand(`${brewPath} --version`, "darwin");

	if (!brewCheck.success) {
		console.log("Installing Homebrew...");
		const installCommand =
			arch === "arm64"
				? '/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"'
				: '/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"';

		const installResult = await runCommand(installCommand, "darwin");

		if (!installResult.success) {
			throw new InstallationError("Failed to install Homebrew: " + installResult.error);
		}

		// اضافه کردن brew به PATH
		await runCommand(`echo 'eval "$(${brewPath} shellenv)"' >> ${shellConfig}`, "darwin");
		await runCommand(`source ${shellConfig}`, "darwin");
	}

	return true;
}

// تابع نصب Chocolatey با پشتیبانی از ویندوز 32/64 بیتی
async function ensureChocolateyInstalled() {
	console.log("Checking for Chocolatey...");
	const chocoCheck = await runCommand("choco --version", "win32");

	if (!chocoCheck.success) {
		console.log("Installing Chocolatey...");

		// دستور نصب سازگار با ویندوز 7 به بالا
		const installCommand = `
            Set-ExecutionPolicy Bypass -Scope Process -Force;
            [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072;
            iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
        `
			.replace(/\n/g, "")
			.trim();

		const installResult = await runCommand(installCommand, "win32");

		if (!installResult.success) {
			throw new InstallationError("Failed to install Chocolatey: " + installResult.error);
		}
	}

	return true;
}

// تابع نصب پیش‌نیازهای لینوکس برای تمام توزیع‌ها
async function installLinuxDependencies() {
	const commands = [
		// Ubuntu/Debian
		"sudo apt-get update && sudo apt-get install -y wget curl gnupg2 software-properties-common",
		// CentOS/RHEL
		"sudo yum install -y wget curl epel-release",
		// Arch
		"sudo pacman -Sy --noconfirm wget curl",
		// Fedora
		"sudo dnf install -y wget curl",
		// OpenSUSE
		"sudo zypper install -y wget curl",
	];

	for (const cmd of commands) {
		const result = await runCommand(cmd, "linux");
		if (result.success) return true;
	}

	throw new InstallationError("Failed to install basic dependencies on Linux", "dependencies", true);
}

// تابع اصلی نصب PostgreSQL
async function installPostgreSQL() {
	try {
		const platform = process.platform;
		const arch = detectArchitecture();
		let osVersion = "unknown";

		console.log(`Detected platform: ${platform}, architecture: ${arch}`);

		// تشخیص نسخه سیستم عامل
		if (platform === "win32") {
			osVersion = await detectWindowsVersion();
			console.log(`Detected Windows version: ${osVersion}`);

			if (osVersion !== "unknown" && osVersion < 6.1) {
				throw new InstallationError(`Windows version ${osVersion} is not supported (Windows 7/8/10/11 required)`, "unsupported_os", false);
			}
		} else if (platform === "darwin") {
			osVersion = await detectMacOSVersion();
			console.log(`Detected macOS version: ${osVersion}`);

			if (osVersion !== "unknown" && parseFloat(osVersion) < 10.13) {
				throw new InstallationError(`macOS version ${osVersion} is not supported (macOS 10.13+ required)`, "unsupported_os", false);
			}
		}

		// 1. نصب پیش‌نیازها
		if (platform === "darwin") {
			await ensureBrewInstalled();
		} else if (platform === "win32") {
			await ensureChocolateyInstalled();
		} else if (platform === "linux") {
			await installLinuxDependencies();
		}

		// 2. نصب PostgreSQL متناسب با پلتفرم و معماری
		let installCommand, successMessage;

		if (platform === "linux") {
			const { stdout: osRelease = "" } = await runCommand('cat /etc/os-release 2>/dev/null || cat /etc/redhat-release 2>/dev/null || echo ""', "linux");

			if (osRelease.includes("Ubuntu") || osRelease.includes("Debian")) {
				installCommand = "sudo apt-get update && sudo apt-get install -y postgresql postgresql-contrib";
				successMessage = "PostgreSQL installed via apt";
			} else if (osRelease.includes("CentOS") || osRelease.includes("Fedora") || osRelease.includes("Rocky")) {
				installCommand = "sudo yum install -y postgresql-server postgresql-contrib && sudo postgresql-setup --initdb";
				successMessage = "PostgreSQL installed via yum";
			} else if (osRelease.includes("Arch") || osRelease.includes("Manjaro")) {
				installCommand = "sudo pacman -Syu --noconfirm postgresql";
				successMessage = "PostgreSQL installed via pacman";
			} else {
				// Fallback برای توزیع‌های ناشناخته
				installCommand = `
                    sudo sh -c 'echo "deb http://apt.postgresql.org/pub/repos/apt $(lsb_release -cs)-pgdg main" > /etc/apt/sources.list.d/pgdg.list' &&
                    wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | sudo apt-key add - &&
                    sudo apt-get update && sudo apt-get install -y postgresql postgresql-contrib
                `.replace(/\n/g, "");
				successMessage = "PostgreSQL installed via PostgreSQL APT repository";
			}
		} else if (platform === "darwin") {
			// نصب برای معماری‌های مختلف مک
			if (arch === "arm64") {
				installCommand = "arch -arm64 brew install postgresql";
				successMessage = "PostgreSQL installed via Homebrew (ARM64)";
			} else {
				installCommand = "brew install postgresql";
				successMessage = "PostgreSQL installed via Homebrew (Intel)";
			}
		} else if (platform === "win32") {
			// نصب برای ویندوزهای 32 و 64 بیتی
			if (arch === "ia32" || arch === "x86") {
				installCommand = "choco install postgresql-9.6 --params '/Password:postgres' -y";
				successMessage = "PostgreSQL 9.6 installed via Chocolatey (32-bit Windows)";
			} else {
				installCommand = "choco install postgresql --params '/Password:postgres' -y";
				successMessage = "PostgreSQL installed via Chocolatey (64-bit Windows)";
			}
		}

		console.log(`Installing PostgreSQL with: ${installCommand}`);
		const installResult = await runCommand(installCommand, platform, platform === "linux");

		if (!installResult.success) {
			throw new InstallationError(`Installation failed: ${installResult.error}`);
		}

		// 3. تنظیمات پس از نصب
		let setupCommand, setupMessage;

		if (platform === "linux") {
			const { stdout: osRelease = "" } = await runCommand('cat /etc/os-release 2>/dev/null || echo ""', "linux");

			if (osRelease.includes("Ubuntu") || osRelease.includes("Debian")) {
				setupCommand = "sudo service postgresql start";
				setupMessage = "Started PostgreSQL service";
			} else if (osRelease.includes("CentOS") || osRelease.includes("Fedora") || osRelease.includes("Rocky")) {
				setupCommand = "sudo systemctl enable --now postgresql";
				setupMessage = "Enabled and started PostgreSQL service";
			} else if (osRelease.includes("Arch") || osRelease.includes("Manjaro")) {
				setupCommand = "sudo systemctl enable --now postgresql.service";
				setupMessage = "Enabled and started PostgreSQL service";
			} else {
				setupCommand = "sudo service postgresql start";
				setupMessage = "Started PostgreSQL service (generic method)";
			}
		} else if (platform === "darwin") {
			setupCommand = "brew services start postgresql";
			setupMessage = "Started PostgreSQL via Homebrew services";
		} else if (platform === "win32") {
			setupCommand = "Start-Service postgresql*";
			setupMessage = "Started PostgreSQL Windows service";
		}

		console.log(`Running post-install setup: ${setupCommand}`);
		const setupResult = await runCommand(setupCommand, platform, platform === "linux");
		console.log(`* * * Completed post-install setup: ${setupResult.stdout}`);
		console.log(`* * * End post-install `);

		return {
			installed: true,
			message: `${successMessage} | ${setupMessage}`,
			details: JSON.parse(
				JSON.stringify({
					platform,
					architecture: arch,
					osVersion,
					nextSteps: [
						platform === "win32" ? "Connect with: psql -U postgres" : "Connect with: sudo -u postgres psql",
						platform === "win32" ? 'Password: "postgres"' : "No password by default",
					],
				})
			),
		};
	} catch (error) {
		console.log("Installation error:", error);

		return JSON.parse(
			JSON.stringify({
				installed: false,
				error: error.message,
				errorType: error.type,
				platform: process.platform,
				architecture: detectArchitecture(),
				isRecoverable: error.isRecoverable,
				suggestion: getSuggestionForError(error.message),
			})
		);
	}
}

// تابع پیشنهادات برای خطاهای مختلف
function getSuggestionForError(error) {
	if (error.includes("permission denied") || error.includes("EACCES")) {
		return "Try running with administrator/sudo privileges";
	}
	if (error.includes("command not found")) {
		return "Required command not found. The script tried to install prerequisites but failed";
	}
	if (error.includes("unsupported")) {
		return "Your operating system version is not supported by this installer";
	}
	if (error.includes("User cancelled")) {
		return "Operation was cancelled by user";
	}
	return "Check your internet connection and try again. If the problem persists, please report the issue.";
}

module.exports = { installPostgreSQL };
