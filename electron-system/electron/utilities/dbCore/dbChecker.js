import { exec } from "child_process";
import { promisify } from "util";
const execPromise = promisify(exec);


export function extractMySQLVersion(output) {
	const match = output.match(/Ver\s+([\d.]+)/);
	return match ? match[1] : null;
}

export async function checkMySQLInstalled() {
	let installed = false;
	let version = null;
	let running = false;
	let error = null;

	try {
		switch (process.platform) {
			case "darwin":
			case "linux":
				try {
					const { stdout } = await execPromise("mysql --version");
					installed = stdout.toLowerCase().includes("mysql");
					version = extractMySQLVersion(stdout);

					try {
						const { stdout: status } = await execPromise("mysqladmin ping");
						running = status.includes("mysqld is alive");
					} catch (e) {
						error = `mysqladmin ping failed: ${e.message}`;
					}
				} catch (e) {
					error = `mysql check failed: ${e.message}`;
				}
				break;

			case "win32":
				try {
					const { stdout } = await execPromise(
						`powershell "Get-Service | Where-Object { $_.DisplayName -like '*mysql*' } | Select-Object -Property Name,Status"`
					);

					if (!stdout.includes("mysql")) {
						return { installed: false, running: false, error: "No MySQL service found." };
					}

					installed = true;
					running = stdout.includes("Running");

					try {
						const { stdout: versionOut } = await execPromise("mysql --version");
						version = extractMySQLVersion(versionOut);
					} catch (e) {
						error = `Version check failed: ${e.message}`;
					}
				} catch (e) {
					error = `Windows service check failed: ${e.message}`;
				}
				break;

			default:
				error = "Unsupported platform.";
		}
	} catch (e) {
		error = `Unexpected error: ${e.message}`;
	}

	return { installed, version, running, error };
}

export async function startMySQLService() {
	try {
		switch (process.platform) {
			case "linux": {
				const services = ["mysql", "mariadb", "mysqld"];
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
					await execPromise("brew services start mysql");
					return { started: true, service: "mysql", platform: "darwin" };
				} catch (e) {
					return { started: false, error: `brew start failed: ${e.message}` };
				}

			case "win32":
				try {
					const { stdout } = await execPromise('sc query type= service state= all | find "SERVICE_NAME: mysql"');
					const serviceLines = stdout.split("\n").filter((line) => line.toLowerCase().includes("service_name") && line.toLowerCase().includes("mysql"));

					if (serviceLines.length === 0) {
						return { started: false, error: "No MySQL service found." };
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

export async function preparingDatabase({ username = "root", password = "1234", database = "myDb" } = {}) {
	const isWindows = process.platform === "win32";

	try {
		// Check if MySQL client is available
		let mysqlPath = "mysql";
		if (isWindows) {
			const { stdout } = await execPromise(
				'powershell "Get-ChildItem \'C:\\Program Files\\MySQL\\*\\bin\\mysql.exe\' | Select-Object -First 1 | % { $_.FullName }"'
			);
			if (stdout.trim()) {
				mysqlPath = stdout.trim();
			}
		}

		// Check if database exists
		const checkCommand = `"${mysqlPath}" -u${username} -p"${password}" -e "SHOW DATABASES LIKE '${database}';"`;
		// const checkCommand = `"${mysqlPath}" -u ${username} -p${password} -e "SHOW DATABASES LIKE '${database}';"`;
		const createCommand = `"${mysqlPath}" -u ${username} -p"${password}" -e "CREATE DATABASE \`${database}\`;"`;

		const { stdout } = await execPromise(checkCommand);

		if (stdout.includes(database)) {
			return {
				success: true,
				created: false,
				message: `Database '${database}' already exists.`,
			};
		} else {
			await execPromise(createCommand);
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

export async function initializeDatabase() {
	// بررسی نصب MySQL
	const { installed, version, running, error } = await checkMySQLInstalled();

	if (!installed) {
		console.error("MySQL is not installed:", error);
		return;
	}

	if (!running) {
		const { started, error } = await startMySQLService();
		if (!started) {
			console.error("Failed to start MySQL:", error);
			return;
		}
	}

	// ایجاد دیتابیس
	const result = await preparingDatabase();
	console.log(result.message);
}

