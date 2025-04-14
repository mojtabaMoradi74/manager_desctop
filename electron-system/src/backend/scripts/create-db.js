// scripts/create-db.js
const { Sequelize } = require("sequelize");
const config = require("../config/database").development;

async function createDatabase() {
	// اتصال به دیتابیس پیش‌فرض postgres
	const adminSequelize = new Sequelize({
		database: "postgres",
		username: config.username,
		password: config.password,
		host: config.host,
		port: config.port,
		dialect: "postgres",
		logging: true,
	});

	try {
		// بررسی وجود دیتابیس
		const [results] = await adminSequelize.query(`SELECT 1 FROM pg_database WHERE datname = '${config.database}'`);

		if (results.length === 0) {
			await adminSequelize.query(`CREATE DATABASE "${config.database}"`);
			console.log(`Database ${config.database} created successfully.`);

			// تنظیمات encoding
			await adminSequelize.query(`
        UPDATE pg_database SET 
        encoding = pg_char_to_encoding('UTF8'),
        datcollate = 'en_US.UTF-8', 
        datctype = 'en_US.UTF-8'
        WHERE datname = '${config.database}';
      `);
		} else {
			console.log(`Database ${config.database} already exists.`);
		}
	} catch (error) {
		console.error("Error creating database:", error);
	} finally {
		await adminSequelize.close();
	}
}

createDatabase();
