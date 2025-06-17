import React, { useState, useEffect } from 'react';
import { Star, Camera, Send, X } from 'lucide-react';
import { submitItemFeedback } from '../../../apis/feedbackApi';

const ReviewModal = ({ isOpen, onClose, order }) => {
  const [reviews, setReviews] = useState({});

  // Initialize reviews state when modal opens
  useEffect(() => {
    if (isOpen && order) {
      const initialReviews = order.orderItems.reduce((acc, item) => {
        acc[item._id] = {
          rating: 0,
          comment: '',
          images: []
        };
        return acc;
      }, {});
      setReviews(initialReviews);
    }
  }, [isOpen, order]);

  if (!isOpen || !order) return null;

  const handleRatingChange = (itemId, rating) => {
    setReviews(prev => ({
      ...prev,
      [itemId]: {
        ...prev[itemId],
        rating
      }
    }));
  };

  const handleCommentChange = (itemId, comment) => {
    setReviews(prev => ({
      ...prev,
      [itemId]: {
        ...prev[itemId],
        comment
      }
    }));
  };

  const handleImageUpload = (itemId, files) => {
    const uploadedFiles = Array.from(files);
    setReviews((prev) => ({
      ...prev,
      [itemId]: {
        ...prev[itemId],
        images: [...(prev[itemId].images || []), ...uploadedFiles]
      }
    }));
  };

  const handleSubmitReview = (itemId) => {
    const review = reviews[itemId];
    if (review.rating === 0) {
      alert('Please select a rating');
      return;
    }
    console.log('Submitting review:', { itemId, ...review });
    alert('Review submitted successfully!');
  };

  const handleSubmitAllReviews = async () => {
    const allReviews = Object.entries(reviews).map(([itemId, review]) => ({
      itemId,
      ...review
    }));

    const unratedItems = allReviews.filter((r) => r.rating === 0);
    if (unratedItems.length > 0) {
      alert('Please rate all items before submitting');
      return;
    }

    try {
      await submitItemFeedback({ orderId: order._id, reviews: allReviews });
      alert('All reviews submitted successfully!');
      onClose();
    } catch (err) {
      alert('Failed to submit reviews. Please try again.');
    }
  };


  const StarRating = ({ rating, onRatingChange, itemId }) => {
    const [hoverRating, setHoverRating] = useState(0);

    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            className="focus:outline-none transition-colors"
            onMouseEnter={() => setHoverRating(star)}
            onMouseLeave={() => setHoverRating(0)}
            onClick={() => onRatingChange(itemId, star)}
          >
            <Star
              size={28}
              className={`${
                star <= (hoverRating || rating)
                  ? 'fill-orange-600 text-orange-600'
                  : 'text-gray-300'
              } transition-colors`}
            />
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bgOp z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Rate your order</h2>
            <div className="flex items-center gap-2 text-gray-600 mt-1">
              <span className="font-semibold text-orange-600">{order.restaurantId?.name}</span>
              <span>•</span>
              <span>{order.deliveryAddress?.city}</span>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Ordered on {new Date(order.createdAt).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={24} className="text-gray-500" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="overflow-y-auto max-h-[60vh] p-6">
          <div className="space-y-6">
            {order.orderItems.map((item) => (
              <div key={item._id} className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="p-4">
                  <div className="flex flex-col md:flex-row gap-4">
                    {/* Item Image */}
                    <div className="w-full md:w-32 h-48 md:h-32 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/200x200?text=Food';
                        }}
                      />
                    </div>

                    {/* Item Details */}
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {item.name}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                        <span>Qty: {item.quantity}</span>
                        <span>₹{item.totalPrice}</span>
                      </div>

                      {/* Rating Section */}
                      <div className="mb-4">
                        <p className="text-sm font-medium text-gray-700 mb-2">
                          How was the {item.name}?
                        </p>
                        <StarRating
                          rating={reviews[item._id]?.rating || 0}
                          onRatingChange={handleRatingChange}
                          itemId={item._id}
                        />
                      </div>

                      {/* Comment Section */}
                      <div className="mb-4">
                        <textarea
                          placeholder="Share your experience (optional)"
                          className="w-full p-3 border border-gray-200 rounded-lg resize-none focus:ring-2 focus:ring-orange-600 focus:border-transparent"
                          rows="3"
                          value={reviews[item._id]?.comment || ''}
                          onChange={(e) => handleCommentChange(item._id, e.target.value)}
                        />
                      </div>

                      {/* Photo Upload Button */}
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        hidden
                        id={`image-upload-${item._id}`}
                        onChange={(e) => handleImageUpload(item._id, e.target.files)}
                      />
                      <label htmlFor={`image-upload-${item._id}`} className="...">
                        <Camera size={18} />
                        Add Photos
                      </label>
                    </div>
                  </div>

                  {/* Rating Labels */}
                  {reviews[item._id]?.rating > 0 && (
                    <div className="mt-4">
                      <div className="bg-orange-50 rounded-lg p-3">
                        <p className="text-sm text-orange-700 font-medium">
                          {reviews[item._id].rating === 5 && "Excellent! 😍"}
                          {reviews[item._id].rating === 4 && "Good! 😊"}
                          {reviews[item._id].rating === 3 && "Average 😐"}
                          {reviews[item._id].rating === 2 && "Poor 😞"}
                          {reviews[item._id].rating === 1 && "Terrible 😭"}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="border-t border-gray-200 p-6">
          <div className="flex flex-col sm:flex-row gap-3 justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmitAllReviews}
              className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors flex items-center gap-2"
            >
              <Send size={18} />
              Submit All Reviews
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewModal;