// src/components/AddCategoryModal.jsx
import React, { useState } from "react";
import { createCategory } from "../../../../apis/restaurantApi";
import { toast } from "react-toastify";

const AddCategoryModal = ({
  showAddModal,
  setShowAddModal,
  restaurantId,
  onCategoryAdded,
}) => {
  const [newCategory, setNewCategory] = useState({
    name: "",
    description: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  console.log(restaurantId, "Restaurant ID in AddCategoryModal");

  const handleAddCategory = async () => {
    if (!newCategory.name || !newCategory.description) {
      setError("Name and description are required");
      return;
    }

    if (newCategory.description.length < 100) {
      setError("Description should be at least 100 characters long");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const response = await createCategory(
        restaurantId,
        newCategory,
        imageFile
      );

      console.log("Category created successfully:", response);

      toast.success(response.message || "Category created successfully");

      // Call the onCategoryAdded callback with the new category
      if (onCategoryAdded) {
        onCategoryAdded(response.data); // or response.category depending on your API response
      }

      // Close modal and reset form
      setShowAddModal(false);
      setNewCategory({
        name: "",
        description: "",
      });
      setImageFile(null);
    } catch (err) {
      console.error("Error creating category:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to create category"
      );
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
    }
  };

  return (
    showAddModal && (
      <div
        style={{ backgroundColor: "rgba(0, 0, 0, 0.9)" }}
        className="fixed inset-0  bg-opacity-50 flex items-center justify-center z-50"
      >
        <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Add New Category
          </h2>

          {error && (
            <div className="mb-4 p-2 bg-red-100 text-red-700 rounded-md">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category Name
              </label>
              <input
                type="text"
                value={newCategory.name}
                onChange={(e) =>
                  setNewCategory((prev) => ({ ...prev, name: e.target.value }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Enter category name"
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description (min 100 characters)
              </label>
              <textarea
                value={newCategory.description}
                onChange={(e) =>
                  setNewCategory((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                rows="4"
                placeholder="Enter category description (minimum 100 characters)"
                disabled={isSubmitting}
              />
              <p className="text-xs text-gray-500 mt-1">
                {newCategory.description.length}/100 characters
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category Image
              </label>
              <input
                type="file"
                onChange={handleImageChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                accept="image/*"
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={() => setShowAddModal(false)}
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleAddCategory}
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:from-orange-600 hover:to-red-600 transition-all duration-200 disabled:opacity-50"
            >
              {isSubmitting ? "Adding..." : "Add Category"}
            </button>
          </div>
        </div>
      </div>
    )
  );
};

export default AddCategoryModal;
