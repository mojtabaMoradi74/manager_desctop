// src/backend/routes/setup.js
const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const { SystemSetting } = require("../models");
const logger = require("../utils/logger");
const { isAdmin } = require("../middleware/auth");

// اعتبارسنجی تنظیمات دیتابیس
const validateDatabaseConfig = [
	check("dbHost").notEmpty().withMessage("آدرس سرور دیتابیس الزامی است"),
	check("dbPort").isInt({ min: 1, max: 65535 }).withMessage("پورت نامعتبر است"),
	check("dbUsername").notEmpty().withMessage("نام کاربری دیتابیس الزامی است"),
	check("dbName").notEmpty().withMessage("نام دیتابیس الزامی است"),
];

// ذخیره تنظیمات دیتابیس
router.post("/database", isAdmin, validateDatabaseConfig, async (req, res) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}

	try {
		const { dbHost, dbPort, dbUsername, dbPassword, dbName, dbType } = req.body;

		// ذخیره تنظیمات در دیتابیس
		const [setting, created] = await SystemSetting.upsert({
			key: "database_config",
			value: JSON.stringify({
				host: dbHost,
				port: dbPort,
				username: dbUsername,
				password: dbPassword,
				database: dbName,
				dialect: dbType || "postgres",
			}),
		});

		logger.info("تنظیمات دیتابیس ذخیره شد");
		res.json({ success: true, setting });
	} catch (error) {
		logger.error("خطا در ذخیره تنظیمات دیتابیس:", error);
		res.status(500).json({ error: "خطا در ذخیره تنظیمات" });
	}
});

// تست اتصال به دیتابیس
router.post("/database/test", isAdmin, validateDatabaseConfig, async (req, res) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}

	try {
		const { dbHost, dbPort, dbUsername, dbPassword, dbName, dbType } = req.body;

		// ایجاد اتصال موقت برای تست
		const { Sequelize } = require("sequelize");
		const sequelize = new Sequelize(dbName, dbUsername, dbPassword, {
			host: dbHost,
			port: dbPort,
			dialect: dbType || "postgres",
			logging: false,
		});

		// تست اتصال
		await sequelize.authenticate();
		await sequelize.close();

		logger.info("اتصال به دیتابیس با موفقیت تست شد");
		res.json({ success: true, message: "اتصال موفقیت‌آمیز بود" });
	} catch (error) {
		logger.error("خطا در تست اتصال دیتابیس:", error);
		res.status(500).json({
			success: false,
			error: "اتصال برقرار نشد",
			details: error.message,
		});
	}
});

// دریافت وضعیت راه‌اندازی سیستم
router.get("/status", async (req, res) => {
	try {
		const settings = await SystemSetting.findAll({
			where: {
				key: ["database_config", "admin_setup"],
			},
		});

		const status = {
			isDatabaseConfigured: settings.some((s) => s.key === "database_config"),
			isAdminSetup: settings.some((s) => s.key === "admin_setup" && s.value === "true"),
		};

		res.json(status);
	} catch (error) {
		logger.error("خطا در دریافت وضعیت راه‌اندازی:", error);
		res.status(500).json({ error: "خطا در دریافت وضعیت" });
	}
});

module.exports = router;
