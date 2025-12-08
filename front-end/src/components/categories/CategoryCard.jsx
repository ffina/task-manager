import React from 'react';
import { CATEGORY_COLORS } from '../../utils/constants';

const CategoryCard = ({ category, taskCount }) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex items-center gap-3">
        <div className={`w-12 h-12 ${CATEGORY_COLORS[category.color]} rounded-lg`} />
        <div>
          <h3 className="font-semibold text-lg">{category.name}</h3>
          <p className="text-sm text-gray-600">
            {taskCount} tasks
          </p>
        </div>
      </div>
    </div>
  );
};

export default CategoryCard;