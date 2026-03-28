from fastapi import APIRouter
from models.user import TaxInput
from services.tax_calc import compare_tax

router = APIRouter()


@router.post("/compare")
def tax_compare(data: TaxInput):
    result = compare_tax(income=data.income, deductions=data.deductions or 0)
    return result
