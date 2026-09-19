from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from tutor import ask_scigenai

app = FastAPI(title="SciGenAI Service")

class QuestionRequest(BaseModel):
    question: str

@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/ask")
def ask(request: QuestionRequest):
    try:
        answer = ask_scigenai(request.question)
        return {
            "question": request.question,
            "answer": answer
        }
    except Exception as e:
        raise HTTPException(
            status_code = 503,
            detail = f"AI is offline: {str(e)}"
        )