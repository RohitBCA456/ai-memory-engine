from fastapi import FastAPI
from pydantic import BaseModel
import joblib

app = FastAPI()
model = joblib.load('memory_classifier.joblib')

class MemoryInput(BaseModel):
    text: str

@app.post("/predict")
async def predict(data: MemoryInput):
    prediction = model.predict([data.text])[0]
    return {"label": prediction}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=5001)