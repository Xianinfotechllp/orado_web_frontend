import React, { useState, useEffect } from 'react';
import { Search, Plus, MoreVertical, Calculator, MapPin, Clock, Settings, Target, Save, X, Edit, Trash2, DollarSign, Navigation, Zap } from 'lucide-react';

const AgentDeliveryFeeSettings = () => {
  const [activeTab, setActiveTab] = useState('global');
  const [selectedCity, setSelectedCity] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [loading, setLoading] = useState(false);

  // Global Settings State
  const [globalSettings, setGlobalSettings] = useState({
    baseFee: 25,
    baseDistance: 2,
    perKmFee: 3,
    peakHourBonus: 10,
    zoneBonus: 5,
    allowManualOverrides: true
  });

  // City-wise Settings State
  const [citySettings, setCitySettings] = useState([
    {
      id: 1,
      cityName: 'Mumbai',
      enabled: true,
      baseFee: 30,
      baseDistance: 3,
      perKmFee: 4,
      peakHourBonus: 15,
      zoneBonus: 8,
      allowManualOverrides: true
    },
    {
      id: 2,
      cityName: 'Delhi',
      enabled: true,
      baseFee: 28,
      baseDistance: 2.5,
      perKmFee: 3.5,
      peakHourBonus: 12,
      zoneBonus: 6,
      allowManualOverrides: true
    }
  ]);

  // Preview Calculation State
  const [previewData, setPreviewData] = useState({
    distance: 5.2,
    isPeakHour: true,
    isHighDemandZone: true,
    selectedCityForPreview: 'Mumbai'
  });

  const availableCities = ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata', 'Pune', 'Hyderabad','Gwalior','Bhopal','Indore','Ujjain'];

  // ✅ FIXED: Input handling that allows empty values
  const handleGlobalSettingsChange = (field, value) => {
    setGlobalSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleCitySettingsChange = (cityId, field, value) => {
    setCitySettings(prev => prev.map(city => 
      city.id === cityId ? { ...city, [field]: value } : city
    ));
  };

  const handleAddNewCity = () => {
    if (!selectedCity) return;
    
    const newCity = {
      id: Date.now(),
      cityName: selectedCity,
      enabled: true,
      ...globalSettings
    };
    setCitySettings(prev => [...prev, newCity]);
    setSelectedCity('');
  };

  const handleRemoveCity = (cityId) => {
    setCitySettings(prev => prev.filter(city => city.id !== cityId));
  };

  const calculatePreviewFee = () => {
    const settings = previewData.selectedCityForPreview 
      ? citySettings.find(c => c.cityName === previewData.selectedCityForPreview) || globalSettings
      : globalSettings;

    let totalFee = settings.baseFee || 0;
    
    if ((previewData.distance || 0) > (settings.baseDistance || 0)) {
      const extraDistance = (previewData.distance || 0) - (settings.baseDistance || 0);
      totalFee += extraDistance * (settings.perKmFee || 0);
    }
    
    if (previewData.isPeakHour) {
      totalFee += settings.peakHourBonus || 0;
    }
    
    if (previewData.isHighDemandZone) {
      totalFee += settings.zoneBonus || 0;
    }

    return {
      baseFee: settings.baseFee || 0,
      extraDistance: (previewData.distance || 0) > (settings.baseDistance || 0) ? ((previewData.distance || 0) - (settings.baseDistance || 0)) * (settings.perKmFee || 0) : 0,
      peakBonus: previewData.isPeakHour ? (settings.peakHourBonus || 0) : 0,
      zoneBonus: previewData.isHighDemandZone ? (settings.zoneBonus || 0) : 0,
      total: totalFee
    };
  };

  const handleSaveGlobalSettings = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  const handleSaveCitySettings = (cityId) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 via-orange-600 to-orange-700 shadow-lg">
        <div className="px-4 sm:px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="bg-white/20 backdrop-blur-sm p-2 rounded-xl">
                <DollarSign className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div>
                <nav className="text-orange-100 text-sm mb-1">
                  {/* Admin Panel &gt; Agent Management &gt; Agent Fee Settings */}
                </nav>
                <h1 className="text-lg sm:text-2xl font-bold text-white">Agent Delivery Fee Settings</h1>
                <p className="text-orange-100 text-sm">Configure delivery fees and bonuses</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-4 sm:px-6">
          <nav className="flex space-x-4 sm:space-x-8 overflow-x-auto">
            <button
              onClick={() => setActiveTab('global')}
              className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-all duration-300 relative overflow-hidden ${
                activeTab === 'global'
                  ? 'border-orange-500 text-orange-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {activeTab === 'global' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-orange-500 to-orange-600 animate-slideIn"></div>
              )}
              <div className="flex items-center space-x-2">
                <Settings className="w-4 h-4" />
                <span>Global Settings</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('citywise')}
              className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-all duration-300 relative overflow-hidden ${
                activeTab === 'citywise'
                  ? 'border-orange-500 text-orange-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {activeTab === 'citywise' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-orange-500 to-orange-600 animate-slideIn"></div>
              )}
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4" />
                <span>City-wise Settings</span>
              </div>
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 sm:px-6 py-6">
        {activeTab === 'global' && (
          <GlobalSettingsTab 
            settings={globalSettings}
            onChange={handleGlobalSettingsChange}
            onSave={handleSaveGlobalSettings}
            loading={loading}
          />
        )}
        {activeTab === 'citywise' && (
          <CityWiseSettingsTab 
            citySettings={citySettings}
            availableCities={availableCities}
            selectedCity={selectedCity}
            setSelectedCity={setSelectedCity}
            onCitySettingsChange={handleCitySettingsChange}
            onAddNewCity={handleAddNewCity}
            onRemoveCity={handleRemoveCity}
            onSave={handleSaveCitySettings}
            loading={loading}
          />
        )}
      </div>

      {/* Fee Calculation Preview */}
      <div className="px-4 sm:px-6 pb-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300">
          <div 
            className="px-6 py-4 bg-gradient-to-r from-blue-50 to-blue-100 border-b border-blue-200 cursor-pointer hover:from-blue-100 hover:to-blue-200 transition-all duration-300"
            onClick={() => setShowPreview(!showPreview)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Calculator className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-semibold text-blue-900"> Fee Calculation Preview</h3>
              </div>
              <div className={`transform transition-transform duration-300 ${showPreview ? 'rotate-180' : ''}`}>
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
          
          {showPreview && (
            <div className="p-6 animate-slideDown">
              <FeeCalculationPreview 
                previewData={previewData}
                setPreviewData={setPreviewData}
                calculateFee={calculatePreviewFee}
                citySettings={citySettings}
                globalSettings={globalSettings}
              />
            </div>
          )}
        </div>
      </div>

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white rounded-xl p-6 shadow-xl">
            <div className="flex items-center space-x-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-500"></div>
              <span className="text-gray-700 font-medium">Saving settings...</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ✅ FIXED: Global Settings Tab Component with proper input handling
const GlobalSettingsTab = ({ settings, onChange, onSave, loading }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <Settings className="w-6 h-6 text-orange-500" />
        <h2 className="text-lg font-semibold text-gray-900">Global Settings</h2>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-all duration-300">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Base Delivery Fee (₹)</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
              <input
                type="number"
                value={settings.baseFee === 0 ? '' : settings.baseFee}
                onChange={(e) => onChange('baseFee', e.target.value === '' ? '' : parseFloat(e.target.value))}
                className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 hover:shadow-md"
                placeholder="25"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Base Distance Included (km)</label>
            <div className="relative">
              <input
                type="number"
                step="0.1"
                value={settings.baseDistance === 0 ? '' : settings.baseDistance}
                onChange={(e) => onChange('baseDistance', e.target.value === '' ? '' : parseFloat(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 hover:shadow-md"
                placeholder="2"
              />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"></span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Per km Fee beyond base distance</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
              <input
                type="number"
                step="0.1"
                value={settings.perKmFee === 0 ? '' : settings.perKmFee}
                onChange={(e) => onChange('perKmFee', e.target.value === '' ? '' : parseFloat(e.target.value))}
                className="w-full pl-8 pr-12 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 hover:shadow-md"
                placeholder="3"
              />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">/km</span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Peak Hour Bonus (₹)</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
              <input
                type="number"
                value={settings.peakHourBonus === 0 ? '' : settings.peakHourBonus}
                onChange={(e) => onChange('peakHourBonus', e.target.value === '' ? '' : parseFloat(e.target.value))}
                className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 hover:shadow-md"
                placeholder="10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Zone Bonus (₹)</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
              <input
                type="number"
                value={settings.zoneBonus === 0 ? '' : settings.zoneBonus}
                onChange={(e) => onChange('zoneBonus', e.target.value === '' ? '' : parseFloat(e.target.value))}
                className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 hover:shadow-md"
                placeholder="5"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Allow Manual Overrides</label>
            <div className="flex items-center space-x-4">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  checked={settings.allowManualOverrides}
                  onChange={() => onChange('allowManualOverrides', true)}
                  className="w-4 h-4 text-orange-600 border-gray-300 focus:ring-orange-500"
                />
                <span className="text-sm text-gray-700">✓ Yes</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  checked={!settings.allowManualOverrides}
                  onChange={() => onChange('allowManualOverrides', false)}
                  className="w-4 h-4 text-orange-600 border-gray-300 focus:ring-orange-500"
                />
                <span className="text-sm text-gray-700">No</span>
              </label>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <button
            onClick={onSave}
            disabled={loading}
            className="group bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 disabled:opacity-50"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span> Save Global Settings</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

// ✅ FIXED: City-wise Settings Tab Component with mobile dropdown width
const CityWiseSettingsTab = ({ citySettings, availableCities, selectedCity, setSelectedCity, onCitySettingsChange, onAddNewCity, onRemoveCity, onSave, loading }) => {
  const unusedCities = availableCities.filter(city => 
    !citySettings.find(setting => setting.cityName === city)
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <MapPin className="w-6 h-6 text-orange-500" />
        <h2 className="text-lg font-semibold text-gray-900"> City-wise Settings</h2>
      </div>

      {/* Add New City */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-all duration-300">
        <div className="flex flex-col sm:flex-row sm:items-end space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">Select City</label>
            {/* ✅ FIXED: Half width on mobile */}
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-1/2 sm:w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 hover:shadow-md"
            >
              <option value="">Select City </option>
              {unusedCities.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>
          <button
            onClick={onAddNewCity}
            disabled={!selectedCity}
            className="group bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
          >
            <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
            <span>Add New City Rule</span>
          </button>
        </div>
      </div>

      {/* City Settings */}
      <div className="space-y-6">
        {citySettings.map((city) => (
          <CitySettingsCard
            key={city.id}
            city={city}
            onChange={(field, value) => onCitySettingsChange(city.id, field, value)}
            onRemove={() => onRemoveCity(city.id)}
            onSave={() => onSave(city.id)}
            loading={loading}
          />
        ))}
      </div>

      {citySettings.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl border-2 border-dashed border-gray-200">
          <MapPin className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No City Rules Configured</h3>
          <p className="text-gray-500">Add your first city-specific delivery fee rule above</p>
        </div>
      )}
    </div>
  );
};

// ✅ FIXED: City Settings Card Component with proper input handling
const CitySettingsCard = ({ city, onChange, onRemove, onSave, loading }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300">
      <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-blue-100 border-b border-blue-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-blue-900 flex items-center space-x-2">
            <MapPin className="w-5 h-5" />
            <span>{city.cityName}</span>
          </h3>
          <div className="flex items-center space-x-2">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={city.enabled}
                onChange={(e) => onChange('enabled', e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-blue-800">✓ Enable Custom Settings for this City</span>
            </label>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Base Delivery Fee (₹)</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
              <input
                type="number"
                value={city.baseFee === 0 ? '' : city.baseFee}
                onChange={(e) => onChange('baseFee', e.target.value === '' ? '' : parseFloat(e.target.value))}
                disabled={!city.enabled}
                className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 hover:shadow-md disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Base Distance Included (km)</label>
            <div className="relative">
              <input
                type="number"
                step="0.1"
                value={city.baseDistance === 0 ? '' : city.baseDistance}
                onChange={(e) => onChange('baseDistance', e.target.value === '' ? '' : parseFloat(e.target.value))}
                disabled={!city.enabled}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 hover:shadow-md disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"></span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Per km Fee beyond base distance</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
              <input
                type="number"
                step="0.1"
                value={city.perKmFee === 0 ? '' : city.perKmFee}
                onChange={(e) => onChange('perKmFee', e.target.value === '' ? '' : parseFloat(e.target.value))}
                disabled={!city.enabled}
                className="w-full pl-8 pr-12 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 hover:shadow-md disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">/km</span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Peak Hour Bonus (₹)</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
              <input
                type="number"
                value={city.peakHourBonus === 0 ? '' : city.peakHourBonus}
                onChange={(e) => onChange('peakHourBonus', e.target.value === '' ? '' : parseFloat(e.target.value))}
                disabled={!city.enabled}
                className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 hover:shadow-md disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Zone Bonus (₹)</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
              <input
                type="number"
                value={city.zoneBonus === 0 ? '' : city.zoneBonus}
                onChange={(e) => onChange('zoneBonus', e.target.value === '' ? '' : parseFloat(e.target.value))}
                disabled={!city.enabled}
                className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 hover:shadow-md disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Allow Manual Overrides</label>
            <div className="flex items-center space-x-4">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  checked={city.allowManualOverrides}
                  onChange={() => onChange('allowManualOverrides', true)}
                  disabled={!city.enabled}
                  className="w-4 h-4 text-orange-600 border-gray-300 focus:ring-orange-500 disabled:cursor-not-allowed"
                />
                <span className={`text-sm ${city.enabled ? 'text-gray-700' : 'text-gray-400'}`}>✓ Yes</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  checked={!city.allowManualOverrides}
                  onChange={() => onChange('allowManualOverrides', false)}
                  disabled={!city.enabled}
                  className="w-4 h-4 text-orange-600 border-gray-300 focus:ring-orange-500 disabled:cursor-not-allowed"
                />
                <span className={`text-sm ${city.enabled ? 'text-gray-700' : 'text-gray-400'}`}>No</span>
              </label>
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-3 sm:space-y-0">
          <button
            onClick={onRemove}
            className="group bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 w-full sm:w-auto"
          >
            <Trash2 className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
            <span> Remove City Rule</span>
          </button>

          <button
            onClick={onSave}
            disabled={loading || !city.enabled}
            className="group bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-6 py-2 rounded-lg flex items-center space-x-2 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span> Save Settings for this City</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

// ✅ FIXED: Fee Calculation Preview Component with mobile dropdown width and proper input handling
const FeeCalculationPreview = ({ previewData, setPreviewData, calculateFee, citySettings, globalSettings }) => {
  const feeBreakdown = calculateFee();

  const updatePreviewData = (field, value) => {
    setPreviewData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      <h4 className="text-lg font-semibold text-gray-900 mb-4">Simulation Settings</h4>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Delivery Distance</label>
          <div className="relative">
            <input
              type="number"
              step="0.1"
              value={previewData.distance === 0 ? '' : previewData.distance}
              onChange={(e) => updatePreviewData('distance', e.target.value === '' ? '' : parseFloat(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
            />
            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm"></span>
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">City</label>
          {/* ✅ FIXED: Half width on mobile */}
          <select
            value={previewData.selectedCityForPreview}
            onChange={(e) => updatePreviewData('selectedCityForPreview', e.target.value)}
            className="w-1/2 sm:w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
          >
            <option value="">Global Settings</option>
            {citySettings.map(city => (
              <option key={city.id} value={city.cityName}>{city.cityName}</option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Time Period</label>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={previewData.isPeakHour}
              onChange={(e) => updatePreviewData('isPeakHour', e.target.checked)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">Peak Hour (7 PM)</span>
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Zone Type</label>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={previewData.isHighDemandZone}
              onChange={(e) => updatePreviewData('isHighDemandZone', e.target.checked)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">High Demand Zone</span>
          </div>
        </div>
      </div>

      {/* Fee Breakdown */}
      <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
        <h5 className="text-lg font-semibold text-green-900 mb-4">Fee Breakdown</h5>
        
        <div className="space-y-3 text-sm">
          <div className="flex justify-between items-center">
            <span className="text-green-800">Base Fee:</span>
            <span className="font-semibold text-green-900">₹{feeBreakdown.baseFee}</span>
          </div>
          
          {feeBreakdown.extraDistance > 0 && (
            <div className="flex justify-between items-center">
              <span className="text-green-800">
                + Extra Distance ({((previewData.distance || 0) - (previewData.selectedCityForPreview 
                  ? citySettings.find(c => c.cityName === previewData.selectedCityForPreview)?.baseDistance || globalSettings.baseDistance || 0
                  : globalSettings.baseDistance || 0)).toFixed(1)} km):
              </span>
              <span className="font-semibold text-green-900">₹{feeBreakdown.extraDistance.toFixed(1)}</span>
            </div>
          )}
          
          {feeBreakdown.peakBonus > 0 && (
            <div className="flex justify-between items-center">
              <span className="text-green-800">+ Peak Hour Bonus:</span>
              <span className="font-semibold text-green-900">₹{feeBreakdown.peakBonus}</span>
            </div>
          )}
          
          {feeBreakdown.zoneBonus > 0 && (
            <div className="flex justify-between items-center">
              <span className="text-green-800">+ Zone Bonus:</span>
              <span className="font-semibold text-green-900">₹{feeBreakdown.zoneBonus}</span>
            </div>
          )}
          
          <div className="border-t border-green-300 pt-3 flex justify-between items-center">
            <span className="text-lg font-bold text-green-900">= Total Agent Fee:</span>
            <span className="text-xl font-bold text-green-900">₹{feeBreakdown.total.toFixed(1)}</span>
          </div>
        </div>

        <div className="mt-4 flex items-center space-x-3">
          <button
            onClick={() => window.location.reload()}
            className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-all duration-300 hover:shadow-lg text-sm"
          >
            <Calculator className="w-4 h-4" />
            <span> Recalculate</span>
          </button>
          <button className="bg-white hover:bg-gray-50 text-green-700 border border-green-300 px-4 py-2 rounded-lg flex items-center space-x-2 transition-all duration-300 hover:shadow-md text-sm">
            <Edit className="w-4 h-4" />
            <span>Customize Example...</span>
          </button>
        </div>
      </div>
    </div>
  );
};

// CSS animations
const styles = `
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  @keyframes slideDown {
    from { 
      opacity: 0; 
      transform: translateY(-10px); 
    }
    to { 
      opacity: 1; 
      transform: translateY(0); 
    }
  }
  
  @keyframes slideIn {
    from { width: 0; }
    to { width: 100%; }
  }
  
  .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
  .animate-slideDown { animation: slideDown 0.3s ease-out; }
  .animate-slideIn { animation: slideIn 0.3s ease-out; }
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}

export default AgentDeliveryFeeSettings;
