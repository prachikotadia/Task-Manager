from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

DATABASE_URL = "postgresql://task_manager_db_d9cz_user:NZYbPSCUfLL4YmYMH3EVkySstd8Rx6X8@dpg-d066fbali9vc73e20nhg-a/task_manager_db_d9cz"

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class TaskDB(Base):
    __tablename__ = "tasks"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    description = Column(String, index=True)

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Task(BaseModel):
    title: str
    description: str

@app.post("/tasks")
def create_task(task: Task):
    db = SessionLocal()
    db_task = TaskDB(title=task.title, description=task.description)
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    db.close()
    return {"id": db_task.id, "title": db_task.title, "description": db_task.description}

@app.get("/tasks")
def get_tasks():
    db = SessionLocal()
    tasks = db.query(TaskDB).all()
    db.close()
    return [{"id": task.id, "title": task.title, "description": task.description} for task in tasks]
@app.get("/")
def root():
    return {"message": "Task Service is Running!"}

@app.put("/tasks/{task_id}")
def update_task(task_id: int, updated_task: Task):
    db = SessionLocal()
    task = db.query(TaskDB).filter(TaskDB.id == task_id).first()
    if not task:
        db.close()
        raise HTTPException(status_code=404, detail="Task not found")
    task.title = updated_task.title
    task.description = updated_task.description
    db.commit()
    db.close()
    return {"message": "Task updated"}

@app.delete("/tasks/{task_id}")
def delete_task(task_id: int):
    db = SessionLocal()
    task = db.query(TaskDB).filter(TaskDB.id == task_id).first()
    if not task:
        db.close()
        raise HTTPException(status_code=404, detail="Task not found")
    db.delete(task)
    db.commit()
    db.close()
    return {"message": "Task deleted"}
