import { app } from 'electron';
import path from 'path';
import fs from 'fs-extra';
import { exec } from 'child_process';
import { promisify } from 'util';
import extract from 'extract-zip';
import axios from 'axios';
import { pipeline } from 'stream';
import { randomBytes } from 'crypto';

const execPromise = promisify(exec);
const streamPipeline = promisify(pipeline);

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
			rootPassword: randomBytes(8).toString('hex'),
			socketPath: path.join(this.installDir, 'mysql.sock')
		};
	}

	async initialize() {
		try {
			// بررسی وجود نصب قبلی
			if (await this.isInstalled()) {
				await this.startServer();
				return;
			}

			// نصب MySQL
			await this.install();

			// راه‌اندازی سرور
			await this.startServer();

			// تنظیم پسورد ریشه
			await this.setRootPassword();

		} catch (error) {
			console.error('MySQL initialization failed:', error);
			throw error;
		}
	}

	async isInstalled() {
		const mysqldPath = this.getMySQLBinaryPath('mysqld');
		return fs.pathExists(mysqldPath);
	}

	async install() {
		// 1. آماده‌سازی دایرکتوری‌ها
		await fs.ensureDir(this.installDir);

		// 2. کپی فایل‌های MySQL از assets یا دانلود آنها
		if (await this.copyFromAssets()) {
			console.log('MySQL copied from assets');
		} else {
			console.log('Downloading MySQL...');
			await this.downloadAndExtract();
		}

		// 3. تنظیم فایل پیکربندی
		await this.createConfigFile();

		// 4. مقداردهی اولیه دیتابیس (فقط برای اولین بار)
		if (!fs.pathExistsSync(path.join(this.installDir, 'data'))) {
			await this.initializeDatabase();
		}
	}

	async copyFromAssets() {
		const platformAssets = path.join(this.resourcesPath, this.platform);
		if (await fs.pathExists(platformAssets)) {
			await fs.copy(platformAssets, this.installDir);
			return true;
		}
		return false;
	}

	async downloadAndExtract() {
		const downloadUrl = this.getDownloadUrl();
		const tempZip = path.join(app.getPath('temp'), 'mysql.zip');

		// دانلود فایل
		const response = await axios({
			method: 'get',
			url: downloadUrl,
			responseType: 'stream'
		});

		await streamPipeline(response.data, fs.createWriteStream(tempZip));

		// اکسترکت کردن
		await extract(tempZip, { dir: this.installDir });

		// حذف فایل موقت
		await fs.unlink(tempZip);
	}

	getDownloadUrl() {
		const urls = {
			win32: {
				x64: 'https://dev.mysql.com/get/Downloads/MySQL-8.0/mysql-8.0.26-winx64.zip'
			},
			darwin: {
				x64: 'https://dev.mysql.com/get/Downloads/MySQL-8.0/mysql-8.0.26-macos10.15-x86_64.tar.gz'
			},
			linux: {
				x64: 'https://dev.mysql.com/get/Downloads/MySQL-8.0/mysql-8.0.26-linux-glibc2.12-x86_64.tar.xz'
			}
		};

		return urls[this.platform]?.[this.arch] || urls.win32.x64;
	}

	async createConfigFile() {
		const configContent = `
[mysqld]
port=${this.config.port}
basedir=${this.installDir}
datadir=${path.join(this.installDir, 'data')}
socket=${this.config.socketPath}
skip-grant-tables
innodb_buffer_pool_size=32M
innodb_log_file_size=24M
innodb_flush_log_at_trx_commit=2
    `;

		await fs.writeFile(path.join(this.installDir, 'my.cnf'), configContent);
	}

	async initializeDatabase() {
		const mysqldPath = this.getMySQLBinaryPath('mysqld');
		await execPromise(`"${mysqldPath}" --initialize-insecure --user=root`);
	}

	async startServer() {
		const mysqldPath = this.getMySQLBinaryPath('mysqld');
		const configPath = path.join(this.installDir, 'my.cnf');

		this.mysqlProcess = exec(`"${mysqldPath}" --defaults-file="${configPath}"`, {
			windowsHide: true
		});

		// منتظر راه‌اندازی سرور بمانید
		await new Promise(resolve => setTimeout(resolve, 5000));
	}

	async setRootPassword() {
		const mysqlPath = this.getMySQLBinaryPath('mysql');
		await execPromise(
			`"${mysqlPath}" -u root -e "ALTER USER 'root'@'localhost' IDENTIFIED BY '${this.config.rootPassword}'"`
		);
	}

	getMySQLBinaryPath(binaryName) {
		const binaries = {
			win32: path.join(this.installDir, 'bin', `${binaryName}.exe`),
			darwin: path.join(this.installDir, 'bin', binaryName),
			linux: path.join(this.installDir, 'bin', binaryName)
		};

		return binaries[this.platform];
	}

	async stop() {
		if (this.mysqlProcess) {
			const mysqladminPath = this.getMySQLBinaryPath('mysqladmin');
			try {
				await execPromise(
					`"${mysqladminPath}" -u root -p${this.config.rootPassword} shutdown`
				);
			} catch (error) {
				this.mysqlProcess.kill();
			}
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