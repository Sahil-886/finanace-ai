def generate_recommendations(data):
    insights = []

    if data.get("monthly_investment", 0) < 0:
        insights.append("You are overspending. Reduce expenses immediately.")

    if data.get("gap", 0) > 0:
        extra = round(data["gap"] / 100)
        insights.append(f"Increase SIP by ₹{extra}/month to reach FIRE.")

    if data.get("emergency_months", 12) < 6:
        insights.append("Build at least 6 months emergency fund.")

    return insights
