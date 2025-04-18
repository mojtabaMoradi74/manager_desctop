const { exec } = require("child_process");
const { promisify } = require("util");
const execPromise = promisify(exec);

/**
 * Get PostgreSQL version from psql --version output
 */
function extractPostgresVersion(output) {
	const match = output.match(/PostgreSQL\)\s+([\d.]+)/) || output.match(/PostgreSQL\s+([\d.]+)/);
	return match ? match[1] : null;
}
/**
 * Check if PostgreSQL is installed and running on macOS/Linux/Windows
 */
async function checkPostgresInstalled() {
	let installed = false;
	let version = null;
	let running = false;
	let error = null;

	try {
		switch (process.platform) {
			case "darwin":
			case "linux":
				try {
					const { stdout } = await execPromise("psql --version");
					installed = stdout.toLowerCase().includes("postgresql");
					version = extractPostgresVersion(stdout);

					try {
						const { stdout: status } = await execPromise("pg_isready");
						running = status.includes("accepting connections");
					} catch (e) {
						error = `pg_isready failed: ${e.message}`;
					}
				} catch (e) {
					error = `psql check failed: ${e.message}`;
				}
				break;

			case "win32":
				try {
					// روش بهتر برای بررسی سرویس در ویندوز
					const { stdout: serviceStdout } = await execPromise('powershell "Get-Service -Name postgresql* | Select-Object -Property Name,Status"');

					if (!serviceStdout.includes("postgresql")) {
						// روش جایگزین برای سیستم‌های قدیمی
						const { stdout: altStdout } = await execPromise(
							"powershell \"Get-Service | Where-Object { $_.Name -like 'postgres*' } | Select-Object -Property Name,Status\""
						);

						if (!altStdout.includes("postgres")) {
							return { installed: false, running: false, error: "No PostgreSQL service found." };
						}
					}

					installed = true;
					running = serviceStdout.includes("Running");

					// بررسی نسخه با مسیر کامل برای جلوگیری از مشکلات PATH
					try {
						const { stdout: versionOut } = await execPromise(
							"powershell \"& { $path = Get-ChildItem 'C:\\Program Files\\PostgreSQL\\*\\bin\\psql.exe' | Select-Object -First 1; if ($path) { & $path.FullName --version } }\""
						);
						version = extractPostgresVersion(versionOut);
					} catch (e) {
						error = `Version check failed: ${e.message}`;
					}
				} catch (e) {
					error = `Windows service check failed: ${e.message}`;
				}
				break;

			// case "win32":
			// 	try {
			// 		const { stdout } = await execPromise('sc query type= service state= all | find "SERVICE_NAME: postgres"');
			// 		const found = stdout.includes("SERVICE_NAME");
			// 		if (found) {
			// 			installed = true;
			// 			running = stdout.includes("RUNNING");

			// 			try {
			// 				const { stdout: versionOut } = await execPromise("psql --version");
			// 				version = extractPostgresVersion(versionOut);
			// 			} catch (e) {
			// 				error = `Version check failed: ${e.message}`;
			// 			}
			// 		}
			// 	} catch (e) {
			// 		error = `Windows service check failed: ${e.message}`;
			// 	}
			// 	break;

			default:
				error = "Unsupported platform.";
		}
	} catch (e) {
		error = `Unexpected error: ${e.message}`;
	}

	return { installed, version, running, error };
}

/**
 * Try to start PostgreSQL service for current platform
 */
async function startPostgresService() {
	try {
		switch (process.platform) {
			case "linux": {
				const services = ["postgresql", "postgresql@14-main", "postgresql@15-main", "postgres"];
				for (const service of services) {
					try {
						await execPromise(`sudo systemctl start ${service}`);
						return { started: true, service, platform: "linux" };
					} catch {
						// Try next service
					}
				}
				return { started: false, error: "All service start attempts failed." };
			}

			case "darwin":
				try {
					await execPromise("brew services start postgresql");
					return { started: true, service: "postgresql", platform: "darwin" };
				} catch (e) {
					return { started: false, error: `brew start failed: ${e.message}` };
				}

			case "win32":
				try {
					const { stdout } = await execPromise('sc query type= service state= all | find "SERVICE_NAME: postgres"');
					const serviceLines = stdout.split("\n").filter((line) => line.toLowerCase().includes("service_name") && line.toLowerCase().includes("postgres"));

					if (serviceLines.length === 0) {
						return { started: false, error: "No PostgreSQL service found." };
					}

					const serviceName = serviceLines[0].split(":")[1].trim();
					await execPromise(`net start "${serviceName}"`);
					return { started: true, service: serviceName, platform: "win32" };
				} catch (e) {
					return { started: false, error: `Windows start failed: ${e.message}` };
				}

			default:
				return { started: false, error: "Unsupported platform." };
		}
	} catch (e) {
		return { started: false, error: `Unexpected error: ${e.message}` };
	}
}

async function preparingDatabase({ username = "mojtaba", password = "1234", database = "myDb" } = {}) {
	const isWindows = process.platform === "win32";
	const passwordEnv = `PGPASSWORD=${password}`;
	const checkCommand = `psql -U ${username} -d postgres -tAc "SELECT 1 FROM pg_database WHERE datname='${database}';"`;
	const createCommand = `psql -U ${username} -d postgres -c "CREATE DATABASE \\"${database}\\";"`;

	const fullCheckCmd = isWindows ? checkCommand : `${passwordEnv} ${checkCommand}`;
	const fullCreateCmd = isWindows ? createCommand : `${passwordEnv} ${createCommand}`;

	try {
		const { stdout } = await execPromise(fullCheckCmd);

		if (stdout.includes("1")) {
			return {
				success: true,
				created: false,
				message: `Database '${database}' already exists.`,
			};
		} else {
			await execPromise(fullCreateCmd);
			return {
				success: true,

				created: true,
				message: `Database '${database}' created successfully.`,
			};
		}
	} catch (error) {
		return {
			success: false,
			created: false,
			message: `Failed to check/create database '${database}'`,
			error: error.message,
		};
	}
}

module.exports = { checkPostgresInstalled, startPostgresService, preparingDatabase };
