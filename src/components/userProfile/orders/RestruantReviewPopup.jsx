import React, { useState } from 'react';
import { Star, X, Camera, Utensils, Clock, MapPin } from 'lucide-react';
import { submitRestaurantFeedback } from '../../../apis/feedbackApi';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function RestaurantReviewPopup({ orderId, restaurant, onClose }) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [photos, setPhotos] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleStarClick = (starNumber) => setRating(starNumber);

  const handlePhotoUpload = (event) => {
    const files = Array.from(event.target.files).slice(0, 5 - photos.length);
    const newPhotos = files.map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      url: URL.createObjectURL(file),
      file: file,
    }));
    setPhotos((prev) => [...prev, ...newPhotos]);
  };

  const removePhoto = (photoId) => {
    setPhotos(photos.filter((photo) => photo.id !== photoId));
  };

  const handleSubmit = async () => {
    if (rating === 0) {
      toast.warn('Please select a rating');
      return;
    }

    setIsSubmitting(true);

    try {
      const fileList = photos.map((photo) => photo.file);
      await submitRestaurantFeedback({
        orderId,
        reviews: [
          {
            rating,
            comment: reviewText,
            targetType: 'restaurant',
            restaurantId: restaurant._id,
            images: fileList,
          },
        ],
      });

      toast.success('Thank you for your review!');
      onClose();
    } catch (err) {
      console.error('Failed to submit review:', err);
      toast.error(err.message || 'Something went wrong while submitting your review.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bgOp flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="bg-orange-600 text-white p-6 rounded-t-lg relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:bg-orange-700 rounded-full p-1 transition-colors"
            disabled={isSubmitting}
          >
            <X size={24} />
          </button>
          <div className="flex items-center">
            <Utensils className="mr-3" size={28} />
            <div>
              <h2 className="text-2xl font-bold mb-1">Share Your Dining Experience</h2>
              <p className="text-orange-100">Your review helps others discover great restaurants</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="mb-8 p-4 bg-orange-50 rounded-lg border border-orange-100">
            <div className="flex items-start">
              <div className="w-16 h-16 bg-orange-100 rounded-lg flex items-center justify-center mr-4">
                <span className="text-orange-700 text-2xl">🍴</span>
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-800 text-xl mb-1">{restaurant.name}</h3>
                <div className="flex items-center text-gray-600 mb-1">
                  <MapPin size={14} className="mr-1" />
                  <span className="text-sm">{restaurant.address?.street || '123 Main St'}, {restaurant.address?.city || 'New York'}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Clock size={14} className="mr-1" />
                  <span className="text-sm">Open now • {restaurant.cuisine || 'Italian'} cuisine</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <label className="block text-gray-700 font-bold mb-4 text-lg">How would you rate your experience?</label>
            <div className="flex items-center justify-center space-x-2 mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => handleStarClick(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="transition-transform hover:scale-110"
                  disabled={isSubmitting}
                >
                  <Star
                    size={40}
                    className={`${(hoverRating || rating) >= star ? 'text-orange-600 fill-orange-600' : 'text-gray-300'} transition-colors`}
                  />
                </button>
              ))}
            </div>
            {rating > 0 && (
              <p className="text-center text-lg font-medium text-orange-700 mt-2">
                {rating === 1 && "Poor - Not enjoyable"}
                {rating === 2 && "Fair - Could be better"}
                {rating === 3 && "Good - Solid experience"}
                {rating === 4 && "Very Good - Would recommend"}
                {rating === 5 && "Excellent - Exceptional dining"}
              </p>
            )}
          </div>

          <div className="mb-8">
            <label className="block text-gray-700 font-bold mb-3 text-lg">Tell us about your meal</label>
            <textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Describe the dishes, service, and ambiance..."
              className="w-full p-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-orange-600 focus:border-orange-600 transition-colors"
              rows={6}
              maxLength={500}
              disabled={isSubmitting}
            />
            <div className="text-right text-sm text-gray-500 mt-1">{reviewText.length}/500 characters</div>
          </div>

          <div className="mb-8">
            <label className="block text-gray-700 font-bold mb-3 text-lg">Add food photos (optional)</label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-orange-600 bg-gray-50 transition-colors">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
                id="photo-upload"
                disabled={isSubmitting || photos.length >= 5}
              />
              <label htmlFor="photo-upload" className={`cursor-pointer flex flex-col items-center ${isSubmitting || photos.length >= 5 ? 'opacity-50 cursor-not-allowed' : ''}`}>
                <div className="bg-orange-100 p-3 rounded-full mb-3">
                  <Camera className="text-orange-700" size={28} />
                </div>
                <p className="text-gray-700 font-medium mb-1">Upload Food Photos</p>
                <p className="text-gray-500 text-sm">Max 5 photos, 10MB each</p>
              </label>
            </div>

            {photos.length > 0 && (
              <div className="mt-6">
                <h4 className="text-gray-700 font-medium mb-3">Your food photos ({photos.length}/5)</h4>
                <div className="grid grid-cols-5 gap-3">
                  {photos.map((photo) => (
                    <div key={photo.id} className="relative group">
                      <img src={photo.url} alt={photo.name} className="w-full h-32 object-cover rounded-lg" />
                      <button
                        onClick={() => removePhoto(photo.id)}
                        className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors transform translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100"
                        disabled={isSubmitting}
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex space-x-4">
            <button
              onClick={onClose}
              className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={rating === 0 || isSubmitting}
              className={`flex-1 py-3 px-4 rounded-lg font-medium ${
                rating === 0 || isSubmitting ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-orange-600 text-white hover:bg-orange-700'
              }`}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Review'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
