import React from 'react';
import UserCard from './UserCard';

const UsersView = ({ users, currentUserId, tasks, setSelectedUser, setCurrentView }) => {
  const handleViewTasks = (user) => {
    setSelectedUser(user);
    setCurrentView('tasks');
  };

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">Other Users</h2>

      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {users.filter(u => u.id !== currentUserId).map(user => (
            <UserCard
              key={user.id}
              user={user}
              taskCount={tasks.filter(t => t.userId === user.id).length}
              onViewTasks={() => handleViewTasks(user)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default UsersView;