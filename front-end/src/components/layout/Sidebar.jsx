import { Link, useLocation } from "react-router-dom";
import {
  CheckCircle,
  Tag,
  Users,
  LogOut,
  LayoutDashboard,
  Menu,
  X,
  Settings,
} from "lucide-react";

export default function Sidebar({ user, onLogout, isOpen, onToggle }) {
  const location = useLocation();

  const menuItems = [
    { path: "/", icon: LayoutDashboard, label: "Dashboard" },
    { path: "/tasks", icon: CheckCircle, label: "My Tasks" },
    { path: "/categories", icon: Tag, label: "Categories" },
    { path: "/users", icon: Users, label: "Other Users" },
    { path: "/settings", icon: Settings, label: "Settings" },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed lg:static inset-y-0 left-0 z-50 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white flex flex-col transition-all duration-300 ease-in-out shadow-2xl ${
          isOpen
            ? "w-64 translate-x-0"
            : "w-0 lg:w-20 -translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Header */}
        <div
          className={`p-4 border-b border-slate-700/50 ${
            isOpen ? "px-6" : "px-2"
          }`}
        >
          {isOpen ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg flex-shrink-0">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <div className="min-w-0">
                  <h1 className="text-lg font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent truncate">
                    TaskFlow
                  </h1>
                  <p className="text-xs text-slate-400 truncate">
                    Manage your tasks
                  </p>
                </div>
              </div>
              <button
                onClick={onToggle}
                className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors flex-shrink-0"
                title="Close Sidebar"
              >
                <X className="w-5 h-5 text-slate-400 hover:text-white" />
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg">
                <CheckCircle className="w-6 h-6" />
              </div>
              <button
                onClick={onToggle}
                className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors"
                title="Open Sidebar"
              >
                <Menu className="w-5 h-5 text-slate-400 hover:text-white" />
              </button>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav
          className={`flex-1 py-4 space-y-1 overflow-y-auto ${
            isOpen ? "px-3" : "px-2"
          }`}
        >
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => window.innerWidth < 1024 && isOpen && onToggle()}
                className={`group flex items-center rounded-lg transition-all duration-200 ${
                  isOpen ? "gap-3 px-4 py-3" : "flex-col gap-1 px-2 py-3"
                } ${
                  isActive
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg"
                    : "text-slate-300 hover:bg-slate-700/50 hover:text-white"
                }`}
                title={!isOpen ? item.label : ""}
              >
                <Icon
                  className={`w-5 h-5 flex-shrink-0 ${
                    isActive
                      ? "text-white"
                      : "text-slate-400 group-hover:text-white"
                  }`}
                />
                {isOpen ? (
                  <>
                    <span className="font-medium truncate">{item.label}</span>
                    {isActive && (
                      <div className="ml-auto w-1.5 h-1.5 bg-white rounded-full flex-shrink-0" />
                    )}
                  </>
                ) : (
                  <span className="text-xs text-slate-400 group-hover:text-white truncate w-full text-center">
                    {item.label.split(" ")[0]}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer - Logout */}
        <div
          className={`p-4 border-t border-slate-700/50 ${
            isOpen ? "px-3" : "px-2"
          }`}
        >
          <button
            onClick={onLogout}
            className={`w-full flex items-center rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-all duration-200 border border-red-500/20 ${
              isOpen ? "gap-3 px-4 py-3" : "flex-col gap-1 px-2 py-3"
            }`}
            title={!isOpen ? "Logout" : ""}
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {isOpen ? (
              <span className="font-medium">Logout</span>
            ) : (
              <span className="text-xs">Out</span>
            )}
          </button>
        </div>
      </div>
    </>
  );
}
