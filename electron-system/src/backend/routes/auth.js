// src/backend/routes/auth.js
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("../models");
const { validateLogin, validateRegister } = require("../middleware/validation");
const logger = require("../utils/logger");

// بررسی وضعیت احراز هویت کاربر
router.get("/me", async (req, res) => {
	try {
		const user = await User.findByPk(req.user.id, {
			attributes: ["id", "username", "email", "role", "createdAt"],
		});

		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}

		res.json(user);
	} catch (error) {
		console.error("Error in /me endpoint:", error);
		res.status(500).json({ error: "Internal server error" });
	}
});

// ثبت نام کاربر جدید
router.post("/register", validateRegister, async (req, res) => {
	try {
		const { username, email, password } = req.body;

		// بررسی وجود کاربر با این ایمیل یا نام کاربری
		const existingUser = await User.findOne({
			where: {
				[Op.or]: [{ email }, { username }],
			},
		});

		if (existingUser) {
			return res.status(400).json({ error: "کاربر با این مشخصات قبلاً ثبت نام کرده است" });
		}

		// هش کردن رمز عبور
		const hashedPassword = await bcrypt.hash(password, 12);

		// ایجاد کاربر جدید
		const user = await User.create({
			username,
			email,
			password: hashedPassword,
		});

		// ایجاد توکن JWT
		const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });

		logger.info(`کاربر جدید ثبت نام کرد: ${user.email}`);
		res.status(201).json({ token, userId: user.id });
	} catch (error) {
		logger.error("خطا در ثبت نام:", error);
		res.status(500).json({ error: "خطای سرور در ثبت نام" });
	}
});

// ورود کاربر
router.post("/login", validateLogin, async (req, res) => {
	try {
		const { email, password } = req.body;

		// یافتن کاربر با ایمیل
		const user = await User.findOne({ where: { email } });
		if (!user) {
			return res.status(401).json({ error: "کاربری با این ایمیل یافت نشد" });
		}

		// بررسی رمز عبور
		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch) {
			return res.status(401).json({ error: "رمز عبور نادرست است" });
		}

		// بررسی فعال بودن حساب
		if (!user.isActive) {
			return res.status(403).json({ error: "حساب کاربری غیرفعال شده است" });
		}

		// ایجاد توکن JWT
		const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });

		logger.info(`کارگر وارد شد: ${user.email}`);
		res.json({ token, userId: user.id, role: user.role });
	} catch (error) {
		logger.error("خطا در ورود:", error);
		res.status(500).json({ error: "خطای سرور در ورود" });
	}
});

// دریافت اطلاعات کاربر جاری
router.get("/me", async (req, res) => {
	try {
		// کاربر از طریق میدلور احراز هویت اضافه شده است
		const user = req.user;

		if (!user) {
			return res.status(404).json({ error: "کاربر یافت نشد" });
		}

		res.json({
			id: user.id,
			username: user.username,
			email: user.email,
			role: user.role,
			createdAt: user.createdAt,
		});
	} catch (error) {
		logger.error("خطا در دریافت اطلاعات کاربر:", error);
		res.status(500).json({ error: "خطای سرور" });
	}
});

module.exports = router;
