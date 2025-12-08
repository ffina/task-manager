import { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { authService } from "../services/auth.service";
import { taskService } from "../services/task.service";
import { categoryService } from "../services/category.service";
import { userService } from "../services/user.service";

// Layout
import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";

// Views
import DashboardView from "../components/dashboard/DashboardView";
import TasksView from "../components/tasks/TasksView";
import CategoriesView from "../components/categories/CategoriesView";
import UsersView from "../components/users/UserView";
import ProfileView from "../components/settings/ProfileView";

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState({ data: [], meta: {} });
  const [categories, setCategories] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      const currentUser = authService.getCurrentUser();
      setUser(currentUser);

      const [tasksData, categoriesData, usersData] = await Promise.all([
        taskService.getTasks(),
        categoryService.getCategories(),
        userService.getUsers(),
      ]);

      setTasks(tasksData);
      setCategories(categoriesData);
      setUsers(usersData);
    } catch (error) {
      console.error("Failed to load data:", error);
    } finally {
      setLoading(false);
    }
  };

  const refreshUserProfile = async () => {
    try {
      const profile = await userService.getProfile();
      // Update user in state
      setUser(profile);
      // Update user in localStorage using authService
      authService.updateCurrentUser(profile);
    } catch (error) {
      console.error("Failed to refresh user profile:", error);
    }
  };

  const handleLogout = () => {
    authService.logout();
    navigate("/login");
  };

  const refreshTasks = async (params = {}) => {
    try {
      const tasksData = await taskService.getTasks(params);
      setTasks(tasksData);
    } catch (error) {
      console.error("Failed to refresh tasks:", error);
    }
  };

  const refreshCategories = async () => {
    try {
      const categoriesData = await categoryService.getCategories();
      setCategories(categoriesData);
    } catch (error) {
      console.error("Failed to refresh categories:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Sidebar
        user={user}
        onLogout={handleLogout}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />

      <div
        className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${
          sidebarOpen ? "lg:ml-0" : "lg:ml-0"
        }`}
      >
        <Header
          user={user}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          onNavigateToDashboard={() => navigate("/")}
        />

        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            <Routes>
              <Route
                path="/"
                element={
                  <DashboardView
                    tasks={tasks}
                    categories={categories}
                    users={users}
                  />
                }
              />
              <Route
                path="/tasks"
                element={
                  <TasksView
                    tasks={tasks}
                    categories={categories}
                    onRefresh={refreshTasks}
                    onRefreshCategories={refreshCategories}
                  />
                }
              />
              <Route
                path="/categories"
                element={
                  <CategoriesView
                    categories={categories}
                    onRefresh={refreshCategories}
                  />
                }
              />
              <Route path="/users" element={<UsersView users={users} />} />
              <Route
                path="/settings"
                element={<ProfileView onProfileUpdate={refreshUserProfile} />}
              />
            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
}
