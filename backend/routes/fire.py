from fastapi import APIRouter
from models.user import FireInput
from services.fire_calc import calculate_fire

router = APIRouter()


@router.post("/calculate")
def fire_plan(data: FireInput):
    result = calculate_fire(
        age=data.age,
        retirement_age=data.retirement_age,
        income=data.income,
        expenses=data.expenses,
        savings=data.savings or 0,
        extra_sip=data.extra_sip or 0,
    )
    return result
