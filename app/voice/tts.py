import requests
import tempfile
import os
from app.config import ELEVENLABS_API_KEY

# Default voice (you can change later)
VOICE_ID = "EXAVITQu4vr4xnSDxMaL"  # Rachel voice (good default)

def speak(text):
    print(f"🤖 M.I.A: {text}")

    url = f"https://api.elevenlabs.io/v1/text-to-speech/{VOICE_ID}"

    headers = {
        "xi-api-key": ELEVENLABS_API_KEY,
        "Content-Type": "application/json"
    }

    data = {
        "text": text,
        "model_id": "eleven_multilingual_v2"
    }

    response = requests.post(url, json=data, headers=headers)

    if response.status_code != 200:
        print("❌ TTS Error:", response.text)
        return

    # Save audio temporarily
    with tempfile.NamedTemporaryFile(delete=False, suffix=".mp3") as f:
        f.write(response.content)
        audio_path = f.name

    # Play audio
    os.system(f"mpg123 {audio_path}")