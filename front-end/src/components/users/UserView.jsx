import { useState } from "react";
import { Search, Eye, X } from "lucide-react";
import { userService } from "../../services/user.service";

export default function UserView({ users }) {
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [userTasks, setUserTasks] = useState({ data: [], meta: {} });
  const [loading, setLoading] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const openImageModal = (task) => {
    setSelectedImage(task);
    setShowImageModal(true);
  };

  const closeImageModal = () => {
    setShowImageModal(false);
    setSelectedImage(null);
  };

  const filteredUsers = users.filter(
    (user) =>
      user.username.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase())
  );

  const viewUserTasks = async (user) => {
    setSelectedUser(user);
    setLoading(true);
    try {
      const tasks = await userService.getUserTasks(user.id);
      setUserTasks(tasks);
    } catch (error) {
      console.error("Failed to load user tasks");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-900 mb-6">Other Users</h2>

      {!selectedUser ? (
        <>
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search users..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredUsers.map((user) => (
              <div
                key={user.id}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition"
              >
                <div className="flex items-center gap-3 mb-4">
                  {user.avatarPath ? (
                    <img
                      src={`http://localhost:3001/${user.avatarPath.replace(
                        /\\/g,
                        "/"
                      )}`}
                      alt={user.username}
                      className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {user.username.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {user.username}
                    </h3>
                    <p className="text-sm text-gray-600">{user.email}</p>
                  </div>
                </div>
                {user.fullName && (
                  <p className="text-sm text-gray-700 mb-4">{user.fullName}</p>
                )}
                <button
                  onClick={() => viewUserTasks(user)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                >
                  <Eye className="w-4 h-4" />
                  View Public Tasks
                </button>
              </div>
            ))}
          </div>

          {filteredUsers.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <p>No users found</p>
            </div>
          )}
        </>
      ) : (
        <>
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-between">
            <span className="text-blue-900">
              Viewing public tasks from:{" "}
              <strong>{selectedUser.username}</strong>
            </span>
            <button
              onClick={() => setSelectedUser(null)}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Back to Users
            </button>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-md">
              {userTasks.data.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b-2 border-gray-200">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                          Title
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                          Priority
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                          Status
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                          Category
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {userTasks.data.map((task) => (
                        <tr key={task.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3">
                            <div>
                              <p className="font-medium text-gray-900">
                                {task.title}
                              </p>
                              {task.description && (
                                <p className="text-sm text-gray-600 line-clamp-1">
                                  {task.description}
                                </p>
                              )}
                              {task.filePath && (
                                <div className="mt-2">
                                  <img
                                    src={`http://localhost:3001/${task.filePath.replace(
                                      /\\/g,
                                      "/"
                                    )}`}
                                    alt={task.fileName || "Task image"}
                                    className="w-20 h-20 object-cover rounded-lg border border-gray-200 cursor-pointer hover:opacity-80 transition"
                                    onClick={() => openImageModal(task)}
                                  />
                                  <p className="text-xs text-gray-500 mt-1">
                                    {task.fileName}
                                  </p>
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium ${
                                task.priority === "high"
                                  ? "bg-red-100 text-red-800"
                                  : task.priority === "medium"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-green-100 text-green-800"
                              }`}
                            >
                              {task.priority}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium ${
                                task.completed
                                  ? "bg-green-100 text-green-800"
                                  : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {task.completed ? "Completed" : "Pending"}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-700">
                            {task.category?.name || "-"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <p>No public tasks from this user</p>
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* Image Modal */}
      {showImageModal && selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[9999] p-4"
          onClick={closeImageModal}
        >
          <div
            className="relative max-w-4xl max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-white">
                  {selectedImage.title}
                </h3>
                <p className="text-blue-100 text-sm">
                  {selectedImage.fileName}
                </p>
              </div>
              <button
                onClick={closeImageModal}
                className="text-white hover:bg-white/20 p-2 rounded-lg transition"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Image */}
            <div className="p-6 flex items-center justify-center bg-gray-50">
              <img
                src={`http://localhost:3001/${selectedImage.filePath.replace(
                  /\\/g,
                  "/"
                )}`}
                alt={selectedImage.fileName}
                className="max-w-full max-h-[70vh] object-contain rounded-lg shadow-lg"
              />
            </div>

            {/* Info */}
            {selectedImage.description && (
              <div className="px-6 py-4 border-t border-gray-200 bg-white">
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">Description:</span>{" "}
                  {selectedImage.description}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
