const sqlite3 = require("sqlite3").verbose();

class Database {
	constructor() {
		this.db = new sqlite3.Database("app_data.db", (err) => {
			if (err) console.error("Database Error:", err.message);
			else console.log("Connected to SQLite Database.");
		});

		this.db.run("CREATE TABLE IF NOT EXISTS messages (id INTEGER PRIMARY KEY, text TEXT, timestamp TEXT)");
	}

	async saveMessage({ text, timestamp }) {
		return new Promise((resolve, reject) => {
			this.db.run("INSERT INTO messages (text, timestamp) VALUES (?, ?)", [text, timestamp], function (err) {
				if (err) reject(err);
				else resolve(this.lastID);
			});
		});
	}

	async getMessages() {
		return new Promise((resolve, reject) => {
			this.db.all("SELECT * FROM messages", [], (err, rows) => {
				if (err) reject(err);
				else resolve(rows);
			});
		});
	}
}

module.exports = Database;
