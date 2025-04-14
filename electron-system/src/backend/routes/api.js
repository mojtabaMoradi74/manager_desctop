// src/backend/routes/api.js
const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const { authJwt } = require("../middleware/auth");
const logger = require("../utils/logger");
const { User, Record } = require("../models");

// میدلور احراز هویت برای همه مسیرهای API
router.use(authJwt);

// دریافت لیست کاربران (فقط برای ادمین)
router.get("/users", authJwt, async (req, res) => {
	try {
		// بررسی نقش کاربر
		if (req.user.role !== "admin") {
			return res.status(403).json({ error: "دسترسی غیرمجاز" });
		}

		const users = await User.findAll({
			attributes: ["id", "username", "email", "role", "isActive", "createdAt"],
			order: [["createdAt", "DESC"]],
		});

		res.json(users);
	} catch (error) {
		logger.error("خطا در دریافت لیست کاربران:", error);
		res.status(500).json({ error: "خطا در دریافت کاربران" });
	}
});

// مدیریت رکوردها
router
	.route("/records")
	.get([check("page").optional().isInt({ min: 1 }).toInt(), check("limit").optional().isInt({ min: 1, max: 100 }).toInt()], async (req, res) => {
		try {
			const page = req.query.page || 1;
			const limit = req.query.limit || 20;
			const offset = (page - 1) * limit;

			// بهینه‌سازی برای ۵ میلیون رکورد
			const { count, rows } = await Record.findAndCountAll({
				limit,
				offset,
				order: [["createdAt", "DESC"]],
			});

			res.json({
				total: count,
				page,
				pageSize: limit,
				totalPages: Math.ceil(count / limit),
				data: rows,
			});
		} catch (error) {
			logger.error("خطا در دریافت رکوردها:", error);
			res.status(500).json({ error: "خطا در دریافت داده‌ها" });
		}
	})
	.post([check("title").notEmpty().withMessage("عنوان الزامی است"), check("content").notEmpty().withMessage("محتوا الزامی است")], async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		try {
			const record = await Record.create({
				...req.body,
				userId: req.user.id,
			});

			logger.info(`رکورد جدید ایجاد شد - ID: ${record.id}`);
			res.status(201).json(record);
		} catch (error) {
			logger.error("خطا در ایجاد رکورد:", error);
			res.status(500).json({ error: "خطا در ایجاد رکورد" });
		}
	});

// مدیریت تک رکورد
router
	.route("/records/:id")
	.get(async (req, res) => {
		try {
			const record = await Record.findByPk(req.params.id);
			if (!record) {
				return res.status(404).json({ error: "رکورد یافت نشد" });
			}

			// بررسی مالکیت (مگر اینکه ادمین باشد)
			if (record.userId !== req.user.id && req.user.role !== "admin") {
				return res.status(403).json({ error: "دسترسی غیرمجاز" });
			}

			res.json(record);
		} catch (error) {
			logger.error("خطا در دریافت رکورد:", error);
			res.status(500).json({ error: "خطا در دریافت رکورد" });
		}
	})
	.put(
		[
			check("title").optional().notEmpty().withMessage("عنوان نمی‌تواند خالی باشد"),
			check("content").optional().notEmpty().withMessage("محتوا نمی‌تواند خالی باشد"),
		],
		async (req, res) => {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return res.status(400).json({ errors: errors.array() });
			}

			try {
				const record = await Record.findByPk(req.params.id);
				if (!record) {
					return res.status(404).json({ error: "رکورد یافت نشد" });
				}

				// بررسی مالکیت
				if (record.userId !== req.user.id && req.user.role !== "admin") {
					return res.status(403).json({ error: "دسترسی غیرمجاز" });
				}

				await record.update(req.body);
				res.json(record);
			} catch (error) {
				logger.error("خطا در به‌روزرسانی رکورد:", error);
				res.status(500).json({ error: "خطا در به‌روزرسانی" });
			}
		}
	)
	.delete(async (req, res) => {
		try {
			const record = await Record.findByPk(req.params.id);
			if (!record) {
				return res.status(404).json({ error: "رکورد یافت نشد" });
			}

			// بررسی مالکیت
			if (record.userId !== req.user.id && req.user.role !== "admin") {
				return res.status(403).json({ error: "دسترسی غیرمجاز" });
			}

			await record.destroy();
			res.json({ success: true });
		} catch (error) {
			logger.error("خطا در حذف رکورد:", error);
			res.status(500).json({ error: "خطا در حذف رکورد" });
		}
	});

module.exports = router;
