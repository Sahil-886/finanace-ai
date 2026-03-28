from fastapi import APIRouter
from pydantic import BaseModel
from services.fire_engine import calculate_fire_plan
from services.recommendation import generate_recommendations
from ai.advisor import get_advice

router = APIRouter()

class AnalyzeRequest(BaseModel):
    age: int
    retirement_age: int
    income: int
    expenses: int
    savings: int
    emergency_months: int = 0

@router.post("/")
def full_analysis(data: dict):
    # Dynamic calculation API without save hook
    user_id = data.get("user_id", -1)
    
    # Calculate FIRE plan
    fire = calculate_fire_plan(
        age=data.get("age", 30),
        retirement_age=data.get("retirement_age", 50),
        income=data.get("income", 0),
        expenses=data.get("expenses", 0),
        savings=data.get("savings", 0)
    )
    
    # Generate recommendations
    recs = generate_recommendations({
        **data,
        **fire
    })
    
    # Get AI advice
    advice = get_advice(data, fire, recs)

    return {
        "fire": fire,
        "recommendations": recs,
        "ai_advice": advice,
        "user_id": user_id
    }
