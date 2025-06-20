import React, { useState, useEffect } from "react";
import {
  Home,
  MapPin,
  Clock,
  Star,
  AlertCircle,
  CheckCircle,
  XCircle,
  Edit,
  Trash2,
  Info
} from "lucide-react";
import { toast } from "react-toastify";
import { deleteRestaurant, getRestaurantById } from "../../../../apis/restaurantApi";

const RestaurantCard = ({ restaurant: initialRestaurant, onClick, onEdit, onDelete, onViewDetails }) => {
  const [restaurant, setRestaurant] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  // Status mapping with colors and icons
  const statusConfig = {
    active: {
      text: "Active",
      bg: "bg-green-100",
      textColor: "text-green-800",
      icon: <CheckCircle className="w-4 h-4" />,
    },
    inactive: {
      text: "Inactive",
      bg: "bg-red-100",
      textColor: "text-red-800",
      icon: <XCircle className="w-4 h-4" />,
    },
    pending: {
      text: "Pending Approval",
      bg: "bg-yellow-100",
      textColor: "text-yellow-800",
      icon: <AlertCircle className="w-4 h-4" />,
    },
    approved: {
      text: "Approved",
      bg: "bg-blue-100",
      textColor: "text-blue-800",
      icon: <CheckCircle className="w-4 h-4" />,
    },
    rejected: {
      text: "Rejected",
      bg: "bg-red-100",
      textColor: "text-red-800",
      icon: <XCircle className="w-4 h-4" />,
    },
  };

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const response = await getRestaurantById(initialRestaurant.id);
        setRestaurant(response.data);
      } catch (error) {
        console.error("Failed to fetch restaurant:", error);
        toast.error(error.response?.data?.message || "Failed to fetch restaurant");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRestaurant();
  }, [initialRestaurant.id]);

  const handleDelete = async (e) => {
    e.stopPropagation();
    
    // Confirm deletion
    const confirmed = window.confirm(`Are you sure you want to delete ${restaurant?.name}? This action cannot be undone.`);
    if (!confirmed) return;

    setIsDeleting(true);
    try {
      await deleteRestaurant(initialRestaurant.id);
      toast.success("Restaurant deleted successfully");
      if (onDelete) {
        onDelete(initialRestaurant.id); // Notify parent component about the deletion
      }
    } catch (error) {
      console.error("Failed to delete restaurant:", error);
      toast.error(error.response?.data?.message || "Failed to delete restaurant");
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 flex justify-center items-center h-48">
        <div className="animate-pulse">Loading restaurant details...</div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 flex justify-center items-center h-48">
        <div className="text-gray-500">Failed to load restaurant details</div>
      </div>
    );
  }

  // Get first opening hours entry for display
  const firstOpeningHour = restaurant.openingHours?.[0] || {};
  const openingTime = firstOpeningHour.openingTime || "Not specified";
  const closingTime = firstOpeningHour.closingTime || "Not specified";

  // Determine status based on API response
  let currentStatus;
  if (restaurant.approvalStatus) {
    currentStatus = restaurant.approvalStatus.toLowerCase();
  } else {
    currentStatus = restaurant.active ? "active" : "inactive";
  }
  const status = statusConfig[currentStatus] || statusConfig.inactive;

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 p-6 border border-gray-100 relative">
      <div onClick={() => onClick(restaurant)} className="cursor-pointer">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
              <Home className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {restaurant.name || "Unknown Restaurant"}
              </h3>
              <p className="text-sm text-gray-500 capitalize">
                {restaurant.foodType || "Food type not specified"}
              </p>
            </div>
          </div>
          <div
            className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${status.bg} ${status.textColor}`}
          >
            {status.icon}
            {status.text}
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-gray-600">
            <MapPin className="w-4 h-4" />
            <span className="text-sm">
              {restaurant.address
                ? `${restaurant.address.street || ""}, ${
                    restaurant.address.city || ""
                  }, ${restaurant.address.state || ""}`
                : "Address not available"}
            </span>
          </div>

          <div className="flex items-center gap-2 text-gray-600">
            <Clock className="w-4 h-4" />
            <span className="text-sm">
              {openingTime} - {closingTime}
            </span>
          </div>

          <div className="flex items-center gap-2 text-gray-600">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium">
              {restaurant.rating?.toFixed(1) || "No rating"}
            </span>
            <span className="text-xs text-gray-500">
              ({restaurant.totalReviews || 0} reviews)
            </span>
          </div>
        </div>
      </div>
      
      <div className="top-4 right-4 flex gap-2">
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onViewDetails(restaurant);
          }}
          className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="View details"
        >
          <Info className="w-4 h-4" />
        </button>
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onEdit(initialRestaurant);
          }}
          className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded-full transition-colors"
          aria-label="Edit restaurant"
        >
          <Edit className="w-4 h-4" />
        </button>
        <button 
          onClick={handleDelete}
          disabled={isDeleting}
          className={`p-2 ${isDeleting ? 'text-gray-400' : 'text-red-600 hover:text-red-800'} hover:bg-red-100 rounded-full transition-colors`}
          aria-label="Delete restaurant"
        >
          {isDeleting ? (
            <span className="animate-spin">⏳</span>
          ) : (
            <Trash2 className="w-4 h-4" />
          )}
        </button>
      </div>
    </div>
  );
};

export default RestaurantCard;