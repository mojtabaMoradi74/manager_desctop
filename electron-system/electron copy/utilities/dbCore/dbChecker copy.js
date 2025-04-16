const { exec } = require("child_process");

function execPromise(command) {
	return new Promise((resolve, reject) => {
		exec(command, (error, stdout, stderr) => {
			if (error) reject(error);
			else resolve({ stdout, stderr });
		});
	});
}

async function checkPostgresInstalled() {
	let installed = false;
	let version = null;
	let running = false;
	let error = null;

	try {
		if (process.platform === "darwin" || process.platform === "linux") {
			try {
				const { stdout } = await execPromise("psql --version");
				if (stdout.toLowerCase().includes("postgresql")) {
					installed = true;
					const match = stdout.match(/PostgreSQL\)\s+([\d.]+)/);
					version = match ? match[1] : null;
				}

				// Check if postgres is running
				try {
					const { stdout: serviceStatus } = await execPromise("pg_isready");
					running = serviceStatus.includes("accepting connections");
				} catch (e) {
					error = `pg_isready check failed: ${e.message}`;
				}
			} catch (e) {
				error = `psql check failed: ${e.message}`;
			}
		} else if (process.platform === "win32") {
			try {
				const { stdout } = await execPromise('sc query type= service state= all | find "SERVICE_NAME: postgres"');
				if (stdout.includes("SERVICE_NAME: postgres")) {
					installed = true;
					running = stdout.includes("RUNNING");
				}

				// Get version
				if (installed) {
					try {
						const { stdout } = await execPromise("psql --version");
						const match = stdout.match(/PostgreSQL\)\s+([\d.]+)/);
						version = match ? match[1] : null;
					} catch (e) {
						error = `Version check failed: ${e.message}`;
					}
				}
			} catch (e) {
				error = `Service check failed: ${e.message}`;
			}
		}
	} catch (error) {
		return { installed: false, error: error.message };
	}

	return { installed, version, running, error };
}

const startPostgresService = async () => {
	try {
		if (process.platform === "linux" || process.platform === "darwin") {
			// Try common service names
			const services = ["postgresql", "postgresql@14-main", "postgresql@15-main", "postgres"];
			for (const service of services) {
				try {
					await execPromise(`sudo systemctl start ${service}`);
					return { started: true, service, platform: process.platform };
				} catch (e) {
					// try next service
					continue;
				}
			}

			// Try with service (without sudo)
			try {
				await execPromise(`service postgresql start`);
				return { started: true, service: "postgresql", platform: process.platform };
			} catch (e) {
				return { started: false, error: `Could not start PostgreSQL service: ${e.message}` };
			}
		}

		if (process.platform === "win32") {
			try {
				const { stdout } = await execPromise('sc query type= service state= all | find "SERVICE_NAME: postgres"');
				const serviceLines = stdout.split("\n").filter((line) => line.includes("SERVICE_NAME") && line.toLowerCase().includes("postgres"));

				if (serviceLines.length === 0) {
					return { started: false, error: "No PostgreSQL service found." };
				}

				// Try to start the first matching service
				const serviceName = serviceLines[0].split(":")[1].trim();
				await execPromise(`net start "${serviceName}"`);
				return { started: true, service: serviceName, platform: process.platform };
			} catch (e) {
				return { started: false, error: `Failed to start PostgreSQL service: ${e.message}` };
			}
		}

		return { started: false, error: "Unsupported platform." };
	} catch (err) {
		return { started: false, error: err.message };
	}
};
const { exec } = require("child_process");
const { promisify } = require("util");
const execPromise = promisify(exec);

async function installPostgreSQL() {
	try {
		const platform = process.platform;
		let installCommand = "";
		let successMessage = "";

		if (platform === "linux") {
			// Detect Linux distribution
			const { stdout: osRelease } = await execPromise('cat /etc/os-release || echo ""');
			const isUbuntu = osRelease.includes("Ubuntu");
			const isDebian = osRelease.includes("Debian");
			const isCentOS = osRelease.includes("CentOS") || osRelease.includes("Rocky");
			const isFedora = osRelease.includes("Fedora");
			const isArch = osRelease.includes("Arch") || osRelease.includes("Manjaro");

			if (isUbuntu || isDebian) {
				installCommand = "sudo apt-get update && sudo apt-get install -y postgresql postgresql-contrib";
				successMessage = "PostgreSQL installed successfully on Ubuntu/Debian";
			} else if (isCentOS || isFedora) {
				installCommand = "sudo yum install -y postgresql-server postgresql-contrib && sudo postgresql-setup --initdb";
				successMessage = "PostgreSQL installed successfully on CentOS/Fedora/Rocky";
			} else if (isArch) {
				installCommand = "sudo pacman -Syu --noconfirm postgresql";
				successMessage = "PostgreSQL installed successfully on Arch/Manjaro";
			} else {
				throw new Error("Unsupported Linux distribution");
			}
		} else if (platform === "darwin") {
			// macOS
			installCommand = "brew install postgresql";
			successMessage = "PostgreSQL installed successfully on macOS using Homebrew";
		} else if (platform === "win32") {
			// Windows with Chocolatey
			try {
				// Check if Chocolatey is installed
				await execPromise("choco --version");
			} catch (e) {
				// Install Chocolatey if not present
				console.log("Installing Chocolatey package manager...");
				await execPromise(
					"Set-ExecutionPolicy Bypass -Scope Process -Force; " +
						"[System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; " +
						"iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))",
					{ shell: "powershell.exe" }
				);
			}

			installCommand = "choco install postgresql -y";
			successMessage = "PostgreSQL installed successfully on Windows using Chocolatey";
		} else {
			throw new Error("Unsupported operating system");
		}

		console.log(`Installing PostgreSQL on ${platform}...`);
		const { stdout } = await execPromise(installCommand, { shell: platform === "win32" ? "powershell.exe" : undefined });

		return {
			installed: true,
			message: successMessage,
			details: stdout,
		};
	} catch (error) {
		return {
			installed: false,
			error: error.message,
			stderr: error.stderr || "",
			platform: process.platform,
		};
	}
}

async function setupPostgreSQL() {
	const installResult = await installPostgreSQL();

	if (!installResult.installed) {
		return installResult;
	}

	// Initialize and start the service
	try {
		const platform = process.platform;
		let initCommand = "";
		let startCommand = "";
		let setupMessage = "";

		if (platform === "linux") {
			const { stdout: osRelease } = await execPromise('cat /etc/os-release || echo ""');
			const isUbuntu = osRelease.includes("Ubuntu");
			const isDebian = osRelease.includes("Debian");
			const isCentOS = osRelease.includes("CentOS") || osRelease.includes("Rocky");
			const isFedora = osRelease.includes("Fedora");

			if (isUbuntu || isDebian) {
				initCommand = "sudo pg_createcluster 15 main --start";
				startCommand = "sudo service postgresql start";
				setupMessage = "PostgreSQL cluster created and service started";
			} else if (isCentOS || isFedora) {
				// Already initialized during install
				startCommand = "sudo systemctl enable --now postgresql";
				setupMessage = "PostgreSQL service enabled and started";
			}
		} else if (platform === "darwin") {
			initCommand = "initdb /usr/local/var/postgres";
			startCommand = "pg_ctl -D /usr/local/var/postgres start";
			setupMessage = "PostgreSQL initialized and started on macOS";
		} else if (platform === "win32") {
			startCommand = "Start-Service postgresql*";
			setupMessage = "PostgreSQL service started on Windows";
		}

		if (initCommand) {
			await execPromise(initCommand, { shell: platform === "win32" ? "powershell.exe" : undefined });
		}
		if (startCommand) {
			await execPromise(startCommand, { shell: platform === "win32" ? "powershell.exe" : undefined });
		}

		return {
			...installResult,
			initialized: true,
			started: true,
			setupMessage,
			nextSteps:
				platform === "win32"
					? [
							"PostgreSQL installed as Windows service",
							"Default user: postgres",
							'Set password: "psql -U postgres -c "ALTER USER postgres WITH PASSWORD \'your_password\';"""',
							'Access with: "psql -U postgres"',
					  ]
					: ["PostgreSQL service is running", 'Access with: "sudo -u postgres psql"'],
		};
	} catch (error) {
		return {
			...installResult,
			initialized: false,
			started: false,
			setupError: error.message,
			platform: process.platform,
		};
	}
}

module.exports = { checkPostgresInstalled, startPostgresService, installPostgreSQL, setupPostgreSQL };
