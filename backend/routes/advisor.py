from fastapi import APIRouter
from models.user import AdvisorInput
from ai.advisor import get_advice

router = APIRouter()


@router.post("/chat")
def advisor_chat(data: AdvisorInput):
    reply = get_advice(message=data.message, financial_context=data.financial_context)
    return {"reply": reply, "advisor": "Artha"}
