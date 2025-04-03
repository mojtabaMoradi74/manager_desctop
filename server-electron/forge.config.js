require("dotenv").config();
const path = require("path");
const { FusesPlugin } = require("@electron-forge/plugin-fuses");
const { FuseV1Options, FuseVersion } = require("@electron/fuses");
console.log("GITHUB_TOKEN:", process.env.GITHUB_TOKEN);

module.exports = {
	publishers: [
		{
			name: "@electron-forge/publisher-github",
			config: {
				repository: {
					owner: "mojtabaMoradi74",
					name: "manager_desctop",
				},
				prerelease: false,
				draft: true,
			},
		},
	],
	packagerConfig: {
		asar: true,
		overwrite: true,
		prune: true,
		icon: path.resolve(__dirname, "assets", "icon"),
		// osxSign: {
		//   identity: "Developer ID Application: Your Name (TEAMID)", // جایگزین کنید با اطلاعات خود
		//   "hardened-runtime": true,
		//   "gatekeeper-assess": false,
		//   entitlements: "entitlements.plist", // اگر نیاز دارید
		//   "entitlements-inherit": "entitlements.plist", // اگر نیاز دارید
		// },
		// osxNotarize: {
		//   tool: "notarytool",
		//   appleId: process.env.APPLE_ID,
		//   appleIdPassword: process.env.APPLE_PASSWORD,
		//   teamId: process.env.APPLE_TEAM_ID,
		// },
	},
	rebuildConfig: {},
	makers: [
		// 🖥 Windows (.exe)
		{
			name: "@electron-forge/maker-squirrel",
			config: {
				setupExe: "my-electron-app-installer.exe",
				noMsi: true,
			},
		},
		// 📦 Windows AppX (Microsoft Store)
		// {
		// 	name: "@electron-forge/maker-appx",
		// 	config: {
		// 		publisher: "CN=developmentca",
		// 		devCert: path.resolve(__dirname, "certs", "devcert.crt"), // چک کن که وجود داره!
		// 		certPass: "1234",
		// 	},
		// },
		// 🍏 macOS (dmg)
		{
			name: "@electron-forge/maker-dmg",
			config: {
				format: "ULFO",
				overwrite: true,
			},
		},
		// 🍏 macOS (zip)
		{
			name: "@electron-forge/maker-zip",
			platforms: ["darwin"],
		},
		// 🐧 Linux (.deb)
		{
			name: "@electron-forge/maker-deb",
			config: {
				options: {
					maintainer: "Mojtaba Moradi",
					homepage: "https://example.com",
					category: "Utility",
				},
			},
		},
		// 🐧 Linux (.rpm)
		{
			name: "@electron-forge/maker-rpm",
			config: {},
		},
	],
	plugins: [
		// 🚀 باز کردن نیتیو فایل‌ها
		{
			name: "@electron-forge/plugin-auto-unpack-natives",
			config: {},
		},
		// 🔒 تنظیمات امنیتی
		new FusesPlugin({
			version: FuseVersion.V1,
			[FuseV1Options.RunAsNode]: false,
			[FuseV1Options.EnableCookieEncryption]: true,
			[FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
			[FuseV1Options.EnableNodeCliInspectArguments]: false,
			[FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true,
			[FuseV1Options.OnlyLoadAppFromAsar]: true,
		}),
	],
	hooks: {
		packageAfterCopy: async (buildPath, electronVersion, platform, arch) => {
			console.log(`🚀 Building for ${platform} (${arch}) on Electron ${electronVersion}`);
		},
	},
};
