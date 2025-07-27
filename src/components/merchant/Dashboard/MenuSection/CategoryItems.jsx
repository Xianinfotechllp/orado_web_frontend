import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  Edit2,
  Trash2,
  Plus,
  X,
  ChevronRight,
  ChevronLeft as ChevronLeftIcon,
} from 'lucide-react';
import apiClient from '../../../../apis/apiClient/apiClient';

// Loading component
const LoadingForAdmins = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center text-orange-500 font-bold">Loading...</div>
  </div>
);

// Error screen component
const ErrorScreen = ({ error }) => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="text-center">
      <div className="text-6xl mb-4">🍽️</div>
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Oops! Something went wrong</h2>
      <p className="text-gray-600 mb-4">{error}</p>
      <button
        onClick={() => window.location.reload()}
        className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
      >
        Try Again
      </button>
    </div>
  </div>
);

// Empty state component
const EmptyState = ({ onAddItem }) => (
  <div className="flex flex-col items-center justify-center py-16 bg-white rounded-xl shadow-sm border border-gray-100">
    <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mb-4">
      <Plus className="h-10 w-10 text-orange-500" />
    </div>
    <h3 className="text-lg font-bold text-gray-800 mb-2">No Items Found</h3>
    <p className="text-gray-500 mb-6 text-sm">This category doesn't have any items yet</p>
    <button
      onClick={onAddItem}
      className="px-5 py-2.5 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-sm font-medium shadow-sm"
    >
      Add New Item
    </button>
  </div>
);

// Card component for each menu item
const MenuItemCard = ({ item, onEdit, onDelete }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex === item.images.length - 1 ? 0 : prevIndex + 1));
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex === 0 ? item.images.length - 1 : prevIndex - 1));
  };

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden relative group border border-gray-100 cursor-pointer">
      <div className="h-48 w-full relative overflow-hidden">
        {item.images?.length > 0 ? (
          <>
            <img
              src={item.images[currentImageIndex]}
              alt={item.name}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            {item.images.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    prevImage();
                  }}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-white bg-opacity-80 rounded-full p-1 shadow-md hover:bg-opacity-100"
                >
                  <ChevronLeftIcon className="h-4 w-4 text-gray-700" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    nextImage();
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-white bg-opacity-80 rounded-full p-1 shadow-md hover:bg-opacity-100"
                >
                  <ChevronRight className="h-4 w-4 text-gray-700" />
                </button>
                <div className="absolute bottom-2 left-0 right-0 flex justify-center space-x-1">
                  {item.images.map((_, index) => (
                    <div
                      key={index}
                      className={`h-1.5 w-1.5 rounded-full ${
                        index === currentImageIndex ? 'bg-white' : 'bg-white bg-opacity-50'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </>
        ) : (
          <div className="h-full w-full bg-gray-100 flex items-center justify-center">
            <span className="text-gray-400">No image</span>
          </div>
        )}
        <div className="absolute top-2 left-2">
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              item.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}
          >
            {item.active ? 'Available' : 'Unavailable'}
          </span>
        </div>
      </div>

      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-bold text-gray-900 line-clamp-1">{item.name}</h3>
          <span className="text-lg font-bold text-orange-500 whitespace-nowrap">
            ₹{item.price?.toFixed(2) || '0.00'}
          </span>
        </div>

        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {item.description || 'No description available'}
        </p>

        <div className="flex justify-between items-center pt-3 border-t border-gray-100">
          <div className="flex space-x-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(item);
              }}
              className="p-1.5 bg-gray-100 rounded-lg hover:bg-gray-200 text-gray-700"
              title="Edit item"
            >
              <Edit2 className="h-4 w-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(item._id);
              }}
              className="p-1.5 bg-gray-100 rounded-lg hover:bg-gray-200 text-red-500"
              title="Delete item"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
          <span
            className={`text-xs px-2 py-1 rounded-full ${
              item.foodType === 'veg' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}
          >
            {item.foodType === 'veg' ? 'Vegetarian' : 'Non-Vegetarian'}
          </span>
        </div>
      </div>
    </div>
  );
};

const CategoryItems = () => {
  const { restaurantId, categoryId } = useParams();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);

  // Fetch the items for the selected category
  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoading(true);
        const res = await apiClient.get(`/admin/restaurant/${restaurantId}/category/${categoryId}`);
        setItems(res.data.data || []);
        setError(null);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch items');
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, [restaurantId, categoryId]);

  // Delete item handler
  const handleDeleteItem = async (itemId) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    try {
      await apiClient.delete(`/restaurants/products/${itemId}`);
      setItems(items.filter((item) => item._id !== itemId));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete item');
    }
  };

  // Open edit modal with current item
  const handleEditClick = (item) => {
    setCurrentItem(item);
    setShowModal(true);
  };

  // Open new item modal
  const handleAddClick = () => {
    setCurrentItem(null);
    setShowModal(true);
  };

  // On submit success (create or update)
  const handleSubmitSuccess = (updatedItem) => {
    if (currentItem) {
      setItems(items.map((item) => (item._id === updatedItem._id ? updatedItem : item)));
    } else {
      setItems([...items, updatedItem]);
    }
    setShowModal(false);
  };

  if (loading) return <LoadingForAdmins />;
  if (error) return <ErrorScreen error={error} />;

  return (
    <div className="min-h-screen bg-[#f8f8f8]">
      <div className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-gray-600 hover:text-orange-500 text-sm font-medium"
            >
              <ChevronLeft className="h-5 w-5 mr-1" />
              Back to Categories
            </button>
            <h1 className="text-xl font-bold text-gray-900">Menu Items</h1>
            <button
              onClick={handleAddClick}
              className="flex items-center px-3 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-sm font-medium shadow-sm"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Item
            </button>
          </div>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {items.length === 0 ? (
          <EmptyState onAddItem={handleAddClick} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {items.map((item) => (
              <MenuItemCard
                key={item._id}
                item={item}
                onEdit={handleEditClick}
                onDelete={handleDeleteItem}
              />
            ))}
          </div>
        )}
      </main>

      <ProductModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleSubmitSuccess}
        item={currentItem}
        restaurantId={restaurantId}
        categoryId={categoryId}
      />
    </div>
  );
};

// Modal with form to create or edit a product
const ProductModal = ({ show, onClose, onSubmit, item, restaurantId, categoryId }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    active: true,
    foodType: 'veg',
    addOns: [],
    attributes: [],
    unit: 'piece',
    stock: 0,
    reorderLevel: 0,
    revenueShare: { type: 'percentage', value: 10 },

    // New fields needed by backend
    minQty: 1,
    maxQty: '',
    costPrice: '',
    preparationTime: '',
    isRecurring: false,
    availability: { type: 'always' },
  });

  const [imagePreviews, setImagePreviews] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [replaceImageIndex, setReplaceImageIndex] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (item) {
      setFormData({
        name: item.name ?? '',
        description: item.description ?? '',
        price: item.price ?? 0,
        active: item.active !== false,
        foodType: item.foodType ?? 'veg',
        addOns: item.addOns ?? [],
        attributes: item.attributes ?? [],
        unit: item.unit ?? 'piece',
        stock: item.stock ?? 0,
        reorderLevel: item.reorderLevel ?? 0,
        revenueShare: item.revenueShare ?? { type: 'percentage', value: 10 },
        minQty: item.minQty ?? 1,
        maxQty: item.maxQty ?? '',
        costPrice: item.costPrice ?? '',
        preparationTime: item.preparationTime ?? '',
        isRecurring: item.isRecurring ?? false,
        availability: item.availability ?? { type: 'always' },
      });
      setImagePreviews(item.images ?? []);
    } else {
      // Reset form for creating new item
      setFormData({
        name: '',
        description: '',
        price: 0,
        active: true,
        foodType: 'veg',
        addOns: [],
        attributes: [],
        unit: 'piece',
        stock: 0,
        reorderLevel: 0,
        revenueShare: { type: 'percentage', value: 10 },
        minQty: 1,
        maxQty: '',
        costPrice: '',
        preparationTime: '',
        isRecurring: false,
        availability: { type: 'always' },
      });
      setImagePreviews([]);
    }
    setNewImages([]);
    setReplaceImageIndex(null);
    setError(null);
  }, [item, show]);

  // Handle added or replaced images
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    if (replaceImageIndex !== null) {
      const updatedPreviews = [...imagePreviews];
      const updatedFiles = [...newImages];

      if (replaceImageIndex < (item?.images?.length ?? 0)) {
        updatedPreviews[replaceImageIndex] = URL.createObjectURL(files[0]);
      } else {
        updatedFiles[replaceImageIndex - (item?.images?.length ?? 0)] = files[0];
        updatedPreviews[replaceImageIndex] = URL.createObjectURL(files[0]);
      }

      setImagePreviews(updatedPreviews);
      setNewImages(updatedFiles);
      setReplaceImageIndex(null);
    } else {
      setNewImages([...newImages, ...files]);
      const previews = files.map((file) => URL.createObjectURL(file));
      setImagePreviews([...imagePreviews, ...previews]);
    }
  };

  const removeImage = (index) => {
    const newPreviews = [...imagePreviews];
    const newFiles = [...newImages];

    if (index >= (item?.images?.length ?? 0)) {
      newFiles.splice(index - (item?.images?.length ?? 0), 1);
      setNewImages(newFiles);
    } else {
      // For existing images: remove from previews only, backend must handle actual deletion.
    }

    URL.revokeObjectURL(newPreviews[index]);
    newPreviews.splice(index, 1);
    setImagePreviews(newPreviews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!formData.name.trim()) {
      setError('Name is required');
      setLoading(false);
      return;
    }
    if (!formData.price || isNaN(formData.price) || Number(formData.price) < 0) {
      setError('Price must be a valid number >= 0');
      setLoading(false);
      return;
    }
    if (!categoryId) {
      setError('Category ID is required');
      setLoading(false);
      return;
    }

    try {
      const formDataToSend = new FormData();

      // IMPORTANT: Add restaurantId field for create
      formDataToSend.append('restaurantId', String(restaurantId));

      // Append all required fields as strings
      formDataToSend.append('categoryId', String(categoryId));
      formDataToSend.append('name', String(formData.name));
      formDataToSend.append('description', String(formData.description));
      formDataToSend.append('price', String(formData.price));
      formDataToSend.append('active', String(formData.active));
      formDataToSend.append('foodType', String(formData.foodType));
      formDataToSend.append('unit', String(formData.unit));
      formDataToSend.append('stock', String(formData.stock));
      formDataToSend.append('reorderLevel', String(formData.reorderLevel));
      formDataToSend.append('minQty', String(formData.minQty));
      formDataToSend.append('maxQty', formData.maxQty !== '' ? String(formData.maxQty) : '');
      formDataToSend.append('costPrice', formData.costPrice !== '' ? String(formData.costPrice) : '');
      formDataToSend.append('preparationTime', formData.preparationTime !== '' ? String(formData.preparationTime) : '');
      formDataToSend.append('isRecurring', String(formData.isRecurring));
      formDataToSend.append('availability', formData.availability.type || 'always');


      // Append arrays as JSON strings
      formData.addOns.forEach((addOn, idx) => {
        formDataToSend.append(`addOns[${idx}]`, JSON.stringify(addOn));
      });
      formData.attributes.forEach((attr, idx) => {
        formDataToSend.append(`attributes[${idx}]`, JSON.stringify(attr));
      });

      // Append new image files
      newImages.forEach((file) => {
        formDataToSend.append('images', file);
      });

      if (replaceImageIndex !== null) {
        formDataToSend.append('replaceImageIndex', replaceImageIndex);
      }

      let response;
      if (item) {
        // Update existing product
        response = await apiClient.put(
          `/admin/restaurant/${restaurantId}/product/${item._id}`,
          formDataToSend
        );
      } else {
        // Create new product
        response = await apiClient.post(
          `/admin/restaurant/${restaurantId}/product`,
          formDataToSend
        );
      }

      onSubmit(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save item');
    } finally {
      setLoading(false);
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">{item ? 'Edit' : 'Add New'} Menu Item</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && <div className="p-3 bg-red-100 text-red-700 rounded-lg text-sm">{error}</div>}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Item Name*</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Enter item name"
              />
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price*</label>
              <input
                type="number"
                min="0"
                step="0.01"
                required
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Price"
              />
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Enter description"
              />
            </div>

            {/* Food Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Food Type</label>
              <select
                value={formData.foodType}
                onChange={(e) => setFormData({ ...formData, foodType: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="veg">Vegetarian</option>
                <option value="non-veg">Non-Vegetarian</option>
              </select>
            </div>

            {/* Active */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="active"
                checked={formData.active}
                onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                className="h-4 w-4 text-orange-500 rounded focus:ring-orange-500 border-gray-300"
              />
              <label htmlFor="active" className="ml-2 text-sm text-gray-700">
                Available
              </label>
            </div>

            {/* Unit */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
              <input
                type="text"
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="piece, kg, pack, etc."
              />
            </div>

            {/* Stock */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
              <input
                type="number"
                min="0"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            {/* Reorder Level */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Reorder Level</label>
              <input
                type="number"
                min="0"
                value={formData.reorderLevel}
                onChange={(e) => setFormData({ ...formData, reorderLevel: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            {/* Minimum Quantity */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Quantity</label>
              <input
                type="number"
                min="1"
                value={formData.minQty}
                onChange={(e) => setFormData({ ...formData, minQty: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            {/* Maximum Quantity */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Maximum Quantity</label>
              <input
                type="number"
                min="1"
                value={formData.maxQty}
                onChange={(e) => setFormData({ ...formData, maxQty: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            {/* Cost Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cost Price</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.costPrice}
                onChange={(e) => setFormData({ ...formData, costPrice: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            {/* Preparation Time */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Preparation Time (mins)</label>
              <input
                type="number"
                min="0"
                value={formData.preparationTime}
                onChange={(e) => setFormData({ ...formData, preparationTime: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            {/* Is Recurring */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isRecurring"
                checked={formData.isRecurring}
                onChange={(e) => setFormData({ ...formData, isRecurring: e.target.checked })}
                className="h-4 w-4 text-orange-500 rounded focus:ring-orange-500 border-gray-300"
              />
              <label htmlFor="isRecurring" className="ml-2 text-sm text-gray-700">
                Is Recurring
              </label>
            </div>

            {/* Availability */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Availability</label>
              <select
                value={formData.availability.type}
                onChange={(e) =>
                  setFormData({ ...formData, availability: { ...formData.availability, type: e.target.value } })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="always">Always</option>
                <option value="scheduled">Scheduled</option>
              </select>
            </div>
          </div>

          {/* Image Uploads */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Images</label>
            <div className="flex flex-wrap gap-3 mb-4">
              {imagePreviews.map((src, idx) => (
                <div key={idx} className="relative group">
                  <div className="w-24 h-24 rounded-lg overflow-hidden border border-gray-200">
                    <img src={src} alt={`Preview ${idx}`} className="w-full h-full object-cover" />
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black bg-opacity-30">
                    <button
                      type="button"
                      onClick={() => setReplaceImageIndex(idx)}
                      className="p-1 bg-white rounded-full mr-1"
                      title="Replace image"
                    >
                      <Edit2 className="h-3 w-3 text-gray-600" />
                    </button>
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="p-1 bg-white rounded-full"
                      title="Remove image"
                    >
                      <X className="h-3 w-3 text-gray-600" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Plus className="h-6 w-6 text-gray-400 mb-1" />
                <p className="text-sm text-gray-500">Click to upload or drag and drop</p>
                <p className="text-xs text-gray-400">PNG, JPG (MAX. 5MB each)</p>
              </div>
              <input
                type="file"
                className="hidden"
                multiple
                accept="image/*"
                onChange={handleImageChange}
              />
            </label>

            {replaceImageIndex !== null && (
              <div className="mt-2 text-sm text-gray-500">Select a new image to replace the current one</div>
            )}
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-70"
              disabled={loading}
            >
              {loading ? (item ? 'Saving...' : 'Creating...') : item ? 'Save Changes' : 'Create Item'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoryItems;
