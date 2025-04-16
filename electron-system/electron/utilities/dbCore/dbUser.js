
// const { exec } = require("child_process");
// const { promisify } = require("util");
// const execPromise = promisify(exec);
import { promisify } from "util";
import { exec } from "child_process";
const execPromise = promisify(exec);


export async function getMySQLConnection(command, rootPassword = "1234") {
	const isWindows = process.platform === "win32";
	const mysqlCmd = isWindows
		? `mysql -u root -p${rootPassword} -e "${command}"`
		: `mysql -u root -p${rootPassword} -e "${command}"`;

	try {
		const { stdout } = await execPromise(mysqlCmd);
		return { success: true, stdout };
	} catch (error) {
		return { success: false, error: error.message, stderr: error.stderr };
	}
}

// بررسی وجود کاربر
export async function checkMySQLUser({ username }) {
	try {
		const connection = await getMySQLConnection();
		const [rows] = await connection.execute(
			"SELECT 1 FROM mysql.user WHERE user = ?",
			[username]
		);
		await connection.end();

		const userExists = rows.length > 0;
		return {
			success: true,
			existed: userExists,
			message: userExists ? `User ${username} exists` : `User ${username} not found`,
		};
	} catch (error) {
		return {
			success: false,
			message: `Error checking user ${username}: ${error.message}`,
			error: error.message,
		};
	}
}

// پیکربندی کاربر
export async function configMySQLUser({ username = "root", password = "1234", isSuperuser = true } = {}) {
	console.log({ username, password, isSuperuser });
	console.log("* * * configMySQLUser step1");

	try {
		const userCheck = await checkMySQLUser({ username });
		console.log("* * * configMySQLUser step2", { userCheck });

		if (userCheck.existed) {
			return {
				success: true,
				existed: true,
				message: `User ${username} already exists`,
			};
		}
		console.log("* * * configMySQLUser step3");

		const connection = await getMySQLConnection();
		console.log("* * * configMySQLUser step4");

		await connection.execute(
			`CREATE USER ?@'localhost' IDENTIFIED BY ?`,
			[username, password]
		);
		console.log("* * * configMySQLUser step5");

		// اگر کاربر superuser باشه (معادل با دسترسی کامل)
		if (isSuperuser) {
			await connection.execute(`GRANT ALL PRIVILEGES ON *.* TO ?@'localhost' WITH GRANT OPTION`, [username]);
		}
		await connection.end();
		console.log("* * * configMySQLUser step6");

		return {
			success: true,
			existed: false,
			message: `User ${username} created successfully`,
		};
	} catch (error) {
		return {
			success: false,
			message: `Error configuring user ${username}: ${error.message}`,
			error: error.message,
		};
	} finally {
		console.log("* * * configMySQLUser completed");
	}
}

// تغییر رمز عبور کاربر موجود
export async function changeMySQLPassword({ username = "root", newPassword = "1234" }) {
	try {
		const connection = await getMySQLConnection();
		await connection.execute(
			`ALTER USER ?@'localhost' IDENTIFIED BY ?`,
			[username, newPassword]
		);
		await connection.end();

		return {
			success: true,
			message: `Password for ${username} changed successfully`,
		};
	} catch (error) {
		return {
			success: false,
			message: `Error changing password: ${error.message}`,
			error: error.message,
		};
	}
}

