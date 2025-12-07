import React from 'react';
import { Plus } from 'lucide-react';
import CategoryCard from './CategoryCard';

const CategoriesView = ({ categories, tasks, setShowCategoryModal }) => {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold">Categories</h2>
        <button
          onClick={() => setShowCategoryModal(true)}
          className="flex items-center gap-2 bg-slate-800 text-white px-4 py-2 rounded-lg hover:bg-slate-700 transition"
        >
          <Plus className="w-5 h-5" />
          Add Category
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map(category => (
          <CategoryCard
            key={category.id}
            category={category}
            taskCount={tasks.filter(t => t.category === category.name).length}
          />
        ))}
      </div>
    </div>
  );
};

export default CategoriesView;