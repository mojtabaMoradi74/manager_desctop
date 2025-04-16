import { exec } from 'child_process';
import { promisify } from 'util';
import sudo from 'sudo-prompt';
import os from 'os';
import fs from 'fs';
import path from 'path';
import { pipeline } from 'stream';
import https from 'https';

const execPromise = promisify(exec);
const sudoPromise = promisify(sudo.exec);
const systemDrive = process.env.SystemDrive;
// ==================== تنظیمات پایه ====================
const DB_CONFIG = {
	mysql: {
		rootPassword: '1234',
		port: 3306,
		serviceName: {
			win32: 'MySQL',
			linux: 'mysql',
			darwin: 'mysql'
		}
	},
	postgresql: {
		postgresPassword: '1234',
		port: 5432,
		serviceName: {
			win32: 'postgresql',
			linux: 'postgresql',
			darwin: 'postgresql'
		}
	}
};

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

// ==================== تشخیص سیستم ====================
class SystemInfo {
	static async detect() {
		const platform = os.platform();
		const arch = os.arch();
		let version = 'unknown';
		let distro = 'unknown';

		try {
			if (platform === 'win32') {
				version = await this._detectWindowsVersion();
			} else if (platform === 'darwin') {
				version = await this._detectMacOSVersion();
			} else if (platform === 'linux') {
				[version, distro] = await Promise.all([
					this._detectLinuxVersion(),
					this._detectLinuxDistro()
				]);
			}

			return {
				platform,
				arch,
				version,
				distro: platform === 'linux' ? distro : undefined,
				isArm: arch.includes('arm') || arch === 'aarch64',
				is64bit: arch === 'x64' || arch === 'arm64'
			};
		} catch (error) {
			throw new DatabaseError('System detection failed', {
				type: 'system',
				isRecoverable: false,
				severity: 'critical'
			});
		}
	}

	static async _detectWindowsVersion() {
		try {
			const { stdout } = await execPromise('powershell -command "(Get-ComputerInfo).WindowsVersion"');
			const version = parseFloat(stdout.trim());
			return isNaN(version) ? 'unknown' : version;
		} catch {
			try {
				const { stdout } = await execPromise('ver');
				const match = stdout.match(/\[Version (\d+\.\d+)\]/);
				return match ? parseFloat(match[1]) : 'unknown';
			} catch {
				return 'unknown';
			}
		}
	}

	static async _detectMacOSVersion() {
		try {
			const { stdout } = await execPromise('sw_vers -productVersion');
			return stdout.trim();
		} catch {
			return 'unknown';
		}
	}

	static async _detectLinuxVersion() {
		try {
			const { stdout } = await execPromise('lsb_release -rs || cat /etc/*release | grep VERSION_ID | head -1');
			return stdout.trim().replace(/"/g, '').split('=')[1] || 'unknown';
		} catch {
			return 'unknown';
		}
	}

	static async _detectLinuxDistro() {
		try {
			const { stdout } = await execPromise('lsb_release -is || cat /etc/*release | grep ^ID= | head -1');
			return stdout.trim().toLowerCase().replace(/"/g, '').split('=')[1] || 'unknown';
		} catch {
			return 'unknown';
		}
	}
}

// ==================== مدیریت نصب ====================
export default class DatabaseInstaller {
	constructor(dbType = 'mysql') {
		this.dbType = dbType;
		this.config = DB_CONFIG[dbType];
		this.systemInfo = null;
		this.logger = new DatabaseLogger(dbType);
	}

	async initialize() {
		this.systemInfo = await SystemInfo.detect();
		this.logger.logSystemInfo(this.systemInfo);

		// بررسی سازگاری سیستم
		this._checkSystemCompatibility();
	}

	_checkSystemCompatibility() {
		const { platform, version } = this.systemInfo;

		if (platform === 'win32' && version !== 'unknown' && version < 6.1) {
			throw new DatabaseError(`Windows version ${version} is not supported`, {
				type: 'compatibility',
				isRecoverable: false
			});
		}

		if (platform === 'darwin' && version !== 'unknown' && parseFloat(version) < 10.13) {
			throw new DatabaseError(`macOS version ${version} is not supported`, {
				type: 'compatibility',
				isRecoverable: false
			});
		}
	}

	async install() {
		try {
			await this.initialize();

			// نصب پیش‌نیازها
			await this._installPrerequisites();

			// نصب پایگاه داده
			await this._installDatabase();

			// پیکربندی پس از نصب
			await this._postInstallConfiguration();

			// راه‌اندازی سرویس
			await this._startService();

			// تست اتصال
			await this._testConnection();

			this.logger.logSuccess('Installation completed successfully');
			return { success: true, message: `${this.dbType} installed successfully` };
		} catch (error) {
			this.logger.logError(error);

			if (error.isRecoverable) {
				this.logger.log('Attempting recovery...');
				try {
					await this._attemptRecovery();
					return { success: true, message: `${this.dbType} recovered after initial failure` };
				} catch (recoveryError) {
					this.logger.logError(recoveryError);
					throw recoveryError;
				}
			}

			throw error;
		}
	}

	async _installPrerequisites() {
		const { platform } = this.systemInfo;

		this.logger.log('Installing prerequisites...');

		try {
			if (platform === 'darwin') {
				await this._installHomebrew();
			} else if (platform === 'win32') {
				await this._installChocolatey();
			} else if (platform === 'linux') {
				await this._installLinuxDependencies();
			}
		} catch (error) {
			throw new DatabaseError(`Prerequisite installation failed: ${error.message}`, {
				type: 'prerequisite',
				isRecoverable: true
			});
		}
	}

	async _installHomebrew() {
		const { arch } = this.systemInfo;
		const brewPath = arch === 'arm64' ? '/opt/homebrew/bin/brew' : '/usr/local/bin/brew';

		try {
			await execPromise(`${brewPath} --version`);
			this.logger.log('Homebrew is already installed');
		} catch {
			this.logger.log('Installing Homebrew...');
			const installCommand = arch === 'arm64' ?
				'/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"' :
				'/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"';

			await execPromise(installCommand);
		}
	}

	async _installChocolatey() {
		try {
			await execPromise('choco --version');
			this.logger.log('Chocolatey is already installed');
		} catch {
			this.logger.log('Installing Chocolatey...');
			const installCommand = `
        Set-ExecutionPolicy Bypass -Scope Process -Force;
        [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072;
        iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
      `.replace(/\n/g, '').trim();

			await execPromise(`powershell -command "${installCommand}"`);
		}
	}

	async _installLinuxDependencies() {
		const { distro } = this.systemInfo;
		let commands = [];

		switch (distro) {
			case 'ubuntu':
			case 'debian':
				commands = ['sudo apt-get update', 'sudo apt-get install -y wget curl gnupg2'];
				break;
			case 'centos':
			case 'rhel':
			case 'fedora':
				commands = ['sudo yum install -y wget curl'];
				break;
			case 'arch':
				commands = ['sudo pacman -Sy --noconfirm wget curl'];
				break;
			default:
				commands = ['sudo apt-get update', 'sudo apt-get install -y wget curl'];
		}

		for (const cmd of commands) {
			try {
				await execPromise(cmd);
			} catch (error) {
				this.logger.log(`Command failed: ${cmd}`, 'warning');
			}
		}
	}

	async _installDatabase() {
		const { platform, arch, distro } = this.systemInfo;
		let installCommand;

		this.logger.log(`Installing ${this.dbType}...`);

		try {
			if (platform === 'win32') {
				if (this.dbType === 'mysql') {
					// 4. Retry installation with alternative method if needed
					// installCommand = 'choco install mysql --params "/InstallDir:C:\\Program Files\\MySQL" -y';
					// installCommand = 'choco install mysql --params "/InstallDir:\'C:\\Program Files\\MySQL\'" -y';
					// installCommand = 'choco install mysql  --version=8.0.26 --params "/InstallDir:C:\\Progra~1\\MySQL" -y';
					return await this._installMySQLWindowsAlternative();

				} else {
					installCommand = 'choco install postgresql --params "/Password:postgres" -y';
				}
			} else if (platform === 'darwin') {
				const brewPrefix = arch === 'arm64' ? 'arch -arm64 brew' : 'brew';
				installCommand = `${brewPrefix} install ${this.dbType}`;
			} else if (platform === 'linux') {
				if (this.dbType === 'mysql') {
					switch (distro) {
						case 'ubuntu':
						case 'debian':
							installCommand = 'sudo apt-get install -y mysql-server';
							break;
						case 'centos':
						case 'rhel':
							installCommand = 'sudo yum install -y mysql-server';
							break;
						case 'arch':
							installCommand = 'sudo pacman -Syu --noconfirm mysql';
							break;
						default:
							installCommand = 'sudo apt-get install -y mysql-server';
					}
				} else {
					switch (distro) {
						case 'ubuntu':
						case 'debian':
							installCommand = 'sudo apt-get install -y postgresql postgresql-contrib';
							break;
						case 'centos':
						case 'rhel':
							installCommand = 'sudo yum install -y postgresql-server postgresql-contrib';
							break;
						case 'arch':
							installCommand = 'sudo pacman -Syu --noconfirm postgresql';
							break;
						default:
							installCommand = 'sudo apt-get install -y postgresql postgresql-contrib';
					}
				}
			}

			this.logger.log(`Running install command: ${installCommand}`);
			const { stdout, stderr } = await execPromise(installCommand);
			this.logger.log('Installation stdout: ' + stdout);

			if (stderr) {
				this.logger.log(stderr, 'warning');
			}
		} catch (error) {
			throw new DatabaseError(`${this.dbType} installation failed: ${error.message}`, {
				type: 'installation',
				isRecoverable: true
			});
		}
	}

	async _postInstallConfiguration() {
		const { platform } = this.systemInfo;

		this.logger.log('Running post-install configuration...');

		try {
			if (this.dbType === 'mysql') {
				if (platform === 'win32') {
					await execPromise(`"${systemDrive}:\\Program Files\\MySQL\\MySQL Server 8.0\\bin\\mysqladmin" -u root password "${this.config.mysql.rootPassword}"`);
				} else {
					await execPromise(`sudo mysqladmin -u root password "${this.config.mysql.rootPassword}"`);
				}
			} else {
				if (platform !== 'win32') {
					await execPromise(`sudo -u postgres psql -c "ALTER USER postgres WITH PASSWORD '${this.config.postgresql.postgresPassword}';"`);
				}
			}
		} catch (error) {
			throw new DatabaseError(`Post-install configuration failed: ${error.message}`, {
				type: 'configuration',
				isRecoverable: true
			});
		}
	}

	async _startService() {
		const { platform, distro } = this.systemInfo;
		const serviceName = this.config.serviceName[platform];

		this.logger.log(`Starting ${this.dbType} service...`);

		try {
			if (platform === 'win32') {
				await execPromise(`powershell "Start-Service -Name '${serviceName}'"`);
			} else if (platform === 'darwin') {
				await execPromise(`brew services start ${serviceName}`);
			} else if (platform === 'linux') {
				if (distro === 'ubuntu' || distro === 'debian') {
					await execPromise(`sudo service ${serviceName} start`);
				} else if (distro === 'centos' || distro === 'rhel') {
					await execPromise(`sudo systemctl start ${serviceName}`);
				} else if (distro === 'arch') {
					await execPromise(`sudo systemctl start ${serviceName}.service`);
				} else {
					await execPromise(`sudo service ${serviceName} start`);
				}
			}

			// Wait for service to be fully started
			await new Promise(resolve => setTimeout(resolve, 5000));
		} catch (error) {
			throw new DatabaseError(`Failed to start ${this.dbType} service: ${error.message}`, {
				type: 'service',
				isRecoverable: true
			});
		}
	}

	async _testConnection() {
		const { platform } = this.systemInfo;

		this.logger.log('Testing database connection...');

		try {
			if (this.dbType === 'mysql') {
				if (platform === 'win32') {
					await execPromise(`"${systemDrive}:\\Program Files\\MySQL\\MySQL Server 8.0\\bin\\mysql" -u root -p${this.config.mysql.rootPassword} -e "SELECT 1;"`);
				} else {
					await execPromise(`mysql -u root -p${this.config.mysql.rootPassword} -e "SELECT 1;"`);
				}
			} else {
				if (platform === 'win32') {
					await execPromise(`psql -U postgres -c "SELECT 1;"`);
				} else {
					await execPromise(`sudo -u postgres psql -c "SELECT 1;"`);
				}
			}
		} catch (error) {
			throw new DatabaseError(`Connection test failed: ${error.message}`, {
				type: 'connection',
				isRecoverable: true
			});
		}
	}

	async _downloadFile(url, destinationPath) {
		// const { pipeline } = require('stream');
		// const { promisify } = require('util');
		// const https = require('https');
		// const fs = require('fs');
		const streamPipeline = promisify(pipeline);

		this.logger.log(`Downloading file from ${url} to ${destinationPath}`);

		return new Promise((resolve, reject) => {
			const fileStream = fs.createWriteStream(destinationPath);

			https.get(url, (response) => {
				if (response.statusCode !== 200) {
					reject(new Error(`Failed to download file. Status code: ${response.statusCode}`));
					return;
				}

				response.on('error', (error) => {
					fs.unlink(destinationPath, () => reject(error));
				});

				fileStream.on('finish', () => {
					fileStream.close();
					resolve();
				});

				streamPipeline(response, fileStream).catch(error => {
					fs.unlink(destinationPath, () => reject(error));
				});
			}).on('error', (error) => {
				fs.unlink(destinationPath, () => reject(error));
			});
		});
	}

	async _installMySQLWindowsAlternative() {
		try {
			// روش اول: استفاده از Chocolatey
			await execPromise('choco install mysql -y');
			this.logger.log('MySQL installed successfully via Chocolatey');
		} catch (chocoError) {
			this.logger.log('Chocolatey installation failed, trying manual download', 'warning');

			try {
				// روش دوم: دانلود مستقیم از سایت MySQL
				const installerUrl = 'https://dev.mysql.com/get/Downloads/MySQLInstaller/mysql-installer-community-8.0.26.0.msi';
				const installerPath = path.join(os.tmpdir(), 'mysql-installer.msi');

				await this._downloadFile(installerUrl, installerPath);
				this.logger.log('MySQL installer downloaded successfully');

				// اجرای installer
				await execPromise(`msiexec /i "${installerPath}" /quiet /qn /norestart`);
				this.logger.log('MySQL installed successfully via manual installer');

				// حذف فایل installer پس از نصب
				fs.unlinkSync(installerPath);
			} catch (downloadError) {
				throw new DatabaseError(`Manual MySQL installation failed: ${downloadError.message}`, {
					type: 'installation',
					isRecoverable: false
				});
			}
		}
	}


	async _cleanupResidualFiles() {
		if (this.systemInfo.platform === 'win32') {
			try {
				// حذف دایرکتوری MySQL اگر باقی مانده است
				const mysqlDir = path.join(systemDrive, 'Program Files', 'MySQL');
				if (fs.existsSync(mysqlDir)) {
					await execPromise(`rmdir /s /q "${mysqlDir}"`);
				}
			} catch (error) {
				this.logger.log(`Cleanup error: ${error.message}`, 'warning');
			}
		}
	}

	async _attemptRecovery() {
		this.logger.log('Attempting recovery...');

		try {
			// 1. Stop any running service
			await this._stopService();

			// 2. Remove existing installation
			await this._removeExistingInstallation();

			// 3. Clean up residual files
			await this._cleanupResidualFiles();
			console.log("this.systemInfo.platform", this.systemInfo.platform);

			// 4. Retry installation with alternative method if needed
			// if (this.systemInfo.platform === 'win32') {
			// 	await this._installMySQLWindowsAlternative();
			// } else {
			// 	await this._installDatabase();
			// }

			// 5. Retry installation
			await this._installDatabase();
			await this._postInstallConfiguration();
			await this._startService();
			await this._testConnection();

			this.logger.log('Recovery successful');
		} catch (error) {
			throw new DatabaseError(`Recovery attempt failed: ${error.message}`, {
				type: 'recovery',
				isRecoverable: false
			});
		}
	}

	async _stopService() {
		const { platform, distro } = this.systemInfo;
		const serviceName = this.config.serviceName[platform];

		try {
			if (platform === 'win32') {
				await execPromise(`powershell "Stop-Service -Name '${serviceName}'"`);
			} else if (platform === 'darwin') {
				await execPromise(`brew services stop ${serviceName}`);
			} else if (platform === 'linux') {
				if (distro === 'ubuntu' || distro === 'debian') {
					await execPromise(`sudo service ${serviceName} stop`);
				} else if (distro === 'centos' || distro === 'rhel') {
					await execPromise(`sudo systemctl stop ${serviceName}`);
				} else if (distro === 'arch') {
					await execPromise(`sudo systemctl stop ${serviceName}.service`);
				} else {
					await execPromise(`sudo service ${serviceName} stop`);
				}
			}
		} catch (error) {
			this.logger.log(`Failed to stop service: ${error.message}`, 'warning');
		}
	}

	async _removeExistingInstallation() {
		const { platform, distro } = this.systemInfo;

		try {
			if (platform === 'win32') {
				if (this.dbType === 'mysql') {
					await execPromise('choco uninstall mysql -y');
				} else {
					await execPromise('choco uninstall postgresql -y');
				}
			} else if (platform === 'darwin') {
				await execPromise(`brew uninstall ${this.dbType}`);
			} else if (platform === 'linux') {
				if (this.dbType === 'mysql') {
					switch (distro) {
						case 'ubuntu':
						case 'debian':
							await execPromise('sudo apt-get purge -y mysql-server');
							break;
						case 'centos':
						case 'rhel':
							await execPromise('sudo yum remove -y mysql-server');
							break;
						case 'arch':
							await execPromise('sudo pacman -R --noconfirm mysql');
							break;
						default:
							await execPromise('sudo apt-get purge -y mysql-server');
					}
				} else {
					switch (distro) {
						case 'ubuntu':
						case 'debian':
							await execPromise('sudo apt-get purge -y postgresql postgresql-contrib');
							break;
						case 'centos':
						case 'rhel':
							await execPromise('sudo yum remove -y postgresql-server postgresql-contrib');
							break;
						case 'arch':
							await execPromise('sudo pacman -R --noconfirm postgresql');
							break;
						default:
							await execPromise('sudo apt-get purge -y postgresql postgresql-contrib');
					}
				}
			}
		} catch (error) {
			this.logger.log(`Failed to remove existing installation: ${error.message}`, 'warning');
		}
	}
}

// ==================== Logger ====================
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
