import React, { useState, useEffect } from "react";
import { CheckCircle2, AlertCircle, Search, Tag } from "lucide-react";
import axios from "axios";
import apiClient from "../../../apis/apiClient/apiClient";

function AssignOffer({ offers, restaurants, onAssignmentSuccess }) {
  const [selectedRestaurant, setSelectedRestaurant] = useState("");
  const [selectedOffer, setSelectedOffer] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const handleAssign = async () => {
    setSuccess("");
    setError("");

    if (!selectedRestaurant || !selectedOffer) {
      setError("Please select both a restaurant and an offer");
      return;
    }

    try {
      await apiClient.post("/admin/offers/assign", {
        restaurantId: selectedRestaurant,
        offerId: selectedOffer,
      });
      setSuccess("Offer assigned successfully");
      setSelectedRestaurant("");
      setSelectedOffer("");
      if (onAssignmentSuccess) onAssignmentSuccess();
    } catch (err) {
      console.error("Error assigning offer:", err);
      setError(err.response?.data?.message || "Failed to assign offer");
    }
  };

  const filteredOffers = offers.filter((o) =>
    o.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white rounded-xl shadow-sm border mb-8">
      <div className="px-6 py-5 border-b flex items-center space-x-3">
        <div className="p-2 bg-green-100 rounded-lg">
          <Tag className="w-5 h-5 text-green-600" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Assign Offer to Restaurant
          </h2>
          <p className="text-sm text-gray-500">
            Link existing offers to restaurants
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
                Select Restaurant
              </label>
              <select
                value={selectedRestaurant}
                onChange={(e) => setSelectedRestaurant(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg shadow-sm"
              >
                <option value="">Choose a restaurant...</option>
                {restaurants.map((r) => (
                  <option key={r._id} value={r._id}>
                    {r.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700">
                Select Offer
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                <select
                  value={selectedOffer}
                  onChange={(e) => setSelectedOffer(e.target.value)}
                  className="w-full px-4 py-3 pl-10 bg-white border border-gray-300 rounded-lg shadow-sm"
                >
                  <option value="">Choose an offer...</option>
                  {filteredOffers.map((o) => (
                    <option key={o._id} value={o._id}>
                      {o.code} ({o.discountValue}{o.discountType === "percentage" ? "%" : "$"})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleAssign}
              className="px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700"
            >
              Assign Offer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AssignOffer;
