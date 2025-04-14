const sudo = require("sudo-prompt");
const { promisify } = require("util");

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
			const { stdout } = await execPromise(command, {
				shell: platform === "win32" ? "powershell.exe" : "/bin/bash",
			});
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

async function ensureBrewInstalled() {
	console.log("Checking for Homebrew...");
	const brewCheck = await runCommand("brew --version", "darwin");

	if (!brewCheck.success) {
		console.log("Installing Homebrew...");
		const installResult = await runCommand('/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"', "darwin");

		if (!installResult.success) {
			throw new Error("Failed to install Homebrew: " + installResult.error);
		}

		// Add brew to PATH if needed
		await runCommand("echo 'eval \"$(/opt/homebrew/bin/brew shellenv)\"' >> ~/.zshrc", "darwin");
		await runCommand("source ~/.zshrc", "darwin");
	}

	return true;
}

async function ensureChocolateyInstalled() {
	console.log("Checking for Chocolatey...");
	const chocoCheck = await runCommand("choco --version", "win32");

	if (!chocoCheck.success) {
		console.log("Installing Chocolatey...");
		const installResult = await runCommand(
			"Set-ExecutionPolicy Bypass -Scope Process -Force; " +
				"[System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; " +
				"iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))",
			"win32"
		);

		if (!installResult.success) {
			throw new Error("Failed to install Chocolatey: " + installResult.error);
		}
	}

	return true;
}

async function installLinuxDependencies() {
	const commands = [
		// Ubuntu/Debian
		"sudo apt-get update && sudo apt-get install -y wget curl gnupg2",
		// CentOS/RHEL
		"sudo yum install -y wget curl",
		// Arch
		"sudo pacman -Sy --noconfirm wget curl",
	];

	for (const cmd of commands) {
		const result = await runCommand(cmd, "linux");
		if (result.success) return true;
	}

	throw new Error("Failed to install basic dependencies on Linux");
}

async function installPostgreSQL() {
	try {
		const platform = process.platform;
		console.log(`Detected platform: ${platform}`);

		// 1. Ensure prerequisites
		if (platform === "darwin") {
			await ensureBrewInstalled();
		} else if (platform === "win32") {
			await ensureChocolateyInstalled();
		} else if (platform === "linux") {
			await installLinuxDependencies();
		}

		// 2. Platform-specific installation
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
				// Fallback for unknown Linux
				installCommand =
					'sudo sh -c \'echo "deb http://apt.postgresql.org/pub/repos/apt $(lsb_release -cs)-pgdg main" > /etc/apt/sources.list.d/pgdg.list && ' +
					"wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | sudo apt-key add - && " +
					"sudo apt-get update && sudo apt-get install -y postgresql postgresql-contrib'";
				successMessage = "PostgreSQL installed via PostgreSQL APT repository";
			}
		} else if (platform === "darwin") {
			installCommand = "brew install postgresql";
			successMessage = "PostgreSQL installed via Homebrew";
		} else if (platform === "win32") {
			installCommand = "choco install postgresql --params '/Password:postgres' -y";
			successMessage = 'PostgreSQL installed via Chocolatey (password set to "postgres")';
		}

		console.log(`Installing PostgreSQL with: ${installCommand}`);
		const installResult = await runCommand(installCommand, platform);

		if (!installResult.success) {
			throw new Error(`Installation failed: ${installResult.error}`);
		}

		// 3. Post-install setup
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
		const setupResult = await runCommand(setupCommand, platform);
		console.log(`Completed post-install setup: ${setupResult.stdout}`);

		return {
			installed: true,
			message: `${successMessage} | ${setupMessage}`,
			details: {
				platform,
				nextSteps: [
					platform === "win32" ? "Connect with: psql -U postgres" : "Connect with: sudo -u postgres psql",
					platform === "win32" ? 'Password: "postgres"' : "No password by default",
				],
			},
		};
	} catch (error) {
		return {
			installed: false,
			error: error.message,
			platform: process.platform,
			suggestion: getSuggestionForError(error.message),
		};
	}
}

function getSuggestionForError(error) {
	if (error.includes("permission denied")) {
		return "Try running with administrator/sudo privileges";
	}
	if (error.includes("EACCES")) {
		return "Permission issues detected. Try running with elevated privileges";
	}
	if (error.includes("command not found")) {
		return "Required command not found. The script tried to install prerequisites but failed";
	}
	return "Check your internet connection and try again";
}

module.exports = { installPostgreSQL };

// async function runCommand(command, platform) {
// 	try {
// 		const { stdout } = await execPromise(command, {
// 			shell: platform === "win32" ? "powershell.exe" : "/bin/bash",
// 		});
// 		return { success: true, stdout };
// 	} catch (error) {
// 		return {
// 			success: false,
// 			error: error.message,
// 			stderr: error.stderr,
// 		};
// 	}
// }
