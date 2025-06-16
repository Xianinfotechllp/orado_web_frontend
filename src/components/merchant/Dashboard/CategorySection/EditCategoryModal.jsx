// src/components/EditCategoryModal.jsx
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { editRestaurantCategory } from "../../../../apis/restaurantApi";

const EditCategoryModal = ({
  showEditModal,
  setShowEditModal,
  restaurantId,
  categoryToEdit,
  onCategoryUpdated,
  fetchCategories, // Add this prop to refresh the category list
}) => {
  const [editedCategory, setEditedCategory] = useState({
    name: "",
    description: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (categoryToEdit) {
      setEditedCategory({
        name: categoryToEdit.name || "",
        description: categoryToEdit.description || "",
      });
      // Set the image preview if category has images
      if (categoryToEdit.images && categoryToEdit.images.length > 0) {
        setImagePreview(categoryToEdit.images[0]); // Just use the first image
      }
    }
    return () => {
      // Clean up the object URL to avoid memory leaks
      if (
        typeof imagePreview === "string" &&
        imagePreview.startsWith("blob:")
      ) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [categoryToEdit]);

  const handleEditCategory = async () => {
    if (!editedCategory.name) {
      setError("Name is required");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const updatedCategory = await editRestaurantCategory(
        restaurantId,
        categoryToEdit._id,
        editedCategory,
        imageFile
      );

      console.log("Category updated successfully:---------", updatedCategory);

      toast.success("Category updated successfully");

      // Call the callback with updated category data
      if (onCategoryUpdated) {
        onCategoryUpdated(updatedCategory.category);
      }

      // Refresh the category list if fetchCategories is provided
      if (fetchCategories) {
        await fetchCategories();
      }

      // Close modal
      setShowEditModal(false);
    } catch (err) {
      console.error("Error updating category:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to update category"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Revoke previous object URL if it exists
      if (
        typeof imagePreview === "string" &&
        imagePreview.startsWith("blob:")
      ) {
        URL.revokeObjectURL(imagePreview);
      }

      setImageFile(file);
      // Create a preview URL for the new image
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const handleCloseModal = () => {
    // Clean up the object URL when closing the modal
    if (typeof imagePreview === "string" && imagePreview.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreview);
    }
    setShowEditModal(false);
  };

  return (
    showEditModal && (
      <div
        style={{ backgroundColor: "rgba(0, 0, 0, 0.9)" }}
        className="fixed inset-0  bg-opacity-50 flex items-center justify-center z-50"
      >
        <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Edit Category
          </h2>

          {error && (
            <div className="mb-4 p-2 bg-red-100 text-red-700 rounded-md">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={editedCategory.name}
                onChange={(e) =>
                  setEditedCategory((prev) => ({
                    ...prev,
                    name: e.target.value,
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Enter category name"
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={editedCategory.description}
                onChange={(e) =>
                  setEditedCategory((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                rows="4"
                placeholder="Enter category description"
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Update Category Image (optional)
              </label>
              {imagePreview && (
                <div className="mt-2">
                  <img
                    src={
                      typeof imagePreview === "string"
                        ? imagePreview
                        : imagePreview[0]
                    }
                    alt="Preview"
                    className="h-20 w-20 object-cover rounded-md"
                  />
                </div>
              )}

              <input
                type="file"
                onChange={handleImageChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                accept="image/*"
                disabled={isSubmitting}
              />
              {categoryToEdit?.images && !imageFile && (
                <p className="text-xs text-gray-500 mt-1">
                  Current image will be kept if no new image is selected
                </p>
              )}
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={handleCloseModal}
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleEditCategory}
              disabled={isSubmitting || !editedCategory.name}
              className="flex-1 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:from-orange-600 hover:to-red-600 transition-all duration-200 disabled:opacity-50"
            >
              {isSubmitting ? "Updating..." : "Update Category"}
            </button>
          </div>
        </div>
      </div>
    )
  );
};

export default EditCategoryModal;
