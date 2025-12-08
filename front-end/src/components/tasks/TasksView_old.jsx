import { useState, useEffect } from "react";
import { Plus, Search, Filter } from "lucide-react";
import { taskService } from "../../services/task.service";
import CreateTaskModal from "../modals/CreateTaskModal";
import EditTaskModal from "../modals/EditTaskModal";
import TaskTable from "./TaskTable";

const TasksView = ({
  selectedUser,
  setSelectedUser,
  setShowCreateModal,
  filterPriority,
  setFilterPriority,
  filterCategory,
  setFilterCategory,
  filterStatus,
  setFilterStatus,
  categories,
  paginatedTasks,
  currentPage,
  totalPages,
  setCurrentPage,
  toggleTaskStatus,
  setEditingTask,
  deleteTask,
}) => {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold">
          {selectedUser ? `${selectedUser.name}'s Tasks` : "My Tasks"}
        </h2>
        {!selectedUser && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 bg-slate-800 text-white px-4 py-2 rounded-lg hover:bg-slate-700 transition"
          >
            <Plus className="w-5 h-5" />
            Add New Task
          </button>
        )}
      </div>

      {selectedUser && (
        <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-between">
          <span className="text-blue-900">
            Viewing tasks from: <strong>{selectedUser.name}</strong>
          </span>
          <button
            onClick={() => setSelectedUser(null)}
            className="text-blue-600 hover:text-blue-800"
          >
            Back to My Tasks
          </button>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-md p-6">
        <TaskFilters
          filterPriority={filterPriority}
          setFilterPriority={setFilterPriority}
          filterCategory={filterCategory}
          setFilterCategory={setFilterCategory}
          filterStatus={filterStatus}
          setFilterStatus={setFilterStatus}
          categories={categories}
        />

        <TaskTable
          tasks={paginatedTasks}
          selectedUser={selectedUser}
          toggleTaskStatus={toggleTaskStatus}
          setEditingTask={setEditingTask}
          deleteTask={deleteTask}
        />

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          setCurrentPage={setCurrentPage}
        />
      </div>
    </div>
  );
};

export default TasksView;
