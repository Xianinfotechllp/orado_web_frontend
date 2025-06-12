import React, { useState } from "react";
import {
  Percent,
  DollarSign,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Settings,
  Minus,
  Plus,
  User,
  Users,
  ShoppingBag
} from "lucide-react";
import axios from "axios";

function CreateOffer({ onOfferCreated }) {
  const [type, setType] = useState("percentage");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [discountValue, setDiscountValue] = useState("");
  const [maxDiscount, setMaxDiscount] = useState("");
  const [minOrderValue, setMinOrderValue] = useState("");
  const [validFrom, setValidFrom] = useState("");
  const [validTill, setValidTill] = useState("");
  const [usageLimitPerUser, setUsageLimitPerUser] = useState("");
  const [totalUsageLimit, setTotalUsageLimit] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    setSuccess("");
    setError("");
    setIsLoading(true);

    if (!title || !discountValue || !validFrom || !validTill || !minOrderValue) {
      setError("Please fill all required fields");
      setIsLoading(false);
      return;
    }

    try {
      const token = sessionStorage.getItem('adminToken');
      if (!token) {
        throw new Error("No authentication token found");
      }

      await axios.post("http://localhost:5000/admin/offer", {
        title,
        description,
        type,
        discountValue: parseFloat(discountValue),
        maxDiscount: maxDiscount ? parseFloat(maxDiscount) : null,
        minOrderValue: parseFloat(minOrderValue),
        validFrom: new Date(validFrom),
        validTill: new Date(validTill),
        usageLimitPerUser: usageLimitPerUser ? parseInt(usageLimitPerUser) : null,
        totalUsageLimit: totalUsageLimit ? parseInt(totalUsageLimit) : null
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      setSuccess("Offer created successfully");
      // Reset all fields
      setTitle("");
      setDescription("");
      setDiscountValue("");
      setMaxDiscount("");
      setMinOrderValue("");
      setValidFrom("");
      setValidTill("");
      setUsageLimitPerUser("");
      setTotalUsageLimit("");
      
      if (onOfferCreated) onOfferCreated();
    } catch (err) {
      console.error("Error creating offer:", err);
      setError(err.response?.data?.message || "Failed to create offer");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white  rounded-xl shadow-sm border mb-8">
      <div className="px-6 py-5 border-b flex items-center space-x-3">
        <div className="p-2 bg-purple-100 rounded-lg">
          <Settings className="w-5 h-5 text-purple-600" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Create New Offer
          </h2>
          <p className="text-sm text-gray-500">
            Configure discount offers with advanced rules
          </p>
        </div>
      </div>

      <div className="p-6">
        {error && (
          <div className="flex items-center space-x-2 p-4 mb-6 text-sm text-red-800 bg-red-50 border border-red-200 rounded-lg">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}
        {success && (
          <div className="flex items-center space-x-2 p-4 mb-6 text-sm text-green-800 bg-green-50 border border-green-200 rounded-lg">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
            <span>{success}</span>
          </div>
        )}

        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm"
                placeholder="Summer Special"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700">
                Description (Optional)
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm"
                placeholder="Limited time summer discount"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700">
                Discount Type <span className="text-red-500">*</span>
              </label>
              <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => setType("percentage")}
                  className={`flex-1 px-4 py-3 text-sm ${
                    type === "percentage"
                      ? "bg-purple-600 text-white"
                      : "bg-white"
                  }`}
                >
                  <div className="flex justify-center items-center space-x-1">
                    <Percent className="w-4 h-4" />
                    <span>Percentage</span>
                  </div>
                </button>
                <button
                  onClick={() => setType("fixed")}
                  className={`flex-1 px-4 py-3 text-sm ${
                    type === "fixed"
                      ? "bg-purple-600 text-white"
                      : "bg-white"
                  }`}
                >
                  <div className="flex justify-center items-center space-x-1">
                    <DollarSign className="w-4 h-4" />
                    <span>Fixed</span>
                  </div>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700">
                Discount Value <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={discountValue}
                  onChange={(e) => setDiscountValue(e.target.value)}
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg shadow-sm"
                  placeholder={type === "percentage" ? "10" : "5"}
                />
                <div className="absolute right-4 top-3 text-gray-500">
                  {type === "percentage" ? "%" : "$"}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700">
                Max Discount ({type === "percentage" ? "$" : ""})
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={maxDiscount}
                  onChange={(e) => setMaxDiscount(e.target.value)}
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg shadow-sm"
                  placeholder="200"
                />
                {type === "percentage" && (
                  <div className="absolute right-4 top-3 text-gray-500">$</div>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700">
                Min Order Value <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={minOrderValue}
                  onChange={(e) => setMinOrderValue(e.target.value)}
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg shadow-sm"
                  placeholder="300"
                />
                <div className="absolute right-4 top-3 text-gray-500">$</div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700">
                Usage Limit Per User
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={usageLimitPerUser}
                  onChange={(e) => setUsageLimitPerUser(e.target.value)}
                  className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg shadow-sm"
                  placeholder="2"
                />
                <User className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700">
                Total Usage Limit
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={totalUsageLimit}
                  onChange={(e) => setTotalUsageLimit(e.target.value)}
                  className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg shadow-sm"
                  placeholder="100"
                />
                <Users className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700">
                Valid From <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="datetime-local"
                  value={validFrom}
                  onChange={(e) => setValidFrom(e.target.value)}
                  className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg shadow-sm"
                />
                <Calendar className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700">
                Valid Till <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="datetime-local"
                  value={validTill}
                  onChange={(e) => setValidTill(e.target.value)}
                  className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg shadow-sm"
                />
                <Calendar className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className={`px-6 py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 ${
                isLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? 'Creating...' : 'Create Offer'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateOffer;