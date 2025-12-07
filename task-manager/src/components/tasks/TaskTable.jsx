import React from 'react';
import TaskRow from './TaskRow';

const TaskTable = ({ tasks, selectedUser, toggleTaskStatus, setEditingTask, deleteTask }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50 border-b-2 border-gray-200">
          <tr>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Title</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Due Date</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Category</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Priority</th>
            {!selectedUser && (
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {tasks.map(task => (
            <TaskRow
              key={task.id}
              task={task}
              selectedUser={selectedUser}
              toggleTaskStatus={toggleTaskStatus}
              setEditingTask={setEditingTask}
              deleteTask={deleteTask}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TaskTable;