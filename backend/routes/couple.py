from fastapi import APIRouter

router = APIRouter()

# ── Indian tax slab helpers ──────────────────────────────────────────────────

def _annual_tax_old(annual: float, deductions: float = 0) -> float:
    """Old regime tax with standard deductions."""
    taxable = max(0, annual - deductions - 50000)  # 50k standard deduction
    tax = 0.0
    slabs = [(250000, 0), (250000, 0.05), (500000, 0.20), (float("inf"), 0.30)]
    for slab, rate in slabs:
        if taxable <= 0:
            break
        chunk = min(taxable, slab)
        tax += chunk * rate
        taxable -= chunk
    # 4% cess
    return tax * 1.04

def _annual_tax_new(annual: float) -> float:
    """New regime tax (FY 2024-25 slabs)."""
    taxable = max(0, annual - 75000)  # 75k standard deduction new regime
    tax = 0.0
    slabs = [
        (300000, 0.00), (300000, 0.05), (300000, 0.10),
        (300000, 0.15), (300000, 0.20), (float("inf"), 0.30),
    ]
    for slab, rate in slabs:
        if taxable <= 0:
            break
        chunk = min(taxable, slab)
        tax += chunk * rate
        taxable -= chunk
    return tax * 1.04


# ── HRA Optimizer ────────────────────────────────────────────────────────────

def _hra_exemption(basic: float, hra_received: float, rent_paid: float, metro: bool) -> float:
    """Calculate HRA exemption — minimum of three values."""
    actual_hra = hra_received
    rent_minus_10 = max(0, rent_paid - 0.10 * basic)
    pct_basic = 0.50 * basic if metro else 0.40 * basic
    return min(actual_hra, rent_minus_10, pct_basic)


# ── NPS optimizer ─────────────────────────────────────────────────────────────

def _nps_benefit(annual_income: float, existing_80c: float, employer_nps_pct: float = 0.10) -> dict:
    """
    80CCD(1):  up to 10% of basic (part of 1.5L 80C limit)
    80CCD(1B): additional 50k independent of 80C limit
    80CCD(2):  employer NPS — not capped, not included in 80C
    Returns recommended contributions and tax saving.
    """
    basic = annual_income * 0.40
    # Employer NPS (80CCD2) — pure bonus if employer offers
    employer_nps = basic * employer_nps_pct
    # Employee NPS 80CCD(1B) — additional 50k
    additional_nps = 50000
    # Existing 80C headroom
    c80_headroom = max(0, 150000 - existing_80c)
    employee_nps_80c = min(basic * 0.10, c80_headroom)

    total_deduction = employer_nps + additional_nps + employee_nps_80c
    tax_saved = _annual_tax_old(annual_income, existing_80c) - _annual_tax_old(annual_income, existing_80c + total_deduction)

    return {
        "employer_nps": round(employer_nps),
        "employee_nps_80ccd1b": round(additional_nps),
        "employee_nps_80c_portion": round(employee_nps_80c),
        "total_nps_deduction": round(total_deduction),
        "estimated_tax_saved": round(tax_saved),
    }


# ── SIP Split ────────────────────────────────────────────────────────────────

def _sip_allocation(partner: dict) -> dict:
    """
    Recommend SIP split based on age, risk tolerance, and savings surplus.
    """
    monthly_surplus = partner["income"] - partner["expenses"]
    if monthly_surplus <= 0:
        return {"elss": 0, "equity_index": 0, "debt": 0, "liquid": 0, "total": 0, "note": "No surplus to invest"}

    age = int(partner.get("age") or 30)
    equity_pct = max(0.40, min(0.90, (100 - age) / 100))
    debt_pct = 1 - equity_pct

    # ELSS gets priority for 80C benefit if under 1.5L/yr limit
    elss_monthly = min(monthly_surplus * 0.30, 12500)  # max 1.5L/yr = 12.5k/mo
    remaining = monthly_surplus - elss_monthly
    equity_index = remaining * equity_pct * 0.70
    debt_fund = remaining * debt_pct * 0.70
    liquid = remaining * 0.30

    return {
        "elss": round(elss_monthly),
        "equity_index": round(equity_index),
        "debt": round(debt_fund),
        "liquid": round(liquid),
        "total": round(monthly_surplus * 0.70),  # invest 70% of surplus
        "note": f"{int(equity_pct * 100)}% equity / {int(debt_pct * 100)}% debt based on age {age}",
    }


# ── Insurance recommendations ─────────────────────────────────────────────────

def _insurance_plan(partner_a: dict, partner_b: dict) -> dict:
    income_a = partner_a["income"] * 12
    income_b = partner_b["income"] * 12

    # Term life = 10-12x annual income
    term_a = income_a * 10
    term_b = income_b * 10

    # Health insurance — individual vs floater
    individual_premium = 12000 + 12000  # rough estimate per person
    floater_premium = 18000             # family floater
    floater_saving = individual_premium - floater_premium

    # Current fragmented estimate
    fragmented_premium = round((income_a + income_b) * 0.015)   # 1.5% income
    optimized_premium  = round((income_a + income_b) * 0.011)   # 1.1% income

    return {
        "partner_a_term_cover": round(term_a),
        "partner_b_term_cover": round(term_b),
        "individual_health_premium": individual_premium,
        "floater_health_premium": floater_premium,
        "floater_saving": floater_saving,
        "current_fragmented_annual": fragmented_premium,
        "optimized_joint_annual": optimized_premium,
        "annual_saving": fragmented_premium - optimized_premium,
        "recommendation": (
            "Switch to a ₹" + f"{round((term_a + term_b)/100000)}L combined cover. "
            "A joint family floater health plan saves ₹" +
            f"{floater_saving:,}/yr vs separate policies."
        ),
    }


# ── Combined net worth tracker ────────────────────────────────────────────────

def _net_worth(partner_a: dict, partner_b: dict) -> dict:
    sa = float(partner_a.get("savings") or 0)
    sb = float(partner_b.get("savings") or 0)
    combined = sa + sb
    monthly_invest = (
        (partner_a["income"] - partner_a["expenses"]) +
        (partner_b["income"] - partner_b["expenses"])
    )
    # Simple projection: combined savings + 10 yr at 12% CAGR on monthly SIP
    projected_10yr = combined * (1.12 ** 10) + monthly_invest * 12 * (((1.12 ** 10) - 1) / 0.12)
    return {
        "partner_a_savings": round(sa),
        "partner_b_savings": round(sb),
        "combined_savings": round(combined),
        "monthly_investable_surplus": round(monthly_invest),
        "projected_10yr_corpus": round(projected_10yr),
    }


# ── Harmony Index ─────────────────────────────────────────────────────────────

def _harmony_score(partner_a: dict, partner_b: dict, nps_a: dict, nps_b: dict, sip_a: dict, sip_b: dict) -> int:
    score = 0
    # Both investing
    if sip_a["total"] > 0: score += 20
    if sip_b["total"] > 0: score += 20
    # NPS used
    if nps_a["total_nps_deduction"] > 0: score += 15
    if nps_b["total_nps_deduction"] > 0: score += 15
    # Savings rate combined
    combined_income = partner_a["income"] + partner_b["income"]
    combined_surplus = (partner_a["income"] - partner_a["expenses"]) + (partner_b["income"] - partner_b["expenses"])
    savings_rate = combined_surplus / combined_income if combined_income > 0 else 0
    if savings_rate >= 0.30: score += 30
    elif savings_rate >= 0.20: score += 20
    elif savings_rate >= 0.10: score += 10
    return min(score, 100)


# ── Main analyze endpoint ─────────────────────────────────────────────────────

@router.post("/analyze")
def analyze_couple(data: dict):
    pa = data.get("partner_a", {})
    pb = data.get("partner_b", {})

    # Normalize monthly values
    for p in [pa, pb]:
        p["income"]   = float(p.get("income")   or 0)
        p["expenses"] = float(p.get("expenses")  or 0)
        p["savings"]  = float(p.get("savings")   or 0)

    # HRA
    hra_a = _hra_exemption(
        basic=pa["income"] * 12 * 0.40,
        hra_received=pa["income"] * 12 * 0.20,
        rent_paid=float(pa.get("rent") or 0) * 12,
        metro=pa.get("metro", True),
    )
    hra_b = _hra_exemption(
        basic=pb["income"] * 12 * 0.40,
        hra_received=pb["income"] * 12 * 0.20,
        rent_paid=float(pb.get("rent") or 0) * 12,
        metro=pb.get("metro", True),
    )

    # NPS
    nps_a = _nps_benefit(pa["income"] * 12, existing_80c=float(pa.get("existing_80c") or 0))
    nps_b = _nps_benefit(pb["income"] * 12, existing_80c=float(pb.get("existing_80c") or 0))

    # SIP
    sip_a = _sip_allocation(pa)
    sip_b = _sip_allocation(pb)

    # Insurance
    insurance = _insurance_plan(pa, pb)

    # Net worth
    net_worth = _net_worth(pa, pb)

    # Harmony score
    harmony = _harmony_score(pa, pb, nps_a, nps_b, sip_a, sip_b)

    # Tax comparison (old vs new) per partner annually
    def tax_compare(p):
        annual = p["income"] * 12
        old_tax = _annual_tax_old(annual, deductions=150000)
        new_tax = _annual_tax_new(annual)
        return {
            "old_regime": round(old_tax),
            "new_regime": round(new_tax),
            "recommended": "Old Regime" if old_tax < new_tax else "New Regime",
            "saving": round(abs(old_tax - new_tax)),
        }

    total_tax_saved = (
        nps_a["estimated_tax_saved"] +
        nps_b["estimated_tax_saved"] +
        insurance["annual_saving"]
    )

    return {
        "hra": {
            "partner_a": round(hra_a),
            "partner_b": round(hra_b),
            "recommendation": (
                f"Claim HRA under {pa.get('name','Partner A')} "
                if hra_a >= hra_b
                else f"Claim HRA under {pb.get('name','Partner B')} "
            ) + f"saving ₹{round(max(hra_a, hra_b)):,}/yr",
        },
        "nps": {
            "partner_a": nps_a,
            "partner_b": nps_b,
        },
        "sip": {
            "partner_a": sip_a,
            "partner_b": sip_b,
        },
        "insurance": insurance,
        "net_worth": net_worth,
        "tax": {
            "partner_a": tax_compare(pa),
            "partner_b": tax_compare(pb),
        },
        "harmony_score": harmony,
        "total_annual_tax_saved": round(total_tax_saved),
        "summary": (
            f"By optimizing HRA, NPS, and SIP routing, your household can save ₹{round(total_tax_saved):,}/yr in taxes "
            f"and be on track for a ₹{round(net_worth['projected_10yr_corpus']/100000):,}L corpus in 10 years."
        ),
    }
