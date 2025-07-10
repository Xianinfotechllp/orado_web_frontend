import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  getRestaurantReviews,
  replyToFeedback,
  getRestaurantProductReviews,
  replyToProductReview,
} from "../../../../apis/restaurantApi";
import { Star, MessageCircle, Reply, Clock, User } from "lucide-react";
import { toast } from "react-toastify";
import RestaurantSlider from "../Slider/RestaurantSlider";

const ReviewsManagement = () => {
  const user = useSelector((state) => state.auth.user);
  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [selectedRestaurantIndex, setSelectedRestaurantIndex] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [productReviews, setProductReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [replying, setReplying] = useState(false);
  const [error, setError] = useState(null);
  const [replyText, setReplyText] = useState({});
  const [filterRating, setFilterRating] = useState("all");
  const [activeTab, setActiveTab] = useState("Restaurant");
  const currentRestaurantId = selectedRestaurant?.id;

  // Handle restaurants load from RestaurantSlider
  const handleRestaurantsLoad = (restaurantData) => {
    setRestaurants(restaurantData);
  };

  // Handle restaurant selection from RestaurantSlider
  const handleRestaurantSelect = async (restaurant, index) => {
    setSelectedRestaurant(restaurant);
    setSelectedRestaurantIndex(index);
    if (restaurant?.id) {
      if (activeTab === "Restaurant") {
        await fetchRestaurantReviews(restaurant.id);
      } else {
        await fetchProductReviews(restaurant.id);
      }
    }
  };

  const fetchRestaurantReviews = async (restaurantId) => {
    if (!restaurantId) {
      setError("Restaurant ID is required");
      return;
    }

    try {
      setLoading(true);
      const response = await getRestaurantReviews(restaurantId);
      if (response?.reviews) {
        const transformedReviews = response.reviews.map((review) => ({
          id: review._id,
          customerName: review.user?.name || "Anonymous",
          profileImage: review.user?.profileImage || null,
          rating: review.rating,
          comment: review.comment || "",
          date: new Date(review.createdAt).toLocaleDateString(),
          reply: review.reply?.message || null,
          repliedAt: review.reply?.repliedAt || null,
          orderItem: review.orderItem || "Not specified",
          status: review.reply ? "replied" : "pending",
        }));
        setReviews(transformedReviews);
        setError(null);
      }
    } catch (err) {
      console.error("Failed to load restaurant reviews:", err);
      setError(
        err.response?.data?.message || err.message || "Failed to load reviews"
      );
      toast.error("Failed to load restaurant reviews");
    } finally {
      setLoading(false);
    }
  };

  const fetchProductReviews = async (restaurantId) => {
    if (!restaurantId) {
      setError("Restaurant ID is required");
      return;
    }

    try {
      setLoading(true);
      const response = await getRestaurantProductReviews(restaurantId);
      if (response?.data) {
        const transformedReviews = response.data.map((review) => ({
          id: review.reviewId,
          customerName: review.user?.name || "Anonymous",
          profileImage: null, // Add if available in your data
          rating: review.rating,
          comment: review.comment || "",
          date: new Date(review.createdAt).toLocaleDateString(),
          reply: review.reply || null,
          repliedAt: review.repliedAt || null,
          product: review.product, // Include product details
          status: review.reply ? "replied" : "pending",
        }));
        setProductReviews(transformedReviews);
        setError(null);
      }
    } catch (err) {
      console.error("Failed to load product reviews:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to load product reviews"
      );
      toast.error("Failed to load product reviews");
    } finally {
      setLoading(false);
    }
  };

  const handleReply = async (reviewId) => {
    if (!replyText[reviewId]?.trim()) {
      toast.error("Reply message is required");
      return;
    }

    if (!currentRestaurantId) {
      toast.error("Restaurant not selected");
      return;
    }

    try {
      setReplying(true);

      if (activeTab === "Restaurant") {
        // Call the API to submit the reply for restaurant review
        await replyToFeedback(
          currentRestaurantId,
          reviewId,
          replyText[reviewId]
        );

        // Update local state if API call succeeds
        setReviews(
          reviews.map((review) =>
            review.id === reviewId
              ? {
                  ...review,
                  reply: replyText[reviewId],
                  status: "replied",
                  repliedAt: new Date().toISOString(),
                }
              : review
          )
        );
      } else {
        // Call the API to submit the reply for product review
        await replyToProductReview(reviewId, replyText[reviewId]);

        // Update local state if API call succeeds
        setProductReviews(
          productReviews.map((review) =>
            review.id === reviewId
              ? {
                  ...review,
                  reply: replyText[reviewId],
                  status: "replied",
                  repliedAt: new Date().toISOString(),
                }
              : review
          )
        );
      }

      setReplyText({ ...replyText, [reviewId]: "" });
      toast.success("Reply submitted successfully");
    } catch (error) {
      console.error("Failed to submit reply:", error);
      toast.error(error.response?.data?.message || "Failed to submit reply");
    } finally {
      setReplying(false);
    }
  };

  const handleReplyChange = (reviewId, text) => {
    setReplyText({ ...replyText, [reviewId]: text });
  };

  // Handle tab change
  const handleTabChange = async (tab) => {
    setActiveTab(tab);
    if (selectedRestaurant?.id) {
      if (tab === "Restaurant") {
        await fetchRestaurantReviews(selectedRestaurant.id);
      } else {
        await fetchProductReviews(selectedRestaurant.id);
      }
    }
  };

  // Get the current reviews based on active tab
  const currentReviews = activeTab === "Restaurant" ? reviews : productReviews;

  const filteredReviews =
    filterRating === "all"
      ? currentReviews
      : currentReviews.filter(
          (review) => review.rating === parseInt(filterRating)
        );

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${
          index < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
        }`}
      />
    ));
  };

  const getAverageRating = () => {
    if (currentReviews.length === 0) return 0;
    const total = currentReviews.reduce(
      (sum, review) => sum + review.rating,
      0
    );
    return (total / currentReviews.length).toFixed(1);
  };

  const getRatingCounts = () => {
    const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    currentReviews.forEach((review) => {
      counts[review.rating]++;
    });
    return counts;
  };

  const ratingCounts = getRatingCounts();

  return (
    <div className="space-y-6 pb-20">
      <div className="flex gap-2">
        <button
          onClick={() => handleTabChange("Restaurant")}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === "Restaurant"
              ? "bg-orange-500 text-white"
              : "bg-white text-gray-700 hover:bg-gray-100"
          }`}
        >
          Restaurant reviews
        </button>
        <button
          onClick={() => handleTabChange("Product")}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === "Product"
              ? "bg-orange-500 text-white"
              : "bg-white text-gray-700 hover:bg-gray-100"
          }`}
        >
          Product Reviews
        </button>
      </div>

      {/* Restaurant Slider Component */}
      <RestaurantSlider
        onRestaurantSelect={handleRestaurantSelect}
        onRestaurantsLoad={handleRestaurantsLoad}
        selectedIndex={selectedRestaurantIndex}
        className=""
        showError={true}
      />

      {loading && restaurants.length === 0 ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
        </div>
      ) : error ? (
        <div className="text-center py-12 text-red-500">{error}</div>
      ) : (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Reviews
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {currentReviews.length}
                  </p>
                </div>
                <MessageCircle className="w-8 h-8 text-blue-500" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Average Rating
                  </p>
                  <div className="flex items-center gap-2">
                    <p className="text-2xl font-bold text-gray-900">
                      {getAverageRating()}
                    </p>
                    <div className="flex">
                      {renderStars(Math.round(getAverageRating()))}
                    </div>
                  </div>
                </div>
                <Star className="w-8 h-8 text-yellow-500" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Pending Replies
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {currentReviews.filter((r) => !r.reply).length}
                  </p>
                </div>
                <Clock className="w-8 h-8 text-orange-500" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Response Rate
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {currentReviews.length > 0
                      ? Math.round(
                          (currentReviews.filter((r) => r.reply).length /
                            currentReviews.length) *
                            100
                        )
                      : 0}
                    %
                  </p>
                </div>
                <Reply className="w-8 h-8 text-green-500" />
              </div>
            </div>
          </div>

          {/* Rating Distribution */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold mb-4">Rating Distribution</h3>
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((rating) => (
                <div key={rating} className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <span className="text-sm font-medium">{rating}</span>
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  </div>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-yellow-400 h-2 rounded-full"
                      style={{
                        width: `${
                          currentReviews.length > 0
                            ? (ratingCounts[rating] / currentReviews.length) *
                              100
                            : 0
                        }%`,
                      }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600">
                    {ratingCounts[rating]}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Filter */}
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center gap-4">
              <label className="text-sm font-medium text-gray-700">
                Filter by Rating:
              </label>
              <select
                value={filterRating}
                onChange={(e) => setFilterRating(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="all">All Ratings</option>
                <option value="5">5 Stars</option>
                <option value="4">4 Stars</option>
                <option value="3">3 Stars</option>
                <option value="2">2 Stars</option>
                <option value="1">1 Star</option>
              </select>
            </div>
          </div>

          {/* Reviews List */}
          <div className="space-y-4">
            {filteredReviews.length > 0 ? (
              filteredReviews.map((review) => (
                <div
                  key={review.id}
                  className="bg-white p-6 rounded-lg shadow-sm border"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                        {review.profileImage ? (
                          <img
                            src={review.profileImage}
                            alt={review.customerName}
                            className="w-full h-full rounded-full object-cover"
                          />
                        ) : (
                          <User className="w-5 h-5 text-gray-600" />
                        )}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">
                          {review.customerName}
                        </h4>
                        <p className="text-sm text-gray-600">{review.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex">{renderStars(review.rating)}</div>
                      <span className="text-sm font-medium text-gray-600">
                        ({review.rating}.0)
                      </span>
                    </div>
                  </div>

                  {activeTab === "Product" && review.product && (
                    <div className="mb-3">
                      <p className="text-sm font-medium text-gray-800">
                        Product: {review.product.name}
                      </p>
                      <p className="text-sm text-gray-600">
                        Price: ${review.product.price}
                      </p>
                    </div>
                  )}

                  <div className="mb-3">
                    {activeTab === "Restaurant" && (
                      <p className="text-sm text-gray-600 mb-1">
                        Order: {review.orderItem || "Not specified"}
                      </p>
                    )}
                    <p className="text-gray-800">{review.comment}</p>
                  </div>

                  {review.reply && (
                    <div className="bg-gray-50 p-4 rounded-lg mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Reply className="w-4 h-4 text-orange-500" />
                          <span className="text-sm font-medium text-orange-600">
                            Your Reply
                          </span>
                        </div>
                        {review.repliedAt && (
                          <span className="text-xs text-gray-500">
                            {new Date(review.repliedAt).toLocaleString()}
                          </span>
                        )}
                      </div>
                      <p className="text-gray-700">{review.reply}</p>
                    </div>
                  )}

                  {!review.reply && (
                    <div className="border-t pt-4">
                      <div className="flex gap-3">
                        <textarea
                          value={replyText[review.id] || ""}
                          onChange={(e) =>
                            handleReplyChange(review.id, e.target.value)
                          }
                          placeholder="Write your reply to this review..."
                          className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                          rows="3"
                        />
                        <button
                          onClick={() => handleReply(review.id)}
                          disabled={!replyText[review.id]?.trim() || replying}
                          className={`px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed h-fit ${
                            replying ? "opacity-70" : ""
                          }`}
                        >
                          {replying ? "Sending..." : "Reply"}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">
                  {currentReviews.length === 0
                    ? `No ${activeTab.toLowerCase()} reviews found for this restaurant.`
                    : "No reviews found for the selected rating."}
                </p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ReviewsManagement;
