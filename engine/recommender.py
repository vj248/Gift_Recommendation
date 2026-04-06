from engine.pruner import load_gifts, prune
from engine.scorer import compute_utility
from engine.bayesian import delivery_probability, is_delivery_risky
from models.schemas import UserProfile, GiftScore

def get_recommendations(user_profile: UserProfile, top_n: int = 4):
    all_gifts = load_gifts()
    total_before = len(all_gifts)

    # Step 1: Prune infeasible candidates
    candidates = prune(all_gifts, user_profile)
    total_after = len(candidates)

    # Step 2: Score each candidate
    scored = []
    for gift in candidates:
        scores = compute_utility(gift, user_profile)
        prob = delivery_probability(
            gift.get("courier", "Unknown"),
            user_profile.city_tier,
            gift["delivery_days"]
        )
        risk = is_delivery_risky(prob)

        scored.append(GiftScore(
            id=gift["id"],
            name=gift["name"],
            category=gift["category"],
            price_inr=gift["price_inr"],
            platform=gift["platform"],
            utility_score=scores["utility_score"],
            preference_score=scores["preference_score"],
            budget_score=scores["budget_score"],
            delivery_score=scores["delivery_score"],
            novelty_score=scores["novelty_score"],
            delivery_probability=prob,
            delivery_risk=risk
        ))

    # Step 3: Greedy best-first sort by utility
    scored.sort(key=lambda x: x.utility_score, reverse=True)

    return scored[:top_n], total_before, total_after