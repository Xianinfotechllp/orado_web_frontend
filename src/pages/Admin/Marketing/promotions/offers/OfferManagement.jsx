import React, { useState, useEffect } from 'react';
import { Plus, X, ChevronDown } from 'lucide-react';
import { fetchRestaurantsDropdown } from '../../../../../apis/adminApis/adminFuntionsApi';
import { fetchProductsByRestaurant } from '../../../../../apis/adminApis/restaurantApi'; // Import the products API

const CreateOfferForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    applicableLevel: 'restaurant',
    selectedRestaurants: [],
    selectedRestaurant: '',
    selectedProducts: [],
    offerType: 'flat',
    discountValue: '',
    maxDiscount: '',
    minOrderAmount: '',
    validFrom: '',
    validTill: '',
    usageLimitPerUser: 1,
    totalUsageLimit: '',
    comboGroups: []
  });

  const [restaurants, setRestaurants] = useState([]);
  const [restaurantProducts, setRestaurantProducts] = useState([]); // Store products for selected restaurant
  const [loadingRestaurants, setLoadingRestaurants] = useState(false);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState({
    restaurants: false,
    singleRestaurant: false,
    products: false
  });

  useEffect(() => {
    const loadRestaurants = async () => {
      setLoadingRestaurants(true);
      try {
        const restaurantData = await fetchRestaurantsDropdown();
        setRestaurants(restaurantData.data.map(item => ({
          name: item.name,
          id: item._id // Store both name and ID for each restaurant
        })));
      } catch (error) {
        console.error("Failed to load restaurants", error);
        setRestaurants([]);
      } finally {
        setLoadingRestaurants(false);
      }
    };

    loadRestaurants();
  }, []);

  useEffect(() => {
    // Load products when a restaurant is selected in product level
    if (formData.applicableLevel === 'product' && formData.selectedRestaurant) {
      const loadProducts = async () => {
        setLoadingProducts(true);
        try {
          const restaurantId = restaurants.find(r => r.name === formData.selectedRestaurant)?.id;
          if (restaurantId) {
            const productsData = await fetchProductsByRestaurant(restaurantId);
            setRestaurantProducts(productsData.data.map(product => ({
              id: product._id,
              name: product.name,
              price: product.price
            })));
          }
        } catch (error) {
          console.error("Failed to load products", error);
          setRestaurantProducts([]);
        } finally {
          setLoadingProducts(false);
        }
      };

      loadProducts();
    }
  }, [formData.selectedRestaurant, formData.applicableLevel, restaurants]);

  const handleInputChange = (field, value) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: value };
      
      // Reset products when restaurant changes in product level
      if (field === 'selectedRestaurant') {
        newData.selectedProducts = [];
      }
      
      // Reset offer type specific fields when level changes
      if (field === 'applicableLevel') {
        newData.selectedRestaurants = [];
        newData.selectedRestaurant = '';
        newData.selectedProducts = [];
        newData.offerType = 'flat';
        newData.comboGroups = [];
      }
      
      return newData;
    });
  };

  const handleMultiSelect = (field, item) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(item) 
        ? prev[field].filter(i => i !== item)
        : [...prev[field], item]
    }));
  };

  const addComboGroup = () => {
    setFormData(prev => ({
      ...prev,
      comboGroups: [
        ...prev.comboGroups,
        {
          id: Date.now(),
          products: [{ product: '', qty: 1 }, { product: '', qty: 1 }],
          comboPrice: ''
        }
      ]
    }));
  };

  const removeComboGroup = (groupId) => {
    setFormData(prev => ({
      ...prev,
      comboGroups: prev.comboGroups.filter(group => group.id !== groupId)
    }));
  };

  const updateComboGroup = (groupId, field, value, productIndex) => {
    setFormData(prev => ({
      ...prev,
      comboGroups: prev.comboGroups.map(group => {
        if (group.id === groupId) {
          if (field === 'product' || field === 'qty') {
            const updatedProducts = [...group.products];
            updatedProducts[productIndex] = {
              ...updatedProducts[productIndex],
              [field]: value
            };
            return { ...group, products: updatedProducts };
          }
          return { ...group, [field]: value };
        }
        return group;
      })
    }));
  };

  const addProductToCombo = (groupId) => {
    setFormData(prev => ({
      ...prev,
      comboGroups: prev.comboGroups.map(group => 
        group.id === groupId 
          ? { ...group, products: [...group.products, { product: '', qty: 1 }] }
          : group
      )
    }));
  };

  const removeProductFromCombo = (groupId, productIndex) => {
    setFormData(prev => ({
      ...prev,
      comboGroups: prev.comboGroups.map(group => 
        group.id === groupId 
          ? { ...group, products: group.products.filter((_, index) => index !== productIndex) }
          : group
      )
    }));
  };

  const handleSubmit = () => {
    console.log('Form submitted:', formData);
    alert('Offer created successfully!');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm border-2 border-gray-200 mb-6">
          <div className="bg-blue-600 text-white p-4 rounded-t-lg">
            <h1 className="text-xl font-bold text-center">📢 Create New Offer</h1>
          </div>
          
          <div className="p-6 space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title:</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter offer title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description:</label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter offer description"
                />
              </div>
            </div>

            {/* Applicable Level */}
            <div className="border-t pt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Applicable Level</h3>
                <ChevronDown className="h-5 w-5 text-gray-500" />
              </div>
              <div className="flex space-x-8">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="applicableLevel"
                    value="restaurant"
                    checked={formData.applicableLevel === 'restaurant'}
                    onChange={(e) => handleInputChange('applicableLevel', e.target.value)}
                    className="mr-2 text-blue-600"
                  />
                  <span className="font-medium">Restaurant Level</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="applicableLevel"
                    value="product"
                    checked={formData.applicableLevel === 'product'}
                    onChange={(e) => handleInputChange('applicableLevel', e.target.value)}
                    className="mr-2 text-blue-600"
                  />
                  <span className="font-medium">Product Level</span>
                </label>
              </div>
            </div>

            {/* Restaurant Level Section */}
            {formData.applicableLevel === 'restaurant' && (
              <div className="border-t pt-6 space-y-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">If "Restaurant Level" is selected:</h3>
                
                {/* Select Restaurants */}
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Select Restaurants:</label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setDropdownOpen(prev => ({ ...prev, restaurants: !prev.restaurants }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-between bg-white"
                      disabled={loadingRestaurants}
                    >
                      <span className="text-gray-700">
                        {loadingRestaurants ? 'Loading restaurants...' : 
                         formData.selectedRestaurants.length > 0 
                          ? `${formData.selectedRestaurants.length} selected`
                          : 'Select restaurants'
                        }
                      </span>
                      <ChevronDown className="h-4 w-4" />
                    </button>
                    {dropdownOpen.restaurants && !loadingRestaurants && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-48 overflow-y-auto">
                        {restaurants.map(restaurant => (
                          <label key={restaurant.id} className="flex items-center px-3 py-2 hover:bg-gray-50 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={formData.selectedRestaurants.includes(restaurant.name)}
                              onChange={() => handleMultiSelect('selectedRestaurants', restaurant.name)}
                              className="mr-2 text-blue-600"
                            />
                            {restaurant.name}
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Offer Type and Values for Restaurant Level */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Offer Type:</label>
                    <div className="flex space-x-6">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="offerType"
                          value="flat"
                          checked={formData.offerType === 'flat'}
                          onChange={(e) => handleInputChange('offerType', e.target.value)}
                          className="mr-2 text-blue-600"
                        />
                        Flat
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="offerType"
                          value="percentage"
                          checked={formData.offerType === 'percentage'}
                          onChange={(e) => handleInputChange('offerType', e.target.value)}
                          className="mr-2 text-blue-600"
                        />
                        Percentage
                      </label>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Discount Value: {formData.offerType === 'flat' ? '₹' : '%'}
                    </label>
                    <input
                      type="number"
                      value={formData.discountValue}
                      onChange={(e) => handleInputChange('discountValue', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Max Discount (₹): (Optional)</label>
                    <input
                      type="number"
                      value={formData.maxDiscount}
                      onChange={(e) => handleInputChange('maxDiscount', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Min Order Amount (₹): (Optional)</label>
                    <input
                      type="number"
                      value={formData.minOrderAmount}
                      onChange={(e) => handleInputChange('minOrderAmount', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Product Level Section */}
            {formData.applicableLevel === 'product' && (
              <div className="border-t pt-6 space-y-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">If "Product Level" is selected:</h3>
                
                {/* Select Single Restaurant */}
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Select Restaurant:</label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setDropdownOpen(prev => ({ ...prev, singleRestaurant: !prev.singleRestaurant }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-between bg-white"
                      disabled={loadingRestaurants}
                    >
                      <span className="text-gray-700">
                        {loadingRestaurants ? 'Loading restaurants...' : 
                         formData.selectedRestaurant || 'Select restaurant'}
                      </span>
                      <ChevronDown className="h-4 w-4" />
                    </button>
                    {dropdownOpen.singleRestaurant && !loadingRestaurants && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-48 overflow-y-auto">
                        {restaurants.map(restaurant => (
                          <button
                            key={restaurant.id}
                            type="button"
                            onClick={() => {
                              handleInputChange('selectedRestaurant', restaurant.name);
                              setDropdownOpen(prev => ({ ...prev, singleRestaurant: false }));
                            }}
                            className="w-full text-left px-3 py-2 hover:bg-gray-50 cursor-pointer"
                          >
                            {restaurant.name}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  {formData.selectedRestaurant && (
                    <p className="text-sm text-gray-600 mt-1">
                      {loadingProducts ? 'Loading products...' : '→ Products loaded'}
                    </p>
                  )}
                </div>

                {/* Select Products */}
                {formData.selectedRestaurant && (
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Select Products:</label>
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setDropdownOpen(prev => ({ ...prev, products: !prev.products }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-between bg-white"
                        disabled={loadingProducts}
                      >
                        <span className="text-gray-700">
                          {loadingProducts ? 'Loading products...' : 
                           formData.selectedProducts.length > 0 
                            ? `${formData.selectedProducts.length} selected`
                            : 'Select products'
                          }
                        </span>
                        <ChevronDown className="h-4 w-4" />
                      </button>
                      {dropdownOpen.products && !loadingProducts && (
                        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-48 overflow-y-auto">
                          {restaurantProducts.map(product => (
                            <label key={product.id} className="flex items-center px-3 py-2 hover:bg-gray-50 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={formData.selectedProducts.includes(product.name)}
                                onChange={() => handleMultiSelect('selectedProducts', product.name)}
                                className="mr-2 text-blue-600"
                              />
                              {product.name} (₹{product.price})
                            </label>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Offer Type for Product Level */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Offer Type:</label>
                  <div className="flex space-x-6">
                    {['flat', 'percentage', 'combo'].map(type => (
                      <label key={type} className="flex items-center">
                        <input
                          type="radio"
                          name="offerType"
                          value={type}
                          checked={formData.offerType === type}
                          onChange={(e) => handleInputChange('offerType', e.target.value)}
                          className="mr-2 text-blue-600"
                        />
                        <span className="capitalize">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Combo Groups */}
                {formData.offerType === 'combo' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-600">→ If Combo is selected:</p>
                      <button
                        type="button"
                        onClick={addComboGroup}
                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center text-sm"
                        disabled={loadingProducts}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Combo Group
                      </button>
                    </div>

                    {formData.comboGroups.map((group, groupIndex) => (
                      <div key={group.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-medium text-gray-900">Combo Group {groupIndex + 1}:</h4>
                          <button
                            type="button"
                            onClick={() => removeComboGroup(group.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>

                        {group.products.map((product, productIndex) => (
                          <div key={productIndex} className="flex items-center space-x-4 mb-3">
                            <div className="flex-1">
                              <label className="block text-xs text-gray-600 mb-1">Product {productIndex + 1}:</label>
                              <select
                                value={product.product}
                                onChange={(e) => updateComboGroup(group.id, 'product', e.target.value, productIndex)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                disabled={loadingProducts}
                              >
                                <option value="">Select Product</option>
                                {restaurantProducts.map(p => (
                                  <option key={p.id} value={p.name}>{p.name} (₹{p.price})</option>
                                ))}
                              </select>
                            </div>
                            <div className="w-20">
                              <label className="block text-xs text-gray-600 mb-1">Qty:</label>
                              <input
                                type="number"
                                value={product.qty}
                                onChange={(e) => updateComboGroup(group.id, 'qty', parseInt(e.target.value), productIndex)}
                                className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                min="1"
                              />
                            </div>
                            {group.products.length > 2 && (
                              <button
                                type="button"
                                onClick={() => removeProductFromCombo(group.id, productIndex)}
                                className="text-red-600 hover:text-red-800 mt-5"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            )}
                          </div>
                        ))}

                        <div className="flex items-center justify-between mt-4">
                          <button
                            type="button"
                            onClick={() => addProductToCombo(group.id)}
                            className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
                            disabled={loadingProducts}
                          >
                            <Plus className="h-3 w-3 mr-1" />
                            Add Product
                          </button>
                          <div className="w-48">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Combo Price: ₹</label>
                            <input
                              type="number"
                              value={group.comboPrice}
                              onChange={(e) => updateComboGroup(group.id, 'comboPrice', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="Enter combo price"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Discount Values for Product Level */}
                {formData.offerType !== 'combo' && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Discount Value: {formData.offerType === 'flat' ? '₹' : '%'}
                      </label>
                      <input
                        type="number"
                        value={formData.discountValue}
                        onChange={(e) => handleInputChange('discountValue', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Max Discount (₹): (Optional)</label>
                      <input
                        type="number"
                        value={formData.maxDiscount}
                        onChange={(e) => handleInputChange('maxDiscount', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Min Order Amount (₹): (Optional)</label>
                      <input
                        type="number"
                        value={formData.minOrderAmount}
                        onChange={(e) => handleInputChange('minOrderAmount', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Validity Dates */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Validity Dates</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Valid From: 📅</label>
                  <input
                    type="date"
                    value={formData.validFrom}
                    onChange={(e) => handleInputChange('validFrom', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Valid Till: 📅</label>
                  <input
                    type="date"
                    value={formData.validTill}
                    onChange={(e) => handleInputChange('validTill', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Usage Rules */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Usage Rules</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Usage Limit Per User: (Default 1)</label>
                  <input
                    type="number"
                    value={formData.usageLimitPerUser}
                    onChange={(e) => handleInputChange('usageLimitPerUser', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Total Usage Limit: (Optional)</label>
                  <input
                    type="number"
                    value={formData.totalUsageLimit}
                    onChange={(e) => handleInputChange('totalUsageLimit', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Optional"
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="border-t pt-6 flex justify-center space-x-4">
              <button
                type="button"
                onClick={handleSubmit}
                className="px-8 py-3 bg-green-600 text-white font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                🟩 Save Offer
              </button>
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="px-8 py-3 bg-red-600 text-white font-medium rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                ❌ Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateOfferForm;


