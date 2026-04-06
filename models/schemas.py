from pydantic import BaseModel
from typing import List, Optional

class UserProfile(BaseModel):
    relation: str           # "parent", "friend", "partner", "colleague", "teacher"
    age_group: str          # "child", "teen", "adult", "senior"
    occasion: str           # "Diwali", "Birthday", etc.
    budget_min: float
    budget_max: float
    urgency_days: int       # how many days until the occasion
    interests: List[str]    # ["art", "tech", "cooking", ...]
    city_tier: int          # 1, 2, or 3
    previously_recommended: Optional[List[str]] = []  # list of gift IDs to penalize

class GiftScore(BaseModel):
    id: str
    name: str
    category: str
    price_inr: float
    platform: str
    utility_score: float
    preference_score: float
    budget_score: float
    delivery_score: float
    novelty_score: float
    delivery_probability: float
    delivery_risk: bool
    explanation: Optional[str] = None

class RecommendationResponse(BaseModel):
    top_recommendations: List[GiftScore]
    total_candidates_before_pruning: int
    total_candidates_after_pruning: int