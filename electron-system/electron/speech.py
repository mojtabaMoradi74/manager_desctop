from vosk import Model, KaldiRecognizer
import pyaudio
import json
import os

# مسیر مدل فارسی
model_path = os.path.join(os.path.dirname(__file__), "models/vosk-model-small-fa-0.4")
model = Model(model_path)
recognizer = KaldiRecognizer(model, 16000)

mic = pyaudio.PyAudio()
stream = mic.open(
    format=pyaudio.paInt16,
    channels=1,
    rate=16000,
    input=True,
    frames_per_buffer=8192
)

print("تشخیص گفتار فعال شد... (Ctrl+C برای خروج)")

try:
    while True:
        data = stream.read(4096)
        if recognizer.AcceptWaveform(data):
            result = json.loads(recognizer.Result())
            print(result["text"])  # چاپ در کنسول
except KeyboardInterrupt:
    stream.stop_stream()
    stream.close()
    mic.terminate()