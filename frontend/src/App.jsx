import { useEffect, useState } from "react";
import io from "socket.io-client";

function App() {
	const [serverIp, setServerIp] = useState(null);
	const [status, setStatus] = useState("Disconnected");
	const [socket, setSocket] = useState(null);
	const [message, setMessage] = useState("");

	useEffect(() => {
		console.log({ api: window.api });

		// Peyda kardan IP server az Electron (window.api.getServerIp)
		if (window.api)
			window.api.getServerIp().then((ip) => {
				console.log({ api: ip });

				setServerIp(ip);
				const newSocket = io(`http://${ip}:4000`);
				setSocket(newSocket);

				newSocket.on("connect", () => {
					setStatus("Connected");
				});

				newSocket.on("disconnect", () => {
					setStatus("Disconnected");
				});
				newSocket.on("receive_message", (data) => {
					console.log("Received message: ", data);
					const messages = document.getElementById("messages");
					const item = document.createElement("li");
					item.textContent = `${data.timestamp} - ${data.text}`;
					messages.appendChild(item);
				});
			});

		return () => {
			if (socket) socket.disconnect();
		};
	}, []);

	const sendMessage = () => {
		if (message.trim() === "") return;
		socket.emit("new_message", { text: message, timestamp: new Date().toLocaleString() });
		setMessage("");
	};

	return (
		<div>
			<h1>Client App</h1>
			<p>Server IP: {serverIp || "Detecting..."}</p>
			<p>Status: {status}</p>
			<div>
				<ul id="messages"></ul> {/* Show received messages */}
				<input type="text" placeholder="Type a message..." value={message} onChange={(e) => setMessage(e.target.value)} />
				<button onClick={sendMessage}>Send</button>
			</div>
		</div>
	);
}

export default App;
