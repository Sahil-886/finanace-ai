from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime
from database import Base
from pydantic import BaseModel
from typing import Optional, List, Dict, Any

# --- SQLAlchemy Models ---
class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    password = Column(String)
    age = Column(String, default="0")
    income = Column(String, default="0")
    expenses = Column(String, default="0")
    savings = Column(String, default="0")

# --- Pydantic Schemas ---
class FireInput(BaseModel):
    age: int
    retirement_age: int
    income: float
    expenses: float
    savings: Optional[float] = 0
    extra_sip: Optional[float] = 0

class HealthInput(BaseModel):
    emergency_months: float
    insurance: bool
    invest_ratio: float
    debt_ratio: float
    tax_saving: bool
    retirement_saving: bool

class TaxInput(BaseModel):
    income: float
    deductions: Optional[float] = 0

class Investment(BaseModel):
    name: str
    amount: float
    current_value: float
    years: Optional[float] = 0

class PortfolioInput(BaseModel):
    investments: List[Investment]

class AdvisorInput(BaseModel):
    message: str
    financial_context: Optional[Dict[str, Any]] = None

class AnalyzeInput(BaseModel):
    age: int
    retirement_age: int
    income: float
    expenses: float
    savings: float
    emergency_months: Optional[float] = 0
