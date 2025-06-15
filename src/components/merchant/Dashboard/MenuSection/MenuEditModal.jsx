import React, { useState, useEffect } from "react";
import CategoryDropdown from "../Dropdown/CategoryDropdown";
import { updateProduct } from "../../../../apis/restaurantApi";
import { toast } from "react-toastify";

const MenuEditModal = ({
  restaurantId,
  onClose,
  onUpdateSuccess,
  categories,
  initialData,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    foodType: "",
    categoryId: "",
    stock: "",
    reorderLevel: "",
    unit: "piece",
  });
  const [errors, setErrors] = useState({});
  const [images, setImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        price: initialData.price || "",
        description: initialData.description || "",
        foodType: initialData.foodType || "",
        categoryId: initialData.categoryId || "",
        stock:
          initialData.stock !== undefined ? initialData.stock.toString() : "",
        reorderLevel:
          initialData.reorderLevel !== undefined
            ? initialData.reorderLevel.toString()
            : "",
        unit: initialData.unit || "piece",
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleCategorySelect = (categoryId) => {
    setFormData((prev) => ({
      ...prev,
      categoryId,
    }));
    if (errors.categoryId) {
      setErrors((prev) => ({ ...prev, categoryId: undefined }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.price) newErrors.price = "Price is required";
    else if (parseFloat(formData.price) <= 0)
      newErrors.price = "Price must be positive";
    if (!formData.foodType) newErrors.foodType = "Food type is required";
    if (!formData.categoryId) newErrors.categoryId = "Category is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleImageChange = (e) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setImages(filesArray);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setIsSubmitting(true);
      setError(null);

      const updatePayload = {
        ...formData,
        price: parseFloat(formData.price),
        stock: formData.stock ? parseInt(formData.stock, 10) : undefined,
        reorderLevel: formData.reorderLevel
          ? parseInt(formData.reorderLevel, 10)
          : undefined,
        images: images, 
      };

      const response = await updateProduct(initialData._id, updatePayload);

      if (response.product) {
        toast.success(response.message || "Product updated successfully");
        onUpdateSuccess(response.product);
        setTimeout(() => {
          onClose();
        }, 100);
      } else if (response.message) {
        if (response.message.includes("permission")) {
          toast.info(response.message);
        } else {
          toast.success(response.message);
        }
        onClose();
      } else {
        const errorMessage = "Unexpected response format";
        setError(errorMessage);
        toast.error(errorMessage);
      }
    } catch (err) {
      console.error("Update error:", err);

      if (err.response) {
        const errorMessage =
          err.response.data?.message ||
          err.response.data?.error ||
          "Failed to update product";

        if (err.response.status === 403) {
          toast.info(errorMessage);
          onClose();
        } else {
          setError(errorMessage);
          toast.error(errorMessage);
        }
      } else {
        const errorMessage = err.message || "An unexpected error occurred";
        setError(errorMessage);
        toast.error(errorMessage);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div 
    style={{ backgroundColor: "rgba(0, 0, 0, 0.9)" }}
    className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Edit Menu Item</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            &times;
          </button>
        </div>

        {error && (
          <div className="mb-4 p-2 bg-red-100 text-red-700 rounded text-sm">
            {error}
          </div>
        )}

        <div className="flex-1 overflow-y-auto pr-2 pb-1">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name*
              </label>
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                type="text"
                className="w-full p-2 border rounded"
              />
              {errors.name && (
                <p className="text-red-500 text-xs mt-1">{errors.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price*
              </label>
              <input
                name="price"
                value={formData.price}
                onChange={handleChange}
                type="number"
                step="0.01"
                className="w-full p-2 border rounded"
              />
              {errors.price && (
                <p className="text-red-500 text-xs mt-1">{errors.price}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={1}
                className="w-full p-2 border rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Update Image
              </label>
              <input
                type="file"
                multiple
                onChange={handleImageChange}
                className="w-full p-2 border rounded"
                accept="image/*"
              />
              
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Food Type*
              </label>
              <select
                name="foodType"
                value={formData.foodType}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              >
                <option value="">Select food type</option>
                <option value="veg">Vegetarian</option>
                <option value="non-veg">Non-Vegetarian</option>
              </select>
              {errors.foodType && (
                <p className="text-red-500 text-xs mt-1">{errors.foodType}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category*
              </label>
              <CategoryDropdown
                restaurantId={restaurantId}
                onCategorySelect={handleCategorySelect}
                selectedCategory={formData.categoryId}
                categories={categories}
              />
              {errors.categoryId && (
                <p className="text-red-500 text-xs mt-1">{errors.categoryId}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Stock
                </label>
                <input
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  type="number"
                  min="0"
                  className="w-full p-2 border rounded"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Reorder Level
                </label>
                <input
                  name="reorderLevel"
                  value={formData.reorderLevel}
                  onChange={handleChange}
                  type="number"
                  min="0"
                  className="w-full p-2 border rounded"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Unit
              </label>
              <select
                name="unit"
                value={formData.unit}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              >
                <option value="piece">Piece</option>
                <option value="kg">Kilogram</option>
                <option value="g">Gram</option>
                <option value="l">Liter</option>
                <option value="ml">Milliliter</option>
              </select>
            </div>
          </form>
        </div>

        <div className="mt-4 pt-4 border-t">
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              onClick={handleSubmit}
              className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 disabled:opacity-50"
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuEditModal;
