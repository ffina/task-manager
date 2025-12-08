import { useState } from "react";
import { Plus, Search } from "lucide-react";
import { taskService } from "../../services/task.service";
import CreateTaskModal from "../modals/CreateTaskModal";
import EditTaskModal from "../modals/EditTaskModal";
import TaskTable from "./TaskTable";
import Pagination from "./Pagination";
import { useToast } from "../../hooks/useToast";
import Toast from "../common/Toast";
import ConfirmDialog from "../common/ConfirmDialog";

export default function TasksView({
  tasks,
  categories,
  onRefresh,
  onRefreshCategories,
}) {
  const { toasts, removeToast, success, error } = useToast();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [filters, setFilters] = useState({
    search: "",
    priority: "",
    status: "",
    categoryId: "",
    page: 1,
    limit: 10,
  });

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value, page: 1 };
    setFilters(newFilters);
    onRefresh(newFilters);
  };

  const handlePageChange = (page) => {
    const newFilters = { ...filters, page };
    setFilters(newFilters);
    onRefresh(newFilters);
  };

  const handleToggleTask = async (taskId) => {
    try {
      await taskService.toggleTask(taskId);
      onRefresh(filters);
      success("Task updated successfully");
    } catch (err) {
      error("Failed to update task");
    }
  };

  const [confirmDelete, setConfirmDelete] = useState(null);

  const handleDeleteTask = async (taskId) => {
    setConfirmDelete(taskId);
  };

  const confirmDeleteTask = async () => {
    const taskId = confirmDelete;
    setConfirmDelete(null);

    try {
      await taskService.deleteTask(taskId);
      onRefresh(filters);
      success("Task deleted successfully");
    } catch (err) {
      error("Failed to delete task");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-gray-900">My Tasks</h2>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
        >
          <Plus className="w-5 h-5" />
          Add New Task
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6">
        {/* Filters */}
        <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={filters.search}
              onChange={(e) => handleFilterChange("search", e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <select
            value={filters.priority}
            onChange={(e) => handleFilterChange("priority", e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Priorities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>

          <select
            value={filters.status}
            onChange={(e) => handleFilterChange("status", e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>

          <select
            value={filters.categoryId}
            onChange={(e) => handleFilterChange("categoryId", e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Tasks Table */}
        <TaskTable
          tasks={tasks.data || []}
          onToggle={handleToggleTask}
          onEdit={setEditingTask}
          onDelete={handleDeleteTask}
        />

        {/* Pagination */}
        <Pagination
          currentPage={filters.page}
          totalPages={tasks.meta?.totalPages || 1}
          onPageChange={handlePageChange}
        />
      </div>

      {/* Modals */}
      <CreateTaskModal
        show={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        categories={categories}
        onSuccess={() => {
          setShowCreateModal(false);
          onRefresh(filters);
          onRefreshCategories();
        }}
      />

      <EditTaskModal
        show={!!editingTask}
        task={editingTask}
        categories={categories}
        onClose={() => setEditingTask(null)}
        onSuccess={() => {
          setEditingTask(null);
          onRefresh(filters);
        }}
      />

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        show={!!confirmDelete}
        title="Yakin Menghapus Task?"
        message="Task akan dihapus, apakah kamu yakin?"
        onConfirm={confirmDeleteTask}
        onCancel={() => setConfirmDelete(null)}
        confirmText="Ya, Yakin"
        cancelText="Batal"
        type="danger"
      />

      {/* Toast Notifications */}
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => removeToast(toast.id)}
          duration={toast.duration}
        />
      ))}
    </div>
  );
}
