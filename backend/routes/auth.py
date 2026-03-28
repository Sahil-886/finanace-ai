from fastapi import APIRouter, Depends, HTTPException, status
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

@router.post("/signup")
def signup(data: dict, db: Session = Depends(get_db)):
    # Check if user already exists
    existing_user = db.query(User).filter(User.email == data.get("email")).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    user = User(
        email=data.get("email"),
        password=data.get("password")  # Note: text-based passwords for local rapid prototyping.
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return {
        "user_id": user.id,
        "name": user.email.split("@")[0] if user.email else "User",
        "age": user.age,
        "income": user.income,
        "expenses": user.expenses,
        "savings": user.savings
    }

@router.post("/login")
def login(data: dict, db: Session = Depends(get_db)):
    user = db.query(User).filter(
        User.email == data.get("email"),
        User.password == data.get("password")
    ).first()

    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    return {
        "user_id": user.id,
        "name": user.email.split("@")[0] if user.email else "User",
        "age": user.age,
        "income": user.income,
        "expenses": user.expenses,
        "savings": user.savings
    }
