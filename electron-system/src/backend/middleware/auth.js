// src/backend/middleware/auth.js
const jwt = require("jsonwebtoken");
const { User } = require("../models");
const logger = require("../utils/logger");

// احراز هویت با JWT
exports.authJwt = async (req, res, next) => {
	try {
		const authHeader = req.header("Authorization");
		if (!authHeader || !authHeader.startsWith("Bearer ")) {
			return res.status(401).json({ error: "توکن احراز هویت ارائه نشده است" });
		}

		const token = authHeader.split(" ")[1];
		const decoded = jwt.verify(token, process.env.JWT_SECRET);

		// یافتن کاربر و بررسی فعال بودن
		const user = await User.findByPk(decoded.userId);
		if (!user || !user.isActive) {
			return res.status(401).json({ error: "حساب کاربری غیرفعال یا حذف شده است" });
		}

		// اضافه کردن کاربر به درخواست
		req.user = user;
		next();
	} catch (error) {
		logger.error("خطا در احراز هویت:", error);

		if (error.name === "TokenExpiredError") {
			return res.status(401).json({ error: "توکن منقضی شده است" });
		}

		if (error.name === "JsonWebTokenError") {
			return res.status(401).json({ error: "توکن نامعتبر است" });
		}

		res.status(500).json({ error: "خطا در احراز هویت" });
	}
};

// بررسی نقش ادمین
exports.isAdmin = (req, res, next) => {
	if (req.user.role !== "admin") {
		return res.status(403).json({ error: "فقط مدیر سیستم می‌تواند این عمل را انجام دهد" });
	}
	next();
};
