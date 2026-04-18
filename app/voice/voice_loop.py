from app.voice.stt import listen
from app.voice.tts import speak
import requests

API_URL = "http://localhost:8000/chat"

def run_voice_mode():
    print("🚀 M.I.A Voice Mode Activated")
    print("Say 'exit' to stop\n")

    while True:
        try:
            # 🎤 Listen
            user_input = listen()

            if not user_input:
                continue

            print(f"🧑‍💻 You: {user_input}")

            # ❌ Exit condition
            if "exit" in user_input.lower():
                speak("Shutting down voice mode. Goodbye Sir.")
                break

            # 🧠 Send to M.I.A Brain
            response = requests.post(
                API_URL,
                json={"message": user_input}
            )

            if response.status_code == 200:
                reply = response.json().get("response", "No response")
            else:
                reply = "There was an error connecting to the brain."

            # 🔊 Speak response
            speak(reply)

        except KeyboardInterrupt:
            print("\n🛑 Voice mode stopped manually.")
            break

        except Exception as e:
            print("❌ Error:", e)
            speak("Something went wrong.")

if __name__ == "__main__":
    run_voice_mode()