from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import feedparser
from dotenv import load_dotenv

from app.brain.router import route_request
from app.brain.memory import init_db
from app.brain.ai import ask_mia
from app.execution.router import route_action
from app.execution.intent_parser import parse_intent

# 🔥 Load env
load_dotenv()

app = FastAPI()

# ✅ CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =========================
# 📦 MODELS
# =========================
class ChatRequest(BaseModel):
    message: str
    mode: str = "default"   # ✅ prevent frontend crash if not sent


# =========================
# 🚀 STARTUP
# =========================
@app.on_event("startup")
def startup():
    init_db()


# =========================
# 🧠 ROOT
# =========================
@app.get("/")
def root():
    return {"message": "MIA is alive"}


# =========================
# 💬 CHAT (AI + EXECUTION)
# =========================
@app.post("/chat")
async def chat(request: ChatRequest):
    raw_input = request.message
    user_input = parse_intent(raw_input)

    # ⚙️ STEP 1: Try execution
    action_result = route_action(user_input)

    if action_result["status"] != "no_action":
        return {
            "type": "action",
            "result": action_result
        }

    # 🧠 STEP 2: AI response
    ai_response = ask_mia(user_input)

    return {
        "type": "ai",
        "response": ai_response
    }


# =========================
# 🌍 NEWS (RSS SYSTEM)
# =========================
@app.get("/news")
def get_news(region: str = "global"):
    try:
        import feedparser

        feeds = [
            "http://feeds.bbci.co.uk/news/rss.xml",
            "http://rss.cnn.com/rss/edition.rss",
            "https://feeds.reuters.com/reuters/topNews"
        ]

        region_keywords = {
            "us": ["us", "america", "biden", "washington"],
            "in": ["india", "delhi", "modi"],
            "gb": ["uk", "britain", "london"],
            "global": []
        }

        keywords = region_keywords.get(region, [])
        articles = []

        for feed_url in feeds:
            feed = feedparser.parse(feed_url)

            for entry in feed.entries:
                title = entry.title
                description = entry.get("summary", "No description")

                if region != "global":
                    if not any(k in title.lower() or k in description.lower() for k in keywords):
                        continue

                articles.append({
                    "title": title,
                    "description": description,
                    "source": feed.feed.get("title", "Unknown")
                })

        # fallback
        if not articles:
            for feed_url in feeds:
                feed = feedparser.parse(feed_url)

                for entry in feed.entries[:4]:
                    articles.append({
                        "title": entry.title,
                        "description": entry.get("summary", "No description"),
                        "source": feed.feed.get("title", "Unknown")
                    })

        articles = articles[:6]

        return {"news": articles}

    except Exception as e:
        print("❌ RSS ERROR:", str(e))
        return {"news": []}


# =========================
# 🧠 MIA ANALYSIS
# =========================
@app.post("/analyze")
def analyze_news(payload: dict):
    try:
        news = payload.get("news", [])

        if not news:
            return {"analysis": "No significant updates in this region."}

        prompt = "Summarize the following news into 2-3 lines with insights:\n"

        for n in news:
            prompt += f"- {n['title']}\n"

        summary = ask_mia(prompt)

        return {"analysis": summary}

    except Exception as e:
        print("❌ ANALYSIS ERROR:", str(e))
        return {"analysis": "MIA unable to analyze at the moment."}