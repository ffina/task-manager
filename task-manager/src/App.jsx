import React, { useState } from 'react';

// Layout Components
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';

// View Components
import DashboardView from './components/dashboard/DashboardView';
import TasksView from './components/tasks/TasksView';
import CategoriesView from './components/categories/CategoriesView';
import UsersView from './components/users/UserView';
import SettingsView from './components/settings/SettingsView';

// Modal Components
import CreateTaskModal from './components/modals/CreateTaskModal';
import EditTaskModal from './components/modals/EditTaskModal';
import CreateCategoryModal from './components/modals/CreateCategoryModal';

// Data and Utils
import { initialTasks, initialCategories, initialUsers } from './data/initialData';
import { filterTasksByUser } from './utils/helpers';
import { TASKS_PER_PAGE } from './utils/constants';

const App = () => {
  // View State
  const [currentView, setCurrentView] = useState('dashboard');
  
  // Data State
  const [tasks, setTasks] = useState(initialTasks);
  const [categories, setCategories] = useState(initialCategories);
  const [users] = useState(initialUsers);
  
  // User State
  const [currentUserId] = useState(1);
  const [selectedUser, setSelectedUser] = useState(null);
  
  // Search and Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPriority, setFilterPriority] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  
  // Modal State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  
  // Task Form State
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium',
    dueDate: '',
    category: 'Work',
    files: []
  });
  
  // Category Form State
  const [newCategory, setNewCategory] = useState({ name: '', color: 'blue' });

  // Filter tasks logic
  const getFilteredTasks = () => {
    let filtered = filterTasksByUser(tasks, currentUserId, selectedUser);

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

  // Pagination logic
  const filteredTasks = getFilteredTasks();
  const totalPages = Math.ceil(filteredTasks.length / TASKS_PER_PAGE);
  const startIndex = (currentPage - 1) * TASKS_PER_PAGE;
  const paginatedTasks = filteredTasks.slice(startIndex, startIndex + TASKS_PER_PAGE);

  // Task CRUD Operations
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

  const toggleTaskStatus = (taskId) => {
    setTasks(tasks.map(task =>
      task.id === taskId
        ? { ...task, status: task.status === 'completed' ? 'pending' : 'completed' }
        : task
    ));
  };

  const deleteTask = (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      setTasks(tasks.filter(task => task.id !== taskId));
    }
  };

  // Category Operations
  const handleCreateCategory = () => {
    if (!newCategory.name) {
      alert('Please enter a category name');
      return;
    }

    setCategories([...categories, { id: categories.length + 1, ...newCategory }]);
    setShowCategoryModal(false);
    setNewCategory({ name: '', color: 'blue' });
  };

  // File Upload Handler
  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    setNewTask({ ...newTask, files: [...newTask.files, ...files.map(f => f.name)] });
  };

  // Render view based on currentView
  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return (
          <DashboardView
            tasks={tasks}
            currentUserId={currentUserId}
            setShowCreateModal={setShowCreateModal}
            toggleTaskStatus={toggleTaskStatus}
          />
        );
      
      case 'tasks':
        return (
          <TasksView
            selectedUser={selectedUser}
            setSelectedUser={setSelectedUser}
            setShowCreateModal={setShowCreateModal}
            filterPriority={filterPriority}
            setFilterPriority={setFilterPriority}
            filterCategory={filterCategory}
            setFilterCategory={setFilterCategory}
            filterStatus={filterStatus}
            setFilterStatus={setFilterStatus}
            categories={categories}
            paginatedTasks={paginatedTasks}
            currentPage={currentPage}
            totalPages={totalPages}
            setCurrentPage={setCurrentPage}
            toggleTaskStatus={toggleTaskStatus}
            setEditingTask={setEditingTask}
            deleteTask={deleteTask}
          />
        );
      
      case 'categories':
        return (
          <CategoriesView
            categories={categories}
            tasks={tasks}
            setShowCategoryModal={setShowCategoryModal}
          />
        );
      
      case 'users':
        return (
          <UsersView
            users={users}
            currentUserId={currentUserId}
            tasks={tasks}
            setSelectedUser={setSelectedUser}
            setCurrentView={setCurrentView}
          />
        );
      
      case 'settings':
        return <SettingsView />;
      
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar
        currentView={currentView}
        setCurrentView={setCurrentView}
        setSelectedUser={setSelectedUser}
      />

      <div className="flex-1 overflow-auto">
        <Header
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        <div className="p-6 max-w-7xl mx-auto">
          {renderView()}
        </div>
      </div>

      {/* Modals */}
      <CreateTaskModal
        showCreateModal={showCreateModal}
        setShowCreateModal={setShowCreateModal}
        newTask={newTask}
        setNewTask={setNewTask}
        categories={categories}
        handleCreateTask={handleCreateTask}
        handleFileUpload={handleFileUpload}
      />

      <EditTaskModal
        editingTask={editingTask}
        setEditingTask={setEditingTask}
        categories={categories}
        handleEditTask={handleEditTask}
      />

      <CreateCategoryModal
        showCategoryModal={showCategoryModal}
        setShowCategoryModal={setShowCategoryModal}
        newCategory={newCategory}
        setNewCategory={setNewCategory}
        handleCreateCategory={handleCreateCategory}
      />
    </div>
  );
};

export default App;