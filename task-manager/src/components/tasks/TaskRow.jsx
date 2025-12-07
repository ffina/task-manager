import React from 'react';
import { Edit2, Trash2 } from 'lucide-react';
import { PRIORITY_COLORS } from '../../utils/constants';

const TaskRow = ({ task, selectedUser, toggleTaskStatus, setEditingTask, deleteTask }) => {
  return (
    <tr className="hover:bg-gray-50">
      <td className="px-4 py-3">
        <input
          type="checkbox"
          checked={task.status === 'completed'}
          onChange={() => !selectedUser && toggleTaskStatus(task.id)}
          disabled={selectedUser}
          className="w-5 h-5"
        />
      </td>
      <td className="px-4 py-3">
        <div>
          <h4 className={`font-medium ${task.status === 'completed' ? 'line-through text-gray-500' : ''}`}>
            {task.title}
          </h4>
          <p className="text-sm text-gray-600">{task.description}</p>
        </div>
      </td>
      <td className="px-4 py-3 text-sm text-gray-700">{task.dueDate}</td>
      <td className="px-4 py-3">
        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
          {task.category}
        </span>
      </td>
      <td className="px-4 py-3">
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${PRIORITY_COLORS[task.priority]}`}>
          {task.priority}
        </span>
      </td>
      {!selectedUser && (
        <td className="px-4 py-3">
          <div className="flex gap-2">
            <button
              onClick={() => setEditingTask(task)}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => deleteTask(task.id)}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </td>
      )}
    </tr>
  );
};

export default TaskRow;