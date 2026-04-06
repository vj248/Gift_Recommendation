from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from models.schemas import UserProfile, RecommendationResponse
from engine.recommender import get_recommendations
import google.generativeai as genai
import os

# Configure Gemini API
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

# Load model
model = genai.GenerativeModel("gemini-1.5-flash")

app = FastAPI(title="Gift Recommender API", version="1.0")

# Allow frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# 🔥 Gemini Explanation Function
def generate_explanation(gift, user_profile: UserProfile) -> str:
    prompt = f"""
    You are a warm and thoughtful Indian gift advisor.

    Gift: {gift.name} (₹{gift.price_inr}) from {gift.platform}
    Occasion: {user_profile.occasion}
    Recipient: {user_profile.relation}
    Interests: {', '.join(user_profile.interests)}

    Write exactly 2 short sentences explaining why this gift is perfect.
    Keep it simple, warm, and culturally relevant.
    """

    response = model.generate_content(prompt)
    return response.text


@app.get("/")
def root():
    return {"message": "Gift Recommender API is running 🚀"}


@app.post("/recommend", response_model=RecommendationResponse)
def recommend(user_profile: UserProfile):
    try:
        top_gifts, before, after = get_recommendations(user_profile)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Recommendation engine error: {str(e)}")

    if not top_gifts:
        raise HTTPException(
            status_code=404,
            detail="No gifts found. Try increasing budget or delivery time."
        )

    # Add Gemini explanations
    for gift in top_gifts:
        try:
            gift.explanation = generate_explanation(gift, user_profile)
        except Exception:
            gift.explanation = "A thoughtful gift that matches your preferences and budget."

    return RecommendationResponse(
        top_recommendations=top_gifts,
        total_candidates_before_pruning=before,
        total_candidates_after_pruning=after
    )


@app.get("/occasions")
def get_occasions():
    return {
        "occasions": [
            "Diwali", "Raksha Bandhan", "Holi", "Eid", "Christmas",
            "Birthday", "Wedding", "Babyshower", "Graduation",
            "Teacher's Day", "Farewell", "Housewarming", "Navratri", "Onam"
        ]
    }


@app.get("/interests")
def get_interests():
    return {
        "interests": [
            "art", "culture", "writing", "spirituality", "home",
            "tech", "gadgets", "fashion", "fitness", "travel",
            "cooking", "music", "books", "memories", "gaming",
            "beauty", "nature", "sports"
        ]
    }