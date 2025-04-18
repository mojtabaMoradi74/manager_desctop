import { app } from "electron";
import fs from "fs-extra";
import { exec, spawn } from "child_process";
import { promisify } from "util";
import extract from "extract-zip";
import axios from "axios";
import { pipeline } from "stream";
import { fileURLToPath } from "url";
import path, { dirname } from "path";
import os from "os";
import EventEmitter from "events";
import crypto from "crypto";
import net from "net";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const execPromise = promisify(exec);
const streamPipeline = promisify(pipeline);

const SERVER_START_TIMEOUT = 30000; // 30 seconds
const SERVER_PING_INTERVAL = 1000; // 1 second

const DOWNLOAD_URLS = {
	win32: {
		x64: "https://dev.mysql.com/get/Downloads/MySQL-8.0/mysql-8.0.36-winx64.zip",
		x86: "https://dev.mysql.com/get/Downloads/MySQL-8.0/mysql-8.0.36-win32.zip",
	},
	darwin: {
		//   arm64: 'https://dev.mysql.com/get/Downloads/MySQL-8.0/mysql-8.0.36-macos13-arm64.dmg',
		//   x64: 'https://dev.mysql.com/get/Downloads/MySQL-8.0/mysql-8.0.36-macos13-x86_64.dmg',
		arm64: "https://dev.mysql.com/get/Downloads/MySQL-8.0/mysql-8.0.36-macos13-arm64.tar.gz",
		x64: "https://dev.mysql.com/get/Downloads/MySQL-8.0/mysql-8.0.36-macos13-x86_64.tar.gz",
	},
	linux: {
		x64: "https://dev.mysql.com/get/Downloads/MySQL-8.0/mysql-8.0.36-linux-glibc2.12-x86_64.tar.xz",
		arm64: "https://dev.mysql.com/get/Downloads/MySQL-8.0/mysql-8.0.36-linux-glibc2.28-aarch64.tar.xz",
		// نسخه عمومی لینوکس (اختیاری)
		generic: "https://dev.mysql.com/get/Downloads/MySQL-8.0/mysql-8.0.36-linux-glibc2.17-x86_64-minimal.tar.xz",
	},
};

const fileNames = {
	win32: {
		x64: { name: "mysql-8.0.36-winx64.zip" },
		x86: { name: "mysql-8.0.36-win32.zip" },
		x32: { name: "mysql-8.0.36-win32.zip" },
		ia32: { name: "mysql-8.0.36-win32.zip" },
	},
	darwin: {
		arm64: { name: "mysql-8.0.36-macos13-arm64.dmg" },
		x64: { name: "mysql-8.0.36-macos13-x86_64.dmg" },
	},
	linux: {
		x64: { name: "mysql-8.0.36-linux-glibc2.12-x86_64.tar.xz" },
		arm64: { name: "mysql-8.0.36-linux-glibc2.28-aarch64.tar.xz" },
	},
};

class MySQLManager extends EventEmitter {
	constructor() {
		super();
		this.platform = process.platform;
		this.arch = process.arch;
		this.resourcesPath = app.isPackaged ? path.join(process.resourcesPath, "assets", "mysql") : path.join(__dirname, "../../assets/mysql");

		this.installDir = path.join(app.getPath("userData"), "mysql");
		this.config = {
			port: 3306,
			rootPassword: this.generateRandomPassword(),
			socketPath: path.join(this.installDir, "mysql.sock"),
			host: "127.0.0.1",
			user: "root",
		};
		this.mysqlProcess = null;
		this.serverReady = false;
	}
	async readConfigFromFile() {
		const configPath = path.join(this.installDir, "my.cnf");

		try {
			const configContent = await fs.readFile(configPath, "utf8");
			const portMatch = configContent.match(/port\s*=\s*(\d+)/i);

			if (portMatch && portMatch[1]) {
				this.config.port = parseInt(portMatch[1]);
				this.emit("debug", `Port read from config file: ${this.config.port}`);
				return true;
			}
		} catch (error) {
			this.emit("error", `Error reading config file: ${error.message}`);
		}

		return false;
	}

	/**
	 * Generate a random password for MySQL root user
	 * @returns {string} Random password
	 */
	generateRandomPassword() {
		return crypto.randomBytes(16).toString("hex");
	}

	/**
	 * Initialize MySQL server
	 * @returns {Promise<boolean>} True if initialization succeeded
	 */
	async initialize() {
		try {
			this.emit("status", "Checking installation...");

			if (await this.isInstalled()) {
				this.emit("status", "MySQL already installed");
				this.readConfigFromFile();
				if (!(await this.isServerReady())) {
					this.emit("status", "Starting MySQL server...");
					await this.startServer();
				}
				return true;
			}

			this.emit("status", "Installing MySQL...");
			await this.install();

			this.emit("status", "Starting MySQL server...");
			await this.startServer();

			// this.emit('status', 'Setting root password...');
			// await this.setRootPassword();

			return true;
		} catch (error) {
			this.emit("error", error);
			// await this.cleanupOnError();
			throw error;
		}
	}

	/**
	 * Start MySQL server
	 */
	async startServer() {
		if (!(await this.isPortAvailable(this.config.port))) {
			this.config.port = await this.findAvailablePort();
			this.emit("status", `Port in use, switched to ${this.config.port}`);
			await this.createConfigFile(); // آپدیت فایل کانفیگ با پورت جدید
		}

		const mysqldPath = this.getMySQLBinaryPath("mysqld");
		const configPath = path.join(this.installDir, "my.cnf");

		if (!fs.existsSync(mysqldPath)) {
			throw new Error(`MySQL binary not found at ${mysqldPath}`);
		}

		if (!fs.existsSync(configPath)) {
			throw new Error(`Config file not found at ${configPath}`);
		}

		const args = [`--defaults-file=${configPath}`, "--console"];

		this.mysqlProcess = spawn(mysqldPath, args, {
			shell: true,
			detached: true,
			stdio: ["ignore", "pipe", "pipe"],
			windowsHide: true,
		});

		this.mysqlProcess.stdout.on("data", (data) => {
			const output = data.toString();
			this.emit("debug", `[MySQL] ${output.trim()}`);

			if (output.includes("ready for connections")) {
				this.serverReady = true;
				this.emit("status", "MySQL server is ready");
			}
		});

		this.mysqlProcess.stderr.on("data", (data) => {
			this.emit("error", `[MySQL ERROR] ${data.toString().trim()}`);
		});

		this.mysqlProcess.on("close", (code) => {
			this.serverReady = false;
			this.emit("status", `MySQL process exited with code ${code}`);
		});

		return this.waitForServerReady();
	}

	/**
	 * Wait for server to be ready
	 */
	async waitForServerReady() {
		return new Promise((resolve, reject) => {
			const startTime = Date.now();
			const checkInterval = setInterval(async () => {
				if (Date.now() - startTime > SERVER_START_TIMEOUT) {
					clearInterval(checkInterval);
					reject(new Error("MySQL server startup timed out"));
				}

				try {
					if (await this.isServerReady()) {
						clearInterval(checkInterval);
						resolve(true);
					}
				} catch (error) {
					// Continue waiting
				}
			}, SERVER_PING_INTERVAL);
		});
	}

	/**
	 * Check if server is ready
	 */
	async isServerReady() {
		const mysqladminPath = this.getMySQLBinaryPath("mysqladmin");
		const command = `"${mysqladminPath}" ping -h 127.0.0.1 -P ${this.config.port} -u root --protocol=tcp`;

		try {
			const { stdout } = await execPromise(command, {
				timeout: 5000,
				windowsHide: true,
			});
			return stdout.includes("mysqld is alive");
		} catch {
			return false;
		}
	}

	/**
	 * Cleanup resources on error
	 */
	async cleanupOnError() {
		try {
			await this.stop();
			await fs.remove(this.installDir).catch(() => {});
			this.emit("status", "Cleanup completed after error");
		} catch (cleanupError) {
			this.emit("error", cleanupError);
		}
	}

	/**
	 * بررسی در دسترس بودن پورت قبل از شروع
	 */
	async isPortAvailable(port) {
		return new Promise((resolve) => {
			const server = net.createServer();
			server.unref();
			server.on("error", () => resolve(false));
			server.listen({ port }, () => {
				server.close(() => resolve(true));
			});
		});
	}

	/**
	 * پیدا کردن پورت آزاد به صورت خودکار
	 */
	async findAvailablePort(startPort = this.config.port) {
		let port = startPort;
		while (port < 40000) {
			// محدوده جستجو
			if (await this.isPortAvailable(port)) {
				return port;
			}
			port++;
		}
		throw new Error("No available port found");
	}

	/**
	 * Check if MySQL is installed
	 * @returns {Promise<boolean>}
	 */
	async isInstalled() {
		const mysqldPath = this.getMySQLBinaryPath("mysqld");
		return fs.pathExists(mysqldPath);
	}

	/**
	 * Install MySQL
	 */
	async install() {
		await fs.ensureDir(this.installDir);

		if (!(await this.copyFromAssets())) {
			// await this.downloadAndExtract();
		}

		if (!fs.pathExistsSync(path.join(this.installDir, "data"))) {
			await this.createConfigFile();
			await this.initializeDatabase();
		}
	}

	/**
	 * Copy MySQL from assets if available
	 * @returns {Promise<boolean>} True if copied from assets
	 */
	async copyFromAssets() {
		const platformAssets = path.join(this.resourcesPath, this.platform, this.arch);
		const zipFile = path.join(platformAssets, fileNames[this.platform][this.arch].name);

		try {
			if (await fs.pathExists(this.installDir)) {
				await fs.remove(this.installDir);
			}

			if (!(await fs.pathExists(zipFile))) {
				this.emit("debug", "No zip file found in assets");
				return false;
			}

			this.emit("status", "Found MySQL zip in assets, extracting...");

			// ایجاد یک دایرکتوری موقت برای استخراج
			const tempExtractDir = path.join(os.tmpdir(), `mysql-extract-${Date.now()}`);
			await fs.ensureDir(tempExtractDir);

			// استخراج فایل زیپ به دایرکتوری موقت
			await extract(zipFile, { dir: tempExtractDir });

			// پیدا کردن دایرکتوری اصلی MySQL در محتوای استخراج شده
			const extractedContents = await fs.readdir(tempExtractDir);
			const mysqlDir = extractedContents.find(
				(item) => item.toLowerCase().includes("mysql") && fs.statSync(path.join(tempExtractDir, item)).isDirectory()
			);

			if (!mysqlDir) {
				throw new Error("Could not find MySQL directory in extracted contents");
			}

			const sourcePath = path.join(tempExtractDir, mysqlDir);

			// کپی محتوا به مسیر نصب
			await fs.copy(sourcePath, this.installDir);
			this.emit("status", "MySQL successfully extracted from assets");

			// پاکسازی دایرکتوری موقت
			await fs.remove(tempExtractDir);

			return true;
		} catch (error) {
			this.emit("error", `Failed to extract from assets: ${error.message}`);
			await this.cleanupOnError();
			throw error;
		}
	}

	/**
	 * Download and extract MySQL
	 */
	// async downloadAndExtract() {
	// 	const downloadUrl = DOWNLOAD_URLS[this.platform]?.[this.arch] || DOWNLOAD_URLS.win32.x64;
	// 	const tempFile = path.join(app.getPath("temp"), `mysql-${Date.now()}`);

	// 	this.emit("status", `Downloading MySQL from ${downloadUrl}...`);
	// 	this.emit("download-progress", 0);

	// 	const response = await axios({
	// 		method: "get",
	// 		url: downloadUrl,
	// 		responseType: "stream",
	// 	});

	// 	let downloadedBytes = 0;
	// 	const totalBytes = parseInt(response.headers["content-length"], 10);

	// 	response.data.on("data", (chunk) => {
	// 		downloadedBytes += chunk.length;
	// 		const percent = Math.floor((downloadedBytes / totalBytes) * 100);
	// 		this.emit("download-progress", percent);
	// 	});

	// 	const writer = fs.createWriteStream(tempFile);
	// 	await streamPipeline(response.data, writer);

	// 	this.emit("status", "Extracting MySQL...");

	// 	if (tempFile.endsWith(".zip")) {
	// 		await extract(tempFile, { dir: this.installDir });
	// 	} else if (tempFile.endsWith(".tar.xz")) {
	// 		await this.extractTarXz(tempFile);
	// 	} else if (tempFile.endsWith(".dmg")) {
	// 		await this.mountDmg(tempFile);
	// 	}

	// 	await fs.unlink(tempFile);
	// 	this.emit("status", "MySQL installation completed");
	// }

	/**
	 * Create MySQL config file
	 */
	async createConfigFile() {
		const dataDir = path.join(this.installDir, "data");
		await fs.ensureDir(dataDir);

		const configContent = `
	  		[mysqld]
	  		port=${this.config.port}
	  		basedir=${this.installDir.replace(/\\/g, "/")}
	  		datadir=${dataDir.replace(/\\/g, "/")}
	  		socket=${this.config.socketPath.replace(/\\/g, "/")}
	  		innodb_buffer_pool_size=32M
	  		innodb_log_file_size=24M
	  		innodb_flush_log_at_trx_commit=2
	  		character-set-server=utf8mb4
	  		collation-server=utf8mb4_unicode_ci
	  		log-error=mysql_error.log
	  		general_log=1
	  		general_log_file=mysql_general.log
	  		bind-address=127.0.0.1
			enable-named-pipe
`;

		await fs.writeFile(path.join(this.installDir, "my.cnf"), configContent);
	}

	/**
	 * Initialize MySQL database
	 */
	async initializeDatabase() {
		const mysqldPath = this.getMySQLBinaryPath("mysqld");
		// const dataDir = path.join(this.installDir, 'data');
		//  --datadir="${dataDir}"
		const command = `"${mysqldPath}" --initialize-insecure --user=root`;
		this.emit("status", "Initializing database...");

		try {
			const { stdout, stderr } = await execPromise(command, { windowsHide: true });
			this.emit("debug", `Database init stdout: ${stdout}`);
			this.emit("debug", `Database init stderr: ${stderr}`);
		} catch (error) {
			this.emit("error", "Database initialization failed");
			throw error;
		}
	}

	/**
	 * ایجاد connection pool برای اتصالات کارآمد
	 */
	async createConnectionPool() {
		const mysql = await import("mysql2/promise");

		this.pool = mysql.createPool({
			...this.dbConfig.connection,
			waitForConnections: true,
			queueLimit: 0,
		});

		this.emit("status", "Connection pool created");
	}

	/**
	 * اجرای کوئری‌های عمومی
	 */
	async query(sql, params = []) {
		if (!this.pool) {
			await this.createConnectionPool();
		}

		try {
			const [rows] = await this.pool.query(sql, params);
			return rows;
		} catch (error) {
			this.emit("error", `Query failed: ${error.message}`);
			throw error;
		}
	}

	/**
	 * تست اتصال به دیتابیس
	 */
	async testConnection() {
		try {
			const result = await this.query("SELECT 1 + 1 AS solution");
			return result[0]?.solution === 2;
		} catch {
			return false;
		}
	}

	/**
	 * هماهنگ‌سازی تمام تنظیمات
	 */
	async syncConfig() {
		// 1. خواندن از فایل اگر وجود دارد
		await this.readConfigFromFile();

		// 2. ذخیره تنظیمات جدید در فایل
		await this.createConfigFile();

		// 3. اعمال تغییرات در connection pool اگر وجود دارد
		if (this.pool) {
			await this.pool.end();
			await this.createConnectionPool();
		}
	}

	/**
	 * تغییر پورت به صورت پویا
	 */
	async changePort(newPort) {
		this.dbConfig.connection.port = newPort;
		await this.syncConfig();
	}

	/**
	 * Set root password
	 */
	async setRootPassword() {
		const mysqlPath = this.getMySQLBinaryPath("mysql");
		const command = `"${mysqlPath}" -h 127.0.0.1 -P ${this.config.port} -u root --protocol=tcp -e "ALTER USER 'root'@'localhost' IDENTIFIED BY '${this.config.rootPassword}'"`;

		await execPromise(command, { windowsHide: true });
		this.emit("status", "Root password set successfully");
	}

	/**
	 * Stop MySQL server
	 */
	async stop() {
		if (!this.mysqlProcess) return;

		try {
			const mysqladminPath = this.getMySQLBinaryPath("mysqladmin");
			const command = `"${mysqladminPath}" -h 127.0.0.1 -P ${this.config.port} -u root -p"${this.config.rootPassword}" shutdown`;

			await execPromise(command, { windowsHide: true }).catch(() => this.mysqlProcess.kill("SIGTERM"));

			this.mysqlProcess = null;
			this.serverReady = false;
			this.emit("status", "MySQL server stopped");
		} catch (error) {
			this.emit("error", "Error stopping MySQL server");
			throw error;
		}
	}

	/**
	 * Get path to MySQL binary
	 * @param {string} binaryName
	 * @returns {string}
	 */
	getMySQLBinaryPath(binaryName) {
		const binary = this.platform === "win32" ? `${binaryName}.exe` : binaryName;
		return path.join(this.installDir, "bin", binary);
	}

	/**
	 * Get connection config
	 * @returns {Object}
	 */
	getConnectionConfig() {
		return {
			host: this.config.host,
			port: this.config.port,
			user: this.config.user,
			password: this.config.rootPassword,
			socketPath: this.config.socketPath,
		};
	}
}

export default MySQLManager;
