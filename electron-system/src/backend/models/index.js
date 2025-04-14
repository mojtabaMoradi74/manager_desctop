// src/backend/models/index.js
const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || "development";
const config = require("../config/database")[env];
const db = {};
const logger = require("../utils/logger");

let sequelize;

async function initializeDatabase() {
	if (config.use_env_variable) {
		sequelize = new Sequelize(process.env[config.use_env_variable], config);
	} else {
		// ابتدا بدون مشخص کردن نام دیتابیس متصل می‌شویم
		const adminSequelize = new Sequelize({
			database: "postgres", // اتصال به دیتابیس پیش‌فرض postgres
			username: config.username,
			password: config.password,
			host: config.host,
			port: config.port,
			dialect: config.dialect,
			logging: false,
		});

		try {
			// بررسی وجود دیتابیس در PostgreSQL
			const result = await adminSequelize.query(`SELECT 1 FROM pg_database WHERE datname = '${config.database}';`);

			// اگر دیتابیس وجود نداشت، آن را ایجاد می‌کنیم
			if (result[0].length === 0) {
				await adminSequelize.query(`CREATE DATABASE "${config.database}";`);
				logger.info(`دیتابیس ${config.database} ایجاد شد`);
				// تنظیم encoding و collation برای PostgreSQL
				await adminSequelize.query(`
				UPDATE pg_database SET encoding = pg_char_to_encoding('UTF8'), 
				datcollate = 'en_US.UTF-8', datctype = 'en_US.UTF-8' 
				WHERE datname = '${config.database}';
			  `);
			} else {
				// logger.info(`دیتابیس ${config.database} از قبل وجود دارد`);
			}
		} catch (error) {
			logger.error(`خطا در ایجاد/بررسی دیتابیس ${config.database}:`, error);
			throw error;
		} finally {
			await adminSequelize.close();
		}

		// حالا با دیتابیس ایجاد شده متصل می‌شویم
		sequelize = new Sequelize(config.database, config.username, config.password, {
			host: config.host,
			port: config.port,
			dialect: config.dialect,
			logging: process.env.SEQUELIZE_LOGGING === "true" ? console.log : false,
			pool: {
				max: 20,
				min: 0,
				acquire: 30000,
				idle: 10000,
			},
			dialectOptions: {
				ssl: config.dialectOptions?.ssl,
				client_encoding: "UTF8",
			},
		});

		// سپس اتصال به دیتابیس را بررسی می‌کنیم
		await sequelize.authenticate();
		logger.info("اتصال به دیتابیس با موفقیت برقرار شد");

		// همگام‌سازی مدل‌ها
		await sequelize.sync({ alter: true });
		logger.info("مدل‌های دیتابیس همگام‌سازی شدند");
	}

	// بارگذاری خودکار تمام مدل‌ها
	fs
		.readdirSync(__dirname)
		.filter((file) => {
			return file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js" && !file.includes(".test.js");
		})
		.forEach((file) => {
			const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
			db[model.name] = model;
		});

	// تنظیم ارتباطات مدل‌ها
	Object.keys(db).forEach((modelName) => {
		if (db[modelName].associate) {
			db[modelName].associate(db);
		}
	});

	db.Sequelize = Sequelize;

	return db;
}

module.exports = {
	initializeDatabase,
	sequelize: sequelize,
};
