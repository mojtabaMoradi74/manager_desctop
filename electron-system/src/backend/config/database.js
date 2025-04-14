// src/backend/config/database.js
require("dotenv").config();

module.exports = {
	development: {
		dialect: process.env.DB_DIALECT || "postgres",
		host: process.env.DB_HOST || "localhost",
		port: process.env.DB_PORT || 5432,
		username: process.env.DB_USER || "postgres",
		password: process.env.DB_PASSWORD || "postgres",
		database: process.env.DB_NAME || "system_dev",
		logging: true,
		dialectOptions: {
			client_encoding: "UTF8",
		},
	},

	test: {
		dialect: "postgres",
		host: "localhost",
		port: 5432,
		username: "postgres",
		password: "postgres",
		database: "system_test",
	},
	production: {
		use_env_variable: "DATABASE_URL",
		dialect: "postgres",
		dialectOptions: {
			ssl: {
				require: true,
				rejectUnauthorized: false,
			},
		},
		pool: {
			max: 5,
			min: 0,
			acquire: 30000,
			idle: 10000,
		},
	},
};
