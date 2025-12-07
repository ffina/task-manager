import React, { useState, useEffect } from 'react';
import { Search, Plus, X, Calendar, Tag, FileText, Users, Settings, Home, List, Clock, CheckCircle, Flame, Edit2, Trash2, Filter, ChevronLeft, ChevronRight } from 'lucide-react';

const TaskManagerApp = () => {
  const [currentView, setCurrentView] = useState('dashboard');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: 'Project Proposal',
      description: 'Complete the Q4 project proposal',
      priority: 'high',
      dueDate: '2024-07-25',
      category: 'Work',
      status: 'pending',
      userId: 1,
      files: []
    },
    {
      id: 2,
      title: 'Grocery Shopping',
      description: 'Buy groceries for the week',
      priority: 'low',
      dueDate: '2024-07-24',
      category: 'Personal',
      status: 'pending',
      userId: 1,
      files: []
    },
    {
      id: 3,
      title: 'Team Meeting',
      description: 'Weekly team sync',
      priority: 'medium',
      dueDate: '2024-07-25',
      category: 'Work',
      status: 'completed',
      userId: 1,
      files: []
    }
  ]);
  
  const [categories, setCategories] = useState([
    { id: 1, name: 'Work', color: 'blue' },
    { id: 2, name: 'Personal', color: 'purple' },
    { id: 3, name: 'Shopping', color: 'green' },
    { id: 4, name: 'Health', color: 'red' }
  ]);

  const [users] = useState([
    { id: 1, name: 'You', email: 'you@example.com' },
    { id: 2, name: 'John Doe', email: 'john@example.com' },
    { id: 3, name: 'Jane Smith', email: 'jane@example.com' }
  ]);

  const [currentUserId, setCurrentUserId] = useState(1);
  const [selectedUser, setSelectedUser] = useState(null);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPriority, setFilterPriority] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  
  const [editingTask, setEditingTask] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const tasksPerPage = 5;

  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium',
    dueDate: '',
    category: 'Work',
    files: []
  });

  const [newCategory, setNewCategory] = useState({ name: '', color: 'blue' });
  const [showCategoryModal, setShowCategoryModal] = useState(false);

  const priorityColors = {
    low: 'bg-green-100 text-green-800 border-green-300',
    medium: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    high: 'bg-red-100 text-red-800 border-red-300'
  };

  const categoryColors = {
    blue: 'bg-blue-500',
    purple: 'bg-purple-500',
    green: 'bg-green-500',
    red: 'bg-red-500',
    yellow: 'bg-yellow-500',
    pink: 'bg-pink-500'
  };

  // Filter tasks
  const getFilteredTasks = () => {
    let filtered = tasks.filter(task => {
      // If viewing other user's tasks
      if (selectedUser) {
        return task.userId === selectedUser.id;
      }
      return task.userId === currentUserId;
    });

    if (searchQuery) {
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (filterPriority !== 'all') {
      filtered = filtered.filter(task => task.priority === filterPriority);
    }

    if (filterCategory !== 'all') {
      filtered = filtered.filter(task => task.category === filterCategory);
    }

    if (filterStatus !== 'all') {
      filtered = filtered.filter(task => task.status === filterStatus);
    }

    return filtered;
  };

  // Pagination
  const filteredTasks = getFilteredTasks();
  const totalPages = Math.ceil(filteredTasks.length / tasksPerPage);
  const startIndex = (currentPage - 1) * tasksPerPage;
  const paginatedTasks = filteredTasks.slice(startIndex, startIndex + tasksPerPage);

  // Dashboard stats
  const dueSoonTasks = tasks.filter(task => {
    const today = new Date();
    const dueDate = new Date(task.dueDate);
    const diffDays = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));
    return diffDays <= 3 && diffDays >= 0 && task.status === 'pending' && task.userId === currentUserId;
  });

  const completedTodayTasks = tasks.filter(task => {
    const today = new Date().toISOString().split('T')[0];
    return task.status === 'completed' && task.userId === currentUserId;
  });

  const highPriorityTasks = tasks.filter(task => 
    task.priority === 'high' && task.status === 'pending' && task.userId === currentUserId
  );

  // Create task
  const handleCreateTask = () => {
    if (!newTask.title) {
      alert('Please enter a task title');
      return;
    }

    const task = {
      id: tasks.length + 1,
      ...newTask,
      status: 'pending',
      userId: currentUserId
    };

    setTasks([...tasks, task]);
    setShowCreateModal(false);
    setNewTask({
      title: '',
      description: '',
      priority: 'medium',
      dueDate: '',
      category: 'Work',
      files: []
    });
  };

  // Toggle task completion
  const toggleTaskStatus = (taskId) => {
    setTasks(tasks.map(task =>
      task.id === taskId
        ? { ...task, status: task.status === 'completed' ? 'pending' : 'completed' }
        : task
    ));
  };

  // Delete task
  const deleteTask = (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      setTasks(tasks.filter(task => task.id !== taskId));
    }
  };

  // Edit task
  const handleEditTask = () => {
    if (!editingTask.title) {
      alert('Please enter a task title');
      return;
    }

    setTasks(tasks.map(task =>
      task.id === editingTask.id ? editingTask : task
    ));
    setEditingTask(null);
  };

  // Create category
  const handleCreateCategory = () => {
    if (!newCategory.name) {
      alert('Please enter a category name');
      return;
    }

    setCategories([...categories, { id: categories.length + 1, ...newCategory }]);
    setShowCategoryModal(false);
    setNewCategory({ name: '', color: 'blue' });
  };

  // File upload handler
  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    setNewTask({ ...newTask, files: [...newTask.files, ...files.map(f => f.name)] });
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-slate-800 text-white">
        <div className="p-6 border-b border-slate-700">
          <div className="flex items-center gap-2">
            <List className="w-8 h-8" />
            <h1 className="text-2xl font-bold">TaskFlow</h1>
          </div>
        </div>

        <nav className="p-4 space-y-2">
          <button
            onClick={() => { setCurrentView('dashboard'); setSelectedUser(null); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
              currentView === 'dashboard' ? 'bg-slate-700' : 'hover:bg-slate-700'
            }`}
          >
            <Home className="w-5 h-5" />
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => { setCurrentView('tasks'); setSelectedUser(null); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
              currentView === 'tasks' ? 'bg-slate-700' : 'hover:bg-slate-700'
            }`}
          >
            <CheckCircle className="w-5 h-5" />
            <span>My Tasks</span>
          </button>

          <button
            onClick={() => setCurrentView('categories')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
              currentView === 'categories' ? 'bg-slate-700' : 'hover:bg-slate-700'
            }`}
          >
            <Tag className="w-5 h-5" />
            <span>Categories</span>
          </button>

          <button
            onClick={() => setCurrentView('users')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
              currentView === 'users' ? 'bg-slate-700' : 'hover:bg-slate-700'
            }`}
          >
            <Users className="w-5 h-5" />
            <span>Other Users</span>
          </button>

          <button
            onClick={() => setCurrentView('settings')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
              currentView === 'settings' ? 'bg-slate-700' : 'hover:bg-slate-700'
            }`}
          >
            <Settings className="w-5 h-5" />
            <span>Settings</span>
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <div className="bg-slate-800 text-white p-6 shadow-lg">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <div className="flex-1 max-w-xl">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search tasks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
            <div className="flex items-center gap-4 ml-4">
              <button className="p-2 hover:bg-slate-700 rounded-lg transition">
                <Users className="w-6 h-6" />
              </button>
              <button className="p-2 hover:bg-slate-700 rounded-lg transition">
                <div className="w-6 h-6 bg-blue-500 rounded-full" />
              </button>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-6 max-w-7xl mx-auto">
          {currentView === 'dashboard' && (
            <div>
              <h2 className="text-3xl font-bold mb-6">Dashboard</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-blue-100 border-2 border-blue-300 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <Clock className="w-8 h-8 text-blue-600" />
                    <h3 className="text-lg font-semibold text-blue-900">Due Soon</h3>
                  </div>
                  <p className="text-3xl font-bold text-blue-900">{dueSoonTasks.length}</p>
                </div>

                <div className="bg-green-100 border-2 border-green-300 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                    <h3 className="text-lg font-semibold text-green-900">Completed Today</h3>
                  </div>
                  <p className="text-3xl font-bold text-green-900">{completedTodayTasks.length}</p>
                </div>

                <div className="bg-orange-100 border-2 border-orange-300 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <Flame className="w-8 h-8 text-orange-600" />
                    <h3 className="text-lg font-semibold text-orange-900">High Priority</h3>
                  </div>
                  <p className="text-3xl font-bold text-orange-900">{highPriorityTasks.length}</p>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold">Recent Tasks</h3>
                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="flex items-center gap-2 bg-slate-800 text-white px-4 py-2 rounded-lg hover:bg-slate-700 transition"
                  >
                    <Plus className="w-5 h-5" />
                    Add New Task
                  </button>
                </div>

                <div className="space-y-3">
                  {tasks.slice(0, 5).map(task => (
                    <div key={task.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                      <input
                        type="checkbox"
                        checked={task.status === 'completed'}
                        onChange={() => toggleTaskStatus(task.id)}
                        className="w-5 h-5"
                      />
                      <div className="flex-1">
                        <h4 className={`font-semibold ${task.status === 'completed' ? 'line-through text-gray-500' : ''}`}>
                          {task.title}
                        </h4>
                        <p className="text-sm text-gray-600">{task.dueDate}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${priorityColors[task.priority]}`}>
                        {task.priority}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {currentView === 'tasks' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold">
                  {selectedUser ? `${selectedUser.name}'s Tasks` : 'My Tasks'}
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
                  <span className="text-blue-900">Viewing tasks from: <strong>{selectedUser.name}</strong></span>
                  <button
                    onClick={() => setSelectedUser(null)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Back to My Tasks
                  </button>
                </div>
              )}

              <div className="bg-white rounded-xl shadow-md p-6">
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
                      {paginatedTasks.map(task => (
                        <tr key={task.id} className="hover:bg-gray-50">
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
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${priorityColors[task.priority]}`}>
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
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-6">
                    <button
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <span className="px-4 py-2">
                      Page {currentPage} of {totalPages}
                    </span>
                    <button
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {currentView === 'categories' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold">Categories</h2>
                <button
                  onClick={() => setShowCategoryModal(true)}
                  className="flex items-center gap-2 bg-slate-800 text-white px-4 py-2 rounded-lg hover:bg-slate-700 transition"
                >
                  <Plus className="w-5 h-5" />
                  Add Category
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categories.map(category => (
                  <div key={category.id} className="bg-white rounded-xl shadow-md p-6">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 ${categoryColors[category.color]} rounded-lg`} />
                      <div>
                        <h3 className="font-semibold text-lg">{category.name}</h3>
                        <p className="text-sm text-gray-600">
                          {tasks.filter(t => t.category === category.name).length} tasks
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {currentView === 'users' && (
            <div>
              <h2 className="text-3xl font-bold mb-6">Other Users</h2>

              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {users.filter(u => u.id !== currentUserId).map(user => (
                    <div key={user.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                            {user.name.charAt(0)}
                          </div>
                          <div>
                            <h3 className="font-semibold">{user.name}</h3>
                            <p className="text-sm text-gray-600">{user.email}</p>
                            <p className="text-xs text-gray-500 mt-1">
                              {tasks.filter(t => t.userId === user.id).length} tasks
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            setSelectedUser(user);
                            setCurrentView('tasks');
                          }}
                          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                        >
                          View Tasks
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {currentView === 'settings' && (
            <div>
              <h2 className="text-3xl font-bold mb-6">Settings</h2>

              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-xl font-semibold mb-4">Email Notifications</h3>
                <div className="space-y-4">
                  <label className="flex items-center gap-3">
                    <input type="checkbox" defaultChecked className="w-5 h-5" />
                    <span>Send email reminder 1 day before task deadline</span>
                  </label>
                  <label className="flex items-center gap-3">
                    <input type="checkbox" defaultChecked className="w-5 h-5" />
                    <span>Daily summary of pending tasks</span>
                  </label>
                  <label className="flex items-center gap-3">
                    <input type="checkbox" className="w-5 h-5" />
                    <span>Weekly task report</span>
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Create Task Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Create New Task</h2>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Task Title</label>
                  <input
                    type="text"
                    value={newTask.title}
                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                    placeholder="Enter task title"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <textarea
                    value={newTask.description}
                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                    placeholder="Enter task description"
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Priority</label>
                    <select
                      value={newTask.priority}
                      onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Due Date</label>
                    <input
                      type="date"
                      value={newTask.dueDate}
                      onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Category</label>
                  <select
                    value={newTask.category}
                    onChange={(e) => setNewTask({ ...newTask, category: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  >
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.name}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">File Upload (Optional)</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                    <input
                      type="file"
                      multiple
                      onChange={handleFileUpload}
                      className="hidden"
                      id="file-upload"
                    />
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <FileText className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                      <p className="text-sm text-gray-600">Click to upload files</p>
                    </label>
                    {newTask.files.length > 0 && (
                      <div className="mt-2 text-sm text-gray-700">
                        {newTask.files.length} file(s) selected
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={handleCreateTask}
                    className="flex-1 bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition font-medium"
                  >
                    Save Task
                  </button>
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Task Modal */}
      {editingTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Edit Task</h2>
                <button
                  onClick={() => setEditingTask(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Task Title</label>
                  <input
                    type="text"
                    value={editingTask.title}
                    onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <textarea
                    value={editingTask.description}
                    onChange={(e) => setEditingTask({ ...editingTask, description: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Priority</label>
                    <select
                      value={editingTask.priority}
                      onChange={(e) => setEditingTask({ ...editingTask, priority: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Due Date</label>
                    <input
                      type="date"
                      value={editingTask.dueDate}
                      onChange={(e) => setEditingTask({ ...editingTask, dueDate: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Category</label>
                  <select
                    value={editingTask.category}
                    onChange={(e) => setEditingTask({ ...editingTask, category: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  >
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.name}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={handleEditTask}
                    className="flex-1 bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition font-medium"
                  >
                    Update Task
                  </button>
                  <button
                    onClick={() => setEditingTask(null)}
                    className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Category Modal */}
      {showCategoryModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Create Category</h2>
                <button
                  onClick={() => setShowCategoryModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Category Name</label>
                  <input
                    type="text"
                    value={newCategory.name}
                    onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                    placeholder="Enter category name"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Color</label>
                  <div className="grid grid-cols-6 gap-2">
                    {Object.keys(categoryColors).map(color => (
                      <button
                        key={color}
                        onClick={() => setNewCategory({ ...newCategory, color })}
                        className={`w-12 h-12 rounded-lg ${categoryColors[color]} ${
                          newCategory.color === color ? 'ring-4 ring-offset-2 ring-blue-400' : ''
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={handleCreateCategory}
                    className="flex-1 bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition font-medium"
                  >
                    Create Category
                  </button>
                  <button
                    onClick={() => setShowCategoryModal(false)}
                    className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskManagerApp