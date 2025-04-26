from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

import httpx

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # You can restrict this to ["http://localhost:5173"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

TASK_SERVICE_URL = "http://localhost:8001"

@app.get("/user-with-tasks")
async def user_with_tasks():
    user_info = {"name": "Prachi", "role": "admin"}
    async with httpx.AsyncClient() as client:
        response = await client.get(f"{TASK_SERVICE_URL}/tasks")
        tasks = response.json()
    return {"user": user_info, "tasks": tasks}


@app.get("/")
def root():
    return {"message": "hello"}

