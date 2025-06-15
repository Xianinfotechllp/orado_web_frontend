import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  getAssignableOffers,
  getOffersForRestaurant,
  updateRestaurantOffer,
  deleteRestaurantOffer,
  toggleOfferAssignment,
} from "../../../../apis/restaurantApi";
import {
  Plus,
  Edit2,
  Trash2,
  Tag,
  Calendar,
  Percent,
  Gift,
  Users,
  Clock,
  Copy,
  Eye,
  EyeOff,
  Loader,
  AlertCircle,
  Check,
  X,
} from "lucide-react";
import { toast } from "react-toastify";
import OfferModal from "./AddOffer";
import EditOfferModal from "./EditOfferModal";
import RestaurantSlider from "../Slider/RestaurantSlider";

const OffersManagement = () => {
  const user = useSelector((state) => state.auth.user);
  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [selectedRestaurantIndex, setSelectedRestaurantIndex] = useState(null);
  const [offersLoading, setOffersLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [assignableOffers, setAssignableOffers] = useState([]);
  const [restaurantOffers, setRestaurantOffers] = useState([]);
  const [activeTab, setActiveTab] = useState("restaurant");
  const [filterStatus, setFilterStatus] = useState("all");
  const [editingOffer, setEditingOffer] = useState(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedOfferForAssignment, setSelectedOfferForAssignment] = useState(null);
  const [assignmentLoading, setAssignmentLoading] = useState({});

  useEffect(() => {
    const fetchAssignableOffers = async () => {
      try {
        const response = await getAssignableOffers();
        
        if (response.success) {
          setAssignableOffers(response.offers || []);
        }
      } catch (err) {
        console.error("Failed to load assignable offers:", err);
      }
    };

    fetchAssignableOffers();
  }, []);

  useEffect(() => {
    const fetchRestaurantOffers = async () => {
      if (selectedRestaurant?.id) {
        try {
          setOffersLoading(true);
          const restaurantId = selectedRestaurant.id;
          const response = await getOffersForRestaurant(restaurantId);
          if (response.success) {
            setRestaurantOffers(response.offers || []);
          }
        } catch (err) {
          console.error("Failed to load restaurant offers:", err);
          setRestaurantOffers([]);
        } finally {
          setOffersLoading(false);
        }
      }
    };

    if (activeTab === "restaurant") {
      fetchRestaurantOffers();
    }
  }, [selectedRestaurant, activeTab]);

  const handleRestaurantSelect = (restaurant, index) => {
    setSelectedRestaurant(restaurant);
    setSelectedRestaurantIndex(index);
  };

  const handleRestaurantsLoad = (restaurantsList) => {
    setRestaurants(restaurantsList);
  };

  const handleDeleteOffer = async (offerId) => {
    if (!window.confirm("Are you sure you want to delete this offer?")) return;

    try {
      await deleteRestaurantOffer(offerId, currentRestaurantId);
      toast.success("Offer deleted successfully!");
      setRestaurantOffers(prev => prev.filter(offer => offer._id !== offerId));
    } catch (error) {
      console.error("Error deleting offer:", error);
      toast.error(error.response?.data?.message || "Failed to delete offer");
    }
  };

  const currentRestaurantId = selectedRestaurant?.id || null;

  const copyCode = (code) => {
    navigator.clipboard.writeText(code);
    toast.success("Coupon code copied to clipboard!");
  };

  const getStatusColor = (status) => {
    if (status === true || status === "active") {
      return "bg-green-100 text-green-800";
    }
    return "bg-gray-100 text-gray-800";
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const calculateDiscountText = (offer) => {
    if (offer.discountType === "percentage") {
      return `${offer.discountValue}% off`;
    } else {
      return `₹${offer.discountValue} off`;
    }
  };

  const currentOffers =
    activeTab === "restaurant" ? restaurantOffers : assignableOffers;

  const filteredOffers = currentOffers.filter((offer) => {
    if (filterStatus === "all") return true;
    if (filterStatus === "active") return offer.isActive === true;
    if (filterStatus === "inactive") return offer.isActive === false;
    return true;
  });

  const getStats = () => {
    const total = currentOffers.length;
    const active = currentOffers.filter((o) => o.isActive === true).length;
    const currentDate = new Date();
    const valid = currentOffers.filter(
      (o) =>
        new Date(o.validFrom) <= currentDate &&
        new Date(o.validTill) >= currentDate
    ).length;

    return { total, active, valid };
  };

  const stats = getStats();

  const handleOpenAssignModal = (offer) => {
    setSelectedOfferForAssignment(offer);
    setShowAssignModal(true);
  };

  const handleToggleAssignment = async (restaurantId) => {
    if (!selectedOfferForAssignment?.id && !selectedOfferForAssignment?._id) {
      toast.error("Invalid offer selected");
      return;
    }
    
    if (!restaurantId) {
      toast.error("Invalid restaurant ID");
      return;
    }
    
    // Use the restaurant ID as key for loading state
    const loadingKey = `${selectedOfferForAssignment._id || selectedOfferForAssignment.id}-${restaurantId}`;
    
    try {
      setAssignmentLoading(prev => ({ ...prev, [loadingKey]: true }));
      
      // Use the correct offer ID (_id or id)
      const offerId = selectedOfferForAssignment._id || selectedOfferForAssignment.id;
      
      console.log('Toggling assignment:', { offerId, restaurantId }); // Debug log
      
      const response = await toggleOfferAssignment(offerId, restaurantId);
      
      if (response.success) {
        // Update the assignable offers list
        setAssignableOffers(prev => 
          prev.map(offer => 
            (offer._id === offerId || offer.id === offerId)
              ? { ...offer, applicableRestaurants: response.offer?.applicableRestaurants || response.applicableRestaurants }
              : offer
          )
        );
        
        // Update the selected offer for assignment to reflect the change immediately
        setSelectedOfferForAssignment(prev => ({
          ...prev,
          applicableRestaurants: response.offer?.applicableRestaurants || response.applicableRestaurants
        }));
        
        // If the current restaurant is affected, update restaurant offers too
        if (restaurantId === currentRestaurantId) {
          const isNowAssigned = response.isAssigned ?? response.offer?.applicableRestaurants?.includes(restaurantId);
          
          if (isNowAssigned) {
            // Check if offer already exists in restaurant offers to avoid duplicates
            setRestaurantOffers(prev => {
              const exists = prev.some(offer => 
                (offer._id === offerId || offer.id === offerId)
              );
              if (!exists) {
                return [...prev, response.offer || selectedOfferForAssignment];
              }
              return prev;
            });
          } else {
            setRestaurantOffers(prev => 
              prev.filter(offer => 
                offer._id !== offerId && offer.id !== offerId
              )
            );
          }
        }
        
        const actionText = response.isAssigned ? 'assigned to' : 'unassigned from';
        const restaurantName = restaurants.find(r => r._id === restaurantId || r.id === restaurantId)?.name || 'restaurant';
        toast.success(`Offer ${actionText} ${restaurantName} successfully`);
      } else {
        toast.error(response.message || "Failed to toggle assignment");
      }
    } catch (error) {
      console.error("Error toggling offer assignment:", error);
      const errorMessage = error.response?.data?.message || error.message || "Failed to toggle assignment";
      toast.error(errorMessage);
    } finally {
      setAssignmentLoading(prev => {
        const newState = { ...prev };
        delete newState[loadingKey];
        return newState;
      });
    }
  };

  const isRestaurantAssigned = (restaurantId) => {
    if (!selectedOfferForAssignment) return false;
    const applicableRestaurants = selectedOfferForAssignment.applicableRestaurants || [];
    return applicableRestaurants.some(
      id => id.toString() === restaurantId.toString()
    );
  };

  return (
    <>
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <div className="flex space-x-4">
              <button
                onClick={() => setActiveTab("restaurant")}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === "restaurant"
                    ? "bg-orange-500 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
              >
                Restaurant Offers
              </button>
              <button
                onClick={() => setActiveTab("assignable")}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === "assignable"
                    ? "bg-orange-500 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
              >
                Available Offers
              </button>
            </div>

            {activeTab === "restaurant" && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 flex items-center gap-2"
                disabled={!currentRestaurantId}
              >
                <Plus className="w-5 h-5" />
                Create Offer
              </button>
            )}
          </div>

          {/* Use RestaurantSlider component for restaurant selection when on restaurant tab */}
          {activeTab === "restaurant" && (
            <div className="mb-6">
              <RestaurantSlider
                onRestaurantSelect={handleRestaurantSelect}
                onRestaurantsLoad={handleRestaurantsLoad}
                selectedIndex={selectedRestaurantIndex}
                className="bg-white p-4 rounded-lg shadow-sm border"
                showError={true}
              />
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Offers
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.total}
                  </p>
                </div>
                <Tag className="w-8 h-8 text-blue-500" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Active Offers
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.active}
                  </p>
                </div>
                <Gift className="w-8 h-8 text-green-500" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Valid Now</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.valid}
                  </p>
                </div>
                <Clock className="w-8 h-8 text-purple-500" />
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border mb-6">
            <div className="flex items-center gap-4">
              <label className="text-sm font-medium text-gray-700">
                Filter by Status:
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="all">All Offers</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          {offersLoading && (
            <div className="flex justify-center py-8">
              <Loader className="w-6 h-6 animate-spin text-orange-500" />
            </div>
          )}

          {!offersLoading && (
            <div className="space-y-4">
              {filteredOffers.map((offer) => (
                <div
                  key={offer._id}
                  className="bg-white p-6 rounded-lg shadow-sm border"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-semibold text-gray-900">
                          {offer.title}
                        </h3>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            offer.isActive
                          )}`}
                        >
                          {offer.isActive ? "Active" : "Inactive"}
                        </span>
                        {offer.createdBy === "admin" && (
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            Admin Created
                          </span>
                        )}
                      </div>
                      <p className="text-gray-600 mb-3">{offer.description}</p>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Tag className="w-4 h-4 text-orange-500" />
                          <span className="font-medium">{offer.code}</span>
                          <button
                            onClick={() => copyCode(offer.code)}
                            className="text-orange-500 hover:text-orange-600"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="flex items-center gap-2">
                          <Percent className="w-4 h-4 text-green-500" />
                          <span>{calculateDiscountText(offer)}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-blue-500" />
                          <span>
                            {formatDate(offer.validFrom)} -{" "}
                            {formatDate(offer.validTill)}
                          </span>
                        </div>

                        {offer.minOrderValue && (
                          <div className="flex items-center gap-2">
                            <Gift className="w-4 h-4 text-purple-500" />
                            <span>Min: ₹{offer.minOrderValue}</span>
                          </div>
                        )}
                      </div>

                      {offer.maxDiscount && (
                        <div className="mt-3 text-sm text-gray-600">
                          <span>Max Discount: ₹{offer.maxDiscount}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2 ml-4">
                      {activeTab === "restaurant" ? (
                        <>
                          <button
                            onClick={() => setEditingOffer(offer)}
                            className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteOffer(offer._id)}
                            className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => handleOpenAssignModal(offer)}
                          className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium"
                        >
                          Assign to Restaurants
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!offersLoading && filteredOffers.length === 0 && (
            <div className="text-center py-12">
              <Tag className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">
                {activeTab === "restaurant"
                  ? currentRestaurantId
                    ? "No offers found for the selected restaurant."
                    : "Please select a restaurant to view offers."
                  : "No assignable offers available."}
              </p>
            </div>
          )}
        </div>
      </div>

      {showCreateModal && currentRestaurantId && (
        <OfferModal
          restaurantId={currentRestaurantId}
          onClose={() => setShowCreateModal(false)}
          onSuccess={(newOffer) => {
            setRestaurantOffers(prev => [...prev, newOffer]);
            setShowCreateModal(false);
          }}
        />
      )}

      {editingOffer && (
        <EditOfferModal
          offer={editingOffer}
          restaurantId={currentRestaurantId}
          onClose={() => setEditingOffer(null)}
          onUpdate={(updatedOffer) => {
            setRestaurantOffers(prev =>
              prev.map((o) => (o._id === updatedOffer._id ? updatedOffer : o))
            );
            setEditingOffer(null);
          }}
        />
      )}

      {/* Assign Offer Modal */}
      {showAssignModal && selectedOfferForAssignment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-gray-900">
                  Assign Offer to Restaurants
                </h3>
                <button
                  onClick={() => setShowAssignModal(false)}
                  className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="mb-6 p-4 bg-orange-50 rounded-lg border border-orange-200">
                <h4 className="font-medium text-gray-900 mb-2">
                  {selectedOfferForAssignment.title}
                </h4>
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>Code: <span className="font-mono font-medium">{selectedOfferForAssignment.code}</span></span>
                  <span className="font-medium text-orange-600">
                    {calculateDiscountText(selectedOfferForAssignment)}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                {restaurants.map((restaurant) => {
                  const restaurantId = restaurant._id || restaurant.id;
                  const isAssigned = isRestaurantAssigned(restaurantId);
                  const loadingKey = `${selectedOfferForAssignment._id || selectedOfferForAssignment.id}-${restaurantId}`;
                  const isLoading = assignmentLoading[loadingKey];
                  
                  return (
                    <div
                      key={restaurantId}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-orange-400"></div>
                        <span className="font-medium text-gray-900">{restaurant.name}</span>
                      </div>
                      
                      <button
                        onClick={() => handleToggleAssignment(restaurantId)}
                        disabled={isLoading}
                        className={`
                          relative inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium
                          transition-all duration-200 min-w-[100px] justify-center
                          ${isAssigned
                            ? 'bg-green-500 text-white hover:bg-green-600 shadow-sm'
                            : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                          }
                          ${isLoading ? 'opacity-75 cursor-not-allowed' : 'cursor-pointer'}
                        `}
                      >
                        {isLoading ? (
                          <>
                            <Loader className="w-4 h-4 animate-spin" />
                            <span>Processing...</span>
                          </>
                        ) : isAssigned ? (
                          <>
                            <Check className="w-4 h-4" />
                            <span>Assigned</span>
                          </>
                        ) : (
                          <>
                            <Plus className="w-4 h-4" />
                            <span>Assign</span>
                          </>
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>

              <div className="mt-8 flex justify-end gap-3">
                <button
                  onClick={() => setShowAssignModal(false)}
                  className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default OffersManagement;