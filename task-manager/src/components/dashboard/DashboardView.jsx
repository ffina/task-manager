import React from 'react';
import { Clock, CheckCircle, Flame, Plus } from 'lucide-react';
import StatsCard from './StatsCard';
import { getDueSoonTasks, getCompletedTodayTasks, getHighPriorityTasks } from '../../utils/helpers';
import { PRIORITY_COLORS } from '../../utils/constants';

const DashboardView = ({ tasks, currentUserId, setShowCreateModal, toggleTaskStatus }) => {
  const dueSoonTasks = getDueSoonTasks(tasks, currentUserId);
  const completedTodayTasks = getCompletedTodayTasks(tasks, currentUserId);
  const highPriorityTasks = getHighPriorityTasks(tasks, currentUserId);

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">Dashboard</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatsCard
          icon={Clock}
          title="Due Soon"
          count={dueSoonTasks.length}
          bgColor="bg-blue-100 border-blue-300"
          iconColor="text-blue-600"
          textColor="text-blue-900"
        />
        <StatsCard
          icon={CheckCircle}
          title="Completed Today"
          count={completedTodayTasks.length}
          bgColor="bg-green-100 border-green-300"
          iconColor="text-green-600"
          textColor="text-green-900"
        />
        <StatsCard
          icon={Flame}
          title="High Priority"
          count={highPriorityTasks.length}
          bgColor="bg-orange-100 border-orange-300"
          iconColor="text-orange-600"
          textColor="text-orange-900"
        />
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
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${PRIORITY_COLORS[task.priority]}`}>
                {task.priority}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardView;