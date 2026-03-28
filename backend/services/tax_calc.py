def calculate_tax_old(income: float, deductions: float = 0) -> float:
    """Old tax regime with standard deductions (80C, HRA etc.)"""
    taxable = max(0, income - deductions - 50000)  # 50k standard deduction

    if taxable <= 250000:
        tax = 0
    elif taxable <= 500000:
        tax = (taxable - 250000) * 0.05
    elif taxable <= 1000000:
        tax = 12500 + (taxable - 500000) * 0.20
    else:
        tax = 112500 + (taxable - 1000000) * 0.30

    # 87A rebate
    if taxable <= 500000:
        tax = 0

    # 4% cess
    tax = tax * 1.04
    return round(tax, 2)


def calculate_tax_new(income: float) -> float:
    """New tax regime (FY 2024-25) with 75k standard deduction"""
    taxable = max(0, income - 75000)  # 75k standard deduction new regime

    if taxable <= 300000:
        tax = 0
    elif taxable <= 700000:
        tax = (taxable - 300000) * 0.05
    elif taxable <= 1000000:
        tax = 20000 + (taxable - 700000) * 0.10
    elif taxable <= 1200000:
        tax = 50000 + (taxable - 1000000) * 0.15
    elif taxable <= 1500000:
        tax = 80000 + (taxable - 1200000) * 0.20
    else:
        tax = 140000 + (taxable - 1500000) * 0.30

    # 87A rebate for new regime up to 7L
    if taxable <= 700000:
        tax = 0

    # 4% cess
    tax = tax * 1.04
    return round(tax, 2)


def compare_tax(income: float, deductions: float = 0) -> dict:
    old = calculate_tax_old(income, deductions)
    new = calculate_tax_new(income)
    better = "Old Regime" if old < new else "New Regime"
    savings = abs(old - new)

    return {
        "income": income,
        "deductions_claimed": deductions,
        "old_regime_tax": old,
        "new_regime_tax": new,
        "recommended_regime": better,
        "savings": round(savings, 2),
        "savings_monthly": round(savings / 12, 2),
        "tip": f"Switch to {better} and save ₹{savings:,.0f}/year (₹{savings/12:,.0f}/month)",
    }
