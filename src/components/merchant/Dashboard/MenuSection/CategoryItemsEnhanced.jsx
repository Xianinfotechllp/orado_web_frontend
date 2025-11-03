import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  ChevronRight,
  Search,
  Plus,
  MoreVertical,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  X,
  Star,
  Clock,
  Truck,
  Shield,
  CreditCard,
  Wallet,
  Heart,
  Zap,
  Timer,
  Percent,
  CheckCircle,
  AlertCircle,
  Filter,
} from 'lucide-react';
import apiClient from '../../../../apis/apiClient/apiClient';

const CategoryItemsEnhanced = () => {
  const { restaurantId, categoryId } = useParams();
  const navigate = useNavigate();
  
  // State management
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState({
    categories: false,
    products: false,
    restaurant: false,
    actions: false,
  });
  const [error, setError] = useState({
    categories: null,
    products: null,
    restaurant: null,
  });
  
  // UI state
  const [openDropdown, setOpenDropdown] = useState(null);
  const [showDropdown, setShowDropdown] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [editModalState, setEditModalState] = useState({
    show: false,
    product: null,
  });
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [editCategoryModal, setEditCategoryModal] = useState({
    show: false,
    category: null,
  });

  const dropdownRef = useRef(null);

  // Fetch initial data
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(prev => ({ ...prev, restaurant: true, categories: true }));

        // Fetch restaurant data
        const restaurantRes = await apiClient.get(`/restaurants/${restaurantId}`);
        setRestaurant(restaurantRes.data.data);

        // Fetch categories
        const categoriesRes = await apiClient.get(`/admin/restaurant/${restaurantId}/category`);
        const categoriesData = categoriesRes.data.data || [];
        setCategories(categoriesData);

        // Set selected category to the current categoryId
        const currentCategory = categoriesData.find(cat => cat._id === categoryId);
        setSelectedCategory(currentCategory || categoriesData[0]);

        setError(prev => ({
          ...prev,
          restaurant: null,
          categories: null,
        }));
      } catch (err) {
        setError(prev => ({
          ...prev,
          restaurant: err.message,
          categories: err.message,
        }));
        console.error('Error fetching initial data:', err);
      } finally {
        setLoading(prev => ({ ...prev, restaurant: false, categories: false }));
      }
    };

    fetchInitialData();
  }, [restaurantId, categoryId]);

  // Fetch products when selected category changes
  useEffect(() => {
    if (!selectedCategory) return;

    const fetchProducts = async () => {
      setLoading(prev => ({ ...prev, products: true }));
      setError(prev => ({ ...prev, products: null }));

      try {
        const productsRes = await apiClient.get(`/admin/restaurant/${restaurantId}/category/${selectedCategory._id}`);
        const productsData = productsRes.data.data || [];
        
        // Filter products based on search and filter
        let filteredProducts = productsData;
        
        if (searchQuery) {
          filteredProducts = filteredProducts.filter(product =>
            product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.description?.toLowerCase().includes(searchQuery.toLowerCase())
          );
        }

        if (activeFilter === 'active') {
          filteredProducts = filteredProducts.filter(product => product.active);
        } else if (activeFilter === 'inactive') {
          filteredProducts = filteredProducts.filter(product => !product.active);
        }

        setProducts(filteredProducts);
        setSelectedProduct(filteredProducts[0] || null);
      } catch (err) {
        setError(prev => ({ ...prev, products: err.message }));
        console.error('Error fetching products:', err);
      } finally {
        setLoading(prev => ({ ...prev, products: false }));
      }
    };

    const debounceTimer = setTimeout(fetchProducts, 300);
    return () => clearTimeout(debounceTimer);
  }, [restaurantId, selectedCategory, searchQuery, activeFilter]);

  // Handle clicks outside dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdown(null);
        setShowDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Category handlers
  const handleEditCategory = (category) => {
    setEditCategoryModal({
      show: true,
      category: category,
    });
    setOpenDropdown(null);
  };

  const handleDeleteCategory = async (categoryId) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;

    try {
      setLoading(prev => ({ ...prev, actions: true }));
      await apiClient.delete(`/admin/restaurant/${restaurantId}/category/${categoryId}`);
      
      setCategories(prev => prev.filter(cat => cat._id !== categoryId));
      
      if (selectedCategory?._id === categoryId) {
        setSelectedCategory(categories[0] || null);
      }
    } catch (error) {
      console.error('Error deleting category:', error);
      alert('Failed to delete category');
    } finally {
      setLoading(prev => ({ ...prev, actions: false }));
    }
  };

  const handleToggleCategoryActive = async (categoryId, currentStatus) => {
    try {
      setLoading(prev => ({ ...prev, actions: true }));
      
      const updatedCategory = await apiClient.put(`/admin/restaurant/${restaurantId}/category/${categoryId}`, {
        active: !currentStatus
      });

      setCategories(prev =>
        prev.map(cat => cat._id === categoryId ? updatedCategory.data.category : cat)
      );

      if (selectedCategory?._id === categoryId) {
        setSelectedCategory(updatedCategory.data.category);
      }
    } catch (error) {
      console.error('Error toggling category status:', error);
      alert('Failed to update category status');
    } finally {
      setLoading(prev => ({ ...prev, actions: false }));
    }
  };

  // Product handlers
  const handleProductCreate = async (productData) => {
    try {
      setLoading(prev => ({ ...prev, actions: true }));
      
      const formData = new FormData();
      formData.append('restaurantId', restaurantId);
      formData.append('categoryId', selectedCategory._id);
      formData.append('name', productData.name);
      formData.append('description', productData.description);
      formData.append('price', productData.price);
      formData.append('active', productData.active);
      formData.append('foodType', productData.foodType);
      formData.append('unit', productData.unit);
      formData.append('stock', productData.stock);
      formData.append('reorderLevel', productData.reorderLevel);
      formData.append('minQty', productData.minQty);
      formData.append('maxQty', productData.maxQty || '');
      formData.append('costPrice', productData.costPrice || '');
      formData.append('preparationTime', productData.preparationTime || '');
      formData.append('isRecurring', productData.isRecurring);
      formData.append('availability', productData.availability?.type || 'always');

      if (productData.images) {
        productData.images.forEach(file => {
          formData.append('images', file);
        });
      }

      const response = await apiClient.post(`/admin/restaurant/${restaurantId}/product`, formData);
      
      setProducts(prev => [...prev, response.data.data]);
      setSelectedProduct(response.data.data);
      setShowAddProduct(false);
    } catch (error) {
      console.error('Error creating product:', error);
      alert('Failed to create product');
    } finally {
      setLoading(prev => ({ ...prev, actions: false }));
    }
  };

  const handleUpdateProduct = async (productData) => {
    try {
      setLoading(prev => ({ ...prev, actions: true }));
      
      const formData = new FormData();
      formData.append('restaurantId', restaurantId);
      formData.append('name', productData.name);
      formData.append('description', productData.description);
      formData.append('price', productData.price);
      formData.append('active', productData.active);
      formData.append('foodType', productData.foodType);
      formData.append('unit', productData.unit);
      formData.append('stock', productData.stock);
      formData.append('reorderLevel', productData.reorderLevel);
      formData.append('minQty', productData.minQty);
      formData.append('maxQty', productData.maxQty || '');
      formData.append('costPrice', productData.costPrice || '');
      formData.append('preparationTime', productData.preparationTime || '');
      formData.append('isRecurring', productData.isRecurring);
      formData.append('availability', productData.availability?.type || 'always');

      if (productData.newImages) {
        productData.newImages.forEach(file => {
          formData.append('images', file);
        });
      }

      const response = await apiClient.put(
        `/admin/restaurant/${restaurantId}/product/${selectedProduct._id}`,
        formData
      );

      setProducts(prev =>
        prev.map(product => product._id === selectedProduct._id ? response.data.data : product)
      );

      setEditModalState({ show: false, product: null });
    } catch (error) {
      console.error('Error updating product:', error);
      alert('Failed to update product');
    } finally {
      setLoading(prev => ({ ...prev, actions: false }));
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      setLoading(prev => ({ ...prev, actions: true }));
      
      await apiClient.delete(`/restaurants/products/${productId}`);

      setProducts(prev => {
        const updated = prev.filter(p => p._id !== productId);
        if (selectedProduct?._id === productId) {
          setSelectedProduct(updated[0] || null);
        }
        return updated;
      });
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Failed to delete product');
    } finally {
      setLoading(prev => ({ ...prev, actions: false }));
    }
  };

  const handleToggleProductActive = async (productId, currentStatus) => {
    try {
      setLoading(prev => ({ ...prev, actions: true }));
      
      // Optimistically update UI
      const newStatus = !currentStatus;
      setProducts(prevProducts => 
        prevProducts.map(product => 
          product._id === productId 
            ? { ...product, active: newStatus } 
            : product
        )
      );
      
      if (selectedProduct?._id === productId) {
        setSelectedProduct(prev => ({ ...prev, active: newStatus }));
      }

      // Make API call
      await apiClient.put(`/restaurants/products/${productId}`, {
        active: newStatus
      });
    } catch (error) {
      // Revert on error
      setProducts(prevProducts => 
        prevProducts.map(product => 
          product._id === productId 
            ? { ...product, active: currentStatus } 
            : product
        )
      );
      
      if (selectedProduct?._id === productId) {
        setSelectedProduct(prev => ({ ...prev, active: currentStatus }));
      }

      console.error('Error toggling product status:', error);
      alert('Failed to update product status');
    } finally {
      setLoading(prev => ({ ...prev, actions: false }));
    }
  };

  if (loading.restaurant || loading.categories) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center text-orange-500 font-bold">Loading...</div>
      </div>
    );
  }

  if (error.restaurant || error.categories) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🍽️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Oops! Something went wrong</h2>
          <p className="text-gray-600 mb-4">{error.restaurant || error.categories}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-gray-600 hover:text-orange-500 text-sm font-medium"
            >
              <ChevronLeft className="h-5 w-5 mr-1" />
              Back to Categories
            </button>
            <h1 className="text-xl font-bold text-gray-900">Menu Management</h1>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowAddCategory(true)}
                className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Category
              </button>
              <button
                onClick={() => setShowAddProduct(true)}
                disabled={!selectedCategory}
                className="flex items-center px-3 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-sm font-medium disabled:opacity-50"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Product
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Categories Column */}
          <div className="lg:w-1/4 bg-white rounded-lg shadow-sm p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-gray-800">
                Categories ({categories.length})
              </h3>
            </div>

            {loading.categories ? (
              <div className="text-center py-4 text-gray-500">Loading categories...</div>
            ) : categories.length === 0 ? (
              <div className="text-center py-4 text-gray-500">No categories found</div>
            ) : (
              <ul className="space-y-2 max-h-[calc(100vh-300px)] overflow-y-auto">
                {categories.map((category) => (
                  <li
                    key={category._id}
                    className={`p-3 rounded-md flex justify-between items-center cursor-pointer transition-colors relative ${
                      selectedCategory?._id === category._id
                        ? "bg-blue-50 border border-blue-200"
                        : "hover:bg-gray-50"
                    }`}
                    onClick={() => setSelectedCategory(category)}
                  >
                    <span
                      className={`truncate ${
                        category.active ? "font-medium" : "text-gray-500"
                      }`}
                      title={category.name}
                    >
                      {category.name}
                    </span>
                    <div className="flex items-center">
                      <span className="text-xs bg-gray-100 px-2 py-1 rounded mr-2">
                        {category.productCount || 0}
                      </span>
                      <div className="relative" ref={dropdownRef}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenDropdown(
                              openDropdown === category._id ? null : category._id
                            );
                          }}
                          className="p-1 text-gray-500 hover:text-gray-700 rounded hover:bg-gray-100"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </button>

                        {openDropdown === category._id && (
                          <div className="absolute right-0 top-8 z-[1000] w-40 bg-white rounded-md shadow-xl border border-gray-200">
                            <div className="py-1">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEditCategory(category);
                                  setOpenDropdown(null);
                                }}
                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                              >
                                <Edit2 className="h-4 w-4 mr-2" /> Edit
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteCategory(category._id);
                                  setOpenDropdown(null);
                                }}
                                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center"
                              >
                                <Trash2 className="h-4 w-4 mr-2" /> Delete
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleToggleCategoryActive(
                                    category._id,
                                    category.active
                                  );
                                  setOpenDropdown(null);
                                }}
                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                              >
                                {category.active ? (
                                  <EyeOff className="h-4 w-4 mr-2" />
                                ) : (
                                  <Eye className="h-4 w-4 mr-2" />
                                )}
                                {category.active ? "Deactivate" : "Activate"}
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Products Column */}
          <div className="lg:w-1/4 bg-white rounded-lg shadow-sm p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-gray-800">
                Products ({products.length})
              </h3>
            </div>

            {/* Search and Filter */}
            <div className="mb-4 space-y-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                />
              </div>
              <select
                value={activeFilter}
                onChange={(e) => setActiveFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
              >
                <option value="all">All Products</option>
                <option value="active">Active Only</option>
                <option value="inactive">Inactive Only</option>
              </select>
            </div>

            {loading.products ? (
              <div className="text-center py-4 text-gray-500">Loading products...</div>
            ) : products.length === 0 ? (
              <div className="text-center py-4 text-gray-500">
                {selectedCategory
                  ? "No products in this category"
                  : "Select a category to view products"}
              </div>
            ) : (
              <ul className="space-y-2 max-h-[calc(100vh-400px)] overflow-y-auto">
                {products.map((product) => (
                  <li
                    key={product._id}
                    className={`p-3 rounded-md flex justify-between items-center transition-colors ${
                      selectedProduct?._id === product._id
                        ? "bg-blue-50 border border-blue-200"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    <div
                      className="flex-grow cursor-pointer truncate"
                      onClick={() => setSelectedProduct(product)}
                      title={product.name}
                    >
                      <span
                        className={`${
                          product.active ? "font-medium" : "text-gray-500"
                        }`}
                      >
                        {product.name}
                      </span>
                    </div>

                    <div className="relative" ref={dropdownRef}>
                      <button
                        className="p-1 rounded hover:bg-gray-100"
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowDropdown(
                            showDropdown === product._id ? null : product._id
                          );
                        }}
                        disabled={loading.actions}
                      >
                        <MoreVertical className="h-4 w-4 text-gray-500" />
                      </button>

                      {showDropdown === product._id && (
                        <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                          <div className="py-1">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditModalState({
                                  show: true,
                                  product: product,
                                });
                                setShowDropdown(null);
                              }}
                              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                              disabled={loading.actions}
                            >
                              <Edit2 className="h-4 w-4 mr-2" /> Edit
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteProduct(product._id);
                                setShowDropdown(null);
                              }}
                              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center"
                              disabled={loading.actions}
                            >
                              <Trash2 className="h-4 w-4 mr-2" /> Delete
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleToggleProductActive(product._id, product.active);
                                setShowDropdown(null);
                              }}
                              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                              disabled={loading.actions}
                            >
                              {product.active ? (
                                <>
                                  <EyeOff className="h-4 w-4 mr-2" /> Deactivate
                                </>
                              ) : (
                                <>
                                  <Eye className="h-4 w-4 mr-2" /> Activate
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Product Details Column */}
          <div className="lg:w-2/4 bg-white rounded-lg shadow-sm p-4">
            <h3 className="font-semibold text-gray-800 mb-4">Product Details</h3>

            {selectedProduct ? (
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="md:w-1/3">
                    <img
                      src={
                        selectedProduct.images?.[0] ||
                        "https://via.placeholder.com/300"
                      }
                      alt={selectedProduct.name}
                      className="w-full h-auto rounded-md object-cover aspect-square"
                    />
                  </div>
                  <div className="md:w-2/3 space-y-3">
                    <h4 className="text-xl font-bold">{selectedProduct.name}</h4>
                    <p className="text-lg font-semibold text-gray-700">
                      ₹{selectedProduct.price?.toFixed(2)}
                    </p>
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          selectedProduct.foodType === "veg"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {selectedProduct.foodType === "veg"
                          ? "Vegetarian"
                          : "Non-Vegetarian"}
                      </span>
                      <span className="px-2 py-1 rounded-full bg-gray-100 text-gray-800 text-xs font-medium">
                        {selectedProduct.unit || "piece"}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedProduct.active}
                          onChange={() => handleToggleProductActive(selectedProduct._id, selectedProduct.active)}
                          className="sr-only peer"
                          disabled={loading.actions}
                        />
                        <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-green-500"></div>
                      </label>
                      <span className="text-xs font-medium">
                        {selectedProduct.active ? 'Active' : 'Inactive'}
                      </span>
                    </div>

                    <p className="text-gray-600 line-clamp-3">
                      {selectedProduct.description}
                    </p>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-2">Details</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Preparation Time</p>
                      <p className="font-medium">
                        {selectedProduct.preparationTime
                          ? `${selectedProduct.preparationTime} mins`
                          : "Not specified"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Order Quantities</p>
                      <p className="font-medium">
                        Min: {selectedProduct.minQty || 1}, Max:{" "}
                        {selectedProduct.maxQty || "No limit"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Stock</p>
                      <p className="font-medium">
                        {selectedProduct.stock || 0} units
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Reorder Level</p>
                      <p className="font-medium">
                        {selectedProduct.reorderLevel || 0} units
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Cost Price</p>
                      <p className="font-medium">
                        {selectedProduct.costPrice ? `₹${selectedProduct.costPrice}` : "Not set"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Status</p>
                      <p
                        className={`font-medium ${
                          selectedProduct.active
                            ? "text-green-600"
                            : "text-gray-500"
                        }`}
                      >
                        {selectedProduct.active ? "Active" : "Inactive"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-2">Full Description</h4>
                  <p className="text-gray-600 whitespace-pre-line">
                    {selectedProduct.description || "No description available"}
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                {products.length === 0
                  ? "No products available"
                  : "Select a product to view details"}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Product Modal */}
      {showAddProduct && (
        <AddProductModal
          onClose={() => setShowAddProduct(false)}
          onSubmit={handleProductCreate}
          categoryName={selectedCategory?.name || ""}
          restaurantId={restaurantId}
          categoryId={selectedCategory?._id}
        />
      )}

      {/* Edit Product Modal */}
      {editModalState.show && (
        <EditProductModal
          onClose={() => setEditModalState({ show: false, product: null })}
          onSubmit={handleUpdateProduct}
          product={editModalState.product}
          categoryName={selectedCategory?.name || ""}
          restaurantId={restaurantId}
        />
      )}

      {/* Add Category Modal */}
      {showAddCategory && (
        <AddCategoryModal
          onClose={() => setShowAddCategory(false)}
          onSubmit={(categoryData) => {
            // Handle category creation
            console.log('Category data:', categoryData);
            setShowAddCategory(false);
          }}
        />
      )}

      {/* Edit Category Modal */}
      {editCategoryModal.show && (
        <EditCategoryModal
          onClose={() => setEditCategoryModal({ show: false, category: null })}
          onSubmit={(categoryData) => {
            // Handle category update
            console.log('Updated category data:', categoryData);
            setEditCategoryModal({ show: false, category: null });
          }}
          category={editCategoryModal.category}
        />
      )}
    </div>
  );
};

// Placeholder components for modals
const AddProductModal = ({ onClose, onSubmit, categoryName, restaurantId, categoryId }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-bold mb-4">Add Product to {categoryName}</h3>
        <p className="text-gray-600 mb-4">Product creation modal will be implemented here</p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              // Placeholder for product creation
              onSubmit({
                name: "Sample Product",
                description: "Sample description",
                price: 100,
                active: true,
                foodType: "veg",
                unit: "piece",
                stock: 10,
                reorderLevel: 5,
                minQty: 1,
                maxQty: 10,
                costPrice: 80,
                preparationTime: 15,
                isRecurring: false,
                availability: { type: "always" },
                images: []
              });
            }}
            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
          >
            Create Product
          </button>
        </div>
      </div>
    </div>
  );
};

const EditProductModal = ({ onClose, onSubmit, product, categoryName, restaurantId }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-bold mb-4">Edit Product in {categoryName}</h3>
        <p className="text-gray-600 mb-4">Product edit modal will be implemented here</p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              // Placeholder for product update
              onSubmit({
                ...product,
                name: product.name + " (Updated)",
                price: product.price + 10
              });
            }}
            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
          >
            Update Product
          </button>
        </div>
      </div>
    </div>
  );
};

const AddCategoryModal = ({ onClose, onSubmit }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-bold mb-4">Add Category</h3>
        <p className="text-gray-600 mb-4">Category creation modal will be implemented here</p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onSubmit({
                name: "Sample Category",
                description: "Sample category description",
                active: true
              });
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Create Category
          </button>
        </div>
      </div>
    </div>
  );
};

const EditCategoryModal = ({ onClose, onSubmit, category }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-bold mb-4">Edit Category</h3>
        <p className="text-gray-600 mb-4">Category edit modal will be implemented here</p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onSubmit({
                ...category,
                name: category.name + " (Updated)"
              });
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Update Category
          </button>
        </div>
      </div>
    </div>
  );
};

export default CategoryItemsEnhanced; 