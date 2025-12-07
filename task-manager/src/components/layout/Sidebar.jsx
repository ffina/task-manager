import React from 'react';
import { Home, CheckCircle, Tag, Users, Settings, List } from 'lucide-react';

const Sidebar = ({ currentView, setCurrentView, setSelectedUser }) => {
  const menuItems = [
    { id: 'dashboard', icon: Home, label: 'Dashboard' },
    { id: 'tasks', icon: CheckCircle, label: 'My Tasks' },
    { id: 'categories', icon: Tag, label: 'Categories' },
    { id: 'users', icon: Users, label: 'Other Users' },
    { id: 'settings', icon: Settings, label: 'Settings' }
  ];

  const handleMenuClick = (viewId) => {
    setCurrentView(viewId);
    if (viewId === 'dashboard' || viewId === 'tasks') {
      setSelectedUser(null);
    }
  };

  return (
    <div className="w-64 bg-slate-800 text-white">
      <div className="p-6 border-b border-slate-700">
        <div className="flex items-center gap-2">
          <List className="w-8 h-8" />
          <h1 className="text-2xl font-bold">TaskFlow</h1>
        </div>
      </div>

      <nav className="p-4 space-y-2">
        {menuItems.map(item => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => handleMenuClick(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                currentView === item.id ? 'bg-slate-700' : 'hover:bg-slate-700'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default Sidebar;