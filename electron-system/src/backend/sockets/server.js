// src/backend/sockets/server.js
const logger = require("../utils/logger");
const { SystemStatus } = require("../models");

module.exports = (socket, namespace) => {
	logger.info(`سرور متصل شد - شناسه: ${socket.id}`);
	const wrap = (handler) => {
		return async (...args) => {
			try {
				await handler(...args);
			} catch (error) {
				const callback = args.find((arg) => typeof arg === "function");
				if (callback) {
					callback({
						success: false,
						error: error.message,
					});
				}
				logger.error("خطای سوکت:", error);
			}
		};
	};
	// ارسال وضعیت سیستم به سرور
	socket.on(
		"getSystemStatus",
		wrap(async (callback) => {
			const status = await SystemStatus.findOne({
				order: [["createdAt", "DESC"]],
			});

			callback({
				success: true,
				status: status || {},
			});
		})
	);

	// دریافت آپدیت وضعیت از سرور
	socket.on("updateSystemStatus", async (data, callback) => {
		try {
			const newStatus = await SystemStatus.create({
				cpuUsage: data.cpuUsage,
				memoryUsage: data.memoryUsage,
				diskUsage: data.diskUsage,
				activeConnections: data.activeConnections,
			});

			// انتشار به همه کلاینت‌ها
			namespace.emit("systemStatusUpdated", newStatus);

			callback({ success: true });
		} catch (error) {
			logger.error("خطا در به‌روزرسانی وضعیت سیستم:", error);
			callback({
				success: false,
				error: "خطا در به‌روزرسانی وضعیت",
			});
		}
	});

	// مدیریت قطع ارتباط سرور
	socket.on("disconnect", (reason) => {
		logger.warn(`سرور قطع شد - شناسه: ${socket.id} - دلیل: ${reason}`);

		// اطلاع به همه کلاینت‌ها
		namespace.emit("serverDisconnected", {
			timestamp: new Date(),
			message: "اتصال با سرور اصلی قطع شد",
		});
	});

	// مدیریت خطاهای سرور
	socket.on("serverError", (error) => {
		logger.error(`خطای سرور - شناسه: ${socket.id} - خطا: ${error.message}`);
	});
};
