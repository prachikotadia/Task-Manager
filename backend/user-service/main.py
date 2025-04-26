from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import httpx
import os

app = FastAPI()

# CORSMiddleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For now allow all origins, later we can restrict
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Read from environment
TASK_SERVICE_URL = os.getenv("TASK_SERVICE_URL")

@app.get("/")
def root():
    return {"message": "User-service is working"}

@app.get("/user-with-tasks")
async def user_with_tasks():
    if not TASK_SERVICE_URL:
        raise HTTPException(status_code=500, detail="TASK_SERVICE_URL is missing!")
    
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(f"{TASK_SERVICE_URL}/tasks")
            response.raise_for_status()  # If not 200, this will raise
            tasks = response.json()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch tasks: {str(e)}")

    user_info = {
        "name": "Prachi",
        "role": "admin"
    }

    return {"user": user_info, "tasks": tasks}
