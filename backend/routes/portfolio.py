from fastapi import APIRouter
from models.user import PortfolioInput
from services.xirr import calculate_cagr

router = APIRouter()


@router.post("/analyze")
def analyze_portfolio(data: PortfolioInput):
    investments = data.investments
    total_invested = sum(inv.amount for inv in investments)
    total_current = sum(inv.current_value for inv in investments)
    total_gain = total_current - total_invested
    total_return_pct = ((total_current - total_invested) / total_invested * 100) if total_invested > 0 else 0

    breakdown = []
    for inv in investments:
        cagr = calculate_cagr(inv.amount, inv.current_value, inv.years or 1)
        gain = inv.current_value - inv.amount
        allocation_pct = round(inv.amount / total_invested * 100, 1) if total_invested > 0 else 0
        breakdown.append({
            "name": inv.name,
            "invested": inv.amount,
            "current_value": inv.current_value,
            "gain": round(gain, 2),
            "cagr_percent": cagr,
            "allocation_percent": allocation_pct,
            "status": "📈 Profit" if gain >= 0 else "📉 Loss",
        })

    # Sort by CAGR descending
    breakdown.sort(key=lambda x: x["cagr_percent"], reverse=True)

    # Portfolio health signals
    signals = []
    if total_return_pct < 8:
        signals.append("⚠️ Portfolio returns below inflation — consider rebalancing")
    if len(investments) < 3:
        signals.append("⚠️ Low diversification — add more asset classes")
    if total_return_pct > 15:
        signals.append("✅ Excellent returns — stay consistent!")

    return {
        "total_invested": round(total_invested, 2),
        "total_current_value": round(total_current, 2),
        "total_gain": round(total_gain, 2),
        "overall_return_percent": round(total_return_pct, 2),
        "num_investments": len(investments),
        "breakdown": breakdown,
        "signals": signals,
    }
