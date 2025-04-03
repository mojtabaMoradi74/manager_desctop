import { useEffect, useState, useCallback } from "react";
import { io } from "socket.io-client";

const App = () => {
	const [connection, setConnection] = useState({
		status: "disconnected",
		mode: null,
		server: null,
		error: null,
	});
	const [messages, setMessages] = useState([]);
	const [input, setInput] = useState("");
	const [socket, setSocket] = useState(null);

	// مدیریت وضعیت شبکه
	useEffect(() => {
		const handleNetworkStatus = (event, status) => {
			setConnection((prev) => ({
				...prev,
				...status,
				status: status.status || "connected",
			}));

			// اگر کلاینت هستیم و آدرس سرور را داریم، ارتباط را برقرار می‌کنیم
			if (status.mode === "client" && status.ip && status.port) {
				initializeSocketConnection(status.ip, status.port);
			}
		};

		window.electronAPI?.networkStatus(handleNetworkStatus);

		return () => {
			window.electronAPI?.networkStatus?.removeListener(handleNetworkStatus);
		};
	}, []);

	// ایجاد ارتباط Socket.io
	const initializeSocketConnection = useCallback((ip, port) => {
		const socketUrl = `http://${ip}:${port}`;
		const newSocket = io(socketUrl, {
			auth: {
				token: "default-dev-key", // در تولید باید از سیستم احراز هویت استفاده شود
			},
			reconnectionAttempts: 5,
			reconnectionDelay: 1000,
			timeout: 5000,
			transports: ["websocket", "polling"],
			upgrade: false,
			forceNew: true,
		});

		newSocket.on("connect", () => {
			setConnection((prev) => ({
				...prev,
				status: "connected",
				server: { ip, port },
			}));
		});

		newSocket.on("server-info", (info) => {
			console.log("Server information:", info);
		});

		newSocket.on("message", (message) => {
			setMessages((prev) => [...prev, message]);
		});

		newSocket.on("disconnect", (reason) => {
			setConnection((prev) => ({
				...prev,
				status: "disconnected",
				error: `Disconnected: ${reason}`,
			}));
		});

		newSocket.on("connect_error", (err) => {
			setConnection((prev) => ({
				...prev,
				status: "error",
				error: `Connection failed: ${err.message}`,
			}));
		});

		setSocket(newSocket);

		return () => {
			newSocket.disconnect();
		};
	}, []);

	// ارسال پیام
	const sendMessage = useCallback(() => {
		if (!input.trim() || !socket) return;

		const message = {
			content: input,
			timestamp: new Date().toISOString(),
			sender: connection.mode === "server" ? "SERVER" : "CLIENT",
		};

		if (connection.mode === "server") {
			// در حالت سرور، پیام را به تمام کلاینت‌ها broadcast می‌کنیم
			socket.emit("broadcast", message);
		} else {
			// در حالت کلاینت، پیام را به سرور ارسال می‌کنیم
			socket.emit("message", message);
		}

		setInput("");
	}, [input, socket, connection.mode]);

	return (
		<div className="app-container">
			<header className="app-header">
				<h1>{connection.mode === "server" ? "SERVER" : "CLIENT"} MODE</h1>
				<div className="connection-status">
					Status: <span className={connection.status}>{connection.status.toUpperCase()}</span>
					{connection.server && (
						<span>
							{" "}
							| Server: {connection.server.ip}:{connection.server.port}
						</span>
					)}
				</div>
			</header>

			<div className="message-container">
				{messages.map((msg, index) => (
					<div key={index} className={`message ${msg.sender}`}>
						<span className="sender">{msg.sender}:</span>
						<span className="content">{msg.content}</span>
						<span className="timestamp">{new Date(msg.timestamp).toLocaleTimeString()}</span>
					</div>
				))}
			</div>

			<div className="input-container">
				<input
					type="text"
					value={input}
					onChange={(e) => setInput(e.target.value)}
					onKeyPress={(e) => e.key === "Enter" && sendMessage()}
					disabled={connection.status !== "connected"}
					placeholder={connection.status === "connected" ? "Type your message..." : "Waiting for connection..."}
				/>
				<button onClick={sendMessage} disabled={connection.status !== "connected" || !input.trim()}>
					Send
				</button>
			</div>

			{connection.error && <div className="error-message">Error: {connection.error}</div>}
		</div>
	);
};

export default App;
