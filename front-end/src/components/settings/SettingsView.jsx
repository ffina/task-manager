import React from 'react';

const SettingsView = () => {
  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">Settings</h2>

      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-xl font-semibold mb-4">Email Notifications</h3>
        <div className="space-y-4">
          <label className="flex items-center gap-3">
            <input type="checkbox" defaultChecked className="w-5 h-5" />
            <span>Send email reminder 1 day before task deadline</span>
          </label>
          <label className="flex items-center gap-3">
            <input type="checkbox" defaultChecked className="w-5 h-5" />
            <span>Daily summary of pending tasks</span>
          </label>
          <label className="flex items-center gap-3">
            <input type="checkbox" className="w-5 h-5" />
            <span>Weekly task report</span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default SettingsView;