import { exec } from 'child_process';
import { promisify } from 'util';
import sudo from 'sudo-prompt';
import os from 'os';
import fs from 'fs';
import path from 'path';
import { pipeline } from 'stream';
import https from 'https';
import extract from 'extract-zip';

const execPromise = promisify(exec);
const sudoExec = promisify(sudo.exec);
const systemDrive = process.env.SystemDrive || 'C:';
const streamPipeline = promisify(pipeline);

// تنظیمات پایه برای MySQL
const MYSQL_CONFIG = {
	rootPassword: '1234',
	port: 3306,
	serviceName: {
		win32: 'MySQL',
		linux: 'mysql',
		darwin: 'mysql'
	},
	windowsInstallDir: path.join(systemDrive, 'Program Files', 'MySQL')
};

class DatabaseInstaller {
	constructor() {
		this.systemInfo = null;
		this.logger = new DatabaseLogger('mysql');
	}

	// متد اصلی نصب
	async install() {
		try {
			await this.initialize();
			await this._installPrerequisites();
			await this._installMySQL();
			await this._postInstallConfiguration();
			await this._startService();
			await this._testConnection();

			this.logger.logSuccess('MySQL installed successfully');
			return { success: true };
		} catch (error) {
			this.logger.logError(error);
			throw error;
		}
	}

	// متد حذف نصب
	async uninstall() {
		try {
			await this.initialize();
			await this._stopService();
			await this._removeExistingInstallation();
			await this._cleanupResidualFiles();

			this.logger.logSuccess('MySQL uninstalled successfully');
			return { success: true };
		} catch (error) {
			this.logger.logError(error);
			throw error;
		}
	}

	// --- متدهای کمکی ---

	async initialize() {
		this.systemInfo = await this._detectSystem();
		this.logger.logSystemInfo(this.systemInfo);
		this._checkCompatibility();
	}

	async _detectSystem() {
		const platform = os.platform();
		const arch = os.arch();

		return {
			platform,
			arch,
			is64bit: arch === 'x64' || arch === 'arm64',
			version: await this._getOSVersion(platform)
		};
	}

	async _getOSVersion(platform) {
		if (platform !== 'win32') return 'unknown';

		try {
			// روش اول: استفاده از WMIC
			const { stdout } = await execPromise('wmic os get version');
			const version = stdout.trim().split('\n')[1];
			return version || 'unknown';
		} catch {
			try {
				// روش دوم: استفاده از PowerShell
				const { stdout } = await execPromise('powershell -command "(Get-ComputerInfo).WindowsVersion"');
				return parseFloat(stdout.trim()) || 'unknown';
			} catch {
				return 'unknown';
			}
		}
	}

	_checkCompatibility() {
		if (this.systemInfo.platform === 'win32' &&
			this.systemInfo.version !== 'unknown' &&
			this.systemInfo.version < 6.1) {
			throw new Error('Windows version not supported');
		}
	}

	async _installPrerequisites() {
		if (this.systemInfo.platform === 'win32') {
			await this._installChocolatey();
		}
	}

	async _installChocolatey() {
		try {
			await execPromise('choco --version');
		} catch {
			const cmd = `
        Set-ExecutionPolicy Bypass -Scope Process -Force;
        [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072;
        iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
      `.replace(/\n/g, '').trim();

			await execPromise(`powershell -Command "${cmd}"`);
		}
	}

	async _installMySQL() {
		if (this.systemInfo.platform === 'win32') {
			await this._installMySQLWindows();
		} else {
			await this._installMySQLUnix();
		}
	}

	async _installMySQLWindowsPortable() {
		try {
			const zipUrl = 'https://downloads.mysql.com/archives/get/p/23/file/mysql-8.0.26-winx64.zip';
			const zipPath = path.join(os.tmpdir(), 'mysql.zip');
			const extractPath = path.join(systemDrive, 'Program Files', 'MySQL');

			// دانلود فایل زیپ
			await this._downloadFile(zipUrl, zipPath);

			// اکسترکت کردن فایل
			await this._extractZip(zipPath, extractPath);

			// تنظیم متغیرهای محیطی
			const binPath = path.join(extractPath, 'mysql-8.0.26-winx64', 'bin');
			await execPromise(`setx PATH "%PATH%;${binPath}" /M`);

			// راه‌اندازی سرویس
			await execPromise(`"${path.join(binPath, 'mysqld')}" --install`);

			fs.unlinkSync(zipPath);
		} catch (error) {
			console.log("* * * _installMySQLWindowsPortable", error);
			throw new Error(`Portable installation failed: ${error.message}`);
		}
	}

	async _extractZip(zipPath, extractPath) {
		await extract(zipPath, { dir: extractPath });
	}
	async _installMySQLWindows() {
		try {
			// روش اول: Chocolatey
			await this._installWithChocolatey();
			return;
		} catch (chocoError) {
			console.log("* * * _installMySQLWindows chocoError", chocoError);
			this.logger.log('Chocolatey install failed, trying direct download', 'warning');
		}

		try {
			// روش دوم: دانلود مستقیم
			await this._installWithDirectDownload();
			return;
		} catch (downloadError) {
			console.log("* * * _installMySQLWindows downloadError", downloadError);
			this.logger.log('Direct download failed, trying portable version', 'warning');
		}

		try {
			// روش سوم: نسخه portable
			await this._installMySQLWindowsPortable();
			return;
		} catch (portableError) {
			console.log("* * * _installMySQLWindows portableError", portableError);
			throw new Error('All installation methods failed');
		}
	}

	async _installWithChocolatey() {

		await execPromise(`choco install mysql -y --params "/InstallDir:\'"C:\\Program Files\MySQL'" --yes --acceptLicense`);
		// await execPromise('choco install mysql -y --params="/InstallDir:\'"C:\\Program Files\\MySQL\'"');
	}

	async _installWithDirectDownload() {
		const mirrorUrls = [
			'https://dev.mysql.com/get/Downloads/MySQL-8.0/mysql-installer-community-8.0.36.0.msi',
			'https://cdn.mysql.com/Downloads/MySQLInstaller/mysql-installer-community-8.0.36.0.msi'
		];

		for (const url of mirrorUrls) {
			try {
				const installerPath = path.join(os.tmpdir(), `mysql_installer_${Date.now()}.msi`);
				await this._downloadFileWithRetry(url, installerPath);
				await this._runWindowsInstaller(installerPath);
				fs.unlinkSync(installerPath);
				return;
			} catch (err) {
				console.log("* * * _installWithDirectDownload", url, err);

				continue;
			}
		}
		throw new Error('All download mirrors failed');
	}

	async _downloadFileWithRetry(url, destination, retries = 3) {
		let lastError;
		for (let i = 0; i < retries; i++) {
			try {
				await this._downloadFile(url, destination);
				return;
			} catch (err) {
				lastError = err;
				await new Promise(resolve => setTimeout(resolve, 2000));
			}
		}
		throw lastError;
	}

	// async _installMySQLWindows() {
	// 	try {
	// 		// روش اول: استفاده از Chocolatey
	// 		await execPromise('choco install mysql -y --params="/InstallDir:\'"C:\\Program Files\\MySQL\'"');
	// 	} catch (error) {
	// 		this.logger.log('Chocolatey install failed, trying manual install', 'warning');

	// 		// روش دوم: دانلود مستقیم
	// 		const installerUrl = 'https://dev.mysql.com/get/Downloads/MySQLInstaller/mysql-installer-community-8.0.26.0.msi';
	// 		const installerPath = path.join(os.tmpdir(), 'mysql_installer.msi');

	// 		await this._downloadFile(installerUrl, installerPath);
	// 		await this._runWindowsInstaller(installerPath);
	// 		fs.unlinkSync(installerPath);
	// 	}
	// }

	async _installMySQLUnix() {
		const commands = {
			linux: 'sudo apt-get install -y mysql-server',
			darwin: 'brew install mysql'
		};

		await execPromise(commands[this.systemInfo.platform] || commands.linux);
	}

	async _runWindowsInstaller(installerPath) {
		await sudoExec(`msiexec /i "${installerPath}" /quiet /qn /norestart`, {
			name: 'MySQL Installer'
		});
	}

	async _postInstallConfiguration() {
		if (this.systemInfo.platform === 'win32') {
			const mysqlAdmin = path.join(MYSQL_CONFIG.windowsInstallDir, 'MySQL Server 8.0', 'bin', 'mysqladmin');
			await execPromise(`"${mysqlAdmin}" -u root password "${MYSQL_CONFIG.rootPassword}"`);
		} else {
			await execPromise(`sudo mysqladmin -u root password "${MYSQL_CONFIG.rootPassword}"`);
		}
	}

	async _startService() {
		const serviceName = MYSQL_CONFIG.serviceName[this.systemInfo.platform];

		if (this.systemInfo.platform === 'win32') {
			await execPromise(`net start ${serviceName}`);
		} else {
			await execPromise(`sudo service ${serviceName} start`);
		}

		await new Promise(resolve => setTimeout(resolve, 5000));
	}

	async _stopService() {
		const serviceName = MYSQL_CONFIG.serviceName[this.systemInfo.platform];

		try {
			if (this.systemInfo.platform === 'win32') {
				await execPromise(`taskkill /F /IM mysqld.exe`);
				await execPromise(`net stop ${serviceName}`);
			} else {
				await execPromise(`sudo service ${serviceName} stop`);
			}
		} catch (error) {
			this.logger.log(`Failed to stop service: ${error.message}`, 'warning');
		}
	}

	async _testConnection() {
		try {
			if (this.systemInfo.platform === 'win32') {
				const mysqlCli = path.join(MYSQL_CONFIG.windowsInstallDir, 'MySQL Server 8.0', 'bin', 'mysql');
				await execPromise(`"${mysqlCli}" -u root -p${MYSQL_CONFIG.rootPassword} -e "SELECT 1;"`);
			} else {
				await execPromise(`mysql -u root -p${MYSQL_CONFIG.rootPassword} -e "SELECT 1;"`);
			}
		} catch (error) {
			throw new Error('Connection test failed');
		}
	}

	async _removeExistingInstallation() {
		if (this.systemInfo.platform === 'win32') {
			await this._removeMySQLWindows();
		} else {
			await this._removeMySQLUnix();
		}
	}

	async _removeMySQLWindows() {
		try {
			await execPromise('choco uninstall mysql -y');
		} catch {
			// اگر Chocolatey نتوانست حذف کند، به صورت دستی حذف می‌کنیم
			await this._forceRemoveWindowsDirectory(MYSQL_CONFIG.windowsInstallDir);
		}
	}

	async _removeMySQLUnix() {
		const commands = {
			linux: 'sudo apt-get purge -y mysql-server',
			darwin: 'brew uninstall mysql'
		};

		await execPromise(commands[this.systemInfo.platform] || commands.linux);
	}

	async _forceRemoveWindowsDirectory(dirPath) {
		if (!fs.existsSync(dirPath)) return;

		// گرفتن مالکیت و تنظیم مجوزها
		await sudoExec(`
      takeown /F "${dirPath}" /R /D Y && 
      icacls "${dirPath}" /grant administrators:F /T && 
      rmdir /s /q "${dirPath}"
    `, { name: 'MySQL Cleanup' });
	}

	async _cleanupResidualFiles() {
		if (this.systemInfo.platform === 'win32') {
			// حذف فایل‌های باقیمانده در ProgramData
			const programDataDir = path.join(systemDrive, 'ProgramData', 'MySQL');
			if (fs.existsSync(programDataDir)) {
				await this._forceRemoveWindowsDirectory(programDataDir);
			}
		}
	}

	async _downloadFile(url, destination) {
		return new Promise((resolve, reject) => {
			const file = fs.createWriteStream(destination);

			const options = {
				headers: {
					'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
				}
			};

			https.get(url, options, response => {
				if (response.statusCode !== 200) {
					reject(new Error(`Download failed with status ${response.statusCode}`));
					return;
				}

				response.pipe(file);

				file.on('finish', () => {
					file.close();
					resolve();
				});
			}).on('error', error => {
				fs.unlink(destination, () => reject(error));
			});
		});
	}
}


// ==================== Logger ====================
// ==================== کلاس خطای سفارشی ====================
class DatabaseError extends Error {
	constructor(message, { type = 'database', isRecoverable = false, severity = 'high', platform } = {}) {
		super(message);
		this.name = 'DatabaseError';
		this.type = type;
		this.isRecoverable = isRecoverable;
		this.severity = severity;
		this.platform = platform || process.platform;
		this.timestamp = new Date().toISOString();
	}

	toJSON() {
		return {
			error: this.message,
			type: this.type,
			isRecoverable: this.isRecoverable,
			severity: this.severity,
			platform: this.platform,
			timestamp: this.timestamp,
			stack: this.stack
		};
	}
}
class DatabaseLogger {
	constructor(dbType) {
		this.dbType = dbType;
		this.logFile = path.join(os.tmpdir(), `${dbType}_installer.log`);
		this.verbose = true;
	}

	log(message, level = 'info') {
		const timestamp = new Date().toISOString();
		const logMessage = `[${timestamp}] [${level.toUpperCase()}] ${message}\n`;
		const validLevels = ['error', 'warn', 'info', 'debug', 'log'];
		const outputLevel = validLevels.includes(level) ? level : 'log';

		if (this.verbose) {
			console[outputLevel](logMessage);
		}

		fs.appendFileSync(this.logFile, logMessage + '\n');
	}

	logSystemInfo(info) {
		this.log('System Information:');
		this.log(`- Platform: ${info.platform}`);
		this.log(`- Architecture: ${info.arch}`);
		this.log(`- Version: ${info.version}`);
		if (info.distro) {
			this.log(`- Distribution: ${info.distro}`);
		}
		this.log(`- Is ARM: ${info.isArm}`);
		this.log(`- Is 64-bit: ${info.is64bit}`);
	}

	logError(error) {
		if (error instanceof DatabaseError) {
			this.log(`Error: ${error.message}`, 'error');
			this.log(`Type: ${error.type}`, 'error');
			this.log(`Recoverable: ${error.isRecoverable}`, 'error');
			this.log(`Stack: ${error.stack}`, 'error');
		} else {
			this.log(`Unexpected error: ${error.message}`, 'error');
			this.log(`Stack: ${error.stack}`, 'error');
		}
	}

	logSuccess(message) {
		this.log(message, 'info');
		console.log('\x1b[32m%s\x1b[0m', message); // متن سبز

	}
}

export default DatabaseInstaller;