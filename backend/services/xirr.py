from datetime import datetime

def xnpv(rate, cashflows):
    return sum(cf / (1 + rate) ** ((d - cashflows[0][0]).days / 365.0)
               for d, cf in cashflows)

def xirr(cashflows, guess=0.1):
    if not cashflows or len(cashflows) < 2:
        return 0.0
    
    rate = guess
    for _ in range(100):
        try:
            f = xnpv(rate, cashflows)
            df = sum(
                -(d - cashflows[0][0]).days / 365.0 * cf /
                (1 + rate) ** (((d - cashflows[0][0]).days / 365.0) + 1)
                for d, cf in cashflows
            )
            if abs(df) < 1e-10: 
                break
            rate -= f / df
        except Exception:
            return 0.0
    return rate

def calculate_cagr(initial_value, final_value, years):
    if initial_value <= 0 or years <= 0:
        return 0.0
    return ((final_value / initial_value) ** (1 / years) - 1) * 100
