from fastapi import APIRouter
from pydantic import BaseModel

from AI_Engine.financial_analyzer import analyze_user
from AI_Engine.prompt_builder import build_prompt
from AI_Engine.llm_engine import generate_response

router = APIRouter()

class AIRequest(BaseModel):
    question: str

@router.post("/ai-advisor")
def ai_advisor(req: AIRequest):

    # Replace this with DB fetch later
    user_data = {
        "credit_score": 620,
        "total_limit": 100000,
        "used_credit": 78000,
        "late_payments": 2,
        "credit_age": 2
    }

    analysis = analyze_user(user_data)
    prompt = build_prompt(analysis, req.question)
    answer = generate_response(prompt)

    return {"answer": answer}