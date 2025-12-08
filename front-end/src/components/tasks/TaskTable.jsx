import TaskRow from "./TaskRow";

export default function TaskTable({ tasks, onToggle, onEdit, onDelete }) {
  if (tasks.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p className="text-lg">No tasks found</p>
        <p className="text-sm mt-2">Create your first task to get started!</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50 border-b-2 border-gray-200">
          <tr>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
              Status
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
              Title
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
              Description
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
              Due Date
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
              Category
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
              Priority
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {tasks.map((task) => (
            <TaskRow
              key={task.id}
              task={task}
              onToggle={onToggle}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
