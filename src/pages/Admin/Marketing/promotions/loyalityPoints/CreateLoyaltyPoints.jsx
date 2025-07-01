import React, { useState, useEffect } from "react";
import { createLoyaltySettings, getLoyalitySettings} from "../../../../../apis/adminApis/adminFuntionsApi";
import { toast } from "react-toastify";

const CreateLoyaltyPoints = () => {
  const [loyaltyData, setLoyaltyData] = useState({
    earningCriteria: '',
    pointsPerAmount: '',
    minOrderAmountForEarning: '',
    maxEarningPoints: '',
    expiryDurationDays: '',
    redemptionCriteria: '',
    pointsPerRedemptionAmount: '',
    minOrderAmountForRedemption: '',
    minPointsForRedemption: '',
    maxRedemptionPercent: ''
  });

  const fetchSettings = async () => {
    try {
      const data = await getLoyalitySettings();
      if (data) {
        setLoyaltyData(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch loyalty settings", error);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoyaltyData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createLoyaltySettings(loyaltyData);
      toast.success("loyality point updated")


    } catch (err) {
      console.error("Save failed", err);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Loyalty Points Settings</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 space-y-6">
        {/* Earning Criteria */}
        <div>
          <h2 className="text-lg font-medium text-gray-900 mb-4">Earning Criteria</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField label="Earning Criteria (Order Amount)" name="earningCriteria" value={loyaltyData.earningCriteria} onChange={handleChange} prefix="$" />
            <InputField label="Points Per Amount" name="pointsPerAmount" value={loyaltyData.pointsPerAmount} onChange={handleChange} />
            <InputField label="Minimum Order Amount for Earning" name="minOrderAmountForEarning" value={loyaltyData.minOrderAmountForEarning} onChange={handleChange} prefix="$" />
            <InputField label="Maximum Earning Points" name="maxEarningPoints" value={loyaltyData.maxEarningPoints} onChange={handleChange} />
            <InputField label="Expiry Duration (Days)" name="expiryDurationDays" value={loyaltyData.expiryDurationDays} onChange={handleChange} />
          </div>
        </div>

        {/* Redemption Criteria */}
        <div>
          <h2 className="text-lg font-medium text-gray-900 mb-4">Redemption Criteria</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField label="Points for Redemption" name="redemptionCriteria" value={loyaltyData.redemptionCriteria} onChange={handleChange} />
            <InputField label="Amount per Redemption Points" name="pointsPerRedemptionAmount" value={loyaltyData.pointsPerRedemptionAmount} onChange={handleChange} prefix="$" />
            <InputField label="Minimum Order Amount for Redemption" name="minOrderAmountForRedemption" value={loyaltyData.minOrderAmountForRedemption} onChange={handleChange} prefix="$" />
            <InputField label="Minimum Points for Redemption" name="minPointsForRedemption" value={loyaltyData.minPointsForRedemption} onChange={handleChange} />
            <InputField label="Maximum Redemption Amount (%)" name="maxRedemptionPercent" value={loyaltyData.maxRedemptionPercent} onChange={handleChange} suffix="%" />
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end space-x-3">
          <button type="button" className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
            Cancel
          </button>
          <button type="submit" className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
            Save Settings
          </button>
        </div>
      </form>
    </div>
  );
};

// Input Field Component
const InputField = ({ label, name, value, onChange, prefix, suffix }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <div className="relative rounded-md shadow-sm">
      {prefix && (
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <span className="text-gray-500 sm:text-sm">{prefix}</span>
        </div>
      )}
      <input
        type="number"
        name={name}
        id={name}
        value={value}
        onChange={onChange}
        className={`focus:ring-blue-500 focus:border-blue-500 block w-full py-2 border border-gray-300 rounded-md ${prefix ? 'pl-7' : ''} ${suffix ? 'pr-7' : ''}`}
        required
      />
      {suffix && (
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          <span className="text-gray-500 sm:text-sm">{suffix}</span>
        </div>
      )}
    </div>
  </div>
);

export default CreateLoyaltyPoints;
