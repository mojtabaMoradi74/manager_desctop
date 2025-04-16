const sudo = require("sudo-prompt");
const { exec } = require("child_process");
const fs = require("fs");
const readline = require("readline");
// Helper: Command runner
function runCommand(command, platform) {
	return new Promise((resolve, reject) => {
		const options = platform === "win32" ? { shell: "cmd.exe" } : undefined;
		exec(command, options, (error, stdout, stderr) => {
			if (error) reject(error);
			else resolve({ stdout, stderr });
		});
	});
}

// Helper: Ask user input
function askQuestion(query) {
	const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
	return new Promise((resolve) =>
		rl.question(query, (answer) => {
			rl.close();
			resolve(answer);
		})
	);
}

// Main: Install PostgreSQL
async function installPostgreSQL() {
	const platform = process.platform;
	const arch = process.arch;

	try {
		if (platform === "darwin") {
			const brewPath = arch === "arm64" ? "/opt/homebrew/bin/brew" : "/usr/local/bin/brew";

			// Ensure Homebrew is installed
			if (!fs.existsSync(brewPath)) {
				console.log("🔧 Installing Homebrew...");
				await runCommand('/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"', platform);
			}

			// Add brew to shell profile
			const shellProfile = process.env.SHELL?.includes("zsh") ? "~/.zprofile" : "~/.bash_profile";
			await runCommand(`echo 'eval "$(${brewPath} shellenv)"' >> ${shellProfile}`, platform);

			console.log("🐘 Installing PostgreSQL via Homebrew...");
			await runCommand(`${brewPath} install postgresql`, platform);
		} else if (platform === "win32") {
			const chocoCheck = await runCommand("choco -v", platform).catch(() => null);
			if (!chocoCheck) {
				console.log("🔧 Installing Chocolatey...");
				await runCommand(
					"powershell -NoProfile -ExecutionPolicy Bypass -Command \"Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://chocolatey.org/install.ps1'))\"",
					platform
				);
			}

			console.log("🐘 Installing PostgreSQL via Chocolatey...");
			await runCommand("choco install postgresql --yes", platform);
		} else if (platform === "linux") {
			let distro = "";
			if (fs.existsSync("/etc/os-release")) {
				const osRelease = fs.readFileSync("/etc/os-release", "utf8");
				const idMatch = osRelease.match(/^ID=(.+)$/m);
				if (idMatch) distro = idMatch[1].replace(/"/g, "");
			}

			const installCommand =
				distro === "ubuntu" || distro === "debian"
					? "apt update && apt install postgresql -y"
					: distro === "fedora"
					? "dnf install postgresql-server -y"
					: distro === "arch"
					? "pacman -Sy postgresql --noconfirm"
					: "";

			if (!installCommand) {
				console.error(`❌ Unsupported Linux distro: ${distro}`);
				return;
			}

			const useSudo = await askQuestion("⚠️ Need sudo privileges. Proceed with sudo? (y/n): ");
			if (useSudo.toLowerCase() === "y") {
				sudo.exec(installCommand, { name: "PostgreSQL Installer" }, (error, stdout, stderr) => {
					if (error) console.error("🚫 Sudo error:", error);
					else console.log("✅ PostgreSQL installed:", stdout || stderr);
				});
			} else {
				console.log("❌ Installation aborted by user.");
			}
		}

		console.log("✅ PostgreSQL installation completed successfully!");
	} catch (error) {
		console.error("🚫 Installation failed:", error);
		console.log("👉 Please install PostgreSQL manually: https://www.enterprisedb.com/downloads/postgres-postgresql-downloads");
	}
}

module.exports = { installPostgreSQL };
