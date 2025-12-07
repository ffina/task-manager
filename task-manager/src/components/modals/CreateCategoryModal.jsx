import React from 'react';
import { X } from 'lucide-react';
import { CATEGORY_COLORS } from '../../utils/constants';

const CreateCategoryModal = ({
  showCategoryModal,
  setShowCategoryModal,
  newCategory,
  setNewCategory,
  handleCreateCategory
}) => {
  if (!showCategoryModal) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Create Category</h2>
            <button
              onClick={() => setShowCategoryModal(false)}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Category Name</label>
              <input
                type="text"
                value={newCategory.name}
                onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                placeholder="Enter category name"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Color</label>
              <div className="grid grid-cols-6 gap-2">
                {Object.keys(CATEGORY_COLORS).map(color => (
                  <button
                    key={color}
                    onClick={() => setNewCategory({ ...newCategory, color })}
                    className={`w-12 h-12 rounded-lg ${CATEGORY_COLORS[color]} ${
                      newCategory.color === color ? 'ring-4 ring-offset-2 ring-blue-400' : ''
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                onClick={handleCreateCategory}
                className="flex-1 bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition font-medium"
              >
                Create Category
              </button>
              <button
                onClick={() => setShowCategoryModal(false)}
                className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateCategoryModal;