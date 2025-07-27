import React, { useEffect, useState } from 'react';
import { getRestaurantCategories, deleteRestaurantCategory } from '../../../../apis/restaurantApi';
import { Edit, Trash2, Plus, ChevronRight } from 'lucide-react';
import EditCategoryModal from './../CategorySection/EditCategoryModal';
import AddCategoryModal from './../CategorySection/AddCategoryModal';
import { toast } from 'react-hot-toast';

const CategoryList = ({ restaurantId, onSelectCategory, selectedCategory }) => {
  const [categories, setCategories] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [categoryToEdit, setCategoryToEdit] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchCategories = async () => {
    if (!restaurantId) return;
    
    setLoading(true);
    try {
      const data = await getRestaurantCategories(restaurantId);
      if (Array.isArray(data.data)) {
        setCategories(data.data);
      } else {
        console.warn("Expected categories array but got:", data);
        setCategories([]);
      }
    } catch (err) {
      console.error("Error fetching categories:", err);
      toast.error("Failed to load categories");
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [restaurantId]);

  const handleEditClick = (category, e) => {
    e.stopPropagation();
    setCategoryToEdit(category);
    setShowEditModal(true);
  };

  const handleDeleteClick = async (categoryId, e) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this category and all its products?")) return;
    
    try {
      setLoading(true);
      await deleteRestaurantCategory(restaurantId, categoryId);
      toast.success("Category deleted successfully");
      fetchCategories();
      // If the deleted category was selected, clear the selection
      if (selectedCategory?._id === categoryId) {
        onSelectCategory(null);
      }
    } catch (err) {
      console.error("Error deleting category:", err);
      toast.error(err.response?.data?.message || "Failed to delete category");
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryUpdated = (updatedCategory) => {
    setCategories(prev => 
      prev.map(cat => cat._id === updatedCategory._id ? updatedCategory : cat)
    );
    setShowEditModal(false);
  };

  const handleCategoryAdded = (newCategory) => {
    setCategories(prev => [...prev, newCategory]);
    setShowAddModal(false);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 w-[280px] flex flex-col h-full">
      <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-100">
        <h2 className="text-lg font-semibold text-gray-800">
          Categories
          <span className="ml-2 text-sm font-normal text-gray-500">
            ({categories.length})
          </span>
        </h2>
        <button 
          onClick={() => setShowAddModal(true)}
          className="p-1.5 rounded-md bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-colors"
          disabled={loading}
          title="Add new category"
        >
          <Plus size={18} strokeWidth={2} />
        </button>
      </div>
      
      {loading && !categories.length ? (
        <div className="flex flex-1 items-center justify-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-indigo-500 border-t-transparent"></div>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto pr-1">
          {categories.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-4">
              <Plus size={24} className="text-gray-400 mb-2" />
              <p className="text-gray-500 text-sm">No categories found</p>
              <button
                onClick={() => setShowAddModal(true)}
                className="mt-3 text-sm text-indigo-600 hover:text-indigo-800 font-medium"
              >
                Create your first category
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              {categories.map((cat) => (
                <div
                  key={cat._id}
                  onClick={() => onSelectCategory(cat)}
                  className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all ${
                    selectedCategory?._id === cat._id
                      ? 'bg-indigo-50 border border-indigo-200'
                      : 'hover:bg-gray-50 border border-transparent hover:border-gray-200'
                  }`}
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate text-gray-800">
                      {cat.name}
                    </p>
                    {cat.description && (
                      <p className="text-sm text-gray-500 truncate mt-1">
                        {cat.description}
                      </p>
                    )}
                  </div>
                  
                  <div className="flex items-center ml-2 space-x-1">
                    <button 
                      onClick={(e) => handleEditClick(cat, e)}
                      className="p-1.5 rounded-full hover:bg-indigo-100 text-gray-500 hover:text-indigo-600 transition-colors"
                    >
                      <Edit size={16} strokeWidth={2} />
                    </button>
                    <button 
                      onClick={(e) => handleDeleteClick(cat._id, e)}
                      className="p-1.5 rounded-full hover:bg-red-100 text-gray-500 hover:text-red-600 transition-colors"
                    >
                      <Trash2 size={16} strokeWidth={2} />
                    </button>
                    <ChevronRight 
                      size={16} 
                      className="text-gray-400 ml-1" 
                      strokeWidth={2} 
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Edit Category Modal */}
      {showEditModal && (
        <EditCategoryModal
          showEditModal={showEditModal}
          setShowEditModal={setShowEditModal}
          restaurantId={restaurantId}
          categoryToEdit={categoryToEdit}
          onCategoryUpdated={handleCategoryUpdated}
          fetchCategories={fetchCategories}
        />
      )}

      {/* Add Category Modal */}
      {showAddModal && (
        <AddCategoryModal
          showAddModal={showAddModal}
          setShowAddModal={setShowAddModal}
          restaurantId={restaurantId}
          onCategoryAdded={handleCategoryAdded}
        />
      )}
    </div>
  );
};

export default CategoryList;