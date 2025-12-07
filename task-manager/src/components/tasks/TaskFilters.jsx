import React from 'react';

const TaskFilters = ({ 
  filterPriority, 
  setFilterPriority, 
  filterCategory, 
  setFilterCategory, 
  filterStatus, 
  setFilterStatus,
  categories 
}) => {
  return (
    <div className="flex gap-4 mb-6 flex-wrap">
      <select
        value={filterPriority}
        onChange={(e) => setFilterPriority(e.target.value)}
        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
      >
        <option value="all">All Priorities</option>
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>

      <select
        value={filterCategory}
        onChange={(e) => setFilterCategory(e.target.value)}
        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
      >
        <option value="all">All Categories</option>
        {categories.map(cat => (
          <option key={cat.id} value={cat.name}>{cat.name}</option>
        ))}
      </select>

      <select
        value={filterStatus}
        onChange={(e) => setFilterStatus(e.target.value)}
        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
      >
        <option value="all">All Status</option>
        <option value="pending">Pending</option>
        <option value="completed">Completed</option>
      </select>
    </div>
  );
};

export default TaskFilters;