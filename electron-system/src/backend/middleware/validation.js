// src/backend/middleware/validation.js
const { check } = require("express-validator");

exports.validateRegister = [
	check("username")
		.notEmpty()
		.withMessage("نام کاربری الزامی است")
		.isLength({ min: 3 })
		.withMessage("نام کاربری باید حداقل ۳ کاراکتر باشد")
		.matches(/^[a-zA-Z0-9_]+$/)
		.withMessage("نام کاربری فقط می‌تواند شامل حروف، اعداد و زیرخط باشد"),

	check("email").notEmpty().withMessage("ایمیل الزامی است").isEmail().withMessage("فرمت ایمیل نامعتبر است"),

	check("password").notEmpty().withMessage("رمز عبور الزامی است").isLength({ min: 6 }).withMessage("رمز عبور باید حداقل ۶ کاراکتر باشد"),
];

exports.validateLogin = [
	check("email").notEmpty().withMessage("ایمیل الزامی است").isEmail().withMessage("فرمت ایمیل نامعتبر است"),

	check("password").notEmpty().withMessage("رمز عبور الزامی است"),
];
