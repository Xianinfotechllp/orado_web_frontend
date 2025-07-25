import React, { useEffect, useState } from "react";
import {
  Calendar,
  ChevronDown,
  Plus,
} from "lucide-react";
import { fetchRestaurantsDropdown } from "../../../../../apis/adminApis/adminFuntionsApi";
import { fetchProductsByRestaurant } from "../../../../../apis/adminApis/restaurantApi";
import { createOffer } from "../../../../../apis/adminApis/offerAndDiscount";
import { toast } from "react-toastify";

function OfferManagement() {
  const [offerType, setOfferType] = useState("restaurant");
  const [discountType, setDiscountType] = useState("flat");
  const [selectedRestaurants, setSelectedRestaurants] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState("");
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [products, setProducts] = useState([]);
  const [showProducts, setShowProducts] = useState(false);
  const [restaurants, setRestaurants] = useState([]);
  
  // Form fields state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "flat",
    discountValue: "",
    maxDiscount: "",
    minOrderValue: "",
    validFrom: "",
    validTill: "",
    isActive: true,
    createdBy: "admin",
    usageLimitPerUser: 1,
    totalUsageLimit: "",
    applicableLevel: "Restaurant",
    applicableRestaurants: [],
    applicableProducts: [],
  });

  const handleRestaurantToggle = (restaurantId) => {
    setSelectedRestaurants((prev) =>
      prev.includes(restaurantId)
        ? prev.filter((id) => id !== restaurantId)
        : [...prev, restaurantId]
    );
  };

  const handleProductToggle = (productId) => {
    setSelectedProducts((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  useEffect(() => {
    const loadRestaurants = async () => {
      const data = await fetchRestaurantsDropdown();
      if (data && data.success) {
        setRestaurants(data.data);
      }
    };
    loadRestaurants();
  }, []);

  const fetchProducts = async () => {
    if (selectedRestaurant) {
      try {
        const data = await fetchProductsByRestaurant(selectedRestaurant);
        if (data && data.success) {
          setProducts(data.data);
          setShowProducts(true);
          setSelectedProducts([]);
        }
      } catch (error) {
        console.error("Error loading products:", error);
        alert("Failed to fetch products");
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const offerData = {
        ...formData,
        type: discountType,
        applicableLevel: offerType === "restaurant" ? "Restaurant" : "Product",
        applicableRestaurants: offerType === "restaurant" ? selectedRestaurants : [],
        applicableProducts: offerType === "product" ? selectedProducts : [],
        validFrom: new Date(formData.validFrom),
        validTill: new Date(formData.validTill),
      };

      // Remove maxDiscount if not percentage offer
      if (discountType !== "percentage") {
        delete offerData.maxDiscount;
      }

      const response = await createOffer(offerData);
      toast.success("Offer created successfully!");
      
     
    } catch (error) {
      console.error("Error creating offer:", error);
      alert("Failed to create offer");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Offer Management Page
          </h2>
          <p className="text-gray-600">
            Create and manage restaurant and product offers
          </p>
        </div>

        {/* Offer Type Selection */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            New Offer Type
          </h3>
          <div className="flex space-x-6">
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="offerType"
                value="restaurant"
                checked={offerType === "restaurant"}
                onChange={(e) => setOfferType(e.target.value)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
              />
              <span className="ml-2 text-gray-700 font-medium">
                Restaurant Offer
              </span>
            </label>
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="offerType"
                value="product"
                checked={offerType === "product"}
                onChange={(e) => setOfferType(e.target.value)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
              />
              <span className="ml-2 text-gray-700 font-medium">
                Product Offer
              </span>
            </label>
          </div>
        </div>

        {/* Offer Form */}
        <form onSubmit={handleSubmit}>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
              {offerType === "restaurant" ? "Restaurant" : "Product"} Offer Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter offer title"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type
                </label>
                <div className="relative">
                  <select
                    name="type"
                    value={discountType}
                    onChange={(e) => setDiscountType(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                  >
                    <option value="flat">Flat</option>
                    <option value="percentage">Percentage</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Discount {discountType === "percentage" ? "(%)" : "(₹)"}
                </label>
                <input
                  type="number"
                  name="discountValue"
                  value={formData.discountValue}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={
                    discountType === "flat"
                      ? "Enter amount"
                      : "Enter percentage"
                  }
                  required
                />
              </div>

              {discountType === "percentage" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Max Discount (₹)
                  </label>
                  <input
                    type="number"
                    name="maxDiscount"
                    value={formData.maxDiscount}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter max discount amount"
                    required
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Min Order Value (₹)
                </label>
                <input
                  type="number"
                  name="minOrderValue"
                  value={formData.minOrderValue}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter minimum order value"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Valid From
                </label>
                <div className="relative">
                  <input
                    type="date"
                    name="validFrom"
                    value={formData.validFrom}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                  <Calendar className="absolute right-3 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Valid To
                </label>
                <div className="relative">
                  <input
                    type="date"
                    name="validTill"
                    value={formData.validTill}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                  <Calendar className="absolute right-3 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Usage Limit/User
                </label>
                <input
                  type="number"
                  name="usageLimitPerUser"
                  value={formData.usageLimitPerUser}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter usage limit per user"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Total Usage Limit
                </label>
                <input
                  type="number"
                  name="totalUsageLimit"
                  value={formData.totalUsageLimit}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter total usage limit"
                  required
                />
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                rows={3}
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter offer description"
                required
              />
            </div>

            {offerType === "restaurant" ? (
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  Select Restaurants
                </label>
                {restaurants.map((restaurant) => (
                  <label
                    key={restaurant._id}
                    className="flex items-center p-3 border border-gray-200 rounded-md hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={selectedRestaurants.includes(restaurant._id)}
                      onChange={() => handleRestaurantToggle(restaurant._id)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-3 text-gray-700">
                      {restaurant.name}
                    </span>
                  </label>
                ))}
              </div>
            ) : (
              <>
                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Restaurant
                  </label>
                  <div className="flex space-x-3">
                    <div className="relative flex-1">
                      <select
                        value={selectedRestaurant}
                        onChange={(e) => setSelectedRestaurant(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                      >
                        <option value="">Choose a restaurant</option>
                        {restaurants.map((restaurant) => (
                          <option key={restaurant._id} value={restaurant._id}>
                            {restaurant.name}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
                    </div>
                    <button
                      type="button"
                      onClick={fetchProducts}
                      disabled={!selectedRestaurant}
                      className="px-6 py-2 bg-green-600 text-white font-medium rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                      Fetch Products
                    </button>
                  </div>
                </div>

                {showProducts && (
                  <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-4">
                      Select Products
                    </label>
                    <div className="border border-gray-200 rounded-md max-h-64 overflow-y-auto">
                      {products.map((product) => (
                        <label
                          key={product._id}
                          className="flex items-center justify-between p-3 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 cursor-pointer transition-colors"
                        >
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              checked={selectedProducts.includes(product._id)}
                              onChange={() => handleProductToggle(product._id)}
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <span className="ml-3 text-gray-700">
                              {product.name}
                            </span>
                          </div>
                          <span className="text-green-600 font-medium">
                            ₹{product.price}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}

            <div className="mt-8">
              <button
                type="submit"
                disabled={
                  offerType === "restaurant" 
                    ? selectedRestaurants.length === 0
                    : selectedProducts.length === 0
                }
                className="w-full md:w-auto px-8 py-3 bg-blue-600 text-white font-medium rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {offerType === "restaurant" 
                  ? "Create Restaurant Offer" 
                  : "Apply Offer to Selected Products"}
              </button>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}

export default OfferManagement;