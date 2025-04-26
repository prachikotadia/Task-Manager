import React from "react";

const TaskCard = ({ task, onDelete, onUpdate }) => {
  return (
    <div className="p-6 bg-white rounded-lg shadow hover:shadow-lg transition flex flex-col gap-2">
      <h2 className="text-2xl font-semibold text-green-700">{task.title}</h2>
      <p className="text-gray-600">{task.description}</p>
      <div className="flex gap-4 mt-2">
        <button
          onClick={() => onUpdate(task)}
          className="bg-blue-100 text-blue-700 px-4 py-2 rounded hover:bg-blue-200"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(task.id)}
          className="bg-red-100 text-red-700 px-4 py-2 rounded hover:bg-red-200"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default TaskCard;
