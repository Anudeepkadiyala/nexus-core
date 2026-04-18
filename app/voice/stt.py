import sounddevice as sd
import numpy as np
import scipy.io.wavfile as wav
import tempfile
from openai import OpenAI
from app.config import OPENAI_API_KEY

client = OpenAI(api_key=OPENAI_API_KEY)

def record_audio(duration=5, fs=16000):
    print("🎤 Recording... Speak now")

    audio = sd.rec(int(duration * fs), samplerate=fs, channels=1, dtype='int16')
    sd.wait()

    print("🛑 Recording complete")

    return fs, audio


def save_temp_wav(fs, audio):
    temp_file = tempfile.NamedTemporaryFile(delete=False, suffix=".wav")
    wav.write(temp_file.name, fs, audio)
    return temp_file.name


def transcribe_audio(file_path):
    print("🧠 Transcribing with Whisper...")

    with open(file_path, "rb") as audio_file:
        transcript = client.audio.transcriptions.create(
            model="gpt-4o-transcribe",
            file=audio_file
        )

    text = transcript.text
    print(f"📝 You said: {text}")

    return text


def listen():
    fs, audio = record_audio()
    file_path = save_temp_wav(fs, audio)
    text = transcribe_audio(file_path)
    return text