const { promisify } = require("util");
const { exec } = require("child_process");
const execPromise = promisify(exec);

function extractPostgresVersion(output) {
	const match = output.match(/PostgreSQL\)\s+([\d.]+)/) || output.match(/PostgreSQL\s+([\d.]+)/);
	return match ? match[1] : null;
}

async function checkPostgresInstalledWindows() {
	let installed = false;
	let version = null;
	let running = false;
	let error = null;
	let serviceName = null;

	try {
		// Get list of PostgreSQL-related services
		const { stdout: servicesOutput } = await execPromise(
			`powershell -Command "Get-Service | Where-Object { $_.DisplayName -like '*postgres*' } | Format-Table -HideTableHeaders Name,Status"`
		);

		const lines = servicesOutput
			.trim()
			.split("\n")
			.map((line) => line.trim())
			.filter(Boolean);

		if (lines.length > 0) {
			installed = true;
			const [name, status] = lines[0].split(/\s+/);
			serviceName = name;
			running = status.toLowerCase() === "running";

			// Get version
			try {
				const { stdout: versionOut } = await execPromise("psql --version");
				version = extractPostgresVersion(versionOut);
			} catch (e) {
				error = `PostgreSQL found but version check failed: ${e.message}`;
			}
		} else {
			error = "No PostgreSQL service found on this machine.";
		}
	} catch (e) {
		error = `PowerShell error: ${e.message}`;
	}

	return { installed, version, running, error, serviceName };
}

async function startPostgresServiceWindows(serviceName) {
	try {
		if (!serviceName) {
			return { started: false, error: "No service name provided." };
		}
		await execPromise(`powershell -Command "Start-Service -Name '${serviceName}'"`);
		return { started: true, service: serviceName };
	} catch (e) {
		return { started: false, error: `Failed to start service: ${e.message}` };
	}
}
