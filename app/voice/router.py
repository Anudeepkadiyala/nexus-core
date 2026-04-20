from fastapi import APIRouter
from app.voice.stt import listen

router = APIRouter()

@router.get("/listen")
def listen_voice():
    try:
        text = listen()
        return {"text": text}
    except Exception as e:
        return {"text": "", "error": str(e)}