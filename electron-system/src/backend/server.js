require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const { createServer } = require("http");
const { Server } = require("socket.io");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
// const { sequelize } = require("./models");
const authRoutes = require("./routes/auth");
const setupRoutes = require("./routes/setup");
const apiRoutes = require("./routes/api");
const socketHandler = require("./sockets/handler");
const logger = require("./utils/logger");
const { initializeDatabase } = require("./models");

const app = express();
const httpServer = createServer(app);
const PORT = process.env.PORT || 5000;

// تنظیمات محدودیت نرخ درخواست
const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 دقیقه
	max: 1000, // حداکثر 1000 درخواست در هر پنجره
	standardHeaders: true,
	legacyHeaders: false,
});

// اتصال به دیتابیس و راه‌اندازی سرور
// sequelize
// 	.authenticate()
// 	.then(async () => {
// 		logger.info("اتصال به دیتابیس با موفقیت برقرار شد");

// 		// همگام‌سازی مدل‌ها با دیتابیس
// 		await sequelize.sync({ alter: true });
// 		logger.info("مدل‌های دیتابیس همگام‌سازی شدند");

// 		// راه‌اندازی سرور
// 		httpServer.listen(PORT, () => {
// 			logger.info(`سرور در حال اجرا روی پورت ${PORT}`);

// 			// تنظیمات سوکت‌ها
// 			socketHandler(io);
// 		});
// 	})
// 	.catch((err) => {
// 		logger.error("خطا در اتصال به دیتابیس:", err);
// 		process.exit(1);
// 	});
async function startServer() {
	try {
		// میدلورهای امنیتی و پایه
		app.use(helmet());
		app.use(limiter);
		app.use(
			cors({
				origin: process.env.CLIENT_URL || "http://localhost:3000",
				credentials: true,
			})
		);
		app.use(express.json({ limit: "10mb" }));
		app.use(express.urlencoded({ extended: true }));

		// لاگ تمام درخواست‌ها
		app.use((req, res, next) => {
			logger.info(`${req.method} ${req.originalUrl}`);
			next();
		});

		// مسیرهای API
		app.use("/api/auth", authRoutes);
		app.use("/api/setup", setupRoutes);
		app.use("/api", apiRoutes);

		// مدیریت فایل‌های استاتیک برای تولید
		if (process.env.NODE_ENV === "production") {
			app.use(express.static(path.join(__dirname, "../../build")));
			app.get("*", (req, res) => {
				res.sendFile(path.resolve(__dirname, "../../build", "index.html"));
			});
		}

		// مدیریت خطاها
		app.use((err, req, res, next) => {
			logger.error(err.stack);
			res.status(500).json({ error: "خطای سرور داخلی" });
		});

		// راه‌اندازی سوکت‌ها
		const io = new Server(httpServer, {
			cors: {
				origin: process.env.CLIENT_URL || "http://localhost:3000",
				methods: ["GET", "POST"],
			},
			maxHttpBufferSize: 1e8, // 100MB برای آپلود فایل‌های بزرگ
		});

		// ابتدا دیتابیس را راه‌اندازی می‌کنیم
		await initializeDatabase();

		// راه‌اندازی سرور
		app.listen(PORT, () => {
			logger.info(`سرور در حال اجرا روی پورت ${PORT}`);
		});

		// مدیریت خاتمه تمیز سرور
		process.on("SIGINT", async () => {
			try {
				await sequelize.close();
				logger.info("اتصال دیتابیس بسته شد");
				process.exit(0);
			} catch (err) {
				logger.error("خطا در بستن اتصال دیتابیس:", err);
				process.exit(1);
			}
		});
	} catch (error) {
		logger.error("خطا در راه‌اندازی سرور:", error);
		process.exit(1);
	}
}

startServer();

module.exports = httpServer;
