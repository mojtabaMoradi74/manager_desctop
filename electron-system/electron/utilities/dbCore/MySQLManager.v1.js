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
			if (await this.isInstalled()) {
				console.log("* * * initialize isInstalled")
				await this.startServer();
				console.log("* * * initialize startServer")

				return true;
			}
			await this.install();
			await this.startServer();
			await this.setRootPassword();
		} catch (error) {
			console.error('MySQL initialization failed:', error);
			throw error;
		} finally {
			this.mysqlProcess.stdout?.on('data', (data) => {
				console.log('[MySQL]', data.toString());
			});

			this.mysqlProcess.stderr?.on('data', (data) => {
				console.error('[MySQL ERROR]', data.toString());
			});

			this.mysqlProcess.on('exit', (code, signal) => {
				console.log(`[MySQL] Process exited with code ${code}, signal ${signal}`);
			});

			this.mysqlProcess.on('error', (err) => {
				console.error('[MySQL ERROR]', err);
			});

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
		return fs.pathExists(mysqldPath);
	}

	async install() {
		await fs.ensureDir(this.installDir);

		if (await this.copyFromAssets()) {
			console.log('MySQL copied from assets');
		} else {
			console.log('Downloading MySQL...');
			await this.downloadAndExtract();
		}
		console.log("* * * install completed download")

		await this.createConfigFile();
		console.log("* * * install createConfigFile")

		if (!fs.pathExistsSync(path.join(this.installDir, 'data'))) {
			console.log("* * * install not pathExistsSync")

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
		const tempZip = path.join(app.getPath('temp'), 'mysql.zip');
		console.log("* * * downloadAndExtract tempZip", tempZip)
		console.log("* * * downloadAndExtract downloadUrl", downloadUrl)

		const response = await axios({
			method: 'get',
			url: downloadUrl,
			responseType: 'stream'
		});

		console.log("* * * downloadAndExtract completed download")
		fs.createWriteStream(tempZip).on('error', (err) => {
			console.error("WriteStream error:", err);
		});
		console.log("* * * downloadAndExtract createWriteStream ok")

		await streamPipeline(response.data, fs.createWriteStream(tempZip));
		console.log("* * * downloadAndExtract completed streamPipeline")
		await extract(tempZip, { dir: this.installDir });
		console.log("* * * downloadAndExtract completed extract")
		await fs.unlink(tempZip);
		console.log("* * * downloadAndExtract completed fs")

	}


	getDownloadUrl() {

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
		console.log("* * * startServer")

		const mysqldPath = this.getMySQLBinaryPath('mysqld');
		console.log("* * * startServer mysqldPath", mysqldPath)

		const configPath = path.join(this.installDir, 'my.cnf');
		console.log("* * * startServer configPath")

		// this.mysqlProcess = exec(`"${mysqldPath}" --defaults-file="${configPath}"`, {
		// 	windowsHide: true
		// });
		this.mysqlProcess = spawn(mysqldPath, ['--defaults-file', configPath], {
			detached: true,
			windowsHide: true,
			stdio: ['ignore', 'pipe', 'pipe'] // اینطوری خروجی و خطا رو می‌گیریم
		});

		console.log("* * * startServer mysqlProcess")

		return await new Promise(resolve => setTimeout(resolve, 5000));

	}

	async setRootPassword() {
		const mysqlPath = this.getMySQLBinaryPath('mysql');
		await execPromise(`"${mysqlPath}" -u root -e "ALTER USER 'root'@'localhost' IDENTIFIED BY '${this.config.rootPassword}'"`);
	}

	getMySQLBinaryPath(binaryName) {
		const binary = process.platform === 'win32' ? `${binaryName}.exe` : binaryName;
		return path.join(this.installDir, 'bin', binary);
	}

	async stop() {
		if (this.mysqlProcess) {
			const mysqladminPath = this.getMySQLBinaryPath('mysqladmin');
			try {
				await execPromise(`"${mysqladminPath}" -u root -p${this.config.rootPassword} shutdown`);
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