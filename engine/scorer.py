import numpy as np
from typing import List, Dict

# All possible interest tags in the system
ALL_INTERESTS = [
    "art", "culture", "writing", "spirituality", "home",
    "tech", "gadgets", "fashion", "fitness", "travel",
    "cooking", "music", "books", "memories", "gaming",
    "beauty", "nature", "sports"
]

WEIGHTS = {
    "preference": 0.35,
    "budget": 0.30,
    "delivery": 0.25,
    "novelty": 0.10
}

def encode_vector(tags: List[str]) -> np.ndarray:
    """Convert a list of interest tags to a one-hot vector."""
    vec = np.zeros(len(ALL_INTERESTS))
    for tag in tags:
        if tag in ALL_INTERESTS:
            vec[ALL_INTERESTS.index(tag)] = 1.0
    return vec

def preference_score(user_interests: List[str], gift_interest_vector: List[str]) -> float:
    u = encode_vector(user_interests)
    g = encode_vector(gift_interest_vector)
    # Cosine similarity
    norm = np.linalg.norm(u) * np.linalg.norm(g)
    if norm == 0:
        return 0.0
    return float(np.dot(u, g) / norm)

def budget_score(price: float, budget_min: float, budget_max: float) -> float:
    if price < budget_min or price > budget_max:
        return 0.0
    mid = (budget_min + budget_max) / 2
    spread = (budget_max - budget_min) / 2 or 1  # avoid division by zero
    return 1.0 - abs(price - mid) / (budget_max - budget_min)

def delivery_score(delivery_days: int, urgency_days: int) -> float:
    if urgency_days == 0:
        return 1.0 if delivery_days == 0 else 0.0
    if delivery_days > urgency_days:
        return 0.0
    return 1.0 - (delivery_days / urgency_days)

def novelty_score(gift: Dict, previously_recommended: List[str]) -> float:
    # Penalize if this gift was shown before
    base = gift.get("novelty_score", 0.5)
    if gift["id"] in previously_recommended:
        return base * 0.3  # heavy penalty
    return base

def compute_utility(gift: Dict, user_profile) -> Dict:
    P = preference_score(user_profile.interests, gift["interest_vector"])
    B = budget_score(gift["price_inr"], user_profile.budget_min, user_profile.budget_max)
    D = delivery_score(gift["delivery_days"], user_profile.urgency_days)
    N = novelty_score(gift, user_profile.previously_recommended or [])

    U = (
        WEIGHTS["preference"] * P +
        WEIGHTS["budget"] * B +
        WEIGHTS["delivery"] * D +
        WEIGHTS["novelty"] * N
    )

    return {
        "preference_score": round(P, 4),
        "budget_score": round(B, 4),
        "delivery_score": round(D, 4),
        "novelty_score": round(N, 4),
        "utility_score": round(U, 4)
    }