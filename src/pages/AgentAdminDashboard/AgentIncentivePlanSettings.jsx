import React, { useState, useEffect } from 'react';
import { Search, Plus, MoreVertical, Calculator, MapPin, Clock, Settings, Target, Save, X, Edit, Trash2, DollarSign, Navigation, Zap, ArrowLeft, ChevronDown, ChevronUp } from 'lucide-react';

const AgentIncentivePlanSettings = () => {
  const [activeTab, setActiveTab] = useState('global');
  const [loading, setLoading] = useState(false);

  // Collapsible sections state
  const [expandedSections, setExpandedSections] = useState({
    daily: true,
    weekly: true,
    monthly: true
  });

  // Global incentive plans state
  const [globalIncentivePlans, setGlobalIncentivePlans] = useState({
    daily: [
      { id: 1, threshold: 1000, incentive: 100 },
      { id: 2, threshold: 2000, incentive: 250 }
    ],
    weekly: [
      { id: 1, threshold: 7000, incentive: 400 }
    ],
    monthly: [
      { id: 1, threshold: 25000, incentive: 1000 }
    ]
  });

  // City-based incentive plans state
  const [cityIncentivePlans, setCityIncentivePlans] = useState([
    {
      id: 1,
      cityName: 'Mumbai',
      enabled: true,
      daily: [
        { id: 1, threshold: 1200, incentive: 120 },
        { id: 2, threshold: 2500, incentive: 300 }
      ],
      weekly: [
        { id: 1, threshold: 8000, incentive: 500 }
      ],
      monthly: [
        { id: 1, threshold: 30000, incentive: 1200 }
      ]
    },
    {
      id: 2,
      cityName: 'Delhi',
      enabled: true,
      daily: [
        { id: 1, threshold: 1100, incentive: 110 }
      ],
      weekly: [
        { id: 1, threshold: 7500, incentive: 450 }
      ],
      monthly: [
        { id: 1, threshold: 28000, incentive: 1100 }
      ]
    }
  ]);

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [editingRule, setEditingRule] = useState(null);
  const [currentPeriodType, setCurrentPeriodType] = useState('');
  const [currentCityId, setCurrentCityId] = useState(null);

  // City management
  const [selectedCity, setSelectedCity] = useState('');
  const availableCities = ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata', 'Pune', 'Hyderabad'];

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Global plan handlers
  const handleGlobalAddRule = (period) => {
    setCurrentPeriodType(period);
    setCurrentCityId(null);
    setEditingRule(null);
    setShowModal(true);
  };

  const handleGlobalEditRule = (period, rule) => {
    setCurrentPeriodType(period);
    setCurrentCityId(null);
    setEditingRule(rule);
    setShowModal(true);
  };

  const handleGlobalDeleteRule = (period, ruleId) => {
    setGlobalIncentivePlans(prev => ({
      ...prev,
      [period]: prev[period].filter(rule => rule.id !== ruleId)
    }));
  };

  // City plan handlers
  const handleCityAddRule = (cityId, period) => {
    setCurrentPeriodType(period);
    setCurrentCityId(cityId);
    setEditingRule(null);
    setShowModal(true);
  };

  const handleCityEditRule = (cityId, period, rule) => {
    setCurrentPeriodType(period);
    setCurrentCityId(cityId);
    setEditingRule(rule);
    setShowModal(true);
  };

  const handleCityDeleteRule = (cityId, period, ruleId) => {
    setCityIncentivePlans(prev => prev.map(city =>
      city.id === cityId
        ? {
            ...city,
            [period]: city[period].filter(rule => rule.id !== ruleId)
          }
        : city
    ));
  };

  const handleCitySettingsChange = (cityId, field, value) => {
    setCityIncentivePlans(prev => prev.map(city =>
      city.id === cityId ? { ...city, [field]: value } : city
    ));
  };

  const handleAddNewCity = () => {
    if (!selectedCity) return;
    
    const newCity = {
      id: Date.now(),
      cityName: selectedCity,
      enabled: true,
      daily: [],
      weekly: [],
      monthly: []
    };
    setCityIncentivePlans(prev => [...prev, newCity]);
    setSelectedCity('');
  };

  const handleRemoveCity = (cityId) => {
    setCityIncentivePlans(prev => prev.filter(city => city.id !== cityId));
  };

  const handleSaveRule = (ruleData) => {
    if (currentCityId) {
      // City-based rule
      if (editingRule) {
        setCityIncentivePlans(prev => prev.map(city =>
          city.id === currentCityId
            ? {
                ...city,
                [currentPeriodType]: city[currentPeriodType].map(rule =>
                  rule.id === editingRule.id ? { ...ruleData, id: editingRule.id } : rule
                )
              }
            : city
        ));
      } else {
        const newRule = { ...ruleData, id: Date.now() };
        setCityIncentivePlans(prev => prev.map(city =>
          city.id === currentCityId
            ? {
                ...city,
                [currentPeriodType]: [...city[currentPeriodType], newRule]
              }
            : city
        ));
      }
    } else {
      // Global rule
      if (editingRule) {
        setGlobalIncentivePlans(prev => ({
          ...prev,
          [currentPeriodType]: prev[currentPeriodType].map(rule =>
            rule.id === editingRule.id ? { ...ruleData, id: editingRule.id } : rule
          )
        }));
      } else {
        const newRule = { ...ruleData, id: Date.now() };
        setGlobalIncentivePlans(prev => ({
          ...prev,
          [currentPeriodType]: [...prev[currentPeriodType], newRule]
        }));
      }
    }
    setShowModal(false);
    setEditingRule(null);
    setCurrentPeriodType('');
    setCurrentCityId(null);
  };

  const handleSavePlan = (period) => {
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
              <button className="bg-white/20 backdrop-blur-sm p-2 rounded-xl hover:bg-white/30 transition-all duration-300 hover:scale-110">
                <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </button>
              <div className="bg-white/20 backdrop-blur-sm p-2 rounded-xl">
                <Target className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg sm:text-2xl font-bold text-white">Agent Incentive Plan Settings</h1>
                <p className="text-orange-100 text-sm">Configure agent performance incentives</p>
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
          <GlobalIncentiveTab
            incentivePlans={globalIncentivePlans}
            expandedSections={expandedSections}
            onToggleSection={toggleSection}
            onAddRule={handleGlobalAddRule}
            onEditRule={handleGlobalEditRule}
            onDeleteRule={handleGlobalDeleteRule}
            onSave={handleSavePlan}
            loading={loading}
          />
        )}
        {activeTab === 'citywise' && (
          <CityWiseIncentiveTab
            cityIncentivePlans={cityIncentivePlans}
            availableCities={availableCities}
            selectedCity={selectedCity}
            setSelectedCity={setSelectedCity}
            expandedSections={expandedSections}
            onToggleSection={toggleSection}
            onCitySettingsChange={handleCitySettingsChange}
            onAddNewCity={handleAddNewCity}
            onRemoveCity={handleRemoveCity}
            onAddRule={handleCityAddRule}
            onEditRule={handleCityEditRule}
            onDeleteRule={handleCityDeleteRule}
            onSave={handleSavePlan}
            loading={loading}
          />
        )}
      </div>

      {/* Rule Modal */}
      {showModal && (
        <RuleModal
          isOpen={showModal}
          onClose={() => {
            setShowModal(false);
            setEditingRule(null);
            setCurrentPeriodType('');
            setCurrentCityId(null);
          }}
          editingRule={editingRule}
          periodType={currentPeriodType}
          onSave={handleSaveRule}
        />
      )}

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white rounded-xl p-6 shadow-xl">
            <div className="flex items-center space-x-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-500"></div>
              <span className="text-gray-700 font-medium">Saving incentive plan...</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Global Incentive Tab Component
const GlobalIncentiveTab = ({ incentivePlans, expandedSections, onToggleSection, onAddRule, onEditRule, onDeleteRule, onSave, loading }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <Settings className="w-6 h-6 text-orange-500" />
        <h2 className="text-lg font-semibold text-gray-900">🌍 Global Incentive Settings</h2>
      </div>

      <div className="space-y-6">
        {/* Daily Incentive Plan */}
        <IncentivePlanSection
          title="DAILY INCENTIVE PLAN"
          period="daily"
          plans={incentivePlans.daily}
          expanded={expandedSections.daily}
          onToggle={() => onToggleSection('daily')}
          onAddRule={() => onAddRule('daily')}
          onEditRule={(rule) => onEditRule('daily', rule)}
          onDeleteRule={(ruleId) => onDeleteRule('daily', ruleId)}
          onSave={() => onSave('daily')}
          loading={loading}
        />

        {/* Weekly Incentive Plan */}
        <IncentivePlanSection
          title="WEEKLY INCENTIVE PLAN"
          period="weekly"
          plans={incentivePlans.weekly}
          expanded={expandedSections.weekly}
          onToggle={() => onToggleSection('weekly')}
          onAddRule={() => onAddRule('weekly')}
          onEditRule={(rule) => onEditRule('weekly', rule)}
          onDeleteRule={(ruleId) => onDeleteRule('weekly', ruleId)}
          onSave={() => onSave('weekly')}
          loading={loading}
        />

        {/* Monthly Incentive Plan */}
        <IncentivePlanSection
          title="MONTHLY INCENTIVE PLAN"
          period="monthly"
          plans={incentivePlans.monthly}
          expanded={expandedSections.monthly}
          onToggle={() => onToggleSection('monthly')}
          onAddRule={() => onAddRule('monthly')}
          onEditRule={(rule) => onEditRule('monthly', rule)}
          onDeleteRule={(ruleId) => onDeleteRule('monthly', ruleId)}
          onSave={() => onSave('monthly')}
          loading={loading}
        />
      </div>
    </div>
  );
};

// City-wise Incentive Tab Component
const CityWiseIncentiveTab = ({ cityIncentivePlans, availableCities, selectedCity, setSelectedCity, expandedSections, onToggleSection, onCitySettingsChange, onAddNewCity, onRemoveCity, onAddRule, onEditRule, onDeleteRule, onSave, loading }) => {
  const unusedCities = availableCities.filter(city => 
    !cityIncentivePlans.find(setting => setting.cityName === city)
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <MapPin className="w-6 h-6 text-orange-500" />
        <h2 className="text-lg font-semibold text-gray-900">🏙️ City-wise Incentive Settings</h2>
      </div>

      {/* Add New City */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-all duration-300">
        <div className="flex flex-col sm:flex-row sm:items-end space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">Select City</label>
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
        {cityIncentivePlans.map((city) => (
          <CityIncentiveCard
            key={city.id}
            city={city}
            expandedSections={expandedSections}
            onToggleSection={onToggleSection}
            onChange={(field, value) => onCitySettingsChange(city.id, field, value)}
            onRemove={() => onRemoveCity(city.id)}
            onAddRule={(period) => onAddRule(city.id, period)}
            onEditRule={(period, rule) => onEditRule(city.id, period, rule)}
            onDeleteRule={(period, ruleId) => onDeleteRule(city.id, period, ruleId)}
            onSave={() => onSave(city.id)}
            loading={loading}
          />
        ))}
      </div>

      {cityIncentivePlans.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl border-2 border-dashed border-gray-200">
          <MapPin className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No City Rules Configured</h3>
          <p className="text-gray-500">Add your first city-specific incentive plan above</p>
        </div>
      )}
    </div>
  );
};

// ✅ UPDATED: City Incentive Card Component with save buttons enabled
const CityIncentiveCard = ({ city, expandedSections, onToggleSection, onChange, onRemove, onAddRule, onEditRule, onDeleteRule, onSave, loading }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300">
      <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-blue-100 border-b border-blue-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-blue-900 flex items-center space-x-2">
            <MapPin className="w-5 h-5" />
            <span>{city.cityName}</span>
          </h3>
          <div className="flex items-center space-x-4">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={city.enabled}
                onChange={(e) => onChange('enabled', e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-blue-800">✓ Enable Custom Settings for this City</span>
            </label>
            <button
              onClick={onRemove}
              className="group text-red-600 hover:text-red-900 p-2 rounded hover:bg-red-50 transition-all duration-300"
            >
              <Trash2 className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
            </button>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="space-y-6">
          {/* Daily Incentive Plan */}
          <IncentivePlanSection
            title="DAILY INCENTIVE PLAN"
            period="daily"
            plans={city.daily}
            expanded={expandedSections.daily}
            onToggle={() => onToggleSection('daily')}
            onAddRule={() => onAddRule('daily')}
            onEditRule={(rule) => onEditRule('daily', rule)}
            onDeleteRule={(ruleId) => onDeleteRule('daily', ruleId)}
            onSave={() => onSave('daily')}
            loading={loading}
            disabled={!city.enabled}
            compact={false} // ✅ Changed from true to false to show save buttons
          />

          {/* Weekly Incentive Plan */}
          <IncentivePlanSection
            title="WEEKLY INCENTIVE PLAN"
            period="weekly"
            plans={city.weekly}
            expanded={expandedSections.weekly}
            onToggle={() => onToggleSection('weekly')}
            onAddRule={() => onAddRule('weekly')}
            onEditRule={(rule) => onEditRule('weekly', rule)}
            onDeleteRule={(ruleId) => onDeleteRule('weekly', ruleId)}
            onSave={() => onSave('weekly')}
            loading={loading}
            disabled={!city.enabled}
            compact={false} // ✅ Changed from true to false to show save buttons
          />

          {/* Monthly Incentive Plan */}
          <IncentivePlanSection
            title="MONTHLY INCENTIVE PLAN"
            period="monthly"
            plans={city.monthly}
            expanded={expandedSections.monthly}
            onToggle={() => onToggleSection('monthly')}
            onAddRule={() => onAddRule('monthly')}
            onEditRule={(rule) => onEditRule('monthly', rule)}
            onDeleteRule={(ruleId) => onDeleteRule('monthly', ruleId)}
            onSave={() => onSave('monthly')}
            loading={loading}
            disabled={!city.enabled}
            compact={false} // ✅ Changed from true to false to show save buttons
          />
        </div>
      </div>
    </div>
  );
};

// Incentive Plan Section Component
const IncentivePlanSection = ({ title, period, plans, expanded, onToggle, onAddRule, onEditRule, onDeleteRule, onSave, loading, disabled = false, compact = false }) => {
  const sectionClass = compact 
    ? "bg-gray-50 rounded-lg border border-gray-200 overflow-hidden"
    : "bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300";

  const headerClass = compact
    ? "px-4 py-3 bg-gradient-to-r from-gray-100 to-gray-200 border-b border-gray-300 cursor-pointer hover:from-gray-200 hover:to-gray-300 transition-all duration-300"
    : "px-6 py-4 bg-gradient-to-r from-blue-50 to-blue-100 border-b border-blue-200 cursor-pointer hover:from-blue-100 hover:to-blue-200 transition-all duration-300";

  return (
    <div className={sectionClass}>
      {/* Section Header */}
      <div className={headerClass} onClick={onToggle}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="text-lg">▸</span>
            <h3 className={`${compact ? 'text-base' : 'text-lg'} font-semibold ${compact ? 'text-gray-800' : 'text-blue-900'}`}>
              {title}
            </h3>
          </div>
          <div className={`transform transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`}>
            {expanded ? 
              <ChevronUp className={`w-5 h-5 ${compact ? 'text-gray-600' : 'text-blue-600'}`} /> : 
              <ChevronDown className={`w-5 h-5 ${compact ? 'text-gray-600' : 'text-blue-600'}`} />
            }
          </div>
        </div>
      </div>

      {/* Section Content */}
      {expanded && (
        <div className={`${compact ? 'p-4' : 'p-6'} animate-slideDown`}>
          {/* Add Rule Button */}
          <div className="mb-4">
            <button
              onClick={onAddRule}
              disabled={disabled}
              className="group bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-3 py-2 rounded-lg flex items-center space-x-2 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
              <span>Add {title.split(' ')[0]} Rule</span>
            </button>
          </div>

          {/* Rules Table */}
          {plans.length > 0 ? (
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden mb-4">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                  <tr>
                    <th className="px-3 sm:px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Threshold (₹)
                    </th>
                    <th className="px-3 sm:px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Incentive (₹)
                    </th>
                    <th className="px-3 sm:px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {plans.map((rule, index) => (
                    <tr key={rule.id} className="hover:bg-gray-50 transition-colors duration-300 animate-fadeIn" style={{ animationDelay: `${index * 100}ms` }}>
                      <td className="px-3 sm:px-4 py-3 whitespace-nowrap">
                        <span className="text-sm font-semibold text-gray-900">₹{rule.threshold.toLocaleString()}</span>
                      </td>
                      <td className="px-3 sm:px-4 py-3 whitespace-nowrap">
                        <span className="text-sm font-semibold text-green-600">₹{rule.incentive.toLocaleString()}</span>
                      </td>
                      <td className="px-3 sm:px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => onEditRule(rule)}
                            disabled={disabled}
                            className="group text-orange-600 hover:text-orange-900 px-2 py-1 rounded border border-orange-200 hover:bg-orange-50 transition-all duration-300 hover:shadow-md text-xs disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Edit className="w-3 h-3 group-hover:rotate-12 transition-transform duration-300" />
                            <span className="hidden sm:inline ml-1">Edit</span>
                          </button>
                          <button
                            onClick={() => onDeleteRule(rule.id)}
                            disabled={disabled}
                            className="group text-red-600 hover:text-red-900 px-2 py-1 rounded border border-red-200 hover:bg-red-50 transition-all duration-300 hover:shadow-md text-xs disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Trash2 className="w-3 h-3 group-hover:scale-110 transition-transform duration-300" />
                            <span className="hidden sm:inline ml-1">Delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-6 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200 mb-4">
              <Target className="w-8 h-8 mx-auto mb-2 text-gray-300" />
              <h4 className="text-sm font-semibold text-gray-900 mb-1">No {title.split(' ')[0]} Rules</h4>
              <p className="text-gray-500 text-xs">Add your first incentive rule above</p>
            </div>
          )}

          {/* ✅ Save Button - Now shows for both global and city-based */}
          {!compact && (
            <div className="flex justify-end">
              <button
                onClick={onSave}
                disabled={loading || plans.length === 0 || disabled}
                className="group bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span> Save {title.split(' ')[0]} Incentives</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Rule Modal Component
const RuleModal = ({ isOpen, onClose, editingRule, periodType, onSave }) => {
  const [formData, setFormData] = useState({
    threshold: editingRule?.threshold || '',
    incentive: editingRule?.incentive || ''
  });

  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.threshold && formData.incentive) {
      onSave({
        threshold: parseFloat(formData.threshold),
        incentive: parseFloat(formData.incentive)
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div 
        className="absolute inset-0 bg-black/20 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md flex flex-col animate-slideInUp">
        {/* Header */}
        <div className="flex-shrink-0 px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-orange-500 to-orange-600">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Target className="w-5 h-5 text-white" />
              <h2 className="text-lg font-semibold text-white">
                {editingRule ? 'Edit' : 'Add'} {periodType.charAt(0).toUpperCase() + periodType.slice(1)} Rule
              </h2>
            </div>
            <button 
              onClick={onClose} 
              className="text-white/70 hover:text-white p-1 rounded-full hover:bg-white/20 transition-all duration-300 hover:scale-110"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Form Content */}
        <div className="flex-1 p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Threshold Amount (₹)</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
                <input
                  type="number"
                  required
                  value={formData.threshold}
                  onChange={(e) => handleInputChange('threshold', e.target.value)}
                  className="w-full pl-8 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 hover:shadow-md"
                  placeholder="1000"
                />
              </div>
              <p className="text-xs text-gray-500">Minimum earnings to qualify for incentive</p>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Incentive Amount (₹)</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
                <input
                  type="number"
                  required
                  value={formData.incentive}
                  onChange={(e) => handleInputChange('incentive', e.target.value)}
                  className="w-full pl-8 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 hover:shadow-md"
                  placeholder="100"
                />
              </div>
              <p className="text-xs text-gray-500">Bonus amount when threshold is reached</p>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-300"
            >
              Cancel
            </button>
            <button 
              onClick={handleSubmit}
              disabled={!formData.threshold || !formData.incentive}
              className="px-6 py-2 text-sm font-medium text-white bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 rounded-lg flex items-center space-x-2 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-4 h-4" />
              <span>{editingRule ? 'Update' : 'Add'} Rule</span>
            </button>
          </div>
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
  
  @keyframes slideInUp {
    from { 
      opacity: 0; 
      transform: translateY(50px) scale(0.95); 
    }
    to { 
      opacity: 1; 
      transform: translateY(0) scale(1); 
    }
  }
  
  @keyframes slideIn {
    from { width: 0; }
    to { width: 100%; }
  }
  
  .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
  .animate-slideDown { animation: slideDown 0.3s ease-out; }
  .animate-slideInUp { animation: slideInUp 0.4s ease-out; }
  .animate-slideIn { animation: slideIn 0.3s ease-out; }
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}

export default AgentIncentivePlanSettings;
