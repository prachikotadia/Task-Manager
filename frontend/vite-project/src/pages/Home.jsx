import { useEffect, useState } from "react";
import TaskCard from "../components/TaskCard";
import axios from "axios";

// Replace with your live Render URL
const API_URL = "https://user-service-10h5.onrender.com";

export default function Home() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/user-with-tasks`);
      setTasks(res.data.tasks || []);
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return alert("Fill in all fields");
    try {
      await axios.post(`${API_URL.replace("/user-with-tasks", "")}/tasks`, { title, description });
      setTitle("");
      setDescription("");
      fetchTasks();
      alert("Task added successfully!");
    } catch (error) {
      console.error("Failed to add task:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL.replace("/user-with-tasks", "")}/tasks/${id}`);
      fetchTasks();
      alert("Task deleted!");
    } catch (error) {
      console.error("Failed to delete task:", error);
    }
  };

  const handleUpdate = async (task) => {
    const newTitle = prompt("New title", task.title);
    const newDesc = prompt("New description", task.description);
    if (newTitle && newDesc) {
      try {
        await axios.put(`${API_URL.replace("/user-with-tasks", "")}/tasks/${task.id}`, {
          title: newTitle,
          description: newDesc,
        });
        fetchTasks();
        alert("Task updated!");
      } catch (error) {
        console.error("Failed to update task:", error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-6">
      <h1 className="text-4xl font-bold mb-6 text-green-700">Task Manager</h1>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md w-full max-w-md flex flex-col gap-4"
      >
        <input
          className="border p-3 rounded focus:outline-none focus:ring-2 focus:ring-green-400"
          placeholder="Task Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          className="border p-3 rounded focus:outline-none focus:ring-2 focus:ring-green-400"
          placeholder="Task Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        ></textarea>
        <button
          type="submit"
          className="bg-green-500 text-white py-3 rounded hover:bg-green-600 transition"
        >
          Add Task
        </button>
      </form>

      {/* Task list */}
      <div className="w-full max-w-2xl mt-10 flex flex-col gap-4">
        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : tasks.length === 0 ? (
          <p className="text-center text-gray-400">No tasks yet. Add one!</p>
        ) : (
          tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onDelete={handleDelete}
              onUpdate={handleUpdate}
            />
          ))
        )}
      </div>
    </div>
  );
}
