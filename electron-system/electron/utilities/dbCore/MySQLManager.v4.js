// const DOWNLOAD_URLS = {
// 	win32: {
// 		x64: "https://dev.mysql.com/get/Downloads/MySQL-8.0/mysql-8.0.36-winx64.zip",
// 		x86: "https://dev.mysql.com/get/Downloads/MySQL-8.0/mysql-8.0.36-win32.zip",
// 	},
// 	darwin: {
// 		arm64: "https://cdn.mysql.com//Downloads/MySQL-8.0/mysql-8.0.42-macos15-arm64.tar.gz",
// 		x64: "https://cdn.mysql.com//Downloads/MySQL-8.0/mysql-8.0.42-macos15-x86_64.tar.gz",
// 	},
// 	linux: {
// 		x64: "https://dev.mysql.com/get/Downloads/MySQL-8.0/mysql-8.0.36-linux-glibc2.12-x86_64.tar.xz",
// 		arm64: "https://dev.mysql.com/get/Downloads/MySQL-8.0/mysql-8.0.36-linux-glibc2.28-aarch64.tar.xz",
// 		// نسخه عمومی لینوکس (اختیاری)
// 		generic: "https://dev.mysql.com/get/Downloads/MySQL-8.0/mysql-8.0.36-linux-glibc2.17-x86_64-minimal.tar.xz",
// 	},
// };
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
import * as tar from "tar";
import streamPromises from "stream/promises";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const execPromise = promisify(exec);
const streamPipeline = promisify(pipeline);

const SERVER_START_TIMEOUT = 30000; // 30 seconds
const SERVER_PING_INTERVAL = 1000; // 1 second

const fileNames = {
	win32: {
		x64: { name: "mysql-8.0.36-winx64.zip" },
		x86: { name: "mysql-8.0.36-win32.zip" },
		x32: { name: "mysql-8.0.36-win32.zip" },
		ia32: { name: "mysql-8.0.36-win32.zip" },
	},
	darwin: {
		arm64: { name: "mysql-8.0.42-macos15-arm64.tar.gz" },
		x64: { name: "mysql-8.0.42-macos15-x86_64.tar.gz" },
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
			port: 33060,
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

			this.emit("status", "Starting MySQL server 2...");
			await this.startServer(true);

			// this.emit('status', 'Setting root password...');
			// await this.setRootPassword();

			return true;
		} catch (error) {
			this.emit("error", error);
			// await this.cleanupOnError();
			throw error;
		}
	}
	async testConfigAccess() {
		const configPath = path.join(this.installDir, "my.cnf");
		try {
			const content = await fs.readFile(configPath, "utf8");
			this.emit("debug", "Config file content:", content);
			return true;
		} catch (err) {
			this.emit("error", `Cannot read config file: ${err.message}`);
			return false;
		}
	}
	/**
	 * Start MySQL server
	 */
	async startServer(force) {
		try {
			// Add these checks at the start
			if (!(await this.verifyConfigFile())) {
				throw new Error("Invalid config file");
			}

			if (force && !(await this.isPortAvailable(this.config.port))) {
				this.config.port = await this.findAvailablePort();
				this.emit("status", `Port in use, switched to ${this.config.port}`);
				await this.createConfigFile(); // آپدیت فایل کانفیگ با پورت جدید
			}

			const mysqldPath = this.getMySQLBinaryPath("mysqld");
			const configPath = path.join(this.installDir, "my.cnf");

			// 2. تنظیم مجوز اجرایی
			if (this.platform === "darwin") {
				try {
					await fs.chmod(mysqldPath, 0o755); // rwxr-xr-x
				} catch (err) {
					console.error("Cannot set executable permissions:", err);
				}
			}
			if (!fs.existsSync(mysqldPath)) {
				throw new Error(`MySQL binary not found at ${mysqldPath}`);
			}

			if (!fs.existsSync(configPath)) {
				throw new Error(`Config file not found at ${configPath}`);
			}
			if (!(await this.verifyBinary(mysqldPath))) {
				throw new Error(`MySQL binary is not executable: ${mysqldPath}`);
			}
			if (this.platform === "darwin") {
				await execPromise(`chmod -R 755 ${this.escapePath(path.join(this.installDir, "bin"))}`);
			}

			this.emit("debug", "Install directory contents:", fs.readdirSync(this.installDir));
			this.emit("debug", "File stats:", fs.statSync(mysqldPath));

			// Properly escape paths for shell
			const escapedMysqldPath = this.escapePath(mysqldPath);
			const escapedConfigPath = this.escapePath(configPath);

			const args = [`--defaults-file=${escapedConfigPath}`, "--console"];

			console.log("* * * START COMMAND * * *");
			if (this.platform === "win32") {
				this.mysqlProcess = spawn(`${mysqldPath}`, args, {
					shell: true,
					detached: true,
					stdio: ["ignore", "pipe", "pipe"],
					windowsHide: true,
				});
			} else {
				// macOS/Linux needs the command as a single string
				this.mysqlProcess = spawn(escapedMysqldPath, args, {
					detached: true,
					stdio: ["ignore", "pipe", "pipe"],
					shell: false, // Important - don't use shell to avoid path splitting
				});
				// const fullCommand = `${mysqldPath} ${args.join(" ")}`;
				// console.log({ fullCommand });

				// this.mysqlProcess = spawn("/bin/sh", ["-c", fullCommand], {
				// 	detached: true,
				// 	stdio: ["ignore", "pipe", "pipe"],
				// });
			}
			console.log("* * * END COMMAND * * *");

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
		} catch (error) {
			this.emit("* * * error", error);

			throw error;
		}
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
			this.emit("status", "Downloading MySQL...");
		}

		if (!fs.pathExistsSync(path.join(this.installDir, "data"))) {
			await this.createConfigFile();
			await this.initializeDatabase();
		}
	}

	async copyFromAssets() {
		const platformAssets = path.join(this.resourcesPath, this.platform, this.arch);
		const assetFile = path.join(platformAssets, fileNames[this.platform][this.arch].name);

		try {
			// Clean install directory
			if (await fs.pathExists(this.installDir)) {
				await fs.remove(this.installDir);
			}

			if (!(await fs.pathExists(assetFile))) {
				this.emit("debug", "No MySQL file found in assets");
				return false;
			}

			this.emit("status", `Found MySQL package in assets (${fileNames[this.platform][this.arch].name}), extracting...`);

			// Create temp directory for extraction
			const tempExtractDir = path.join(os.tmpdir(), `mysql-extract-${Date.now()}`);
			await fs.ensureDir(tempExtractDir);

			// Handle different file types
			if (assetFile.endsWith(".zip")) {
				// Windows - extract zip
				await extract(assetFile, { dir: tempExtractDir });
			} else if (assetFile.endsWith(".tar.gz")) {
				// macOS - extract tar.gz
				await this.extractTarGz(assetFile, tempExtractDir);
			} else if (assetFile.endsWith(".dmg")) {
				// macOS DMG - mount and copy
				await this.mountAndCopyDmg(assetFile, tempExtractDir);
			} else {
				throw new Error(`Unsupported file format: ${assetFile}`);
			}

			// Find MySQL directory in extracted contents
			const extractedContents = await fs.readdir(tempExtractDir);
			const mysqlDir = extractedContents.find(
				(item) => item.toLowerCase().includes("mysql") && fs.statSync(path.join(tempExtractDir, item)).isDirectory()
			);

			if (!mysqlDir) {
				throw new Error("Could not find MySQL directory in extracted contents");
			}

			const sourcePath = path.join(tempExtractDir, mysqlDir);

			// Copy to installation directory
			await fs.copy(sourcePath, this.installDir);
			this.emit("status", "MySQL successfully extracted from assets");
			this.emit("debug", "bin directory contents:", await fs.readdir(path.join(this.installDir, "bin")));

			// Set executable permissions on macOS
			if (this.platform === "darwin") {
				await this.setExecutablePermissions();
			}

			// Cleanup
			await fs.remove(tempExtractDir);
			return true;
		} catch (error) {
			this.emit("error", `Failed to extract from assets: ${error.message}`);
			await this.cleanupOnError();
			throw error;
		}
	}

	async extractTarGz(tarPath, extractDir) {
		try {
			await streamPromises.pipeline(
				fs.createReadStream(tarPath),
				tar.x({
					C: extractDir,
					// strip: 1 // حذف پوشه اصلی اگر نیاز باشد
				})
			);
		} catch (moduleError) {
			this.emit("debug", "Falling back to system tar...");

			// اگر با خطا مواجه شد، از tar سیستمی استفاده کنید
			try {
				await execPromise(`tar -xzf "${tarPath}" -C "${extractDir}" --strip-components=1`);
			} catch (systemError) {
				throw new Error(`Both module and system tar failed: 
			Module Error: ${moduleError.message}
			System Error: ${systemError.message}`);
			}
		}
	}
	async verifyBinary(binPath) {
		try {
			await fs.access(binPath, fs.constants.X_OK);
			this.emit("status", `Binary ${binPath} is  executable`);

			return true;
		} catch (err) {
			this.emit("warning", `Binary ${binPath} is not executable: ${err.message}`);
			return false;
		}
	}
	// Helper method for DMG handling
	async mountAndCopyDmg(dmgPath, extractDir) {
		try {
			// Mount the DMG
			const { stdout } = await execPromise(`hdiutil attach -nobrowse -readonly -mountpoint /Volumes/mysql_temp "${dmgPath}"`);

			// Find and copy the package contents
			const pkgPath = "/Volumes/mysql_temp/mysql-*.pkg";
			await execPromise(`pkgutil --expand-full "${pkgPath}" "${extractDir}"`);

			// Unmount the DMG
			await execPromise(`hdiutil detach /Volumes/mysql_temp`);
		} catch (error) {
			throw new Error(`Failed to process DMG file: ${error.message}`);
		}
	}

	// Set executable permissions on macOS binaries
	async setExecutablePermissions() {
		try {
			const binPath = path.join(this.installDir, "bin");
			if (await fs.pathExists(binPath)) {
				// Recursively set execute permissions
				await execPromise(`find "${binPath}" -type f -exec chmod u+x {} +`);

				// await execPromise(`chmod -R +x "${binPath}"`, {
				// 	windowsHide: true,
				// });
			}

			// Specific binaries that must be executable
			const requiredBinaries = ["mysqld", "mysql", "mysqladmin"];
			for (const bin of requiredBinaries) {
				const binPath = this.getMySQLBinaryPath(bin);
				if (await fs.pathExists(binPath)) {
					await fs.chmod(binPath, 0o755); // rwxr-xr-x
				}
			}
		} catch (error) {
			this.emit("warning", `Could not set executable permissions: ${error.message}`);
		}
	}
	formatPathForConfig = (p) => p.replace(/\\/g, "/").replace(/'/g, "\\'");

	/**
	 * Create MySQL config file
	 */
	async createConfigFile() {
		const dataDir = path.join(this.installDir, "data");
		await fs.ensureDir(dataDir);

		const configContent = `
		[mysqld]
		port=${this.config.port}
		basedir=${this.escapePath(this.installDir)}
		datadir=${this.escapePath(path.join(this.installDir, "data"))}
		socket=${this.escapePath(this.config.socketPath)}
		skip-grant-tables
		innodb_buffer_pool_size=32M
		innodb_log_file_size=24M
		innodb_flush_log_at_trx_commit=2
				`;
		console.log({ configContent });

		await fs.writeFile(path.join(this.installDir, "my.cnf"), configContent);
	}
	async verifyConfigFile() {
		const configPath = path.join(this.installDir, "my.cnf");
		try {
			await fs.access(configPath, fs.constants.R_OK);
			const content = await fs.readFile(configPath, "utf8");
			this.emit("debug", "Config file verified");
			return true;
		} catch (err) {
			this.emit("error", `Config file verification failed: ${err.message}`);
			return false;
		}
	}
	/**
	 * Initialize MySQL database
	 */
	async initializeDatabase() {
		const mysqldPath = this.getMySQLBinaryPath("mysqld");
		// const dataDir = path.join(this.installDir, 'data');
		//  --datadir="${dataDir}"
		const command = `"${mysqldPath}" --initialize-insecure --user=${this.config.user}`;
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

		// Common paths to check
		const possiblePaths = [
			path.join(this.installDir, "bin", binary),
			path.join(this.installDir, "usr/local/bin", binary),
			path.join(this.installDir, "usr/bin", binary),
			path.join(this.installDir, binary),
		];

		// Find the first existing path
		if (this.platform !== "win32") {
			for (const binPath of possiblePaths) {
				if (fs.existsSync(binPath)) {
					// Set executable permissions if not Windows
					try {
						fs.chmodSync(binPath, 0o755); // rwxr-xr-x
					} catch (err) {
						this.emit("warning", `Could not set permissions on ${binPath}: ${err.message}`);
					}
				}
				this.emit("status", `Could set permissions on ${binPath}`);

				return binPath;
			}
		}

		throw new Error(`Could not find ${binaryName} binary in any of these locations:\n${possiblePaths.join("\n")}`);
	}

	escapePath(pathStr) {
		if (!pathStr) return '""';
		if (this.platform === "win32") {
			return `"${pathStr}"`;
		}
		// For macOS/Linux - escape all special characters and spaces
		return `'${pathStr.replace(/'/g, "'\\''")}'`;
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

	async extractTarGz(source, destination) {
		try {
			await tar.x({
				file: source,
				C: destination,
			});
			this.emit("status", "Extraction completed.");
		} catch (error) {
			this.emit("error", `Error extracting tar.gz: ${error.message}`);
			throw error;
		}
	}
}

export default MySQLManager;

// getMySQLBinaryPath(binaryName) {
// 	const binary = this.platform === "win32" ? `${binaryName}.exe` : binaryName;

// 	// مسیر پیش‌فرض برای macOS و Linux
// 	let binaryPath = path.join(this.installDir, "bin", binary);

// 	// اگر فایل اجرایی وجود ندارد، ممکن است در مسیر دیگری باشد
// 	if (!fs.existsSync(binaryPath) && this.platform === "darwin") {
// 		// بررسی مسیرهای جایگزین در macOS
// 		const alternativePaths = [
// 			path.join(this.installDir, "usr", "local", "bin", binary),
// 			path.join(this.installDir, "usr", "bin", binary),
// 			path.join(this.installDir, binary),
// 		];

// 		for (const altPath of alternativePaths) {
// 			if (fs.existsSync(altPath)) {
// 				binaryPath = altPath;
// 				break;
// 			}
// 		}
// 	}

// 	// تنظیم مجوز اجرایی اگر وجود دارد
// 	if (fs.existsSync(binaryPath) && this.platform !== "win32") {
// 		try {
// 			fs.chmodSync(binaryPath, 0o755); // rwxr-xr-x
// 		} catch (err) {
// 			console.error(`Cannot set executable permissions on ${binaryPath}:`, err);
// 		}
// 	}

// 	return binaryPath;
// }

// escapePath(pathStr) {
// 	if (this.platform === "win32") {
// 		return `"${pathStr}"`;
// 	}
// 	return `"${pathStr.replace(/ /g, "\\ ")}"`;
// 	// return `'${pathStr.replace(/'/g, "'\\''")}'`;
// }

// getMySQLBinaryPath(binaryName) {
// 	const binary = this.platform === "win32" ? `${binaryName}.exe` : binaryName;

// 	// Common paths to check for macOS
// 	const possiblePaths = [
// 		path.join(this.installDir, "bin", binary), // Standard location
// 		path.join(this.installDir, "usr/local/bin", binary),
// 		path.join(this.installDir, "usr/bin", binary),
// 		path.join(this.installDir, binary), // Directly in install dir
// 	];

// 	// For macOS ARM64, the binaries might be in a different path
// 	// if (this.platform === "darwin" && this.arch === "arm64") {
// 	// 	possiblePaths.unshift(path.join(this.installDir, "mysql-8.0.42-macos15-arm64/bin", binary));
// 	// }

// 	// Find the first existing path
// 	if (this.platform !== "win32") {
// 		for (const binPath of possiblePaths) {
// 			if (fs.existsSync(binPath)) {
// 				// Set executable permissions if not Windows
// 				try {
// 					fs.chmodSync(binPath, 0o755); // rwxr-xr-x
// 				} catch (err) {
// 					this.emit("warning", `Could not set permissions on ${binPath}: ${err.message}`);
// 				}
// 			}
// 			return binPath;
// 		}
// 	}

// 	throw new Error(`Could not find ${binaryName} binary in any of these locations:\n${possiblePaths.join("\n")}`);
// }
