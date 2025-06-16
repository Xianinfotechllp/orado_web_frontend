import React, { useState } from 'react';
import { Save, Settings, Truck, MapPin, Package, Plus, Trash2, Info } from 'lucide-react';

const DeliveryFeeSettings = () => {
  const [settings, setSettings] = useState({
    deliveryFeeType: 'Fixed',
    baseDeliveryFee: 30,
    baseDistance: 2,
    perKmFee: 5,
    orderTypeDeliveryFees: [
      { category: 'food', fee: 25, label: 'Food Items' },
      { category: 'meat', fee: 35, label: 'Meat Products' },
      { category: 'grocery', fee: 20, label: 'Grocery Items' }
    ]
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  const deliveryFeeTypes = [
    { value: 'Fixed', label: 'Fixed Amount', icon: Package, description: 'Same fee for all deliveries' },
    { value: 'Per KM', label: 'Distance Based', icon: MapPin, description: 'Fee based on delivery distance' },
    { value: 'Per Order Type', label: 'Category Based', icon: Truck, description: 'Different fees for different categories' }
  ];

  const orderCategories = [
    { value: 'food', label: 'Food Items' },
    { value: 'meat', label: 'Meat Products' },
    { value: 'grocery', label: 'Grocery Items' },
    { value: 'beverages', label: 'Beverages' },
    { value: 'desserts', label: 'Desserts' },
    { value: 'pharmacy', label: 'Pharmacy' }
  ];

  const handleDeliveryFeeTypeChange = (type) => {
    setSettings({ ...settings, deliveryFeeType: type });
  };

  const handleBaseDeliveryFeeChange = (value) => {
    setSettings({ ...settings, baseDeliveryFee: parseFloat(value) || 0 });
  };

  const handleBaseDistanceChange = (value) => {
    setSettings({ ...settings, baseDistance: parseFloat(value) || 0 });
  };

  const handlePerKmFeeChange = (value) => {
    setSettings({ ...settings, perKmFee: parseFloat(value) || 0 });
  };

  const handleOrderTypeFeeChange = (index, field, value) => {
    const updatedFees = [...settings.orderTypeDeliveryFees];
    if (field === 'fee') {
      updatedFees[index][field] = parseFloat(value) || 0;
    } else {
      updatedFees[index][field] = value;
      // Update label when category changes
      const categoryInfo = orderCategories.find(cat => cat.value === value);
      if (categoryInfo) {
        updatedFees[index].label = categoryInfo.label;
      }
    }
    setSettings({ ...settings, orderTypeDeliveryFees: updatedFees });
  };

  const addOrderTypeFee = () => {
    const availableCategories = orderCategories.filter(cat => 
      !settings.orderTypeDeliveryFees.some(fee => fee.category === cat.value)
    );
    
    if (availableCategories.length > 0) {
      const newCategory = availableCategories[0];
      setSettings({
        ...settings,
        orderTypeDeliveryFees: [
          ...settings.orderTypeDeliveryFees,
          { category: newCategory.value, fee: 0, label: newCategory.label }
        ]
      });
    }
  };

  const removeOrderTypeFee = (index) => {
    const updatedFees = settings.orderTypeDeliveryFees.filter((_, i) => i !== index);
    setSettings({ ...settings, orderTypeDeliveryFees: updatedFees });
  };

  const handleSave = async () => {
    setIsSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      setSaveMessage('Settings saved successfully!');
      setTimeout(() => setSaveMessage(''), 3000);
    }, 1000);
  };

  const getSelectedTypeInfo = () => {
    return deliveryFeeTypes.find(type => type.value === settings.deliveryFeeType);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-2">
            <Settings className="w-8 h-8 text-blue-600 mr-3" />
            <h1 className="text-3xl font-bold text-gray-900">Delivery Fee Settings</h1>
          </div>
          <p className="text-gray-600">Configure how delivery fees are calculated for your platform</p>
        </div>

        {/* Main Settings Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          
          {/* Delivery Fee Type Selection */}
          <div className="p-8 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Delivery Fee Structure</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {deliveryFeeTypes.map((type) => {
                const IconComponent = type.icon;
                const isSelected = settings.deliveryFeeType === type.value;
                
                return (
                  <div
                    key={type.value}
                    onClick={() => handleDeliveryFeeTypeChange(type.value)}
                    className={`relative p-6 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex flex-col items-center text-center">
                      <div className={`p-3 rounded-full mb-3 ${
                        isSelected ? 'bg-blue-100' : 'bg-gray-100'
                      }`}>
                        <IconComponent className={`w-6 h-6 ${
                          isSelected ? 'text-blue-600' : 'text-gray-600'
                        }`} />
                      </div>
                      <h3 className={`font-semibold mb-1 ${
                        isSelected ? 'text-blue-900' : 'text-gray-900'
                      }`}>
                        {type.label}
                      </h3>
                      <p className={`text-sm ${
                        isSelected ? 'text-blue-700' : 'text-gray-600'
                      }`}>
                        {type.description}
                      </p>
                    </div>
                    
                    {isSelected && (
                      <div className="absolute top-3 right-3">
                        <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Configuration Section */}
          <div className="p-8">
            <div className="flex items-center mb-6">
              <div className="p-2 bg-blue-100 rounded-lg mr-3">
                {React.createElement(getSelectedTypeInfo()?.icon, { 
                  className: "w-5 h-5 text-blue-600" 
                })}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {getSelectedTypeInfo()?.label} Configuration
                </h3>
                <p className="text-sm text-gray-600">
                  {getSelectedTypeInfo()?.description}
                </p>
              </div>
            </div>

            <div className="space-y-6">
              {/* Base Delivery Fee - Always visible */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Base Delivery Fee
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={settings.baseDeliveryFee}
                      onChange={(e) => handleBaseDeliveryFeeChange(e.target.value)}
                      className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="0.00"
                    />
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    {settings.deliveryFeeType === 'Fixed' 
                      ? 'Fixed amount charged for all deliveries'
                      : settings.deliveryFeeType === 'Per KM'
                      ? 'Base amount before distance calculation'
                      : 'Fallback amount for unconfigured categories'
                    }
                  </p>
                </div>
              </div>

              {/* Per KM Fee - Only visible when Per KM is selected */}
              {settings.deliveryFeeType === 'Per KM' && (
                <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
                  <div className="flex items-start">
                    <Info className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
                    <div className="flex-1">
                      <h4 className="font-medium text-blue-900 mb-3">Distance-Based Pricing</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Base Distance Coverage
                            <span className="text-red-500 ml-1">*</span>
                          </label>
                          <div className="relative">
                            <input
                              type="number"
                              min="0"
                              step="0.1"
                              value={settings.baseDistance}
                              onChange={(e) => handleBaseDistanceChange(e.target.value)}
                              className="w-full pl-4 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                              placeholder="0.0"
                            />
                            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">km</span>
                          </div>
                          <p className="mt-1 text-xs text-gray-600">
                            Distance covered by base fee
                          </p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Per KM Fee
                            <span className="text-red-500 ml-1">*</span>
                          </label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
                            <input
                              type="number"
                              min="0"
                              step="0.01"
                              value={settings.perKmFee}
                              onChange={(e) => handlePerKmFeeChange(e.target.value)}
                              className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                              placeholder="0.00"
                            />
                          </div>
                          <p className="mt-1 text-xs text-gray-600">
                            Amount charged per kilometer beyond base distance
                          </p>
                        </div>
                      </div>
                      <div className="mt-4 p-3 bg-white rounded-lg border border-blue-200">
                        <p className="text-sm text-blue-800">
                          <strong>Formula:</strong> Base Fee (₹{settings.baseDeliveryFee}) for first {settings.baseDistance}km + Additional distance × ₹{settings.perKmFee}/km
                        </p>
                        <div className="text-xs text-blue-600 mt-2 space-y-1">
                          <p>Example 1: {settings.baseDistance}km delivery = ₹{settings.baseDeliveryFee} (within base distance)</p>
                          <p>Example 2: 5km delivery = ₹{settings.baseDeliveryFee} + ({Math.max(0, 5 - settings.baseDistance)} × ₹{settings.perKmFee}) = ₹{settings.baseDeliveryFee + (Math.max(0, 5 - settings.baseDistance) * settings.perKmFee)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Order Type Delivery Fees - Only visible when Per Order Type is selected */}
              {settings.deliveryFeeType === 'Per Order Type' && (
                <div className="bg-green-50 rounded-lg p-6 border border-green-200">
                  <div className="flex items-start">
                    <Package className="w-5 h-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" />
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-4">
                        <div>
                          <h4 className="font-medium text-green-900">Category-Based Pricing</h4>
                          <p className="text-sm text-green-700 mt-1">Set different delivery fees for different order categories</p>
                        </div>
                        <button
                          onClick={addOrderTypeFee}
                          className="inline-flex items-center px-3 py-1.5 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
                          disabled={settings.orderTypeDeliveryFees.length >= orderCategories.length}
                        >
                          <Plus className="w-4 h-4 mr-1" />
                          Add Category
                        </button>
                      </div>

                      <div className="space-y-3">
                        {settings.orderTypeDeliveryFees.map((orderTypeFee, index) => (
                          <div key={index} className="flex items-center space-x-3 p-4 bg-white rounded-lg border border-green-200">
                            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Category
                                </label>
                                <select
                                  value={orderTypeFee.category}
                                  onChange={(e) => handleOrderTypeFeeChange(index, 'category', e.target.value)}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                >
                                  {orderCategories.map(cat => (
                                    <option 
                                      key={cat.value} 
                                      value={cat.value}
                                      disabled={settings.orderTypeDeliveryFees.some((fee, i) => 
                                        i !== index && fee.category === cat.value
                                      )}
                                    >
                                      {cat.label}
                                    </option>
                                  ))}
                                </select>
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Delivery Fee
                                </label>
                                <div className="relative">
                                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">₹</span>
                                  <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={orderTypeFee.fee}
                                    onChange={(e) => handleOrderTypeFeeChange(index, 'fee', e.target.value)}
                                    className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                    placeholder="0.00"
                                  />
                                </div>
                              </div>
                            </div>
                            {settings.orderTypeDeliveryFees.length > 1 && (
                              <button
                                onClick={() => removeOrderTypeFee(index)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Remove category"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Save Button */}
          <div className="px-8 py-6 bg-gray-50 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                {saveMessage && (
                  <div className="flex items-center text-green-600">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    <span className="text-sm font-medium">{saveMessage}</span>
                  </div>
                )}
              </div>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className={`inline-flex items-center px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                  isSaving
                    ? 'bg-gray-400 text-white cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg'
                }`}
              >
                {isSaving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Settings
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Preview Card */}
        <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Settings Preview</h3>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-600">Fee Type:</span>
                <span className="ml-2 text-gray-900">{settings.deliveryFeeType}</span>
              </div>
              <div>
                <span className="font-medium text-gray-600">Base Fee:</span>
                <span className="ml-2 text-gray-900">₹{settings.baseDeliveryFee}</span>
              </div>
              {settings.deliveryFeeType === 'Per KM' && (
                <div>
                  <span className="font-medium text-gray-600">Base Distance:</span>
                  <span className="ml-2 text-gray-900">{settings.baseDistance}km</span>
                </div>
              )}
              {settings.deliveryFeeType === 'Per KM' && (
                <div>
                  <span className="font-medium text-gray-600">Per KM:</span>
                  <span className="ml-2 text-gray-900">₹{settings.perKmFee}</span>
                </div>
              )}
              {settings.deliveryFeeType === 'Per Order Type' && (
                <div className="md:col-span-2 lg:col-span-3">
                  <span className="font-medium text-gray-600">Category Fees:</span>
                  <div className="mt-1 flex flex-wrap gap-2">
                    {settings.orderTypeDeliveryFees.map((fee, index) => (
                      <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {fee.label}: ₹{fee.fee}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliveryFeeSettings;