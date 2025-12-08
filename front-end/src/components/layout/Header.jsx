import { Menu, Bell, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Header({
  user,
  onToggleSidebar,
  onNavigateToDashboard,
}) {
  const navigate = useNavigate();

  const handleSettingsClick = () => {
    navigate("/settings");
  };

  return (
    <div className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition"
            title="Toggle Sidebar"
          >
            <Menu className="w-6 h-6 text-gray-700" />
          </button>
          <div
            onClick={onNavigateToDashboard}
            className="cursor-pointer hover:opacity-80 transition"
            title="Go to Dashboard"
          >
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Task Manager
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Manage your tasks efficiently
            </p>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3">
          {/* Notifications */}
          <button className="relative p-2 hover:bg-gray-100 rounded-lg transition">
            <Bell className="w-5 h-5 text-gray-600" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* Settings */}
          <button
            onClick={handleSettingsClick}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
            title="Profile Settings"
          >
            <Settings className="w-5 h-5 text-gray-600" />
          </button>

          {/* User Profile */}
          <div className="flex items-center gap-3 pl-3 border-l border-gray-200">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-gray-900">
                {user?.fullName || user?.username}
              </p>
              <p className="text-xs text-gray-500">{user?.email}</p>
            </div>
            {user?.avatarPath ? (
              <img
                src={`http://localhost:3001/${user.avatarPath.replace(
                  /\\/g,
                  "/"
                )}`}
                alt={user?.username}
                className="w-10 h-10 rounded-full object-cover border-2 border-gray-200 shadow-lg cursor-pointer hover:border-blue-500 transition"
                onClick={handleSettingsClick}
                title="View Profile"
              />
            ) : (
              <div
                className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg cursor-pointer hover:scale-110 transition"
                onClick={handleSettingsClick}
                title="View Profile"
              >
                {user?.username?.charAt(0).toUpperCase() || "U"}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
