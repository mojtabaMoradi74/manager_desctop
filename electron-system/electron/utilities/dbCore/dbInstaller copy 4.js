import { promisify } from "util";
import sudo from "sudo-prompt";
import { exec } from "child_process";
import { detectSystemArchitecture } from "../../lib/platformTools.js";
// const execPromise = promisify(exec);
const execPromise = promisify(exec);
// کلاس خطای سفارشی برای مدیریت بهتر خطاها
class InstallationError extends Error {
	constructor(message, type = "installation", isRecoverable = false) {
		super(message);
		this.type = type;
		this.isRecoverable = isRecoverable;
		this.name = "InstallationError";
	}
}

// تابع تشخیص نسخه ویندوز
export async function detectWindowsVersion() {
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
export async function detectMacOSVersion() {
	try {
		const { stdout } = await runCommand("sw_vers -productVersion", "darwin");
		return stdout.trim();
	} catch (error) {
		return "unknown";
	}
}

// تابع اجرای دستورات با sudo
export function runSudoCommand(command, options = { name: "PostgreSQL Installer" }) {
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
export async function runCommand(command, platform, useSudo = false) {
	try {
		if (useSudo && platform !== "linux") {
			const stdout = await runSudoCommand(command, {
				name: "PostgreSQL Installer",
			});
			return { success: true, stdout };
		} else {

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
export async function ensureBrewInstalled() {
	const arch = detectSystemArchitecture();
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
export async function ensureChocolateyInstalled() {
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
export async function installLinuxDependencies() {
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


// تابع اصلی نصب MySQL
export async function installMySQL() {
	try {
		const platform = process.platform;
		const arch = detectSystemArchitecture();
		let osVersion = "unknown";

		console.log(`Detected platform: ${platform}, architecture: ${arch}`);

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

		// نصب پیش‌نیازها
		if (platform === "darwin") {
			await ensureBrewInstalled();
		} else if (platform === "win32") {
			await ensureChocolateyInstalled();
		} else if (platform === "linux") {
			await installLinuxDependencies();
		}

		// نصب MySQL متناسب با پلتفرم و معماری
		let installCommand, successMessage;

		if (platform === "linux") {
			const { stdout: osRelease = "" } = await runCommand('cat /etc/os-release 2>/dev/null || cat /etc/redhat-release 2>/dev/null || echo ""', "linux");

			if (osRelease.includes("Ubuntu") || osRelease.includes("Debian")) {
				installCommand = "sudo apt-get update && sudo apt-get install -y mysql-server";
				successMessage = "MySQL installed via apt";
			} else if (osRelease.includes("CentOS") || osRelease.includes("Fedora") || osRelease.includes("Rocky")) {
				installCommand = "sudo yum install -y mysql-server";
				successMessage = "MySQL installed via yum";
			} else if (osRelease.includes("Arch") || osRelease.includes("Manjaro")) {
				installCommand = "sudo pacman -Syu --noconfirm mysql";
				successMessage = "MySQL installed via pacman";
			} else {
				installCommand = "sudo apt-get update && sudo apt-get install -y mysql-server";
				successMessage = "MySQL installed via fallback apt command";
			}
		} else if (platform === "darwin") {
			installCommand = "brew install mysql";
			successMessage = "MySQL installed via Homebrew";
		} else if (platform === "win32") {
			installCommand = "choco install mysql --params '/InstallDir:\"C:\\\\MySQL\"' -y";
			successMessage = "MySQL installed via Chocolatey";
		}

		console.log(`Installing MySQL with: ${installCommand}`);
		const installResult = await runCommand(installCommand, platform, platform === "linux");

		if (!installResult.success) {
			throw new InstallationError("MySQL installation failed: " + installResult.error);
		}
		// 3. تنظیمات پس از نصب
		await configureMySQLAfterInstall(platform);

		console.log(successMessage);
		return true;

	} catch (error) {
		console.error("Installation failed:", error.message || error);
		throw error;
	}
}


export async function configureMySQLAfterInstall(platform) {
	try {
		if (platform === "linux") {
			await runCommand("sudo systemctl enable mysql", "linux");
			await runCommand("sudo systemctl start mysql", "linux");
			console.log("MySQL service started and enabled on Linux.");
		} else if (platform === "darwin") {
			await runCommand("brew services start mysql", "darwin");
			console.log("MySQL service started via Homebrew on macOS.");
		} else if (platform === "win32") {
			await runCommand("net start mysql", "win32");
			console.log("MySQL service started on Windows.");
		}

		// تنظیم پسورد root به صورت پیش‌فرض (اختیاری - برای لوکال)
		await runCommand(`mysqladmin -u root password "1234"`, platform);

		console.log("MySQL configured successfully.");

	} catch (err) {
		console.error("MySQL post-installation configuration failed:", err);
		throw new InstallationError("MySQL post-installation configuration failed.", "configuration", true);
	}
}


// تابع اصلی نصب PostgreSQL
export async function installPostgreSQL() {
	try {
		const platform = process.platform;
		const arch = detectSystemArchitecture();
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
				architecture: detectSystemArchitecture(),
				isRecoverable: error.isRecoverable,
				suggestion: getSuggestionForError(error.message),
			})
		);
	}
}

// تابع پیشنهادات برای خطاهای مختلف
export function getSuggestionForError(error) {
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

