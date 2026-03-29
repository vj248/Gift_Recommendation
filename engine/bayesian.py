import json

def load_courier_data(path: str = "knowledge_base/courier_data.json") -> dict:
    with open(path, "r") as f:
        return json.load(f)

COURIER_DATA = load_courier_data()

def delivery_probability(courier: str, city_tier: int, delivery_days: int) -> float:
    """
    Posterior P(on_time | courier, city_tier, urgency)
    Adjusted downward for tighter delivery windows.
    """
    tier_key = f"tier{city_tier}"

    if courier not in COURIER_DATA:
        # Unknown courier — conservative estimate
        base_rate = 0.65
    elif tier_key not in COURIER_DATA[courier]:
        base_rate = 0.65
    else:
        base_rate = COURIER_DATA[courier][tier_key]["on_time_rate"]

    # Bayesian adjustment: same-day and next-day harder to guarantee
    if delivery_days == 0:
        return round(base_rate * 0.65, 3)
    elif delivery_days == 1:
        return round(base_rate * 0.80, 3)
    elif delivery_days == 2:
        return round(base_rate * 0.90, 3)
    else:
        return round(base_rate, 3)

def is_delivery_risky(prob: float, threshold: float = 0.75) -> bool:
    return prob < threshold