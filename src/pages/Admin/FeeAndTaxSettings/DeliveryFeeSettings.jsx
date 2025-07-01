import React, { useState, useEffect } from 'react';
import { Save, Settings, MapPin, Info, ArrowUp, ArrowDown, ChevronDown } from 'lucide-react';
import { 
  updateDeliveryFeeSettings, 
  getCurrentDeliveryFeeSettings
} from '../../../apis/adminApis/feeSettings';
import {
  getAllCities,
  createCityDeliveryFeeSetting,
  getCityDeliveryFeeSettings,
  getSingleCityDeliveryFeeSetting
} from "../../../apis/adminApis/adminFuntionsApi";
import { Link } from 'react-router-dom';

const DeliveryFeeSettings = () => {
  // State for editable settings
  const [settings, setSettings] = useState({
    deliveryFeeType: 'Per KM',
    baseDeliveryFee: 0,
    baseDistanceKm: 0,
    perKmFeeBeyondBase: 0
  });

  // State for current saved settings
  const [currentSettings, setCurrentSettings] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  
  // City related states
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);
  const [citySettings, setCitySettings] = useState({
    baseDeliveryFee: 0,
    baseDistanceKm: 0,
    perKmFeeBeyondBase: 0,
    exists: false // Flag to check if city settings exist
  });
  const [showCityForm, setShowCityForm] = useState(false);

  // Load current settings and cities on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        
        // Load global settings
        const globalResponse = await getCurrentDeliveryFeeSettings();
        if (globalResponse.status === 200) {
          const apiData = globalResponse.data.data || globalResponse.data;
          const distanceBasedSettings = {
            deliveryFeeType: 'Per KM',
            baseDeliveryFee: parseFloat(apiData.baseDeliveryFee) || 0,
            baseDistanceKm: parseFloat(apiData.baseDistanceKm) || 0,
            perKmFeeBeyondBase: parseFloat(apiData.perKmFeeBeyondBase) || 0
          };
          
          setCurrentSettings(distanceBasedSettings);
          setSettings(distanceBasedSettings);
        }

        // Load cities
        const citiesResponse = await getAllCities();
        if (citiesResponse.success) {
          setCities(citiesResponse.data);
        }
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, []);

  // Load city settings when city is selected
 useEffect(() => {
  if (selectedCity) {
    const loadCitySettings = async () => {
      try {
        // Pass city and optional serviceCategory if needed
        const response = await getSingleCityDeliveryFeeSetting({
          city: selectedCity._id,
     // optional based on your context
        });

        if (response.success && response.data) {
          console.log(response.data, "city setting response");

          setCitySettings({
            baseDeliveryFee: response.data.baseFee || 0,
            baseDistanceKm: response.data.baseDistanceKm || 0,
            perKmFeeBeyondBase: response.data.perKmFeeBeyondBase || 0,
            exists: true
          });
        } else {
          // Reset to default if no settings exist
          setCitySettings({
            baseDeliveryFee: 0,
            baseDistanceKm: 0,
            perKmFeeBeyondBase: 0,
            exists: false
          });
        }

      } catch (error) {
        console.error("Error loading city settings:", error);
        setCitySettings({
          baseDeliveryFee: 0,
          baseDistanceKm: 0,
          perKmFeeBeyondBase: 0,
          exists: false
        });
      }
    };

    loadCitySettings();
  }
}, [selectedCity]);

  // Check if there are unsaved changes
  const hasChanges = !currentSettings || 
    JSON.stringify(settings) !== JSON.stringify(currentSettings);

  // Handler for changing base delivery fee
  const handleBaseDeliveryFeeChange = (value) => {
    setSettings({ 
      ...settings, 
      baseDeliveryFee: parseFloat(value) || 0 
    });
  };

  // Handler for changing base distance
  const handleBaseDistanceChange = (value) => {
    setSettings({ 
      ...settings, 
      baseDistanceKm: parseFloat(value) || 0 
    });
  };

  // Handler for changing per km fee
  const handlePerKmFeeChange = (value) => {
    setSettings({ 
      ...settings, 
      perKmFeeBeyondBase: parseFloat(value) || 0 
    });
  };

  // Handler for changing city base delivery fee
  const handleCityBaseDeliveryFeeChange = (value) => {
    setCitySettings({ 
      ...citySettings, 
      baseDeliveryFee: parseFloat(value) || 0 
    });
  };

  // Handler for changing city base distance
  const handleCityBaseDistanceChange = (value) => {
    setCitySettings({ 
      ...citySettings, 
      baseDistanceKm: parseFloat(value) || 0 
    });
  };

  // Handler for changing city per km fee
  const handleCityPerKmFeeChange = (value) => {
    setCitySettings({ 
      ...citySettings, 
      perKmFeeBeyondBase: parseFloat(value) || 0 
    });
  };

  // Save global settings to API
  const handleSave = async () => {
    try {
      setIsSaving(true);
      
      const payload = {
        deliveryFeeType: 'Per KM',
        baseDeliveryFee: settings.baseDeliveryFee,
        baseDistanceKm: settings.baseDistanceKm,
        perKmFeeBeyondBase: settings.perKmFeeBeyondBase
      };

      const response = await updateDeliveryFeeSettings(payload);
      
      if (response.status === 200) {
        setSaveMessage('Settings saved successfully!');
        setCurrentSettings(settings);
      } else {
        throw new Error(response.data?.message || 'Failed to save settings');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      setSaveMessage(error.message || 'Failed to save settings. Please try again.');
    } finally {
      setIsSaving(false);
      setTimeout(() => setSaveMessage(''), 3000);
    }
  };

const handleSaveCitySettings = async () => {
  if (!selectedCity || !selectedCity._id) {
    setSaveMessage('Please select a city before saving settings.');
    return;
  }

  try {
    setIsSaving(true);

    const payload = {
      city: selectedCity._id,
      feeType: 'Per KM',
      baseFee: citySettings.baseDeliveryFee,
      baseDistanceKm: citySettings.baseDistanceKm,
      perKmFeeBeyondBase: citySettings.perKmFeeBeyondBase
    };

    const response = await createCityDeliveryFeeSetting(payload);

    if (response.success) {
      setSaveMessage(`City settings for ${selectedCity.name} saved successfully!`);
      setCitySettings(prev => ({ ...prev, exists: true }));
    } else {
      throw new Error(response.message || 'Failed to save city settings');
    }
  } catch (error) {
    console.error('Error saving city settings:', error);
    setSaveMessage(error.message || 'Failed to save city settings. Please try again.');
  } finally {
    setIsSaving(false);
    setTimeout(() => setSaveMessage(''), 3000);
  }
};

  // Helper function to render comparison indicator
  const renderComparison = (currentVal, newVal, isCurrency = false) => {
    if (currentVal === undefined || newVal === undefined) return null;
    
    const diff = newVal - currentVal;
    if (diff === 0) return null;

    const isIncrease = diff > 0;
    const displayDiff = isCurrency 
      ? Math.abs(diff).toFixed(2)
      : Math.abs(diff);

    return (
      <span className={`ml-2 inline-flex items-center text-xs ${
        isIncrease ? 'text-red-500' : 'text-green-500'
      }`}>
        {isIncrease ? <ArrowUp size={12} className="mr-0.5" /> : <ArrowDown size={12} className="mr-0.5" />}
        {isCurrency ? '₹' : ''}{displayDiff}
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading delivery fee settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-2">
            <Settings className="w-8 h-8 text-blue-600 mr-3" />
            <h1 className="text-3xl font-bold text-gray-900">Delivery Fee Settings</h1>
          </div>
          <p className="text-gray-600">Configure distance-based delivery fees for your platform</p>
        </div>

        {/* City Selection */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">City-Based Delivery Fees</h2>
            
  <div>
    <Link
      to="/admin/dashboard/add-city"
      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
    >
      + Add City
    </Link>
  </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">Select City</label>
                <div className="relative">
                  <select
                    value={selectedCity?._id || ''}
                    onChange={(e) => {
                      const city = cities.find(c => c._id === e.target.value);
                      setSelectedCity(city || null);
                      setShowCityForm(false);
                    }}
                    className="w-full pl-4 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                  >
                    <option value="">Select a city</option>
                    {cities.map(city => (
                      <option key={city._id} value={city._id}>{city.name}</option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  </div>
                </div>
              </div>
              
              {selectedCity && (
                <button
                  onClick={() => setShowCityForm(!showCityForm)}
                  className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg font-medium transition-colors duration-200"
                >
                  {showCityForm ? 'Hide Settings' : 'Edit City Settings'}
                </button>
              )}
            </div>

            {/* City Settings View */}
            {selectedCity && !showCityForm && (
              <div className="mt-6 bg-gray-50 rounded-lg p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {selectedCity.name} Delivery Settings
                </h3>
                
                {citySettings.exists ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-white p-4 rounded-lg border border-gray-200">
                        <h4 className="text-sm font-medium text-gray-500 mb-1">Base Fee</h4>
                        <p className="text-lg font-semibold">₹{citySettings.baseDeliveryFee.toFixed(2)}</p>
                      </div>
                      <div className="bg-white p-4 rounded-lg border border-gray-200">
                        <h4 className="text-sm font-medium text-gray-500 mb-1">Base Distance</h4>
                        <p className="text-lg font-semibold">{citySettings.baseDistanceKm} km</p>
                      </div>
                      <div className="bg-white p-4 rounded-lg border border-gray-200">
                        <h4 className="text-sm font-medium text-gray-500 mb-1">Per KM Fee</h4>
                        <p className="text-lg font-semibold">₹{citySettings.perKmFeeBeyondBase.toFixed(2)}</p>
                      </div>
                    </div>
                    
                    <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <p className="text-sm text-blue-800">
                        <strong>Formula:</strong> Base Fee (₹{citySettings.baseDeliveryFee.toFixed(2)}) for first {citySettings.baseDistanceKm}km + Additional distance × ₹{citySettings.perKmFeeBeyondBase.toFixed(2)}/km
                      </p>
                      <div className="text-xs text-blue-600 mt-2 space-y-1">
                        <p>Example 1: {citySettings.baseDistanceKm}km delivery = ₹{citySettings.baseDeliveryFee.toFixed(2)} (within base distance)</p>
                        <p>Example 2: 5km delivery = ₹{citySettings.baseDeliveryFee.toFixed(2)} + ({Math.max(0, 5 - citySettings.baseDistanceKm)} × ₹{citySettings.perKmFeeBeyondBase.toFixed(2)}) = ₹{(citySettings.baseDeliveryFee + (Math.max(0, 5 - citySettings.baseDistanceKm) * citySettings.perKmFeeBeyondBase)).toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <p className="text-gray-500 mb-4">No custom delivery settings found for {selectedCity.name}</p>
                    <p className="text-sm text-gray-400">Using global delivery fee settings</p>
                  </div>
                )}
              </div>
            )}

            {/* City Settings Form */}
            {selectedCity && showCityForm && (
              <div className="mt-6 bg-blue-50 rounded-lg p-6 border border-blue-200">
                <h3 className="text-lg font-semibold text-blue-900 mb-4">
                  {selectedCity.name} Delivery Fee Settings
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Base Delivery Fee
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={citySettings.baseDeliveryFee}
                        onChange={(e) => handleCityBaseDeliveryFeeChange(e.target.value)}
                        className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Base Distance Coverage
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        min="0"
                        step="0.1"
                        value={citySettings.baseDistanceKm}
                        onChange={(e) => handleCityBaseDistanceChange(e.target.value)}
                        className="w-full pl-4 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                        placeholder="0.0"
                      />
                      <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">km</span>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Per KM Fee Beyond Base
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={citySettings.perKmFeeBeyondBase}
                        onChange={(e) => handleCityPerKmFeeChange(e.target.value)}
                        className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 flex justify-end">
                  <button
                    onClick={handleSaveCitySettings}
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
                        Save City Settings
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Main Settings Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Configuration Section */}
          <div className="p-8">
            <div className="flex items-center mb-6">
              <div className="p-2 bg-blue-100 rounded-lg mr-3">
                <MapPin className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Global Delivery Fee Settings
                </h3>
                <p className="text-sm text-gray-600">
                  Default fees applied when no city-specific settings exist
                </p>
              </div>
            </div>

            {/* Settings Comparison Card */}
            <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Settings Comparison</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Current Settings */}
                  <div>
                    <div className="flex items-center mb-3">
                      <div className="w-2 h-2 bg-gray-400 rounded-full mr-2"></div>
                      <h4 className="font-medium text-gray-700">Current Settings</h4>
                    </div>
                    
                    {currentSettings ? (
                      <div className="space-y-3 text-sm">
                        <div>
                          <span className="text-gray-600">Base Fee:</span>
                          <span className="ml-2 text-gray-900">₹{currentSettings.baseDeliveryFee.toFixed(2)}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Base Distance:</span>
                          <span className="ml-2 text-gray-900">{currentSettings.baseDistanceKm} km</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Per KM Fee Beyond Base:</span>
                          <span className="ml-2 text-gray-900">₹{currentSettings.perKmFeeBeyondBase.toFixed(2)}</span>
                        </div>
                      </div>
                    ) : (
                      <p className="text-gray-500 text-sm">No current settings available</p>
                    )}
                  </div>

                  {/* New Settings */}
                  <div>
                    <div className="flex items-center mb-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                      <h4 className="font-medium text-gray-700">Pending Changes</h4>
                    </div>
                    
                    <div className="space-y-3 text-sm">
                      <div>
                        <span className="text-gray-600">Base Fee:</span>
                        <span className="ml-2 text-gray-900">
                          ₹{settings.baseDeliveryFee.toFixed(2)}
                          {renderComparison(
                            currentSettings?.baseDeliveryFee, 
                            settings.baseDeliveryFee, 
                            true
                          )}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Base Distance:</span>
                        <span className="ml-2 text-gray-900">
                          {settings.baseDistanceKm} km
                          {renderComparison(
                            currentSettings?.baseDistanceKm, 
                            settings.baseDistanceKm
                          )}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Per KM Fee Beyond Base:</span>
                        <span className="ml-2 text-gray-900">
                          ₹{settings.perKmFeeBeyondBase.toFixed(2)}
                          {renderComparison(
                            currentSettings?.perKmFeeBeyondBase, 
                            settings.perKmFeeBeyondBase, 
                            true
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6 mt-6">
              {/* Base Delivery Fee */}
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
                    Base amount before distance calculation
                  </p>
                </div>
              </div>

              {/* Distance-Based Pricing Section */}
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
                            value={settings.baseDistanceKm}
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
                          Per KM Fee Beyond Base
                          <span className="text-red-500 ml-1">*</span>
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={settings.perKmFeeBeyondBase}
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
                        <strong>Formula:</strong> Base Fee (₹{settings.baseDeliveryFee.toFixed(2)}) for first {settings.baseDistanceKm}km + Additional distance × ₹{settings.perKmFeeBeyondBase.toFixed(2)}/km
                      </p>
                      <div className="text-xs text-blue-600 mt-2 space-y-1">
                        <p>Example 1: {settings.baseDistanceKm}km delivery = ₹{settings.baseDeliveryFee.toFixed(2)} (within base distance)</p>
                        <p>Example 2: 5km delivery = ₹{settings.baseDeliveryFee.toFixed(2)} + ({Math.max(0, 5 - settings.baseDistanceKm)} × ₹{settings.perKmFeeBeyondBase.toFixed(2)}) = ₹{(settings.baseDeliveryFee + (Math.max(0, 5 - settings.baseDistanceKm) * settings.perKmFeeBeyondBase)).toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="px-8 py-6 bg-gray-50 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                {saveMessage && (
                  <div className={`flex items-center ${
                    saveMessage.includes('success') ? 'text-green-600' : 'text-red-600'
                  }`}>
                    <div className={`w-2 h-2 rounded-full mr-2 ${
                      saveMessage.includes('success') ? 'bg-green-500' : 'bg-red-500'
                    }`}></div>
                    <span className="text-sm font-medium">{saveMessage}</span>
                  </div>
                )}
              </div>
              <button
                onClick={handleSave}
                disabled={isSaving || !hasChanges}
                className={`inline-flex items-center px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                  isSaving
                    ? 'bg-gray-400 text-white cursor-not-allowed'
                    : !hasChanges
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
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
                    {hasChanges ? 'Save Changes' : 'No Changes'}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliveryFeeSettings;