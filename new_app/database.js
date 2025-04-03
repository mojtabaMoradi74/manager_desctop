const path = require("path");
const { Sequelize, DataTypes } = require("sequelize");
const { app } = require("electron");

class Database {
	constructor() {
		// مسیر ذخیره‌سازی دیتابیس در پوشه userData الکترون
		const dbPath = path.join(app.getPath("userData"), "appdata.sqlite");

		// تنظیمات پیشرفته Sequelize برای عملکرد بهتر
		this.sequelize = new Sequelize({
			dialect: "sqlite",
			storage: dbPath,
			logging: false, // غیرفعال کردن لاگ برای عملکرد بهتر
			transactionType: "IMMEDIATE", // بهینه‌سازی تراکنش‌ها
			retry: {
				max: 5, // حداکثر تعداد تلاش برای اتصال
				timeout: 30000, // زمان انتظار برای هر تلاش (میلی‌ثانیه)
			},
			pool: {
				max: 5,
				min: 0,
				acquire: 30000,
				idle: 10000,
			},
			benchmark: false,
			define: {
				freezeTableName: true, // جلوگیری از تغییر نام جداول
				timestamps: true, // فعال کردن createdAt و updatedAt
			},
		});

		// تعریف مدل Message با تنظیمات بهینه
		this.Message = this.sequelize.define(
			"Message",
			{
				id: {
					type: DataTypes.INTEGER,
					autoIncrement: true,
					primaryKey: true,
				},
				text: {
					type: DataTypes.TEXT, // استفاده از TEXT به جای STRING برای محتوای طولانی
					allowNull: false,
				},
				timestamp: {
					type: DataTypes.DATE,
					defaultValue: Sequelize.NOW,
				},
				// فیلدهای اضافی برای بهینه‌سازی جستجو
				searchKeywords: {
					type: DataTypes.TEXT,
					allowNull: true,
				},
			},
			{
				indexes: [
					// ایندکس برای جستجوی سریع‌تر
					{
						name: "message_timestamp_index",
						fields: ["timestamp"],
					},
					// ایندکس برای جستجوی متنی (در صورت نیاز)
					{
						name: "message_text_index",
						fields: ["text"],
						using: "FULLTEXT", // برای SQLite با پلاگین FTS
					},
				],
				// بهینه‌سازی‌های بیشتر
				paranoid: false, // غیرفعال کردن soft delete
				underscored: true, // استفاده از نام‌گذاری underscore
			}
		);
	}

	/**
	 * مقداردهی اولیه و اتصال به دیتابیس
	 */
	async init() {
		try {
			// تست اتصال به دیتابیس
			await this.sequelize.authenticate();

			// همگام‌سازی مدل‌ها با دیتابیس
			await this.sequelize.sync({
				alter: true, // تغییرات ساختاری را اعمال کند
				logging: console.log, // فقط در حالت توسعه
			});

			console.log("✅ Database connected and synced successfully");
		} catch (error) {
			console.error("❌ Database connection error:", error);
			throw error; // پرتاب خطا برای مدیریت در سطح بالاتر
		}
	}

	/**
	 * ذخیره پیام جدید در دیتابیس
	 * @param {Object} messageData - داده‌های پیام
	 * @param {string} messageData.text - متن پیام
	 * @returns {Promise<Model>} - مدل ذخیره شده
	 */
	async saveMessage(messageData) {
		try {
			// استخراج کلمات کلیدی برای جستجوی بهتر (اختیاری)
			const searchKeywords = this.extractKeywords(messageData.text);

			const message = await this.Message.create({
				...messageData,
				searchKeywords,
			});

			return message;
		} catch (error) {
			console.error("Error saving message:", error);
			throw error;
		}
	}

	/**
	 * بازیابی پیام‌ها با امکان صفحه‌بندی
	 * @param {Object} options - گزینه‌های جستجو
	 * @param {number} options.page - شماره صفحه
	 * @param {number} options.pageSize - تعداد آیتم در هر صفحه
	 * @param {string} options.searchTerm - عبارت جستجو
	 * @returns {Promise<Array>} - لیست پیام‌ها
	 */
	async getMessages({ page = 1, pageSize = 10, searchTerm = "" } = {}) {
		try {
			const where = {};

			// اضافه کردن شرایط جستجو اگر وجود داشت
			if (searchTerm) {
				where[Sequelize.Op.or] = [{ text: { [Sequelize.Op.like]: `%${searchTerm}%` } }, { searchKeywords: { [Sequelize.Op.like]: `%${searchTerm}%` } }];
			}

			return await this.Message.findAll({
				where,
				order: [["timestamp", "DESC"]], // جدیدترین پیام‌ها اول
				limit: pageSize,
				offset: (page - 1) * pageSize,
			});
		} catch (error) {
			console.error("Error fetching messages:", error);
			throw error;
		}
	}

	/**
	 * استخراج کلمات کلیدی از متن (برای بهینه‌سازی جستجو)
	 * @private
	 */
	extractKeywords(text) {
		// پیاده‌سازی ساده استخراج کلمات کلیدی
		return text
			.toLowerCase()
			.replace(/[^\w\s]/gi, "") // حذف علائم نگارشی
			.split(/\s+/)
			.filter((word) => word.length > 3) // فقط کلمات با طول بیشتر از 3 حرف
			.join(" ");
	}

	/**
	 * پشتیبان‌گیری از دیتابیس
	 */
	async backupDatabase(backupPath) {
		try {
			// در SQLite می‌توانید کپی ساده از فایل بگیرید
			const fs = require("fs");
			const dbPath = path.join(app.getPath("userData"), "appdata.sqlite");
			fs.copyFileSync(dbPath, backupPath);
			return true;
		} catch (error) {
			console.error("Backup failed:", error);
			return false;
		}
	}

	/**
	 * بستن اتصال به دیتابیس
	 */
	async close() {
		await this.sequelize.close();
	}
}

module.exports = Database;
