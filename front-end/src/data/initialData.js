export const initialTasks = [
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
];

export const initialCategories = [
  { id: 1, name: 'Work', color: 'blue' },
  { id: 2, name: 'Personal', color: 'purple' },
  { id: 3, name: 'Shopping', color: 'green' },
  { id: 4, name: 'Health', color: 'red' }
];

export const initialUsers = [
  { id: 1, name: 'You', email: 'you@example.com' },
  { id: 2, name: 'John Doe', email: 'john@example.com' },
  { id: 3, name: 'Jane Smith', email: 'jane@example.com' }
];