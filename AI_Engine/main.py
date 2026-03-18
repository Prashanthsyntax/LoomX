from fastapi import FastAPI # type: ignore
from routers import ai_advisor

app = FastAPI()

app.include_router(ai_advisor.router)

@app.get("/")
def home():
    return {"message": "LoomX Backend Running"}