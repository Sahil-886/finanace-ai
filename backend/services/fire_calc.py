def calculate_fire(age: int, retirement_age: int, income: float, expenses: float, savings: float = 0, return_rate: float = 0.12, extra_sip: float = 0) -> dict:
    years = retirement_age - age
    annual_expenses = expenses * 12
    fire_number = annual_expenses * 25  # 4% withdrawal rule

    monthly_investment = max(0, income - expenses) + extra_sip
    monthly_rate = return_rate / 12

    # Future value of current savings
    future_savings = savings * ((1 + monthly_rate) ** (years * 12))

    # Future value of monthly SIP
    if monthly_rate > 0 and monthly_investment > 0:
        future_sip = monthly_investment * (((1 + monthly_rate) ** (years * 12) - 1) / monthly_rate)
    else:
        future_sip = monthly_investment * years * 12

    projected_corpus = future_savings + future_sip
    shortfall = max(0, fire_number - projected_corpus)

    # Required SIP to reach FIRE
    if monthly_rate > 0 and years > 0:
        n = years * 12
        fv_savings = savings * ((1 + monthly_rate) ** n)
        remaining = fire_number - fv_savings
        if remaining > 0:
            required_sip = remaining * monthly_rate / (((1 + monthly_rate) ** n) - 1)
        else:
            required_sip = 0
    else:
        required_sip = 0

    savings_rate = (monthly_investment / income * 100) if income > 0 else 0

    # Find actual years to FIRE
    actual_years = -1
    total_monthly = monthly_investment + extra_sip
    current_corpus = savings
    
    if total_monthly > 0 or current_corpus >= fire_number:
        yr = 0
        while yr < 60:
            if current_corpus >= fire_number:
                actual_years = yr
                break
            # Compound for 12 months
            for _ in range(12):
                current_corpus = (current_corpus + total_monthly) * (1 + monthly_rate)
            yr += 1

    status = "On Track 🎯" if projected_corpus >= fire_number else "Needs Boost 📈"

    return {
        "fire_number": round(fire_number, 2),
        "projected_corpus": round(projected_corpus, 2),
        "monthly_investment": round(monthly_investment, 2),
        "required_sip": round(max(0, required_sip), 2),
        "years_to_retire": years,
        "actual_years_to_fire": actual_years,
        "shortfall": round(shortfall, 2),
        "savings_rate_percent": round(savings_rate, 1),
        "status": status,
        "annual_expenses": round(annual_expenses, 2),
    }
