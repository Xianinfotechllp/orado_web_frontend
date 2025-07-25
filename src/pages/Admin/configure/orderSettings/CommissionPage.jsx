import React, { useState, useEffect } from 'react';
import CommissionDetails from './CommissionDetails';
import { getCommissionSettings, saveCommissionSettings } from '../../../../apis/adminApis/commisionApi';
import { toast } from 'react-toastify';

const CommissionPage = () => {
  const [deliveryMethodEnabled, setDeliveryMethodEnabled] = useState(false);
  const [commissionType, setCommissionType] = useState('percentage');
  const [transferType, setTransferType] = useState('offline');
  const [payoutSchedule, setPayoutSchedule] = useState('realtime');
  const [includeDeliveryCharges, setIncludeDeliveryCharges] = useState(false);
  const [marketplaceTax, setMarketplaceTax] = useState('admin');
  const [restaurantTax, setRestaurantTax] = useState('merchant');
  const [productTax, setProductTax] = useState('admin');
  const [promoLoyalty, setPromoLoyalty] = useState('admin');
  const [deliveryChargeTransfer, setDeliveryChargeTransfer] = useState(false);
  const [additionalChargeTransfer, setAdditionalChargeTransfer] = useState(false);
  const [activeTab, setActiveTab] = useState('setup');
  const [commissionValue, setCommissionValue] = useState('');
  const [govCommissionValue, setGovCommissionValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const deliveryMethods = [
    { value: 'home', label: 'Home delivery' },
    { value: 'pickup', label: 'Pickup' },
    { value: 'dinein', label: 'Dine-in' }
  ];
  const [selectedDeliveryMethod, setSelectedDeliveryMethod] = useState(deliveryMethods[0].value);

  // Fetch current settings on mount
  useEffect(() => {
    const fetchSettings = async () => {
      setLoading(true);
      setError('');
      try {
        const { data, status } = await getCommissionSettings();

        if (status === 200 && data?.settings) {
          const settings = data.settings;

          // Set all the state values from the API response
          setCommissionValue(settings.defaultCommissionValue || '');
          setCommissionType(settings.commissionType || 'percentage');
          setPayoutSchedule(settings.payoutScheduleDays === 0 ? 'realtime' : 'later');
          setIncludeDeliveryCharges(settings.includeDeliveryCharges || false);
          setAdditionalChargeTransfer(settings.additionalChargeCommissionTo === 'admin');
          setMarketplaceTax(settings.marketplaceTaxOwner || 'admin');
          setRestaurantTax(settings.merchantTaxOwner || 'merchant');
          setProductTax(settings.productTaxOwner || 'admin');
          setPromoLoyalty(settings.promoLoyaltyDeductFrom || 'admin');
          setDeliveryChargeTransfer(settings.deliveryChargeTransfer || false);
          setDeliveryMethodEnabled(settings.deliveryMethodEnabled || false);
          
          if (settings.selectedDeliveryMethod) {
            setSelectedDeliveryMethod(settings.selectedDeliveryMethod);
          }
        } else {
          setError('Failed to load commission settings');
          toast.error('Failed to load commission settings');
        }
      } catch (err) {
        setError(err.message || 'Failed to fetch commission settings');
        toast.error(err.message || 'Failed to fetch commission settings');
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  // Save settings handler
  const handleSave = async () => {
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      const payload = {
        defaultCommissionValue: Number(commissionValue),
        commissionType,
        payoutScheduleDays: payoutSchedule === 'realtime' ? 0 : 7,
        includeDeliveryCharges,
        additionalChargeCommissionTo: additionalChargeTransfer ? 'admin' : 'merchant',
        marketplaceTaxOwner: marketplaceTax,
        merchantTaxOwner: restaurantTax,
        productTaxOwner: productTax,
        promoLoyaltyDeductFrom: promoLoyalty,
        deliveryChargeTransfer,
        deliveryMethodEnabled,
        selectedDeliveryMethod: deliveryMethodEnabled ? selectedDeliveryMethod : undefined
      };
      
      const response = await saveCommissionSettings(payload);
      
      if (response && response.status === 200) {
        setSuccess('Settings saved successfully!');
        toast.success("Settings saved successfully!");
      } else {
        setError(response?.data?.message || 'Failed to save settings');
        toast.error(response?.data?.message || 'Failed to save settings');
      }
    } catch (err) {
      setError(err.message || 'Failed to save settings');
      toast.error(err.message || 'Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  // Helper function to render toggle switches with consistent styling
  const renderToggle = (checked, onChange, leftLabel, rightLabel) => (
    <div className="flex items-center justify-between">
      <span className="text-gray-700 text-sm">{leftLabel}</span>
      <div className="flex items-center">
        <label className="relative inline-flex items-center cursor-pointer mx-2">
          <input 
            type="checkbox" 
            checked={checked}
            onChange={onChange}
            className="sr-only peer" 
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
        </label>
        <span className="text-gray-700 text-sm">{rightLabel}</span>
      </div>
    </div>
  );

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-sm overflow-hidden">
        {/* Header Section */}
        <div className="flex items-center p-6 border-b border-gray-200">
          <div className="mr-4 bg-blue-50 p-3 rounded-lg">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-blue-600">
              <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="flex-grow">
            <h1 className="text-2xl font-bold text-gray-800">Commission</h1>
            <p className="text-gray-500 mt-1">Configure commission rates for users on your platform</p>
          </div>
          {renderToggle(
            deliveryMethodEnabled,
            () => setDeliveryMethodEnabled(!deliveryMethodEnabled),
            'Delivery Method',
            'Enabled'
          )}
        </div>

        {/* Introduction Section */}
        <div className="p-6 border-b border-gray-200">
          <p className="text-gray-600 mb-3">
            Use commission to configure your commission rates to the users for using the platform. 
            Commission rates are applied against each individual order. Commission can be of 2 types: 
            Fixed or percentage, and can be handled on the platform or offline.
          </p>
          <a href="#" className="text-blue-600 hover:text-blue-800 text-sm flex items-center">
            Learn more on how to set up commissions
            <svg className="w-4 h-4 ml-1" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
              <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/>
            </svg>
          </a>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex">
            <button 
              className={`px-6 py-3 border-b-2 font-medium ${activeTab === 'setup' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('setup')}
            >
              Setup
            </button>
            <button 
              className={`px-6 py-3 border-b-2 font-medium ${activeTab === 'details' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('details')}
            >
              Details
            </button>
          </nav>
        </div>

        {/* Main Content */}
        <div>
          {activeTab === 'setup' ? (
            <div className="p-6">
              {/* Delivery Method Toggle */}
              <div className="flex items-center justify-between mb-6 p-4 bg-gray-50 rounded-lg">
                <p className="text-gray-700">
                  Enable this toggle to transfer commissions on the basis of delivery methods.
                </p>
                {renderToggle(
                  deliveryMethodEnabled,
                  () => setDeliveryMethodEnabled(!deliveryMethodEnabled),
                  'Disabled',
                  'Enabled'
                )}
              </div>

              {/* Commission Setup Section */}
              <div className="mb-8">
                <div className="flex flex-col md:flex-row mb-6">
                  <div className="md:w-1/3 mb-4 md:mb-0">
                    <h3 className="text-lg font-semibold text-gray-800">Commission Setup</h3>
                    <p className="text-gray-500 text-sm mt-1">
                      Configure the commission rate to your users. It will affect all commission calculations.
                    </p>
                  </div>
                  <div className="md:w-2/3 space-y-6">
                    {/* Delivery Method Dropdown */}
                    {deliveryMethodEnabled && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Mode</label>
                        <select 
                          value={selectedDeliveryMethod}
                          onChange={(e) => setSelectedDeliveryMethod(e.target.value)}
                          className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                        >
                          {deliveryMethods.map(method => (
                            <option key={method.value} value={method.value}>{method.label}</option>
                          ))}
                        </select>
                      </div>
                    )}

                    {/* Commission Type */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Default Commission</label>
                      <div className="flex flex-col sm:flex-row gap-4">
                        <label className="inline-flex items-center">
                          <input
                            type="radio"
                            name="commissionType"
                            checked={commissionType === 'fixed'}
                            onChange={() => setCommissionType('fixed')}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                          />
                          <span className="ml-2 text-gray-700">Set fixed Amount ($)</span>
                        </label>
                        <label className="inline-flex items-center">
                          <input
                            type="radio"
                            name="commissionType"
                            checked={commissionType === 'percentage'}
                            onChange={() => setCommissionType('percentage')}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                          />
                          <span className="ml-2 text-gray-700">Set a Percentage (%)</span>
                        </label>
                      </div>
                    </div>

                    {/* Commission Value */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Commission Value</label>
                      <div className="relative">
                        <input
                          type="number"
                          value={commissionValue}
                          onChange={e => setCommissionValue(e.target.value)}
                          placeholder={`Enter value in ${commissionType === 'percentage' ? 'percentage' : 'dollars'}`}
                          className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                        />
                        <span className="absolute right-3 top-2.5 text-gray-500 text-sm">
                          {commissionType === 'percentage' ? '%' : '$'}
                        </span>
                      </div>
                    </div>

                    {/* Commission Transfer */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Commission Transfer</label>
                      <div className="flex flex-col sm:flex-row gap-4">
                        <label className="inline-flex items-center">
                          <input
                            type="radio"
                            name="transferType"
                            checked={transferType === 'offline'}
                            onChange={() => setTransferType('offline')}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                          />
                          <span className="ml-2 text-gray-700">Offline</span>
                        </label>
                        <label className="inline-flex items-center">
                          <input
                            type="radio"
                            name="transferType"
                            checked={transferType === 'online'}
                            onChange={() => setTransferType('online')}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                          />
                          <span className="ml-2 text-gray-700">Online</span>
                        </label>
                      </div>
                    </div>

                    {/* Payout Schedule */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Payout Schedule</label>
                      <div className="flex flex-col sm:flex-row gap-4">
                        <label className="inline-flex items-center">
                          <input
                            type="radio"
                            name="payoutSchedule"
                            checked={payoutSchedule === 'realtime'}
                            onChange={() => setPayoutSchedule('realtime')}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                          />
                          <span className="ml-2 text-gray-700">Real Time</span>
                        </label>
                        <label className="inline-flex items-center">
                          <input
                            type="radio"
                            name="payoutSchedule"
                            checked={payoutSchedule === 'later'}
                            onChange={() => setPayoutSchedule('later')}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                          />
                          <span className="ml-2 text-gray-700">Later</span>
                        </label>
                      </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-end gap-3 pt-6">
                      <button 
                        className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 text-sm font-medium transition-colors" 
                        disabled={loading}
                      >
                        Cancel
                      </button>
                      <button 
                        onClick={handleSave} 
                        className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 text-sm font-medium transition-colors shadow-sm" 
                        disabled={loading}
                      >
                        {loading ? (
                          <span className="flex items-center">
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Saving...
                          </span>
                        ) : 'Save'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Government Commission Section */}
              <div className="mb-8">
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-1/3 mb-4 md:mb-0">
                    <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                      Government Commission
                      <svg className="w-4 h-4 ml-1 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd"/>
                      </svg>
                    </h3>
                  </div>
                  <div className="md:w-2/3 space-y-4">
                    {/* Government Commission Value */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Commission Value</label>
                      <div className="relative">
                        <input
                          type="number"
                          value={govCommissionValue}
                          onChange={e => setGovCommissionValue(e.target.value)}
                          placeholder="Enter value in percentage"
                          className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                        />
                        <span className="absolute right-3 top-2.5 text-gray-500 text-sm">%</span>
                      </div>
                    </div>

                    {/* Include Delivery Charges */}
                    <div className="flex items-center justify-between">
                      <label className="block text-sm font-medium text-gray-700">Include Delivery Charges</label>
                      {renderToggle(
                        includeDeliveryCharges,
                        () => setIncludeDeliveryCharges(!includeDeliveryCharges),
                        '',
                        ''
                      )}
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-end gap-3 pt-4">
                      <button className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 text-sm font-medium transition-colors">
                        Cancel
                      </button>
                      <button className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 text-sm font-medium transition-colors shadow-sm">
                        Save
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tax Transfer Sections */}
              <div className="space-y-4">
                {/* Marketplace Level Tax */}
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Marketplace Level Tax</h4>
                  {renderToggle(
                    marketplaceTax === 'merchant',
                    () => setMarketplaceTax(marketplaceTax === 'admin' ? 'merchant' : 'admin'),
                    'Admin',
                    'Merchant'
                  )}
                </div>

                {/* Restaurant Level Tax */}
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Restaurants Level Tax</h4>
                  {renderToggle(
                    restaurantTax === 'admin',
                    () => setRestaurantTax(restaurantTax === 'merchant' ? 'admin' : 'merchant'),
                    'Merchant',
                    'Admin'
                  )}
                </div>

                {/* Product Level Tax */}
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Product Level Tax</h4>
                  {renderToggle(
                    productTax === 'merchant',
                    () => setProductTax(productTax === 'admin' ? 'merchant' : 'admin'),
                    'Admin',
                    'Merchant'
                  )}
                </div>

                {/* Promo Codes and Loyalty Points */}
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Promo Codes and Loyalty Points</h4>
                  {renderToggle(
                    promoLoyalty === 'both',
                    () => setPromoLoyalty(promoLoyalty === 'admin' ? 'both' : 'admin'),
                    'Admin',
                    'Both Admin & Merchant'
                  )}
                </div>

                {/* Delivery Charge Transfer */}
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-700">
                      Enable this toggle to transfer the Commission of Delivery Charge to the Admin if Delivery is done by the Restaurants
                    </p>
                    {renderToggle(
                      deliveryChargeTransfer,
                      () => setDeliveryChargeTransfer(!deliveryChargeTransfer),
                      '',
                      ''
                    )}
                  </div>
                </div>

                {/* Additional Charge Transfer */}
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-700">
                      Enable this toggle to transfer the Commission of Additional Charge to the Admin else the charges will be transferred to Restaurants
                    </p>
                    {renderToggle(
                      additionalChargeTransfer,
                      () => setAdditionalChargeTransfer(!additionalChargeTransfer),
                      '',
                      ''
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <CommissionDetails/>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommissionPage;