from fastapi import APIRouter
from models.user import HealthInput
from services.health_score import calculate_health

router = APIRouter()


@router.post("/score")
def health_score(data: HealthInput):
    result = calculate_health(data.model_dump())
    return result
