// src/components/TaskCard.jsx

export default function TaskCard({ task, onDelete, onUpdate }) {
  return (
    <div className="flex justify-between items-center bg-white p-4 rounded shadow">
      <div>
        <h2 className="text-xl font-semibold text-gray-800">{task.title}</h2>
        <p className="text-gray-600">{task.description}</p>
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => onUpdate(task)}
          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(task.id)}
          className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
