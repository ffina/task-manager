import { Edit2, Trash2, FileText, Image } from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";

const PRIORITY_COLORS = {
  low: "bg-green-100 text-green-800",
  medium: "bg-yellow-100 text-yellow-800",
  high: "bg-red-100 text-red-800",
};

export default function TaskRow({ task, onToggle, onEdit, onDelete }) {
  const [showImageModal, setShowImageModal] = useState(false);

  return (
    <>
      <tr className="hover:bg-gray-50">
        <td className="px-4 py-3">
          <input
            type="checkbox"
            checked={task.completed}
            onChange={() => onToggle(task.id)}
            className="w-5 h-5 rounded border-gray-300 text-blue-500 focus:ring-blue-500"
          />
        </td>
        <td className="px-4 py-3">
          <h4
            className={`font-medium ${
              task.completed ? "line-through text-gray-500" : "text-gray-900"
            }`}
          >
            {task.title}
          </h4>
          {task.fileName && (
            <div className="flex items-center gap-2 mt-1">
              <button
                onClick={() => setShowImageModal(true)}
                className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 hover:underline"
              >
                <Image className="w-3 h-3" />
                {task.fileName}
              </button>
            </div>
          )}
        </td>
        <td className="px-4 py-3 text-sm text-gray-700">
          <div className="space-y-2">
            {task.description ? (
              <span className="line-clamp-2">{task.description}</span>
            ) : (
              <span className="text-gray-400 italic">No description</span>
            )}
            {task.filePath && (
              <div>
                <img
                  src={`http://localhost:3001/${task.filePath.replace(
                    /\\/g,
                    "/"
                  )}`}
                  alt={task.fileName}
                  className="w-20 h-20 object-cover rounded-lg border border-gray-200 cursor-pointer hover:opacity-80 transition"
                  onClick={() => setShowImageModal(true)}
                />
              </div>
            )}
          </div>
        </td>
        <td className="px-4 py-3 text-sm text-gray-700">
          {task.dueDate ? format(new Date(task.dueDate), "MMM dd, yyyy") : "-"}
        </td>
        <td className="px-4 py-3">
          {task.category ? (
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
              {task.category.name}
            </span>
          ) : (
            <span className="text-gray-400 text-xs">No category</span>
          )}
        </td>
        <td className="px-4 py-3">
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              PRIORITY_COLORS[task.priority]
            }`}
          >
            {task.priority}
          </span>
        </td>
        <td className="px-4 py-3">
          <div className="flex gap-2">
            <button
              onClick={() => onEdit(task)}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
              title="Edit task"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(task.id)}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
              title="Delete task"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </td>
      </tr>

      {/* Image Modal */}
      {showImageModal && task.filePath && (
        <tr>
          <td colSpan="7" className="p-0">
            <div
              className="fixed inset-0 bg-black bg-opacity-75 z-[9999] flex items-center justify-center p-4"
              onClick={() => setShowImageModal(false)}
            >
              <div
                className="relative max-w-4xl max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-white">
                      {task.title}
                    </h3>
                    <p className="text-blue-100 text-sm">{task.fileName}</p>
                  </div>
                  <button
                    onClick={() => setShowImageModal(false)}
                    className="text-white hover:bg-white/20 p-2 rounded-lg transition"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                {/* Image */}
                <div className="p-6 flex items-center justify-center bg-gray-50">
                  <img
                    src={`http://localhost:3001/${task.filePath.replace(
                      /\\/g,
                      "/"
                    )}`}
                    alt={task.fileName}
                    className="max-w-full max-h-[70vh] object-contain rounded-lg shadow-lg"
                  />
                </div>

                {/* Info */}
                {task.description && (
                  <div className="px-6 py-4 border-t border-gray-200 bg-white">
                    <p className="text-sm text-gray-700">
                      <span className="font-semibold">Description:</span>{" "}
                      {task.description}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}
