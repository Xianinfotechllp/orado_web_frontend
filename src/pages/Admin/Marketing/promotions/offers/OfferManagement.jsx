import React, { useState } from 'react';

const CreateOfferForm = () => {
  // Form state
  const [formData, setFormData] = useState({
    offerTitle: '',
    description: '',
    offerType: 'flat',
    createdBy: 'admin',
    restaurantId: '',
    applicableLevel: 'restaurant',
    productIds: [],
    applicableRestaurants: [],
    validFrom: '',
    validTill: '',
    isActive: true,
    usageLimitPerUser: 1,
    totalUsageLimit: 100,
    minOrderValue: 0,
    priority: 10,
    discountValue: 0,
    maxDiscount: 0,
    combos: [{
      comboTitle: '',
      comboPrice: 0,
      products: [{
        productId: '',
        quantity: 1
      }]
    }]
  });

  // Mock data for dropdowns
  const restaurants = [
    { id: '1', name: 'Burger King', products: [
      { id: '101', name: 'Cheeseburger', price: 5.99 },
      { id: '102', name: 'Chicken Sandwich', price: 6.99 }
    ]},
    { id: '2', name: 'McDonald\'s', products: [
      { id: '201', name: 'Big Mac', price: 4.99 },
      { id: '202', name: 'Quarter Pounder', price: 5.49 }
    ]},
    { id: '3', name: 'Pizza Hut', products: [
      { id: '301', name: 'Pepperoni Pizza', price: 12.99 },
      { id: '302', name: 'Veggie Pizza', price: 11.99 }
    ]},
    { id: '4', name: 'KFC', products: [
      { id: '401', name: 'Fried Chicken Bucket', price: 15.99 },
      { id: '402', name: 'Chicken Wings', price: 8.99 }
    ]},
  ];

  // Get all products for product level selection
  const allProducts = restaurants.flatMap(restaurant => 
    restaurant.products.map(product => ({
      ...product,
      restaurantId: restaurant.id,
      restaurantName: restaurant.name
    }))
  );

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Handle restaurant selection
  const handleRestaurantSelect = (restaurantId) => {
    if (formData.applicableRestaurants.includes(restaurantId)) {
      setFormData(prev => ({
        ...prev,
        applicableRestaurants: prev.applicableRestaurants.filter(id => id !== restaurantId)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        applicableRestaurants: [...prev.applicableRestaurants, restaurantId]
      }));
    }
  };

  // Handle product selection
  const handleProductSelect = (productId) => {
    if (formData.productIds.includes(productId)) {
      setFormData(prev => ({
        ...prev,
        productIds: prev.productIds.filter(id => id !== productId)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        productIds: [...prev.productIds, productId]
      }));
    }
  };

  // Handle combo changes
  const handleComboChange = (comboIndex, field, value) => {
    const updatedCombos = [...formData.combos];
    updatedCombos[comboIndex][field] = value;
    setFormData(prev => ({ ...prev, combos: updatedCombos }));
  };

  // Handle combo product changes
  const handleComboProductChange = (comboIndex, productIndex, field, value) => {
    const updatedCombos = [...formData.combos];
    updatedCombos[comboIndex].products[productIndex][field] = value;
    setFormData(prev => ({ ...prev, combos: updatedCombos }));
  };

  // Add new combo
  const addCombo = () => {
    setFormData(prev => ({
      ...prev,
      combos: [
        ...prev.combos,
        {
          comboTitle: '',
          comboPrice: 0,
          products: [{ productId: '', quantity: 1 }]
        }
      ]
    }));
  };

  // Add product to combo
  const addProductToCombo = (comboIndex) => {
    const updatedCombos = [...formData.combos];
    updatedCombos[comboIndex].products.push({ productId: '', quantity: 1 });
    setFormData(prev => ({ ...prev, combos: updatedCombos }));
  };

  // Remove combo
  const removeCombo = (comboIndex) => {
    if (formData.combos.length > 1) {
      const updatedCombos = formData.combos.filter((_, index) => index !== comboIndex);
      setFormData(prev => ({ ...prev, combos: updatedCombos }));
    }
  };

  // Remove product from combo
  const removeProductFromCombo = (comboIndex, productIndex) => {
    const updatedCombos = [...formData.combos];
    if (updatedCombos[comboIndex].products.length > 1) {
      updatedCombos[comboIndex].products.splice(productIndex, 1);
      setFormData(prev => ({ ...prev, combos: updatedCombos }));
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Here you would typically send the data to your API
  };

  // Get selected restaurant names
  const selectedRestaurantNames = formData.applicableRestaurants.map(id => 
    restaurants.find(r => r.id === id)?.name || ''
  ).filter(name => name);

  // Get selected product names
  const selectedProductNames = formData.productIds.map(id => 
    allProducts.find(p => p.id === id)?.name || ''
  ).filter(name => name);

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Form Header */}
          <div className="bg-blue-600 px-6 py-4">
            <h1 className="text-2xl font-bold text-white">Create New Offer</h1>
          </div>

          {/* Main Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Common Fields Section */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Basic Information</h2>
              
              {/* Offer Title */}
              <div>
                <label htmlFor="offerTitle" className="block text-sm font-medium text-gray-700 mb-1">
                  Offer Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="offerTitle"
                  name="offerTitle"
                  value={formData.offerTitle}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={3}
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Offer Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Offer Type <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {['flat', 'percentage', 'combo'].map((type) => (
                    <div key={type} className="flex items-center">
                      <input
                        type="radio"
                        id={`offerType-${type}`}
                        name="offerType"
                        value={type}
                        checked={formData.offerType === type}
                        onChange={handleChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                      <label htmlFor={`offerType-${type}`} className="ml-2 block text-sm text-gray-700 capitalize">
                        {type}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Created By */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Created By <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {['admin', 'restaurant'].map((creator) => (
                    <div key={creator} className="flex items-center">
                      <input
                        type="radio"
                        id={`createdBy-${creator}`}
                        name="createdBy"
                        value={creator}
                        checked={formData.createdBy === creator}
                        onChange={handleChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                      <label htmlFor={`createdBy-${creator}`} className="ml-2 block text-sm text-gray-700 capitalize">
                        {creator}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Restaurant Dropdown (conditional) */}
              {formData.createdBy === 'restaurant' && (
                <div>
                  <label htmlFor="restaurantId" className="block text-sm font-medium text-gray-700 mb-1">
                    Restaurant <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="restaurantId"
                    name="restaurantId"
                    value={formData.restaurantId}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select Restaurant</option>
                    {restaurants.map(restaurant => (
                      <option key={restaurant.id} value={restaurant.id}>{restaurant.name}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Applicable Level */}
              <div>
                <label htmlFor="applicableLevel" className="block text-sm font-medium text-gray-700 mb-1">
                  Applicable Level <span className="text-red-500">*</span>
                </label>
                <select
                  id="applicableLevel"
                  name="applicableLevel"
                  value={formData.applicableLevel}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="restaurant">Restaurant</option>
                  <option value="product">Product</option>
                </select>
              </div>

              {/* Restaurant Selection (for restaurant level) */}
              {formData.applicableLevel === 'restaurant' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Restaurants <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {restaurants.map(restaurant => (
                      <div 
                        key={restaurant.id}
                        onClick={() => handleRestaurantSelect(restaurant.id)}
                        className={`p-3 border rounded-md cursor-pointer transition-colors ${
                          formData.applicableRestaurants.includes(restaurant.id)
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            checked={formData.applicableRestaurants.includes(restaurant.id)}
                            readOnly
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <span className="ml-2 font-medium">{restaurant.name}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  {selectedRestaurantNames.length > 0 && (
                    <div className="mt-2">
                      <p className="text-sm text-gray-600">
                        Selected: {selectedRestaurantNames.join(', ')}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Product Selection (for product level) */}
              {formData.applicableLevel === 'product' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Products <span className="text-red-500">*</span>
                  </label>
                  <div className="space-y-2">
                    {allProducts.map(product => (
                      <div 
                        key={product.id}
                        onClick={() => handleProductSelect(product.id)}
                        className={`p-3 border rounded-md cursor-pointer transition-colors ${
                          formData.productIds.includes(product.id)
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            checked={formData.productIds.includes(product.id)}
                            readOnly
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <div className="ml-2">
                            <span className="font-medium">{product.name}</span>
                            <span className="text-sm text-gray-500 ml-2">({product.restaurantName})</span>
                            <span className="text-sm text-gray-700 ml-2">${product.price.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  {selectedProductNames.length > 0 && (
                    <div className="mt-2">
                      <p className="text-sm text-gray-600">
                        Selected: {selectedProductNames.join(', ')}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Validity Period */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="validFrom" className="block text-sm font-medium text-gray-700 mb-1">
                    Valid From <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="datetime-local"
                    id="validFrom"
                    name="validFrom"
                    value={formData.validFrom}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="validTill" className="block text-sm font-medium text-gray-700 mb-1">
                    Valid Till <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="datetime-local"
                    id="validTill"
                    name="validTill"
                    value={formData.validTill}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Toggle and Limits */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isActive"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">
                    Is Active
                  </label>
                </div>
                <div>
                  <label htmlFor="usageLimitPerUser" className="block text-sm font-medium text-gray-700 mb-1">
                    Usage Limit Per User
                  </label>
                  <input
                    type="number"
                    id="usageLimitPerUser"
                    name="usageLimitPerUser"
                    min="1"
                    value={formData.usageLimitPerUser}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="totalUsageLimit" className="block text-sm font-medium text-gray-700 mb-1">
                    Total Usage Limit
                  </label>
                  <input
                    type="number"
                    id="totalUsageLimit"
                    name="totalUsageLimit"
                    min="1"
                    value={formData.totalUsageLimit}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
                    Priority
                  </label>
                  <input
                    type="number"
                    id="priority"
                    name="priority"
                    min="1"
                    value={formData.priority}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Min Order Value */}
              <div>
                <label htmlFor="minOrderValue" className="block text-sm font-medium text-gray-700 mb-1">
                  Minimum Order Value
                </label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">$</span>
                  </div>
                  <input
                    type="number"
                    id="minOrderValue"
                    name="minOrderValue"
                    min="0"
                    step="0.01"
                    value={formData.minOrderValue}
                    onChange={handleChange}
                    className="block w-full pl-7 pr-12 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">USD</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Conditional Sections Based on Offer Type */}
            <div className="space-y-6">
              {/* Flat/Percentage Discount Section */}
              {(formData.offerType === 'flat' || formData.offerType === 'percentage') && (
                <>
                  <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Discount Details</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="discountValue" className="block text-sm font-medium text-gray-700 mb-1">
                        {formData.offerType === 'flat' ? 'Discount Amount' : 'Discount Percentage'} <span className="text-red-500">*</span>
                      </label>
                      <div className="relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <span className="text-gray-500 sm:text-sm">
                            {formData.offerType === 'flat' ? '$' : '%'}
                          </span>
                        </div>
                        <input
                          type="number"
                          id="discountValue"
                          name="discountValue"
                          min="0"
                          step={formData.offerType === 'flat' ? "0.01" : "1"}
                          value={formData.discountValue}
                          onChange={handleChange}
                          required
                          className="block w-full pl-7 pr-12 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                          <span className="text-gray-500 sm:text-sm">
                            {formData.offerType === 'flat' ? 'USD' : ''}
                          </span>
                        </div>
                      </div>
                    </div>
                    {formData.offerType === 'percentage' && (
                      <div>
                        <label htmlFor="maxDiscount" className="block text-sm font-medium text-gray-700 mb-1">
                          Maximum Discount Amount
                        </label>
                        <div className="relative rounded-md shadow-sm">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span className="text-gray-500 sm:text-sm">$</span>
                          </div>
                          <input
                            type="number"
                            id="maxDiscount"
                            name="maxDiscount"
                            min="0"
                            step="0.01"
                            value={formData.maxDiscount}
                            onChange={handleChange}
                            className="block w-full pl-7 pr-12 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          />
                          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                            <span className="text-gray-500 sm:text-sm">USD</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* Combo Section */}
              {formData.offerType === 'combo' && (
                <>
                  <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Combo Details</h2>
                  {formData.combos.map((combo, comboIndex) => (
                    <div key={comboIndex} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-medium text-gray-800">Combo #{comboIndex + 1}</h3>
                        {formData.combos.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeCombo(comboIndex)}
                            className="text-red-600 hover:text-red-800 text-sm font-medium"
                          >
                            Remove Combo
                          </button>
                        )}
                      </div>

                      {/* Combo Title */}
                      <div className="mb-4">
                        <label htmlFor={`comboTitle-${comboIndex}`} className="block text-sm font-medium text-gray-700 mb-1">
                          Combo Title <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          id={`comboTitle-${comboIndex}`}
                          value={combo.comboTitle}
                          onChange={(e) => handleComboChange(comboIndex, 'comboTitle', e.target.value)}
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>

                      {/* Combo Price */}
                      <div className="mb-4">
                        <label htmlFor={`comboPrice-${comboIndex}`} className="block text-sm font-medium text-gray-700 mb-1">
                          Combo Price <span className="text-red-500">*</span>
                        </label>
                        <div className="relative rounded-md shadow-sm">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span className="text-gray-500 sm:text-sm">$</span>
                          </div>
                          <input
                            type="number"
                            id={`comboPrice-${comboIndex}`}
                            min="0"
                            step="0.01"
                            value={combo.comboPrice}
                            onChange={(e) => handleComboChange(comboIndex, 'comboPrice', e.target.value)}
                            required
                            className="block w-full pl-7 pr-12 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          />
                          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                            <span className="text-gray-500 sm:text-sm">USD</span>
                          </div>
                        </div>
                      </div>

                      {/* Combo Products */}
                      <div className="space-y-4">
                        <label className="block text-sm font-medium text-gray-700">Products in Combo</label>
                        {combo.products.map((product, productIndex) => (
                          <div key={productIndex} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                            <div>
                              <label htmlFor={`product-${comboIndex}-${productIndex}`} className="block text-sm font-medium text-gray-700 mb-1">
                                Product <span className="text-red-500">*</span>
                              </label>
                              <select
                                id={`product-${comboIndex}-${productIndex}`}
                                value={product.productId}
                                onChange={(e) => handleComboProductChange(comboIndex, productIndex, 'productId', e.target.value)}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                              >
                                <option value="">Select Product</option>
                                {allProducts.map(p => (
                                  <option key={p.id} value={p.id}>
                                    {p.name} (${p.price.toFixed(2)})
                                  </option>
                                ))}
                              </select>
                            </div>
                            <div>
                              <label htmlFor={`quantity-${comboIndex}-${productIndex}`} className="block text-sm font-medium text-gray-700 mb-1">
                                Quantity <span className="text-red-500">*</span>
                              </label>
                              <input
                                type="number"
                                id={`quantity-${comboIndex}-${productIndex}`}
                                min="1"
                                value={product.quantity}
                                onChange={(e) => handleComboProductChange(comboIndex, productIndex, 'quantity', e.target.value)}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                              />
                            </div>
                            <div className="flex justify-end">
                              {combo.products.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => removeProductFromCombo(comboIndex, productIndex)}
                                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                >
                                  Remove
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                        <div className="pt-2">
                          <button
                            type="button"
                            onClick={() => addProductToCombo(comboIndex)}
                            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          >
                            Add Product
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={addCombo}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Add Another Combo
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Form Actions */}
            <div className="flex justify-between pt-6 border-t border-gray-200">
              <button
                type="button"
                className="inline-flex justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Create Offer
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateOfferForm;