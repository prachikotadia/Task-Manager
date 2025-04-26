from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "https://your-vercel-app.vercel.app", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


tasks = []
task_id_counter = 1

class Task(BaseModel):
    title: str
    description: str

@app.post("/tasks")
def create_task(task: Task):
    global task_id_counter
    task_data = {"id": task_id_counter, "title": task.title, "description": task.description}
    tasks.append(task_data)
    task_id_counter += 1
    return task_data

@app.get("/tasks")
def get_tasks():
    return tasks

@app.put("/tasks/{task_id}")
def update_task(task_id: int, updated_task: Task):
    for task in tasks:
        if task["id"] == task_id:
            task["title"] = updated_task.title
            task["description"] = updated_task.description
            return task
    raise HTTPException(status_code=404, detail="Task not found")

@app.delete("/tasks/{task_id}")
def delete_task(task_id: int):
    for task in tasks:
        if task["id"] == task_id:
            tasks.remove(task)
            return {"message": "Task deleted"}
    raise HTTPException(status_code=404, detail="Task not found")
