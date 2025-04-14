// src/backend/middleware/socket-auth.js
const jwt = require("jsonwebtoken");
const { User } = require("../models");
const logger = require("../utils/logger");

module.exports = async (socket, next) => {
	try {
		// دریافت توکن از query string یا handshake headers
		const token = socket.handshake.query?.token || socket.handshake.auth?.token || socket.handshake.headers?.authorization?.split(" ")[1];

		if (!token) {
			logger.warn("اتصال سوکت بدون توکن - IP: " + socket.handshake.address);
			return next(new Error("توکن احراز هویت ارائه نشده است"));
		}

		// بررسی اعتبار توکن JWT
		const decoded = jwt.verify(token, process.env.JWT_SECRET);

		// یافتن کاربر در دیتابیس
		const user = await User.findByPk(decoded.userId, {
			attributes: ["id", "username", "email", "role", "isActive"],
		});

		if (!user || !user.isActive) {
			logger.warn("کاربر غیرفعال یا حذف شده - SocketID: " + socket.id);
			return next(new Error("حساب کاربری غیرفعال یا حذف شده است"));
		}

		// اضافه کردن اطلاعات کاربر به شیء سوکت
		socket.user = user;
		logger.info(`اتصال سوکت احراز هویت شد - کاربر: ${user.email} - SocketID: ${socket.id}`);
		next();
	} catch (error) {
		logger.error("خطا در احراز هویت سوکت:", error.message);

		if (error.name === "TokenExpiredError") {
			return next(new Error("توکن منقضی شده است"));
		}

		if (error.name === "JsonWebTokenError") {
			return next(new Error("توکن نامعتبر است"));
		}

		next(new Error("خطا در احراز هویت"));
	}
};
