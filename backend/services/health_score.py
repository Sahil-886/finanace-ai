def calculate_health(data: dict) -> dict:
    score = 0
    breakdown = {}

    # Emergency fund (6+ months ideal)
    em = data.get("emergency_months", 0)
    if em >= 6:
        score += 20
        breakdown["emergency_fund"] = {"score": 20, "max": 20, "status": "✅ Excellent", "label": "Emergency Fund", "pct": 100, "color": "emerald"}
    elif em >= 3:
        score += 10
        breakdown["emergency_fund"] = {"score": 10, "max": 20, "status": "⚠️ Good — aim for 6 months", "label": "Emergency Fund", "pct": 50, "color": "amber"}
    else:
        breakdown["emergency_fund"] = {"score": 0, "max": 20, "status": "❌ Build your emergency fund", "label": "Emergency Fund", "pct": 10, "color": "red"}

    # Insurance
    if data.get("insurance", False):
        score += 15
        breakdown["insurance"] = {"score": 15, "max": 15, "status": "✅ Covered", "label": "Insurance Shield", "pct": 100, "color": "emerald"}
    else:
        breakdown["insurance"] = {"score": 0, "max": 15, "status": "❌ Get term + health insurance", "label": "Insurance Shield", "pct": 10, "color": "red"}

    # Investment ratio
    ir = data.get("invest_ratio", 0)
    if ir >= 0.3:
        score += 25
        breakdown["investment_ratio"] = {"score": 25, "max": 25, "status": "✅ Power investor", "label": "Investments", "pct": 100, "color": "emerald"}
    elif ir >= 0.2:
        score += 18
        breakdown["investment_ratio"] = {"score": 18, "max": 25, "status": "✅ Good — aim for 30%", "label": "Investments", "pct": 72, "color": "emerald"}
    elif ir >= 0.1:
        score += 10
        breakdown["investment_ratio"] = {"score": 10, "max": 25, "status": "⚠️ Increase investments", "label": "Investments", "pct": 40, "color": "amber"}
    else:
        breakdown["investment_ratio"] = {"score": 0, "max": 25, "status": "❌ Start investing now", "label": "Investments", "pct": 10, "color": "red"}

    # Debt ratio
    dr = data.get("debt_ratio", 1)
    if dr < 0.2:
        score += 15
        breakdown["debt"] = {"score": 15, "max": 15, "status": "✅ Low debt load", "label": "Debt Health", "pct": 100, "color": "emerald"}
    elif dr < 0.3:
        score += 10
        breakdown["debt"] = {"score": 10, "max": 15, "status": "⚠️ Manageable debt", "label": "Debt Health", "pct": 60, "color": "amber"}
    else:
        breakdown["debt"] = {"score": 0, "max": 15, "status": "❌ Reduce high-interest debt", "label": "Debt Health", "pct": 10, "color": "red"}

    # Tax saving
    if data.get("tax_saving", False):
        score += 10
        breakdown["tax_saving"] = {"score": 10, "max": 10, "status": "✅ Using 80C/NPS", "label": "Tax Savings", "pct": 100, "color": "emerald"}
    else:
        breakdown["tax_saving"] = {"score": 0, "max": 10, "status": "❌ Use 80C, NPS, HRA deductions", "label": "Tax Savings", "pct": 10, "color": "red"}

    # Retirement saving
    if data.get("retirement_saving", False):
        score += 15
        breakdown["retirement"] = {"score": 15, "max": 15, "status": "✅ Planning for future", "label": "Retirement", "pct": 100, "color": "emerald"}
    else:
        breakdown["retirement"] = {"score": 0, "max": 15, "status": "❌ Start EPF/NPS/PPF now", "label": "Retirement", "pct": 10, "color": "red"}

    if score >= 85:
        status, color = "Excellent 🌟", "green"
    elif score >= 65:
        status, color = "Good 👍", "blue"
    elif score >= 45:
        status, color = "Fair ⚠️", "yellow"
    else:
        status, color = "Needs Improvement 🔴", "red"

    top_actions = _get_top_actions(breakdown, ir)
    personality = _get_personality(dr, ir, em)

    return {
        "score": score,
        "max_score": 100,
        "status": status,
        "color": color,
        "breakdown": breakdown,
        "top_actions": top_actions,
        "personality": personality,
    }


def _get_top_actions(breakdown: dict, ir: float) -> list:
    actions = []
    
    # Priority 1: Red actions (score == 0)
    for key, val in breakdown.items():
        if val["score"] == 0:
            msg = val["status"].replace("❌ ", "")
            # Identify missed opportunities vs standard actions
            if key in ["tax_saving", "insurance", "retirement"]:
                actions.append({
                    "title": f"Missed Opportunity: {msg}", 
                    "color": "red", 
                    "bg_color": "#fee2e2", "text_color": "#b91c1c",
                    "icon": "🔴", 
                    "priority": 1
                })
            else:
                actions.append({
                    "title": msg, 
                    "color": "red", 
                    "bg_color": "#fee2e2", "text_color": "#b91c1c",
                    "icon": "🔴", 
                    "priority": 1
                })

    # Priority 2: Yellow actions (partial score)
    if len(actions) < 3:
        for key, val in breakdown.items():
            if 0 < val["score"] < val["max"]:
                msg = val["status"].replace("⚠️ ", "").replace("✅ ", "")
                actions.append({
                    "title": msg, 
                    "color": "yellow", 
                    "bg_color": "#fef3c7", "text_color": "#b45309",
                    "icon": "🟡", 
                    "priority": 2
                })

    # Priority 3: Green actions if nothing else
    if len(actions) == 0:
        if ir >= 0.3:
            actions.append({"title": "Keep holding index funds", "color": "green", "bg_color": "#d1fae5", "text_color": "#047857", "icon": "🟢", "priority": 3})
            actions.append({"title": "Review portfolio rebalancing", "color": "green", "bg_color": "#d1fae5", "text_color": "#047857", "icon": "🟢", "priority": 3})
        else:
            actions.append({"title": "Maintain exactly what you're doing", "color": "green", "bg_color": "#d1fae5", "text_color": "#047857", "icon": "🟢", "priority": 3})

    actions.sort(key=lambda x: x["priority"])
    return actions[:3]


def _get_personality(dr: float, ir: float, em: float) -> str:
    if dr >= 0.3:
        return "Debt-Focused Repairer"
    if ir >= 0.3 and dr < 0.2 and em >= 3:
        return "Aggressive Wealth Builder 🚀"
    if ir < 0.1 and em >= 6:
        return "Conservative Cash Saver 🛡️"
    if ir >= 0.1 and em >= 3:
        return "Balanced Planner ⚖️"
    return "Getting Started 🌱"
