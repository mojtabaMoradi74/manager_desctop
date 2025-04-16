const { exec } = require("child_process");
const { promisify } = require("util");
const { findPostgres, extractPostgresVersion } = require("../postgresHelper/win");
const execPromise = promisify(exec);


/**
 * Get PostgreSQL version from psql --version output
 */
// function extractPostgresVersion(output) {
// 	const match = output.match(/PostgreSQL\)\s+([\d.]+)/) || output.match(/PostgreSQL\s+([\d.]+)/);
// 	return match ? match[1] : null;
// }
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

				const { stdout } = await execPromise(
					`powershell "Get-Service | Where-Object { $_.DisplayName -like '*postgres*' } | Select-Object -Property Name,Status"`
				);

				if (!stdout.includes("postgres")) {
					return { installed: false, running: false, error: "No PostgreSQL service found." };
				}

				installed = true;
				running = stdout.includes("Running");

				const findPsql = await findPostgres()
				console.log("* * * psqlPath", findPsql.path);
				version = findPsql.version;

				break;
			default:
				error = "Unsupported platform.";
		}
	} catch (e) {
		throw error
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

	try {
		// ابتدا بررسی می‌کنیم که psql در دسترس است
		let psqlPath = "psql";
		if (isWindows) {
			const { stdout } = await execPromise(
				'powershell "Get-ChildItem \'C:\\Program Files\\PostgreSQL\\*\\bin\\psql.exe\' | Select-Object -First 1 | % { $_.FullName }"'
			);
			if (stdout.trim()) {
				psqlPath = stdout.trim();
			}
		}

		const checkCommand = `"${psqlPath}" -U ${username} -d postgres -tAc "SELECT 1 FROM pg_database WHERE datname='${database}';"`;
		const createCommand = `"${psqlPath}" -U ${username} -d postgres -c "CREATE DATABASE \\"${database}\\";"`;

		// تنظیم PGPASSWORD برای ویندوز و لینوکس/مک
		const envCmd = isWindows ? `set PGPASSWORD=${password} && ` : `PGPASSWORD=${password} `;

		const { stdout } = await execPromise(envCmd + checkCommand);

		if (stdout.includes("1")) {
			return {
				success: true,
				created: false,
				message: `Database '${database}' already exists.`,
			};
		} else {
			await execPromise(envCmd + createCommand);
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


// async function preparingDatabase({ username = "mojtaba", password = "1234", database = "myDb" } = {}) {
// 	const isWindows = process.platform === "win32";
// 	const passwordEnv = `PGPASSWORD=${password}`;
// 	const checkCommand = `psql -U ${username} -d postgres -tAc "SELECT 1 FROM pg_database WHERE datname='${database}';"`;
// 	const createCommand = `psql -U ${username} -d postgres -c "CREATE DATABASE \\"${database}\\";"`;

// 	const fullCheckCmd = isWindows ? checkCommand : `${passwordEnv} ${checkCommand}`;
// 	const fullCreateCmd = isWindows ? createCommand : `${passwordEnv} ${createCommand}`;

// 	try {
// 		const { stdout } = await execPromise(fullCheckCmd);

// 		if (stdout.includes("1")) {
// 			return {
// 				success: true,
// 				created: false,
// 				message: `Database '${database}' already exists.`,
// 			};
// 		} else {
// 			await execPromise(fullCreateCmd);
// 			return {
// 				success: true,

// 				created: true,
// 				message: `Database '${database}' created successfully.`,
// 			};
// 		}
// 	} catch (error) {
// 		return {
// 			success: false,
// 			created: false,
// 			message: `Failed to check/create database '${database}'`,
// 			error: error.message,
// 		};
// 	}
// }

// async function checkUserConnection({ username = "mojtaba", password = "1234", database = "myDb" }) {
// 	const isWindows = process.platform === "win32";
// 	const passwordEnv = `PGPASSWORD=${password}`;
// 	const cmd = `psql -U ${username} -d ${database} -c "SELECT 1;"`;

// 	const fullCommand = isWindows ? cmd : `${passwordEnv} ${cmd}`;

// 	try {
// 		const { stdout } = await execPromise(fullCommand);
// 		return {
// 			success: true,
// 			message: `User ${username} connected successfully.`,
// 			stdout,
// 		};
// 	} catch (error) {
// 		return {
// 			success: false,
// 			message: `Failed to connect as user ${username}.`,
// 			error: error.message,
// 			stderr: error.stderr,
// 		};
// 	}
// }

module.exports = { checkPostgresInstalled, startPostgresService, preparingDatabase };
