from app.brain.memory import get_memory
from openai import OpenAI
from app.config import OPENAI_API_KEY   # ✅ IMPORT FROM CONFIG




# ✅ Use centralized key
client = OpenAI(api_key=OPENAI_API_KEY)


# =========================
# 🧠 MAIN CHAT FUNCTION
# =========================
def get_ai_response(user_input: str):
    memory = get_memory()
    context = "\n".join(memory[-5:])

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {
                "role": "system",
                "content": f"""
You are MIA, an advanced AI assistant.

You remember past interactions:
{context}

Respond clearly and intelligently.
"""
            },
            {"role": "user", "content": user_input}
        ]
    )

    return response.choices[0].message.content


# =========================
# 🌍 NEWS ANALYSIS FUNCTION
# =========================
def ask_mia(prompt: str):
    """
    Specialized function for analyzing global news.
    """

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {
                "role": "system",
                "content": """
You are MIA — a global intelligence AI.

Analyze news like a strategist.

Your job:
- Summarize key developments
- Identify patterns or risks
- Highlight important global signals

Keep response:
- Short (2–3 lines)
- Insightful (not generic)
- Clear and impactful
"""
            },
            {
                "role": "user",
                "content": prompt
            }
        ]
    )

    return response.choices[0].message.content