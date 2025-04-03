const path = require("path");
const { app } = require("electron");

module.exports = {
	development: {
		dialect: "sqlite",
		storage: path.join(app.getPath("userData"), "chat-db.sqlite"),
		logging: console.log,
		define: {
			timestamps: true,
			underscored: true,
		},
	},
	production: {
		dialect: "sqlite",
		storage: path.join(app.getPath("userData"), "chat-db.sqlite"),
		logging: false,
		define: {
			timestamps: true,
			underscored: true,
		},
	},
};
