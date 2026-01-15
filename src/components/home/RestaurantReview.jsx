import { useEffect, useState } from 'react';
import { fetchRestaurantReviews } from '../../apis/feedbackApi';
import { Star, StarHalf, User, MessageCircle, Camera, Loader2 } from 'lucide-react';

const RestaurantReviews = ({ restaurantId }) => {
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadReviews = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetchRestaurantReviews(restaurantId);
        setReviews(res.reviews || []);
        setAverageRating(res.averageRating || 0);
      } catch (err) {
        console.error("Failed to fetch reviews", err);
        setError(err.message || "Failed to load reviews");
      } finally {
        setLoading(false);
      }
    };
    
    if (restaurantId) {
      loadReviews();
    }
  }, [restaurantId]);

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`full-${i}`} className="w-4 h-4 fill-yellow-500 text-yellow-500" />);
    }
    
    if (hasHalfStar) {
      stars.push(<StarHalf key="half" className="w-4 h-4 fill-yellow-500 text-yellow-500" />);
    }
    
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="w-4 h-4 text-gray-300" />);
    }
    
    return stars;
  };

  const getRatingColor = (rating) => {
    if (rating >= 4) return 'bg-green-500';
    if (rating >= 3) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const handleImageError = (e) => {
    e.target.style.display = 'none';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 text-orange-600 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center">
        <div className="text-red-500 mb-2">Error loading reviews</div>
        <p className="text-gray-500 text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-orange-600 to-orange-500 p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Customer Reviews</h2>
            <div className="flex items-center gap-3">
              <div className={`${getRatingColor(averageRating)} px-3 py-1 rounded-full flex items-center gap-1 text-sm font-semibold`}>
                <Star className="w-4 h-4 fill-white" />
                {averageRating.toFixed(1)}
              </div>
              <span className="text-orange-100 text-sm">
                Based on {reviews.length} review{reviews.length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1 mb-1">
              {renderStars(averageRating)}
            </div>
            <p className="text-orange-100 text-sm">Average Rating</p>
          </div>
        </div>
      </div>

      {/* Reviews List */}
      <div className="p-6 space-y-6">
        {reviews.length === 0 ? (
          <div className="text-center py-12">
            <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No reviews yet</p>
            <p className="text-gray-400 text-sm">Be the first to share your experience!</p>
          </div>
        ) : (
          reviews.map((review) => (
            <div key={review._id || Math.random()} className="border border-gray-100 rounded-xl p-5 hover:shadow-md transition-shadow duration-200">
              {/* User Info & Rating */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  {review.user?.profileImage ? (
                    <img 
                      src={review.user.profileImage} 
                      alt={review.user?.name || 'User'} 
                      className="w-12 h-12 rounded-full object-cover border-2 border-orange-100"
                      onError={handleImageError}
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
                      <User className="w-6 h-6 text-orange-600" />
                    </div>
                  )}
                  <div>
                    <span className="font-semibold text-gray-800 text-lg">
                      {review.user?.name || 'Anonymous'}
                    </span>
                    <div className="flex items-center gap-2 mt-1">
                      <div className={`${getRatingColor(review.rating)} px-2 py-1 rounded text-white text-xs font-semibold flex items-center gap-1`}>
                        <Star className="w-3 h-3 fill-white" />
                        {review.rating}
                      </div>
                      <div className="flex items-center gap-1">
                        {renderStars(review.rating)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Review Comment */}
              <p className="text-gray-700 leading-relaxed mb-4 text-base">
                {review.comment || 'No comment provided'}
              </p>

              {/* Review Images */}
              {review.images?.length > 0 && (
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Camera className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-500 font-medium">Photos from review</span>
                  </div>
                  <div className="flex gap-3 overflow-x-auto pb-2">
                    {review.images.map((img, idx) => (
                      <img 
                        key={idx} 
                        src={img} 
                        alt={`Review ${idx + 1}`} 
                        className="w-20 h-20 object-cover rounded-lg border-2 border-gray-100 hover:border-orange-300 transition-colors cursor-pointer flex-shrink-0"
                        onError={handleImageError}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Restaurant Reply */}
              {review.reply && (
                <div className="bg-orange-50 rounded-lg p-4 border-l-4 border-orange-600">
                  <div className="flex items-center gap-2 mb-2">
                    {review.reply.repliedBy?.logo ? (
                      <img 
                        src={review.reply.repliedBy.logo} 
                        alt={review.reply.repliedBy?.name || 'Restaurant'} 
                        className="w-8 h-8 rounded-full object-cover border border-orange-200"
                        onError={handleImageError}
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-orange-600 flex items-center justify-center">
                        <span className="text-white text-xs font-bold">
                          {review.reply.repliedBy?.name?.charAt(0) || 'R'}
                        </span>
                      </div>
                    )}
                    <div>
                      <strong className="text-orange-800 text-sm">
                        {review.reply.repliedBy?.name || 'Restaurant'}
                      </strong>
                      <span className="text-orange-600 text-sm ml-1">replied:</span>
                    </div>
                  </div>
                  <p className="text-gray-700 ml-10 text-sm leading-relaxed">
                    {review.reply.message}
                  </p>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RestaurantReviews;