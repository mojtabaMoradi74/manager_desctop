// src/backend/sockets/client.js
const logger = require("../utils/logger");
const { Record } = require("../models");

module.exports = (socket, namespace) => {
	logger.info(`کلاینت متصل شد - کاربر: ${socket.user.email} - SocketID: ${socket.id}`);

	// مدیریت دریافت رکورد جدید از کلاینت
	socket.on("createRecord", async (data, callback) => {
		try {
			logger.info(`دریافت درخواست ایجاد رکورد از کاربر ${socket.user.id}`);

			// اعتبارسنجی داده‌ها
			if (!data.title || !data.content) {
				throw new Error("عنوان و محتوا الزامی هستند");
			}

			// ایجاد رکورد جدید
			const record = await Record.create({
				title: data.title,
				content: data.content,
				userId: socket.user.id,
			});

			logger.info(`رکورد جدید ایجاد شد - ID: ${record.id}`);

			// انتشار به همه کلاینت‌ها (به جز فرستنده)
			namespace.emit("newRecord", {
				...record.get({ plain: true }),
				user: {
					id: socket.user.id,
					username: socket.user.username,
				},
			});

			// پاسخ به فرستنده
			callback({
				success: true,
				record,
			});
		} catch (error) {
			logger.error("خطا در ایجاد رکورد:", error.message);
			callback({
				success: false,
				error: error.message,
			});
		}
	});

	// درخواست همگام‌سازی رکوردها
	socket.on("syncRecords", async (query, callback) => {
		try {
			const limit = Math.min(query.limit || 100, 500);
			const offset = query.offset || 0;

			const records = await Record.findAll({
				where: query.filters || {},
				limit,
				offset,
				order: [["createdAt", "DESC"]],
			});

			callback({
				success: true,
				data: records,
			});
		} catch (error) {
			logger.error("خطا در همگام‌سازی رکوردها:", error);
			callback({
				success: false,
				error: "خطا در دریافت داده‌ها",
			});
		}
	});

	// مدیریت قطع ارتباط
	socket.on("disconnect", (reason) => {
		logger.info(`کلاینت قطع شد - کاربر: ${socket.user.email} - دلیل: ${reason}`);
	});

	// مدیریت خطاها
	socket.on("error", (error) => {
		logger.error(`خطای سوکت - کاربر: ${socket.user.email} - خطا: ${error.message}`);
	});
};
