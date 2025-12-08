import React from 'react';

const StatsCard = ({ icon: Icon, title, count, bgColor, iconColor, textColor }) => {
  return (
    <div className={`${bgColor} border-2 rounded-xl p-6`}>
      <div className="flex items-center gap-3 mb-2">
        <Icon className={`w-8 h-8 ${iconColor}`} />
        <h3 className={`text-lg font-semibold ${textColor}`}>{title}</h3>
      </div>
      <p className={`text-3xl font-bold ${textColor}`}>{count}</p>
    </div>
  );
};

export default StatsCard;