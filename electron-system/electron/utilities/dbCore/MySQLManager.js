import { app } from 'electron';
import fs from 'fs-extra';
import { exec, spawn } from 'child_process';
import { promisify } from 'util';
import extract from 'extract-zip';
import axios from 'axios';
import { pipeline } from 'stream';
import { randomBytes } from 'crypto';
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
import os from 'os';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const execPromise = promisify(exec);
const streamPipeline = promisify(pipeline);


const urls = {
	win32: {
		x64: 'https://dev.mysql.com/get/Downloads/MySQL-8.0/mysql-8.0.36-winx64.zip',
		x86: 'https://dev.mysql.com/get/Downloads/MySQL-8.0/mysql-8.0.36-win32.zip'
	},
	darwin: {
		arm64: 'https://dev.mysql.com/get/Downloads/MySQL-8.0/mysql-8.0.36-macos13-arm64.dmg',
		x64: 'https://dev.mysql.com/get/Downloads/MySQL-8.0/mysql-8.0.36-macos13-x86_64.dmg'
	},
	linux: {
		x64: 'https://dev.mysql.com/get/Downloads/MySQL-8.0/mysql-8.0.36-linux-glibc2.12-x86_64.tar.xz',
		arm64: 'https://dev.mysql.com/get/Downloads/MySQL-8.0/mysql-8.0.36-linux-glibc2.28-aarch64.tar.xz'
	}
};

const fileNames = {
	win32: {
		x64: { name: 'mysql-8.0.36-winx64.zip' },
		x86: { name: 'mysql-8.0.36-win32.zip' },
		x32: { name: 'mysql-8.0.36-win32.zip' },
		ia32: { name: 'mysql-8.0.36-win32.zip' },
	},
	darwin: {
		arm64: { name: 'mysql-8.0.36-macos13-arm64.dmg' },
		x64: { name: 'mysql-8.0.36-macos13-x86_64.dmg' }
	},
	linux: {
		x64: { name: 'mysql-8.0.36-linux-glibc2.12-x86_64.tar.xz' },
		arm64: { name: 'mysql-8.0.36-linux-glibc2.28-aarch64.tar.xz' }
	}
};
/**
 * MySQL Manager for Electron applications
 * @class
 * @property {string} platform - Current platform (win32, darwin, linux)
 * @property {string} arch - Current architecture (x64, arm64, etc.)
 * @property {string} resourcesPath - Path to MySQL assets
 * @property {string} installDir - Installation directory
 * @property {Object} config - MySQL configuration
 */
class MySQLManager {
	constructor() {
		this.platform = process.platform;
		this.arch = process.arch;
		this.resourcesPath = app.isPackaged
			? path.join(process.resourcesPath, 'assets', 'mysql')
			: path.join(__dirname, '../../assets/mysql');

		this.installDir = path.join(app.getPath('userData'), 'mysql');
		this.config = {
			port: 3306,
			rootPassword: 1234,
			socketPath: path.join(this.installDir, 'mysql.sock'),
			// host: 'localhost',
			host: '127.0.0.1', // نه localhost
			user: 'root',
			// password: 1234,
		};
		this.serverStatus = {

		}
	}
	/**
	 * Initialize MySQL server (install if needed)
	 * @async
	 * @returns {Promise<boolean>} True if initialization was successful
	 * @throws {Error} If initialization fails
	 */
	async initialize() {
		try {
			// await this.checkCompatibility();

			if (await this.isInstalled()) {
				this.serverStatus.isNew = false
				console.log("MySQL already installed, starting server...");
				if (!await this.checkAlive()) {
					await this.startServer();
					return true
				}
				return true;
			}
			this.serverStatus.isNew = true
			console.log("Installing MySQL...");
			await this.install();
			await this.startServer();
			console.log("Installed MySQL...");
			return true;

		} catch (error) {
			console.error('MySQL initialization failed:', error);
			// await this.cleanupOnError();
			throw error;
		}
	}


	async cleanupOnError() {
		try {
			await this.stopMySQL();
			await fs.remove(this.installDir).catch(() => { });
		} catch (cleanupError) {
			console.error('Cleanup failed:', cleanupError);
		}
	}

	async stopMySQL() {
		if (this.mysqlProcess) {
			// بستن پروسه MySQL
			this.mysqlProcess.kill('SIGTERM'); // برای بستن امن
			this.mysqlProcess = null;
			console.log('[MySQL] MySQL server stopped.');
		}
	}

	async isInstalled() {
		const mysqldPath = this.getMySQLBinaryPath('mysqld');
		const pathExists = await fs.pathExists(mysqldPath);
		console.log({ pathExists, mysqldPath });
		return pathExists;
	}

	async install() {
		// await fs.chmod(this.installDir, 0o777);
		// await fs.chmod(path.join(this.installDir, 'data'), 0o777);


		await fs.ensureDir(this.installDir);

		if (await this.copyFromAssets()) {
			console.log('MySQL copied from assets');
		} else {
			console.log('Downloading MySQL...');
			await this.downloadAndExtract();
		}
		console.log("* * * install completed download")



		if (!fs.pathExistsSync(path.join(this.installDir, 'data'))) {
			console.log("* * * install not pathExistsSync")
			await this.createConfigFile();
			console.log("* * * install createConfigFile")
			await this.initializeDatabase();
		}
		console.log("* * * install pathExistsSync")

	}



	async copyFromAssets() {
		const platformAssets = path.join(this.resourcesPath, this.platform, this.arch);
		const zipFile = path.join(platformAssets, fileNames[this.platform][this.arch].name);

		try {
			if (await fs.pathExists(this.installDir)) {
				console.log('* * * Removing old installation...');
				await fs.remove(this.installDir);
			}

			if (await fs.pathExists(zipFile)) {
				console.log('* * * Found zip in assets, extracting...');

				const tmpDir = path.join(os.tmpdir(), `mysql-tmp-${Date.now()}`);
				await extract(zipFile, { dir: tmpDir });

				// فرض می‌کنیم همه محتوا داخل یک فولدر هست (مثلاً mysql/)
				const [extractedFolder] = await fs.readdir(tmpDir);
				const extractedPath = path.join(tmpDir, extractedFolder);

				if (await fs.pathExists(extractedPath)) {
					await fs.copy(extractedPath, this.installDir);
					console.log('* * * Extraction and copy completed.');
				} else {
					console.warn('* * * Extracted folder not found inside temp.');
				}

				await fs.remove(tmpDir);
				return true;

			} else if (await fs.pathExists(platformAssets)) {
				console.log('* * * Copying already extracted mysql from assets...');
				await fs.copy(platformAssets, this.installDir);
				return true;
			}

			console.warn('* * * No mysql zip or extracted folder found in assets.');
			return false;

		} catch (err) {
			console.error('🔥 Error during copyFromAssets:', err);
			throw err;
		}
	}


	async downloadAndExtract() {
		const downloadUrl = this.getDownloadUrl();
		const tempFile = path.join(app.getPath('temp'), `mysql-${Date.now()}`);

		console.log(`Downloading MySQL from ${downloadUrl}...`);

		const response = await axios({
			method: 'get',
			url: downloadUrl,
			responseType: 'stream'
		});

		// Track download progress
		let downloadedBytes = 0;
		const totalBytes = parseInt(response.headers['content-length'], 10);
		response.data.on('data', (chunk) => {
			downloadedBytes += chunk.length;
			const percent = ((downloadedBytes / totalBytes) * 100).toFixed(2);
			console.log(`Download progress: ${percent}%`);
		});

		const writer = fs.createWriteStream(tempFile);
		await streamPipeline(response.data, writer);

		console.log('Extracting MySQL...');
		if (tempFile.endsWith('.zip')) {
			await extract(tempFile, { dir: this.installDir });
		} else if (tempFile.endsWith('.tar.xz')) {
			await this.extractTarXz(tempFile);
		} else if (tempFile.endsWith('.dmg')) {
			await this.mountDmg(tempFile);
		}

		await fs.unlink(tempFile);
		console.log('MySQL installation files cleaned up');
	}


	getDownloadUrl() {

		return urls[this.platform]?.[this.arch] || urls.win32.x64;
	}

	async createConfigFile() {
		const dataDir = path.join(this.installDir, 'data');
		await fs.ensureDir(dataDir); // اطمینان از وجود دایرکتوری data

		const configContent = `
	  		[mysqld]
	  		port=${this.config.port}
	  		basedir=${this.installDir.replace(/\\/g, '/')}
	  		datadir=${dataDir.replace(/\\/g, '/')}
	  		socket=${this.config.socketPath.replace(/\\/g, '/')}
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
		// skip-networking=OFF
		// # protocol=tcp
		// # shared-memory
		// skip-grant-tables
		console.log('Creating my.cnf with content:', configContent);
		await fs.writeFile(path.join(this.installDir, 'my.cnf'), configContent);
	}

	async initializeDatabase() {
		const mysqldPath = this.getMySQLBinaryPath('mysqld');
		const dataDir = path.join(this.installDir, 'data');

		const command = `"${mysqldPath}" --initialize-insecure --user=root --datadir=${dataDir}`;
		console.log('Initializing database with:', command);

		try {
			const { stdout, stderr } = await execPromise(command, { windowsHide: true });
			console.log('Initialize output:', stdout);
			console.error('Initialize stderr:', stderr);

		} catch (error) {
			console.error('Database initialization failed:', {
				error: error.message,
				stdout: error.stdout,
				stderr: error.stderr
			});
			throw error;
		}
	}


	async startServer() {
		// 1. پاک کردن فایل‌های مشکل‌ساز
		await fs.remove(path.join(this.installDir, 'data', 'ib*'));

		// 2. تنظیم دسترسی‌ها
		await fs.chmod(this.installDir, 0o777); // دسترسی کامل
		console.log(`* * * startServer * * *`);

		const mysqldPath = this.getMySQLBinaryPath('mysqld');
		const configPath = path.join(this.installDir, 'my.cnf');
		console.log(`Starting MySQL with: "${mysqldPath}" --defaults-file="${configPath}"`);


		// Verify files exist
		if (!fs.existsSync(mysqldPath)) {
			throw new Error(`MySQL binary not found at ${mysqldPath}`);
		}
		if (!fs.existsSync(configPath)) {
			throw new Error(`Config file not found at ${configPath}`);
		}
		const args = [
			`--defaults-file=${configPath}`,
			'--console',
		];
		this.mysqlProcess = spawn(mysqldPath, args, {
			detached: true,
			windowsHide: true,
			stdio: ['ignore', 'pipe', 'pipe'],
			// windowsHide: true,
			windowsVerbatimArguments: true, // برای مدیریت بهتر مسیرها در ویندوز
		});

		// اضافه کردن لاگ‌گیری از خروجی سرور
		this.mysqlProcess.stdout.on('data', (data) => {
			console.log('[MySQL stdout]', data.toString());
		});

		this.mysqlProcess.stderr.on('data', (data) => {
			console.error('[MySQL stderr]', data.toString());
		});

		// Enhanced logging
		this.mysqlProcess.stdout.on('data', (data) => {
			const output = data.toString();
			console.log('[MySQL]', output);
			// Check for specific startup messages
			if (output.includes('ready for connections')) {
				this.serverReady = true;
			}
		});

		this.mysqlProcess.stderr.on('data', (data) => {
			console.error('[MySQL ERROR]', data.toString());
		});

		this.mysqlProcess.on('close', (code) => {
			console.log(`MySQL process exited with code ${code}`);
		});

		return await this.checkAlive()


	}

	async checkAlive() {
		// Wait for server to be ready (check port)
		const startTime = Date.now();
		const timeout = 20000; // 30 seconds timeout
		const checkInterval = 10000; // Check every second

		return new Promise((resolve, reject) => {
			const checkPort = async () => {
				if (Date.now() - startTime > timeout) {
					reject(new Error('MySQL server startup timed out'));
					return;
				}

				try {
					const isReady = await this.isServerReady();
					if (isReady) {
						resolve(true);
					} else {
						setTimeout(checkPort, checkInterval);
					}
				} catch (err) {
					setTimeout(checkPort, checkInterval);
				}
			};

			checkPort();
		});
	}
	async checkServerStatus() {
		try {
			const mysqldPath = this.getMySQLBinaryPath('mysqld');
			const { stdout } = await execPromise(
				`"${mysqldPath}" status -u root -p${this.config.rootPassword}`,
				{ timeout: 5000 }
			);
			return stdout.includes('Uptime');
		} catch {
			return false;
		}
	}
	async isServerReady() {
		const mysqladminPath = this.getMySQLBinaryPath('mysqladmin');
		const passwordPart = this.config.password ? `-p"${this.config.password}"` : '';
		const command = `"${mysqladminPath}" ping -h 127.0.0.1 -P ${this.config.port} -u ${this.config.user} ${passwordPart}`;

		// const command = `"${mysqladminPath}" ping -h 127.0.0.1 -P ${this.config.port} -u root -p"${this.config.password}" --silent`;

		try {
			const { stdout, stderr } = await execPromise(command, { timeout: 5000 });
			console.log('MySQL ping result:', { stdout, stderr });
			console.log('* * * MySQL is alive * * *');
			return true
			// return stdout.includes('mysqld is alive');
		} catch (error) {
			console.error('MySQL ping failed:', {
				error: error.message,
				stdout: error.stdout,
				stderr: error.stderr
			});
			return false;
		}
	}
	// async isServerReady() {
	// 	try {
	// 		const net = await import('net');
	// 		return new Promise((resolve) => {
	// 			const socket = net.createConnection(this.config.port, '127.0.0.1', () => {
	// 				console.log("* * * Server is ready * * * ");
	// 				socket.end();
	// 				resolve(true);
	// 			});
	// 			socket.on('error', () => resolve(false));
	// 		});
	// 	} catch {
	// 		return false;
	// 	}
	// }

	// async isServerReady() {
	// 	// ابتدا منتظر پیام "ready for connections" در stdout باشیم
	// 	// await new Promise((resolve) => {
	// 	// 	this.mysqlProcess.stdout.on('data', (data) => {
	// 	// 		if (data.includes('ready for connections')) {
	// 	// 			resolve();
	// 	// 		}
	// 	// 	});
	// 	// });

	// 	// سپس اتصال TCP را بررسی کنیم
	// 	const net = await import('net');
	// 	return new Promise((resolve) => {
	// 		const socket = net.createConnection(3306, '127.0.0.1', () => {
	// 			socket.end();
	// 			resolve(true);
	// 		});
	// 		socket.on('error', () => resolve(false));
	// 	});
	// }

	// async isServerReady() {
	// 	const mysqladminPath = this.getMySQLBinaryPath('mysqladmin');
	// 	const command = [
	// 		`"${mysqladminPath}"`,
	// 		'ping',
	// 		`-h 127.0.0.1`,
	// 		`-P ${this.config.port}`,
	// 		`-u ${this.config.user}`,
	// 		// this.config.rootPassword ? `-p"${this.config.rootPassword}"` : '',
	// 		'--silent'
	// 	].filter(Boolean).join(' ');

	// 	try {
	// 		const { stdout } = await execPromise(command, { timeout: 5000 });
	// 		return stdout.includes('mysqld is alive');
	// 	} catch (error) {
	// 		console.error('MySQL ping command:', command);
	// 		console.error('Ping error details:', {
	// 			error: error.message,
	// 			stdout: error.stdout,
	// 			stderr: error.stderr
	// 		});
	// 		return false;
	// 	}
	// }

	async isPortAvailable() {
		const net = await import('net');
		return new Promise((resolve) => {
			const server = net.createServer();
			server.once('error', () => resolve(false));
			server.once('listening', () => {
				server.close(() => resolve(true));
			});
			server.listen(this.config.port);
		});
	}

	async setRootPassword() {
		const mysqlPath = this.getMySQLBinaryPath('mysql');
		return await execPromise(`"${mysqlPath}" -u root -e "ALTER USER 'root'@'localhost' IDENTIFIED BY '${this.config.rootPassword}'"`);
	}

	async checkCompatibility() {
		const requiredVersion = '8.0.36';
		const installedVersion = await this.getInstalledVersion();

		if (!installedVersion?.includes(requiredVersion)) {
			throw new Error(`MySQL version mismatch. Required: ${requiredVersion}, Found: ${installedVersion}`);
		}
	}

	getMySQLBinaryPath(binaryName) {
		const binary = process.platform === 'win32' ? `${binaryName}.exe` : binaryName;
		return path.join(this.installDir, 'bin', binary);
	}

	async stop() {
		// if (!this.mysqlProcess) return;
		if (!await this.isServerReady()) return console.log('MySQL server is stopped');
		try {
			console.log("* * * STOP * * *");

			const mysqlPath = this.getMySQLBinaryPath('mysql');
			const passwordPart = this.config.rootPassword ? `-p"${this.config.rootPassword}"` : '';
			const command = `"${mysqlPath}" -u root ${passwordPart} shutdown`;


			// `"${mysqlPath}" -u root -p${this.config.rootPassword} shutdown`
			await execPromise(
				command
			).catch(() => {
				// If shutdown command fails, force kill
				if (this.mysqlProcess) this.mysqlProcess.kill('SIGTERM');
			});

			this.mysqlProcess = null;
			console.log('MySQL server stopped successfully');
		} catch (error) {
			console.error('Error stopping MySQL server:', error);
			throw error;
		}
	}
	async getInstalledVersion() {
		try {
			const mysqlPath = this.getMySQLBinaryPath('mysql');
			const { stdout } = await execPromise(`"${mysqlPath}" --version`);
			return stdout.trim();
		} catch (error) {
			console.error('Could not get MySQL version:', error);
			return null;
		}
	}

	getConnectionConfig() {
		return {
			host: 'localhost',
			port: this.config.port,
			user: 'root',
			password: this.config.rootPassword,
			socketPath: this.config.socketPath
		};
	}


}

export default MySQLManager;