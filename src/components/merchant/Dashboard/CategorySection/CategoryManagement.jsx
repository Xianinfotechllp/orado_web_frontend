import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  getRestaurantCategories,
  deleteRestaurantCategory,
} from "../../../../apis/restaurantApi";
import { Edit2, Trash2, List, Loader2, Image as ImageIcon } from "lucide-react";
import AddCategoryModal from "./AddCategoryModal";
import EditCategoryModal from "./EditCategoryModal";
import RestaurantSlider from "../Slider/RestaurantSlider";

const CategoryManagement = () => {
  const user = useSelector((state) => state.auth.user);
  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [selectedRestaurantIndex, setSelectedRestaurantIndex] = useState(null);
  const [categoriesLoading, setCategoriesLoading] = useState(false);

  const [categories, setCategories] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCategory, setNewCategory] = useState({
    name: "",
    description: "",
    isActive: true,
    images: [],
  });

  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [editingCategory, setEditingCategory] = useState({
    _id: null,
    name: "",
    description: "",
    isActive: true,
    images: [],
  });

  const [deletingCategory, setDeletingCategory] = useState(null);

  // Handle restaurant selection from RestaurantSlider
  const handleRestaurantSelect = (restaurant, index) => {
    setSelectedRestaurant(restaurant);
    setSelectedRestaurantIndex(index);
  };

  // Handle restaurants load from RestaurantSlider
  const handleRestaurantsLoad = (restaurantData) => {
    setRestaurants(restaurantData);
  };

  // Fetch categories when selected restaurant changes
  useEffect(() => {
    const fetchCategories = async () => {
      if (selectedRestaurant?.id) {
        try {
          setCategoriesLoading(true);
          const response = await getRestaurantCategories(selectedRestaurant.id);
          console.log("Fetched Categories Response:-------", response);

          // Fix here - use response.data directly instead of response.data.categories
          const categoriesData = response?.data || [];
          console.log("Categories Data:-------", categoriesData);

          setCategories(Array.isArray(categoriesData) ? categoriesData : []);
        } catch (err) {
          console.error("Failed to load categories:", err);
          setCategories([]);
        } finally {
          setCategoriesLoading(false);
        }
      }
    };

    fetchCategories();
  }, [selectedRestaurant]);

  const toggleCategoryStatus = async (categoryId) => {
    try {
      const category = categories.find((c) => c._id === categoryId);
      const newStatus = !category.isActive;

      setCategories((prevCategories) =>
        prevCategories.map((cat) =>
          cat._id === categoryId ? { ...cat, isActive: newStatus } : cat
        )
      );

      await updateCategoryStatus(categoryId, newStatus);
    } catch (error) {
      console.error("Failed to update category status:", error);
      setCategories((prevCategories) =>
        prevCategories.map((cat) =>
          cat._id === categoryId ? { ...cat, isActive: !cat.isActive } : cat
        )
      );
    }
  };

  const handleAddCategory = async () => {
    try {
      const restaurantId = selectedRestaurant?._id;
      if (!restaurantId) return;

      const categoryData = {
        name: newCategory.name.trim(),
        description: newCategory.description.trim(),
        isActive: newCategory.isActive,
        images: newCategory.images,
      };

      const createdCategory = await createCategory(restaurantId, categoryData);
      setCategories((prev) => [...prev, createdCategory]);
      setNewCategory({ name: "", description: "", isActive: true, images: [] });
      setShowAddModal(false);
    } catch (error) {
      console.error("Failed to create category:", error);
    }
  };

  const handleEditCategory = async () => {
    try {
      const categoryData = {
        name: editingCategory.name.trim(),
        description: editingCategory.description.trim(),
        isActive: editingCategory.isActive,
        images: editingCategory.images,
      };

      const updatedCategory = await updateCategory(
        editingCategory._id,
        categoryData
      );
      setCategories((prev) =>
        prev.map((cat) =>
          cat._id === editingCategory._id ? updatedCategory : cat
        )
      );
      setShowEditModal(false);
    } catch (error) {
      console.error("Failed to update category:", error);
    }
  };

  const startEditing = (category) => {
    setSelectedCategory(category);
    setEditingCategory({ ...category });
    setShowEditModal(true);
  };

  const handleCategoryUpdated = (updatedCategory) => {
    setCategories((prevCategories) =>
      prevCategories.map((cat) =>
        cat._id === updatedCategory._id ? updatedCategory : cat
      )
    );
    setShowEditModal(false);
  };

  const handleDeleteCategory = async (category) => {
    try {
      setDeletingCategory(category._id);
      const restaurantId = selectedRestaurant?.id;

      if (!restaurantId) {
        throw new Error("Restaurant ID not found");
      }

      await deleteRestaurantCategory(category._id, restaurantId);

      setCategories((prev) => prev.filter((c) => c._id !== category._id));
    } catch (error) {
      console.error("Failed to delete category:", error);
      alert("Failed to delete category. Please try again.");
    } finally {
      setDeletingCategory(null);
    }
  };

  const selectedRestaurantId = selectedRestaurant?.id || null;

  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      {/* Restaurant Slider Component */}
      <RestaurantSlider
        onRestaurantSelect={handleRestaurantSelect}
        onRestaurantsLoad={handleRestaurantsLoad}
        selectedIndex={selectedRestaurantIndex}
        className="mb-6"
      />

      {/* Categories Grid */}
      {categoriesLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="animate-spin h-8 w-8 text-orange-500" />
        </div>
      ) : categories.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
          {categories.map((category) => (
            <div
              key={category._id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200"
            >
              <div className="p-6">
                {/* Category Header with Image */}
                <div className="flex items-center space-x-3 mb-4">
                  {category.images && category.images.length > 0 ? (
                    <img
                      src={category.images[0]}
                      alt={category.name}
                      className="w-10 h-10 rounded-md object-cover flex-shrink-0"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-md bg-gray-100 flex items-center justify-center flex-shrink-0">
                      <ImageIcon className="w-5 h-5 text-gray-400" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-800 truncate group relative">
                      {category.name}
                      <span className="hidden group-hover:block absolute top-full left-0 mt-1 bg-gray-900 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap z-20 shadow-lg border border-gray-700">
                        {category.name}
                      </span>
                    </h3>
                  </div>
                </div>

                {/* Category Description */}
                <div className="mb-4">
                  <p className="text-gray-600 text-sm line-clamp-3">
                    {category.description}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
                  <button
                    onClick={() => startEditing(category)}
                    className="text-gray-400 hover:text-blue-500 transition-colors p-2 rounded-md hover:bg-blue-50"
                    title="Edit category"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteCategory(category)}
                    disabled={deletingCategory === category._id}
                    className="text-gray-400 hover:text-red-500 transition-colors p-2 rounded-md hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Delete category"
                  >
                    {deletingCategory === category._id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : selectedRestaurant ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <div className="mx-auto max-w-md">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900">
              No categories found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              This restaurant doesn't have any categories yet. Get started by
              creating a new one.
            </p>
            <div className="mt-6">
              <button
                type="button"
                onClick={() => setShowAddModal(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
              >
                <List className="-ml-1 mr-2 h-5 w-5" />
                Add Category
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {/* Add Category Button - Fixed in bottom right */}
      {categories.length > 0 && selectedRestaurant && (
        <button
          onClick={() => setShowAddModal(true)}
          className="fixed bottom-6 right-6 bg-gradient-to-r from-orange-500 to-red-500 text-white p-4 rounded-full shadow-lg hover:from-orange-600 hover:to-red-600 transition-all duration-200 flex items-center justify-center z-40"
        >
          <List className="w-6 h-6 mr-2" />
          <span className="text-white font-medium">Add Category</span>
        </button>
      )}

      {/* Add Category Modal */}
      <AddCategoryModal
        showAddModal={showAddModal}
        setShowAddModal={setShowAddModal}
        restaurantId={selectedRestaurantId}
        onCategoryAdded={(newCategory) => {
          setCategories((prev) => [...prev, newCategory]);
        }}
      />

      {/* Edit Category Modal */}
      <EditCategoryModal
        showEditModal={showEditModal}
        setShowEditModal={setShowEditModal}
        restaurantId={selectedRestaurantId}
        categoryToEdit={selectedCategory}
        onCategoryUpdated={handleCategoryUpdated}
      />
    </div>
  );
};

export default CategoryManagement;
