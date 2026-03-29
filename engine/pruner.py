import json
from typing import List, Dict

def load_gifts(path: str = "knowledge_base/gifts.json") -> List[Dict]:
    with open(path, "r") as f:
        return json.load(f)

def prune(gifts: List[Dict], user_profile) -> List[Dict]:
    """
    R1: Discard if price > budget_max
    R2: Discard if delivery_days > urgency_days
    R3: Discard if availability is False
    R4: Discard if occasion not in gift's suitability list
    R5: Discard if city tier not supported
    R6: Discard if recipient relation not in recipient_tags
    """
    filtered = []

    for gift in gifts:
        # R1 - Budget hard cap
        if gift["price_inr"] > user_profile.budget_max:
            continue

        # R2 - Delivery urgency
        if gift["delivery_days"] > user_profile.urgency_days:
            continue

        # R3 - Availability
        if not gift["availability"]:
            continue

        # R4 - Occasion suitability
        if user_profile.occasion not in gift["suitability"]:
            continue

        # R5 - City tier delivery support
        if user_profile.city_tier not in gift["city_tier_availability"]:
            continue

        # R6 - Recipient tag match
        if user_profile.relation not in gift["recipient_tags"]:
            continue

        filtered.append(gift)

    return filtered