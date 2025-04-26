import { useEffect, useState } from "react";
import TaskCard from "../components/TaskCard";
import axios from "axios";

const API_URL = "http://localhost:8000"; // use your deployed URL here later

export default function Home() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const fetchTasks = async () => {
    const res = await axios.get(`${API_URL}/user-with-tasks`);
    console.log("Fetched tasks:", res.data);
    setTasks(res.data.tasks);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post("http://localhost:8001/tasks", { title, description });
    setTitle("");
    setDescription("");
    fetchTasks();
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:8001/tasks/${id}`);
    fetchTasks();
  };

  const handleUpdate = async (task) => {
    const newTitle = prompt("New title", task.title);
    const newDesc = prompt("New description", task.description);
    if (newTitle && newDesc) {
      await axios.put(`http://localhost:8001/tasks/${task.id}`, {
        title: newTitle,
        description: newDesc,
      });
      fetchTasks();
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-4">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 mb-6">
        <input
          className="p-2 border rounded"
          placeholder="Task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          className="p-2 border rounded"
          placeholder="Task description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        ></textarea>
        <button className="bg-green-500 text-white p-2 rounded">Add Task</button>
      </form>

      <div className="flex flex-col gap-4 mt- 6">
        {console.log("Current tasks state:", tasks)}
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onDelete={handleDelete}
            onUpdate={handleUpdate}
          />
        ))}
      </div>
    </div>
  );
}
