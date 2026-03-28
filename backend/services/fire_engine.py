import math

def future_value(monthly_investment, annual_rate, months):
    if months <= 0 or monthly_investment <= 0:
        return 0
    r = annual_rate / 12
    return monthly_investment * ((1 + r)**months - 1) / r

def calculate_fire_plan(age, retirement_age, income, expenses, savings, rate=0.12):
    months = max((retirement_age - age) * 12, 0)
    annual_expenses = expenses * 12
    
    fire_number = annual_expenses * 25
    
    monthly_investment = income - expenses
    
    invested_value = future_value(monthly_investment, rate, months) if monthly_investment > 0 else 0
    
    total_wealth = invested_value + savings

    gap = fire_number - total_wealth

    return {
        "fire_number": round(fire_number),
        "total_wealth": round(total_wealth),
        "monthly_investment": monthly_investment,
        "gap": round(gap),
        "status": "On Track" if gap <= 0 else "Behind"
    }
