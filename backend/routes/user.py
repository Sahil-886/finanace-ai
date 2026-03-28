from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import SessionLocal
from models.user import User

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/profile")
def get_profile(user_id: int, db: Session = Depends(get_db)):
    """Fetch the full user profile — used for real-time frontend sync."""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return {
        "user_id": user.id,
        "name": user.email.split("@")[0] if user.email else "User",
        "email": user.email,
        "age": user.age,
        "income": user.income,
        "expenses": user.expenses,
        "savings": user.savings,
    }

@router.post("/save-data")
def save_data(data: dict, db: Session = Depends(get_db)):
    user_id = data.get("user_id")
    if not user_id:
        raise HTTPException(status_code=400, detail="User ID is missing")

    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user.age = str(data.get("age", user.age))
    user.income = str(data.get("income", user.income))
    user.expenses = str(data.get("expenses", user.expenses))
    user.savings = str(data.get("savings", user.savings))

    db.commit()
    db.refresh(user)

    # Return the updated profile so the frontend can sync immediately
    return {
        "msg": "Data successfully saved to database.",
        "user_id": user.id,
        "name": user.email.split("@")[0] if user.email else "User",
        "email": user.email,
        "age": user.age,
        "income": user.income,
        "expenses": user.expenses,
        "savings": user.savings,
    }
