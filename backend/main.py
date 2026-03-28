from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from pydantic import BaseModel
from typing import Optional
import requests

load_dotenv()

from routes import fire, health, tax, portfolio, advisor, analyze, auth, user, couple
from database import engine
from models.user import User

# Generate database tables
User.metadata.create_all(bind=engine)

app = FastAPI(title="AI Money Mentor API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(fire.router, prefix="/fire", tags=["FIRE"])
app.include_router(health.router, prefix="/health", tags=["Health"])
app.include_router(tax.router, prefix="/tax", tags=["Tax"])
app.include_router(portfolio.router, prefix="/portfolio", tags=["Portfolio"])
app.include_router(advisor.router, prefix="/advisor", tags=["Advisor"])
app.include_router(analyze.router, prefix="/analyze", tags=["Analyze"])
app.include_router(auth.router, prefix="/auth", tags=["Auth"])
app.include_router(user.router, prefix="/user", tags=["User"])
app.include_router(couple.router, prefix="/couple", tags=["Couple"])


@app.get("/")
def read_root():
    return {"message": "AI Money Mentor API is running 🚀"}

class ChatRequest(BaseModel):
    message: str
    financial_context: Optional[dict] = None

OLLAMA_URL = "http://localhost:11434/api/generate"

@app.post("/chat")
def chat(req: ChatRequest):
    user_data = req.financial_context or {}

    prompt = f"""
You are Artha, an intelligent, empathetic Indian financial advisor. You must provide specific, actionable advice based heavily on the user's Exact Financial Data below.

Exact Financial Data:
- Age: {user_data.get('age', 'Unknown')}
- Monthly Income: ₹{user_data.get('income', '0')}
- Monthly Expenses: ₹{user_data.get('expenses', '0')}
- Current Savings/Corpus: ₹{user_data.get('savings', '0')}

Rules:
1. Always analyze their Income vs Expenses and tell them their savings rate if relevant.
2. If they ask about Early Retirement/FIRE, calculate if their savings can cover 25x their expenses.
3. Keep answers concise, strictly actionable, and format with markdown. Do NOT give generic disclaimers.

User Question: {req.message}
"""
    try:
        response = requests.post(
            OLLAMA_URL,
            json={
                "model": "llama3",
                "prompt": prompt,
                "stream": False
            }
        )
        data = response.json()
        return {
            "reply": data.get("response", "I am having trouble processing that right now.")
        }
    except Exception:
        return {
            "reply": "Sorry, my local AI engine seems to be offline. Make sure Ollama is running."
        }
