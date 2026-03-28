import os
from openai import OpenAI

# Initialize only if key is available so app doesn't crash on import
client = None
if os.getenv("OPENAI_API_KEY"):
    client = OpenAI()

def get_advice(message: str, financial_context: dict = None) -> str:
    if not client:
        return "OpenAI API Key not set. Missing structured AI advice."

    ctx = financial_context or {}
    income = ctx.get("income", "Unknown")
    expenses = ctx.get("expenses", "Unknown")
    savings = ctx.get("savings", "Unknown")
    age = ctx.get("age", "Unknown")

    system_prompt = f"""
You are Artha, a highly intelligent, empathetic, and expert financial AI Copilot.
You have perfectly contextual knowledge of the user's current financial situation.
Do NOT give generic advice. Give hyper-specific advice based on precisely these numbers:
- Monthly Income: ₹{income}
- Monthly Expenses: ₹{expenses}
- Current Savings (Corpus): ₹{savings}
- Age: {age}

Rules:
1. Always format responses in clean Markdown.
2. Be direct and avoid generic disclaimers.
3. If the user asks if they can retire early, calculate an approximate 4% rule (annual expenses * 25) vs their current savings.
4. Keep answers concise but strictly actionable. Give real numbers.
    """

    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": message}
            ]
        )
        return response.choices[0].message.content
    except Exception as e:
        return f"Could not fetch AI advice: {str(e)}"
