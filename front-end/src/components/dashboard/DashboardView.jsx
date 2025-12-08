import {
  CheckCircle2,
  Clock,
  AlertCircle,
  TrendingUp,
  Tag,
  Users,
} from "lucide-react";
import { format, isToday, isTomorrow, isPast } from "date-fns";

export default function DashboardView({ tasks, categories, users }) {
  const taskList = tasks.data || [];

  // Calculate statistics
  const stats = {
    total: taskList.length,
    completed: taskList.filter((t) => t.completed).length,
    pending: taskList.filter((t) => !t.completed).length,
    overdue: taskList.filter(
      (t) => !t.completed && t.dueDate && isPast(new Date(t.dueDate))
    ).length,
    dueToday: taskList.filter(
      (t) => !t.completed && t.dueDate && isToday(new Date(t.dueDate))
    ).length,
    dueTomorrow: taskList.filter(
      (t) => !t.completed && t.dueDate && isTomorrow(new Date(t.dueDate))
    ).length,
    high: taskList.filter((t) => !t.completed && t.priority === "high").length,
    medium: taskList.filter((t) => !t.completed && t.priority === "medium")
      .length,
    low: taskList.filter((t) => !t.completed && t.priority === "low").length,
  };

  const completionRate =
    stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

  // Upcoming tasks (due soon, not completed)
  const upcomingTasks = taskList
    .filter((t) => !t.completed && t.dueDate)
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    .slice(0, 5);

  const statCards = [
    {
      title: "Total Tasks",
      value: stats.total,
      icon: CheckCircle2,
      color: "blue",
      gradient: "from-blue-500 to-blue-600",
    },
    {
      title: "Completed",
      value: stats.completed,
      icon: CheckCircle2,
      color: "green",
      gradient: "from-green-500 to-green-600",
    },
    {
      title: "Pending",
      value: stats.pending,
      icon: Clock,
      color: "yellow",
      gradient: "from-yellow-500 to-yellow-600",
    },
    {
      title: "Overdue",
      value: stats.overdue,
      icon: AlertCircle,
      color: "red",
      gradient: "from-red-500 to-red-600",
    },
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 text-white shadow-lg">
        <h1 className="text-4xl font-bold mb-2">Welcome to Your Dashboard!</h1>
        <p className="text-blue-100 text-lg">
          Here's an overview of your tasks and progress
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.title}
              className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden animate-slideUp"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className={`bg-gradient-to-r ${stat.gradient} p-6`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white text-opacity-90 text-sm font-medium mb-1">
                      {stat.title}
                    </p>
                    <p className="text-white text-4xl font-bold">
                      {stat.value}
                    </p>
                  </div>
                  <Icon className="w-12 h-12 text-white text-opacity-80" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Completion Progress */}
        <div
          className="bg-white rounded-xl shadow-md p-6 animate-slideUp"
          style={{ animationDelay: "400ms" }}
        >
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp className="w-6 h-6 text-blue-500" />
            <h2 className="text-xl font-bold text-gray-900">Completion Rate</h2>
          </div>
          <div className="space-y-4">
            <div className="relative pt-1">
              <div className="flex mb-2 items-center justify-between">
                <span className="text-2xl font-bold text-blue-600">
                  {completionRate}%
                </span>
                <span className="text-sm text-gray-600">
                  {stats.completed} of {stats.total} tasks
                </span>
              </div>
              <div className="overflow-hidden h-4 text-xs flex rounded-full bg-blue-100">
                <div
                  style={{ width: `${completionRate}%` }}
                  className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-1000 ease-out"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-4">
              <div className="text-center p-3 bg-red-50 rounded-lg">
                <p className="text-2xl font-bold text-red-600">{stats.high}</p>
                <p className="text-xs text-gray-600 mt-1">High Priority</p>
              </div>
              <div className="text-center p-3 bg-yellow-50 rounded-lg">
                <p className="text-2xl font-bold text-yellow-600">
                  {stats.medium}
                </p>
                <p className="text-xs text-gray-600 mt-1">Medium Priority</p>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <p className="text-2xl font-bold text-green-600">{stats.low}</p>
                <p className="text-xs text-gray-600 mt-1">Low Priority</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div
          className="bg-white rounded-xl shadow-md p-6 animate-slideUp"
          style={{ animationDelay: "500ms" }}
        >
          <div className="flex items-center gap-3 mb-4">
            <Clock className="w-6 h-6 text-blue-500" />
            <h2 className="text-xl font-bold text-gray-900">Quick Stats</h2>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-red-50 to-red-100 rounded-lg border-l-4 border-red-500">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <span className="font-medium text-gray-900">Due Today</span>
              </div>
              <span className="text-2xl font-bold text-red-600">
                {stats.dueToday}
              </span>
            </div>
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-lg border-l-4 border-yellow-500">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-yellow-600" />
                <span className="font-medium text-gray-900">Due Tomorrow</span>
              </div>
              <span className="text-2xl font-bold text-yellow-600">
                {stats.dueTomorrow}
              </span>
            </div>
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg border-l-4 border-purple-500">
              <div className="flex items-center gap-3">
                <Tag className="w-5 h-5 text-purple-600" />
                <span className="font-medium text-gray-900">Categories</span>
              </div>
              <span className="text-2xl font-bold text-purple-600">
                {categories.length}
              </span>
            </div>
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-indigo-50 to-indigo-100 rounded-lg border-l-4 border-indigo-500">
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-indigo-600" />
                <span className="font-medium text-gray-900">Other Users</span>
              </div>
              <span className="text-2xl font-bold text-indigo-600">
                {users.length}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Upcoming Tasks */}
      {upcomingTasks.length > 0 && (
        <div
          className="bg-white rounded-xl shadow-md p-6 animate-slideUp"
          style={{ animationDelay: "600ms" }}
        >
          <div className="flex items-center gap-3 mb-4">
            <AlertCircle className="w-6 h-6 text-orange-500" />
            <h2 className="text-xl font-bold text-gray-900">Upcoming Tasks</h2>
          </div>
          <div className="space-y-3">
            {upcomingTasks.map((task, index) => {
              const dueDate = new Date(task.dueDate);
              const isOverdue = isPast(dueDate);
              const isDueToday = isToday(dueDate);

              return (
                <div
                  key={task.id}
                  className="flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                  style={{ animationDelay: `${700 + index * 50}ms` }}
                >
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">
                      {task.title}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          task.priority === "high"
                            ? "bg-red-100 text-red-700"
                            : task.priority === "medium"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {task.priority}
                      </span>
                      {task.category && (
                        <span className="px-2 py-1 rounded text-xs font-medium bg-purple-100 text-purple-700">
                          {task.category.name}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p
                      className={`text-sm font-semibold ${
                        isOverdue
                          ? "text-red-600"
                          : isDueToday
                          ? "text-orange-600"
                          : "text-gray-600"
                      }`}
                    >
                      {isOverdue
                        ? "Overdue!"
                        : isDueToday
                        ? "Today"
                        : format(dueDate, "MMM dd")}
                    </p>
                    <p className="text-xs text-gray-500">
                      {format(dueDate, "yyyy")}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
