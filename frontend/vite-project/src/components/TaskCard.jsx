import React from "react";

const TaskCard = ({ task, onDelete, onUpdate }) => {
  return (
    <div className="p-4 rounded-md bg-white text-black border border-gray-300 shadow">
      <h2 className="text-xl font-semibold">{task.title}</h2>
      <p className="text-gray-700 mt-1">{task.description}</p>
      <div className="mt-3 flex gap-4 text-sm">
        <button
          onClick={() => onUpdate(task)}
          className="text-blue-600 underline hover:text-blue-800"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(task.id)}
          className="text-red-600 underline hover:text-red-800"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default TaskCard;
