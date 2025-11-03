import React, { useState } from "react";
import { Home, Utensils } from "lucide-react";
import RestaurantCard from "./RestaurantCard";
import RestaurantDetailsDashboard from "./RestaurantDetailsDashboard";
import {
  Star,
  Check,
  X,
  Edit,
  Eye,
  Trash2,
  Building2,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import MerchantProfile from "../../../../pages/Merchant/MerchantProfile";

const RestaurantList = ({
  restaurants = [],
  onRegisterClick,
  onAddNewClick,
  onRestaurantClick,
  onEditRestaurant,
  onDeleteRestaurant,
  onToggleActive, // New prop for toggling active status
}) => {
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  const handleViewDetails = (restaurant) => {
    setSelectedRestaurant(restaurant);
    setShowDetails(true);
  };

  const handleCloseDetails = () => {
    setShowDetails(false);
  };

  const handleToggleActive = (restaurant) => {
    if (onToggleActive) {
      onToggleActive(restaurant.id, !restaurant.isActive);
    }
  };

  const ToggleButton = ({ isActive, onToggle, disabled = false }) => {
    const [isLoading, setIsLoading] = useState(false);

    const handleClick = async () => {
      if (disabled || isLoading) return;
      setIsLoading(true);
      try {
        await onToggle();
      } finally {
        setIsLoading(false);
      }
    };

    return (
      <button
        type="button"
        onClick={handleClick}
        disabled={disabled || isLoading}
        aria-pressed={isActive}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
          isActive ? "bg-green-500" : "bg-gray-200"
        } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
      >
        <span
          className={` h-5 w-5 transform rounded-full bg-white shadow-lg transition-transform flex items-center justify-center ${
            isActive ? "translate-x-6" : "translate-x-1"
          }`}
        >
          {isLoading ? (
            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-gray-600" />
          ) : isActive ? (
            <Check className="h-3 w-3 text-green-500" />
          ) : (
            <X className="h-3 w-3 text-gray-500" />
          )}
        </span>
        <span className="sr-only">{isActive ? "Active" : "Inactive"}</span>
      </button>
    );
  };
  console.log("child component:------------>>>", restaurants);
  if (restaurants.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-6">
        <div className="w-24 h-24 bg-gradient-to-r from-orange-100 to-red-100 rounded-full flex items-center justify-center mb-6">
          <Home className="w-12 h-12 text-gray-900" />
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-3">
          No Restaurants Found
        </h2>
        <p className="text-gray-600 text-center mb-8 max-w-md">
          You haven't registered any restaurants yet. Get started by registering
          your first restaurant to begin managing your business.
        </p>

        <button
          onClick={onRegisterClick}
          className="bg-gradient-to-r bg-gray-950 hover:bg-gray-600 text-white px-8 py-3 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl flex items-center"
        >
          <Utensils className="w-5 h-5 mr-2" />
          Register Restaurant
        </button>
      </div>
    );
  }

  return (
    <div className="pb-20">
      <div className="mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900"></h1>
          <p className="text-gray-600 mt-1"></p>
        </div>
      </div>

      <div className="overflow-hidden shadow-md sm:rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Store ID
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Store Name
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Store Type
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Address
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Contact
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Rating
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Status
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Approval
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Registered On
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {restaurants.map((restaurant) => (
              <tr
                key={restaurant.id}
                className="hover:bg-gray-50 transition-colors duration-150"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 font-mono"           onClick={() => handleViewDetails(restaurant)} >
                    
                    {restaurant.id.length > 10
                      ? `${restaurant.id.substring(0, 8)}..`
                      : restaurant.id}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-md flex items-center justify-center">
                      <Building2 className="h-5 w-5 text-gray-400" />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {restaurant.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {restaurant.email}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 capitalize">
                    {restaurant.storeType}
                  </div>
                </td>
                <td className="px-6 py-4 max-w-xs">
                  <div className="text-sm text-gray-900 line-clamp-2">
                    {restaurant.address?.street || "N/A"}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {restaurant.phone}
                  </div>
                  <div className="text-sm text-gray-500">
                    {restaurant.email}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                    <span className="text-sm font-medium text-gray-900">
                      {restaurant.rating || "0.0"}
                    </span>
                    <span className="text-xs text-gray-500 ml-1">
                      ({restaurant.reviewCount || 0})
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => handleToggleActive(restaurant)}
                    className="flex items-center focus:outline-none"
                  >
                    <ToggleButton
                      isActive={restaurant.isActive}
                      onToggleActive={() => (
                        restaurant.id, !restaurant.isActive
                      )}
                    />
                    <span
                      className={`ml-2 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        restaurant.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {restaurant.isActive ? "OPEN" : "CLOSED"}
                    </span>
                  </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      restaurant.status === "approved"
                        ? "bg-green-100 text-green-800"
                        : restaurant.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {restaurant.status?.toUpperCase() || "PENDING"}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(restaurant.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => onEditRestaurant?.(restaurant)}
                      className="text-indigo-600 hover:text-indigo-900 p-1 rounded-md hover:bg-indigo-50"
                      title="Edit"
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleViewDetails(restaurant)}
                      className="text-gray-600 hover:text-gray-900 p-1 rounded-md hover:bg-gray-50"
                      title="View Details"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => onDeleteRestaurant?.(restaurant)}
                      className="text-red-600 hover:text-red-900 p-1 rounded-md hover:bg-red-50"
                      title="Delete"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Floating Add Restaurant button with Utensils icon */}
      <button
        onClick={onAddNewClick}
        className="fixed bottom-6 right-6 bg-gradient-to-r bg-gray-950 hover:bg-gray-600 text-white p-4 rounded-full font-medium transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center z-50"
        aria-label="Add Restaurant"
      >
        <Home className="w-6 h-6 mr-2" />
        <span>Add Restaurant</span>
      </button>

      {/* Restaurant Details Modal */}
      {/* {showDetails && selectedRestaurant && (
        <div className="fixed inset-0 bgOp z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white p-4 border-b flex justify-between items-center">
              <h2 className="text-xl font-bold">
                {selectedRestaurant.name} Details
              </h2>
              <button
                onClick={handleCloseDetails}
                className="p-2 text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <RestaurantDetailsDashboard
              restaurantData={selectedRestaurant}
              onClose={handleCloseDetails}
            />
          </div>
        </div>
      )} */}
{showDetails && selectedRestaurant && (
  <div className="fixed inset-0 z-50 flex">
    {/* Dark overlay - only covers the main content area */}

    {console.log("selectedRestaurant:", selectedRestaurant)}
    <div
      className="fixed inset-0 bg-black/30 ml-64" // ml-64 matches sidebar width
      onClick={handleCloseDetails}
    />
    
    {/* Modal container - positioned to not overlap sidebar */}
    <div 
      className="relative z-10 w-full h-full bg-white shadow-xl overflow-y-auto ml-64" // ml-64 matches sidebar width
      style={{ width: 'calc(100% - 16rem)' }} // 16rem = 64 * 0.25rem
    >
      <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
        <h2 className="text-lg font-semibold">{selectedRestaurant.name}</h2>
        <button
          onClick={handleCloseDetails}
          className="p-2 text-gray-600 hover:text-gray-900"
        >
          ✕
        </button>
      </div>
      <div className="p-4">
        <MerchantProfile selectedRestaurant={selectedRestaurant} />
      </div>
    </div>
  </div>
)}

    </div>
  );
};

export default RestaurantList;
