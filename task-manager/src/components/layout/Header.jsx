import React from 'react';
import { Search, Users } from 'lucide-react';

const Header = ({ searchQuery, setSearchQuery }) => {
  return (
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
  );
};

export default Header;