const { exec } = require("child_process");
const { promisify } = require("util");
const execPromise = promisify(exec);

// تابع امن برای اجرای دستورات PSQL
async function runPsqlCommand(command, username = "postgres") {
	try {
		// تشخیص سیستم عامل برای ساخت دستور مناسب
		const isWindows = process.platform === "win32";
		const psqlCmd = isWindows ? `psql -U ${username} -t -c "${command}"` : `sudo -u ${username} psql -t -c "${command}"`;

		const { stdout } = await execPromise(psqlCmd);
		return { success: true, stdout };
	} catch (error) {
		return {
			success: false,
			error: error.message,
			stderr: error.stderr,
		};
	}
}

// بررسی وجود کاربر
async function checkPostgresUser({ username }) {
	try {
		// استفاده از پارامتر امن برای جلوگیری از SQL injection
		const { success, stdout } = await runPsqlCommand(`SELECT 1 FROM pg_roles WHERE rolname='${username.replace(/'/g, "''")}'`);
		console.log("* * * checkPostgresUser step1", { stdout });

		if (!success) {
			return {
				success: false,
				existed: false,
				message: `Error checking user ${username}`,
			};
		}

		const userExists = stdout.includes("1");
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
async function configPostgresUser({ username = "mojtaba", password = "1234", isSuperuser = true } = {}) {
	console.log({ username, password, isSuperuser });
	console.log("* * * configPostgresUser step1");

	try {
		// 1. بررسی وجود کاربر
		const userCheck = await checkPostgresUser({ username });
		console.log("* * * configPostgresUser step2", { userCheck });

		if (userCheck.existed) {
			return {
				success: true,
				existed: true,
				message: `User ${username} already exists`,
			};
		}
		console.log("* * * configPostgresUser step3");

		// 2. ایجاد کاربر جدید با دستور امن
		const escapedPassword = password.replace(/'/g, "''");
		const superuserClause = isSuperuser ? "SUPERUSER" : "";
		console.log("* * * configPostgresUser step4");

		const createResult = await runPsqlCommand(`CREATE USER ${username} ${superuserClause} PASSWORD '${escapedPassword}'`);
		console.log("* * * configPostgresUser step5", { createResult });

		if (!createResult.success) {
			throw new Error(createResult.error || "Failed to create user");
		}
		console.log("* * * configPostgresUser step6");

		// 3. تنظیم مجوزهای اضافی (اختیاری)
		if (isSuperuser) {
			await runPsqlCommand(`ALTER USER ${username} WITH ${superuserClause}`);
		}
		console.log("* * * configPostgresUser step7");

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
		console.log("* * * configPostgresUser completed");
	}
}

// تابع برای تغییر رمز عبور کاربر موجود
async function changePostgresPassword({ username = "mojtaba", newPassword = "1234" }) {
	try {
		const escapedPassword = newPassword.replace(/'/g, "''");
		const { success } = await runPsqlCommand(`ALTER USER ${username} WITH PASSWORD '${escapedPassword}'`);

		return {
			success,
			message: success ? `Password for ${username} changed successfully` : `Failed to change password for ${username}`,
		};
	} catch (error) {
		return {
			success: false,
			message: `Error changing password: ${error.message}`,
			error: error.message,
		};
	}
}

module.exports = {
	configPostgresUser,
	checkPostgresUser,
	changePostgresPassword,
	runPsqlCommand,
};
