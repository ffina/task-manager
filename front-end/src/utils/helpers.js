// Calculate days until due date
export const getDaysUntilDue = (dueDate) => {
  const today = new Date();
  const due = new Date(dueDate);
  const diffTime = due - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

// Filter tasks by user
export const filterTasksByUser = (tasks, userId, selectedUser) => {
  if (selectedUser) {
    return tasks.filter(task => task.userId === selectedUser.id);
  }
  return tasks.filter(task => task.userId === userId);
};

// Get due soon tasks
export const getDueSoonTasks = (tasks, userId, days = 3) => {
  return tasks.filter(task => {
    const diffDays = getDaysUntilDue(task.dueDate);
    return diffDays <= days && diffDays >= 0 && task.status === 'pending' && task.userId === userId;
  });
};

// Get completed today tasks
export const getCompletedTodayTasks = (tasks, userId) => {
  return tasks.filter(task => 
    task.status === 'completed' && task.userId === userId
  );
};

// Get high priority tasks
export const getHighPriorityTasks = (tasks, userId) => {
  return tasks.filter(task => 
    task.priority === 'high' && task.status === 'pending' && task.userId === userId
  );
};