import React, { useState, useEffect } from "react";

const SpeechToText = () => {
	const [transcript, setTranscript] = useState(""); // Matn ra zakhire mikonim
	const [isListening, setIsListening] = useState(false); // Agar gavaresh gofteman
	const [recognition, setRecognition] = useState(null); // `recognition` ro ba `null` gharar midim.

	const startListening = () => {
		if (recognition) {
			recognition.start(); // Baray shoroo'
			setIsListening(true);
		}
	};

	const stopListening = () => {
		if (recognition) {
			recognition.stop(); // Baray pak kardan gofteman
			setIsListening(false);
		}
	};

	useEffect(() => {
		// بررسی پشتیبانی مرورگر
		if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
			alert("مرورگر شما از تشخیص گفتار پشتیبانی نمی‌کند!");
			return;
		}

		const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
		const recognitionInstance = new SpeechRecognition();

		recognitionInstance.lang = "fa-IR";
		recognitionInstance.interimResults = false;
		recognitionInstance.maxAlternatives = 1;

		recognitionInstance.onresult = (event) => {
			const newTranscript = event.results[0][0].transcript;
			setTranscript(newTranscript);
		};

		recognitionInstance.onerror = (event) => {
			console.error("خطا در تشخیص گفتار:", event.error);
			setIsListening(false);

			if (event.error === "not-allowed") {
				alert("دسترسی به میکروفون مسدود شده است. لطفاً مجوزها را بررسی کنید.");
			} else if (event.error === "network") {
				alert("اتصال اینترنت برقرار نیست یا سرویس تشخیص گفتار در دسترس نمی‌باشد.");
			}
		};

		setRecognition(recognitionInstance);

		// تمیزکاری هنگام آنمونت
		return () => {
			recognitionInstance.abort();
		};
	}, []);
	return (
		<div>
			<h1>Speech to Text in React</h1>
			<div>
				<button onClick={isListening ? stopListening : startListening}>{isListening ? "Stop Listening" : "Start Listening"}</button>
			</div>
			<p>Recognized Text: {transcript}</p>
		</div>
	);
};

export default SpeechToText;
