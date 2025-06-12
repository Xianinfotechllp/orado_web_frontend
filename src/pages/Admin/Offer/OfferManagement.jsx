import React, { useState, useEffect } from "react";
import {
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Tag,
  Settings,
  TrendingUp,
  Search,
  Calendar,
  Percent,
  DollarSign,
} from "lucide-react";
import axios from "axios";
import LoadingForAdmins from "../AdminUtils/LoadingForAdmins";
import CreateOffer from "./CreateOffer";
import AssignOffer from "./AssignOffer";
import apiClient from "../../../apis/apiClient/apiClient";

function OfferManagement() {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [restaurants, setRestaurants] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const fetchOffers = async () => {
    try {
      const res = await apiClient.get("/admin/offer");
      setOffers(res.data || []); // The API returns the array directly
    } catch (err) {
      console.error("Error fetching offers:", err);
      setError("Failed to fetch offers");
    } finally {
      setLoading(false);
    }
  };

  const fetchRestaurants = async () => {
    try {
      const res = await apiClient.get(
        "/restaurants/all-restaurants"
      );
      setRestaurants(res.data.restaurants || []);
    } catch (err) {
      console.error("Error fetching restaurants:", err);
    }
  };

  useEffect(() => {
    fetchOffers();
    fetchRestaurants();
  }, []);

  const handleDelete = async (offerId) => {
    if (window.confirm("Are you sure you want to delete this offer?")) {
      try {
        await apiClient.delete(`/admin/offers/${offerId}`);
        setError("");
        fetchOffers();
      } catch (err) {
        console.error("Error deleting offer:", err);
        setError("Failed to delete offer");
      }
    }
  };

 const filteredOffers = offers.filter((o) => {
  const search = searchTerm.toLowerCase().trim();
  
  // Check title
  if (o.title?.toLowerCase().includes(search)) {
    return true;
  }
  
  // Check description
  if (o.description?.toLowerCase().includes(search)) {
    return true;
  }
  
  // Check restaurant names
  if (o.applicableRestaurants?.length > 0) {
    const hasMatchingRestaurant = o.applicableRestaurants.some(restId => {
      const restaurant = restaurants.find(r => r._id === restId);
      return restaurant?.name.toLowerCase().includes(search);
    });
    
    if (hasMatchingRestaurant) {
      return true;
    }
  }
  
  return false;
});

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentOffers = filteredOffers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredOffers.length / itemsPerPage);

  const stats = {
    total: offers.length,
    active: offers.filter(o => new Date(o.validTill) > new Date()).length,
    avgDiscount:
      offers
        .filter((o) => o.type === "percentage")
        .reduce((acc, o) => acc + (o.discountValue || 0), 0) /
      Math.max(
        offers.filter((o) => o.type === "percentage").length,
        1
      ),
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Tag className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  Offer Management
                </h1>
                <p className="text-sm text-gray-500">
                  Manage discount offers and promotions
                </p>
              </div>
            </div>
            <span className="px-3 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded-full">
              Admin Panel
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Total */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Offers
                </p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {stats.total}
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Tag className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          {/* Active */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Offers</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {stats.active}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          {/* Average */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Avg Discount
                </p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {stats.avgDiscount.toFixed(1)}%
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Create Offer Component */}
        <CreateOffer 
          onOfferCreated={fetchOffers} 
          restaurants={restaurants} 
        />

        {/* Assign Offer Component */}
        <AssignOffer 
          offers={offers.filter(o => !o.applicableRestaurants || o.applicableRestaurants.length === 0)} 
          restaurants={restaurants} 
          onAssignmentSuccess={fetchOffers} 
        />

        {/* Offers Table */}
        <div className="bg-white rounded-xl shadow-sm border">
          <div className="px-6 py-5 border-b flex justify-between items-center">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Offers Overview
              </h2>
              <p className="text-sm text-gray-500">
                View and manage all discount offers
              </p>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search offers..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-10 pr-4 py-2 w-64 border border-gray-300 rounded-lg text-sm"
              />
            </div>
          </div>

          {loading ? (
            <LoadingForAdmins />
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Restaurant(s)
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Title
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Description
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Discount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Validity
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentOffers.map((o) => {
                      const restaurantNames = o.applicableRestaurants 
                        ? o.applicableRestaurants.map(restId => {
                            const r = restaurants.find(r => r._id === restId);
                            return r ? r.name : null;
                          }).filter(Boolean).join(", ")
                        : "Unassigned";
                      const isActive = new Date(o.validTill) > new Date();
                      return (
                        <tr key={o._id}>
                          <td className="px-6 py-4">
                            {restaurantNames}
                          </td>
                          <td className="px-6 py-4 font-medium">
                            {o.title}
                          </td>
                          <td className="px-6 py-4">
                            {o.description || "—"}
                          </td>
                          <td className="px-6 py-4">
                            {o.discountValue}{o.type === "percentage" ? "%" : "$"}
                            {o.maxDiscount && o.type === "percentage" && (
                              <span className="text-xs text-gray-500 ml-1">(max ${o.maxDiscount})</span>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-1 text-sm">
                              <Calendar className="w-4 h-4 text-gray-400" />
                              <span>
                                {new Date(o.validFrom).toLocaleDateString()}
                              </span>
                              <ArrowRight className="w-4 h-4 text-gray-400" />
                              <span>
                                {new Date(o.validTill).toLocaleDateString()}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            {isActive ? (
                              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                                Active
                              </span>
                            ) : (
                              <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs font-medium rounded-full">
                                Expired
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <button
                              onClick={() => handleDelete(o._id)}
                              className="text-red-600 hover:text-red-900 text-sm font-medium"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                    {currentOffers.length === 0 && (
                      <tr>
                        <td
                          colSpan="7"
                          className="text-center py-6 text-gray-500"
                        >
                          No offers found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-end items-center px-6 py-4 space-x-2 text-sm">
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                    className="px-3 py-1 rounded border text-gray-700 hover:bg-gray-100 disabled:opacity-50"
                  >
                    Previous
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`px-3 py-1 rounded border ${
                        currentPage === i + 1
                          ? "bg-purple-600 text-white"
                          : "hover:bg-gray-100"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 rounded border text-gray-700 hover:bg-gray-100 disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default OfferManagement;