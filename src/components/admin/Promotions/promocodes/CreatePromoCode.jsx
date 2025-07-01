import React, { useState, useEffect } from "react";
import axios from "axios";
import { fetchRestaurantsDropdown } from "../../../../apis/adminApis/adminFuntionsApi";

const CreatePromoCode = ({ onAddPromoCode }) => {
  const [promoData, setPromoData] = useState({
    language: "en",
    promotionType: "Percentage",
    promotionName: "",
    description: "",
    discountValue: "",
    maximumDiscountValue: "",
    minimumOrderAmount: "",
    isReusableBySameUser: false,
    allowLoyaltyEarn: false,
    allowLoyaltyRedeem: false,
    promoAppliedOn: "cartValue",
    maximumNoOfAllowedUsers: "",
    applicationMode: "Public",
    from: "",
    till: "",
    assignedRestaurants: [],
  });

  const [restaurantsList, setRestaurantsList] = useState([]);
  const [showRestaurantModal, setShowRestaurantModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        // Replace with your actual API endpoint
        const response = await fetchRestaurantsDropdown()
        setRestaurantsList(response.data);
      } catch (error) {
        console.error("Error fetching restaurants:", error);
      }
    };
    fetchRestaurants();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPromoData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setPromoData((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const toggleRestaurantSelection = (restaurantId) => {
    setPromoData(prev => {
      const newSelection = [...prev.assignedRestaurants];
      const index = newSelection.indexOf(restaurantId);
      
      if (index === -1) {
        newSelection.push(restaurantId);
      } else {
        newSelection.splice(index, 1);
      }
      
      return {
        ...prev,
        assignedRestaurants: newSelection
      };
    });
  };

  const formatDateForAPI = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toISOString();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Format the data for API
      const apiData = {
        ...promoData,
        discountValue: parseFloat(promoData.discountValue),
        maximumDiscountValue: promoData.maximumDiscountValue ? parseFloat(promoData.maximumDiscountValue) : null,
        minimumOrderAmount: promoData.minimumOrderAmount ? parseFloat(promoData.minimumOrderAmount) : null,
        maximumNoOfAllowedUsers: promoData.maximumNoOfAllowedUsers ? parseInt(promoData.maximumNoOfAllowedUsers) : null,
        from: formatDateForAPI(promoData.from),
        till: formatDateForAPI(promoData.till),
      };

      // Make API call
      
      const response = await axios.post('http://localhost:5000/promo', apiData, {
        headers: {
          'Content-Type': 'application/json',
          // Add authorization if needed
          // 'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

    console.log(apiData)

      if (onAddPromoCode) {
        onAddPromoCode(response.data);
      }

      // Reset form after successful submission
      setPromoData({
        language: "en",
        promotionType: "Percentage",
        promotionName: "",
        description: "",
        discountValue: "",
        maximumDiscountValue: "",
        minimumOrderAmount: "",
        isReusableBySameUser: false,
        allowLoyaltyEarn: false,
        allowLoyaltyRedeem: false,
        promoAppliedOn: "cartValue",
        maximumNoOfAllowedUsers: "",
        applicationMode: "Public",
        from: "",
        till: "",
        assignedRestaurants: [],
      });

    } catch (error) {
      console.error("Error creating promo:", error);
      setError(error.response?.data?.message || "Something went wrong while creating the promo");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Add Promotion</h1>

      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-6">
        <form onSubmit={handleSubmit}>
          {/* Language */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Language *
            </label>
            <select
              name="language"
              value={promoData.language}
              onChange={handleChange}
              className="w-full md:w-1/2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
            </select>
          </div>

          {/* Promotion Type */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Promotion Type *
            </label>
            <div className="flex space-x-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="promotionType"
                  value="Percentage"
                  checked={promoData.promotionType === "Percentage"}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                  required
                />
                <span className="ml-2 text-gray-700">Percentage Discount</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="promotionType"
                  value="Flat"
                  checked={promoData.promotionType === "Flat"}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-gray-700">Flat Discount</span>
              </label>
            </div>
          </div>

          {/* Promotion Name */}
          <div className="mb-6">
            <label
              htmlFor="promotionName"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Promotion Name *
            </label>
            <input
              type="text"
              id="promotionName"
              name="promotionName"
              value={promoData.promotionName}
              onChange={handleChange}
              className="w-full md:w-1/2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              placeholder="e.g. WELCOME50"
            />
          </div>

          {/* Description */}
          <div className="mb-6">
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Description (Max 150 Characters)
            </label>
            <textarea
              id="description"
              name="description"
              value={promoData.description}
              onChange={handleChange}
              maxLength="150"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="3"
              placeholder="e.g. 50% off for your first order"
            />
            <p className="text-xs text-gray-500 mt-1">
              {promoData.description.length}/150 characters
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Discount Value */}
            <div>
              <label
                htmlFor="discountValue"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                {promoData.promotionType === "Percentage"
                  ? "Percentage Value *"
                  : "Fixed Amount *"}
              </label>
              <div className="relative">
                <input
                  type="number"
                  id="discountValue"
                  name="discountValue"
                  value={promoData.discountValue}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  min="0"
                  step={promoData.promotionType === "Percentage" ? "0.01" : "1"}
                  placeholder={
                    promoData.promotionType === "Percentage"
                      ? "e.g. 15.00"
                      : "e.g. 50.00"
                  }
                />
                {promoData.promotionType === "Percentage" && (
                  <span className="absolute right-3 top-2 text-gray-500">
                    %
                  </span>
                )}
              </div>
            </div>

            {/* Maximum Discount Value */}
            <div>
              <label
                htmlFor="maximumDiscountValue"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Maximum Discount Value
              </label>
              <div className="relative">
                <input
                  type="number"
                  id="maximumDiscountValue"
                  name="maximumDiscountValue"
                  value={promoData.maximumDiscountValue}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="0"
                  step="1"
                  placeholder="e.g. 200.00"
                />
                <span className="absolute right-3 top-2 text-gray-500">$</span>
              </div>
            </div>
          </div>

          {/* Minimum Order Amount */}
          <div className="mb-6">
            <label
              htmlFor="minimumOrderAmount"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Minimum Order Amount
            </label>
            <div className="relative">
              <input
                type="number"
                id="minimumOrderAmount"
                name="minimumOrderAmount"
                value={promoData.minimumOrderAmount}
                onChange={handleChange}
                className="w-full md:w-1/2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="0"
                step="1"
                placeholder="e.g. 300.00"
              />
              <span className="absolute right-3 top-2 text-gray-500">$</span>
            </div>
          </div>

          {/* Multiple Use */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Allow Single User To Use The Code Multiple Times?
            </label>
            <div className="flex items-center">
              <input
                type="checkbox"
                name="isReusableBySameUser"
                checked={promoData.isReusableBySameUser}
                onChange={handleCheckboxChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-gray-700">Yes</span>
            </div>
          </div>

          {/* Earn Loyalty Points */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Allow Loyalty Points To Be Earned If This Promo Code Is Applied?
            </label>
            <div className="flex items-center">
              <input
                type="checkbox"
                name="allowLoyaltyEarn"
                checked={promoData.allowLoyaltyEarn}
                onChange={handleCheckboxChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-gray-700">Yes</span>
            </div>
          </div>

          {/* Maximum Users */}
          <div className="mb-6">
            <label
              htmlFor="maximumNoOfAllowedUsers"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Maximum No Of Allowed Users
            </label>
            <input
              type="number"
              id="maximumNoOfAllowedUsers"
              name="maximumNoOfAllowedUsers"
              value={promoData.maximumNoOfAllowedUsers}
              onChange={handleChange}
              className="w-full md:w-1/2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="0"
              placeholder="e.g. 100"
            />
          </div>

          {/* Application Mode */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Promotion Application Mode *
            </label>
            <div className="flex space-x-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="applicationMode"
                  value="Public"
                  checked={promoData.applicationMode === "Public"}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-gray-700">Public</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="applicationMode"
                  value="Private"
                  checked={promoData.applicationMode === "Private"}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-gray-700">Private</span>
              </label>
            </div>
          </div>

          {/* Redeem Loyalty Points */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Allow Loyalty Points To Be Redeemed If This Promo Code Is Applied?
            </label>
            <div className="flex items-center">
              <input
                type="checkbox"
                name="allowLoyaltyRedeem"
                checked={promoData.allowLoyaltyRedeem}
                onChange={handleCheckboxChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-gray-700">Yes</span>
            </div>
          </div>

          {/* Applied On */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Promotion Applied On *
            </label>
            <div className="flex space-x-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="promoAppliedOn"
                  value="cartValue"
                  checked={promoData.promoAppliedOn === "cartValue"}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-gray-700">Cart Value</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="promoAppliedOn"
                  value="specificItems"
                  checked={promoData.promoAppliedOn === "specificItems"}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-gray-700">Specific Items</span>
              </label>
            </div>
          </div>

          {/* Assign Restaurants */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Assign Restaurants
            </label>
            <button
              type="button"
              onClick={() => setShowRestaurantModal(true)}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {promoData.assignedRestaurants.length > 0 
                ? `${promoData.assignedRestaurants.length} selected` 
                : "Choose"}
            </button>
          </div>

          {/* Restaurant Selection Modal */}
          {showRestaurantModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-lg p-6 max-w-md w-full max-h-[80vh] overflow-y-auto">
                <h2 className="text-xl font-bold mb-4">Select Restaurants</h2>
                <div className="space-y-2">
                  {restaurantsList.map(restaurant => (
                    <div key={restaurant._id} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`restaurant-${restaurant._id}`}
                        checked={promoData.assignedRestaurants.includes(restaurant._id)}
                        onChange={() => toggleRestaurantSelection(restaurant._id)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                      />
                      <label htmlFor={`restaurant-${restaurant._id}`} className="ml-2">
                        {restaurant.name}
                      </label>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setShowRestaurantModal(false)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Done
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Date Range */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <label
                htmlFor="from"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Start Date *
              </label>
              <input
                type="datetime-local"
                id="from"
                name="from"
                value={promoData.from}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label
                htmlFor="till"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                End Date *
              </label>
              <input
                type="datetime-local"
                id="till"
                name="till"
                value={promoData.till}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Creating...' : 'Add Promotion'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePromoCode;