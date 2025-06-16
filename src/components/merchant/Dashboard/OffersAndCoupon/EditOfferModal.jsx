import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { toast } from "react-toastify";
import { updateRestaurantOffer } from "../../../../apis/restaurantApi";

const EditOfferModal = ({ offer, restaurantId, onClose, onUpdate }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "percentage",
    discountValue: "",
    maxDiscount: "",
    minOrderValue: "",
    validFrom: null,
    validTill: null,
    usageLimitPerUser: "",
    totalUsageLimit: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
  if (offer) {
    setFormData({
      title: offer.title || "",
      description: offer.description || "",
      type: offer.discountType || "percentage",
      discountValue: offer.discountValue || "",
      maxDiscount: offer.maxDiscount || "",
      minOrderValue: offer.minOrderValue || "", // Make sure this matches the prop name
      validFrom: offer.validFrom ? new Date(offer.validFrom) : null,
      validTill: offer.validTill ? new Date(offer.validTill) : null,
      usageLimitPerUser: offer.usageLimitPerUser || "",
      totalUsageLimit: offer.totalUsageLimit || "",
    });
  }
}, [offer]);

  const validate = () => {
    const newErrors = {};

    if (!formData.title) newErrors.title = "Title is required";
    if (!formData.type || !["flat", "percentage"].includes(formData.type))
      newErrors.type = "Invalid offer type";
    if (
      !formData.discountValue ||
      isNaN(formData.discountValue) ||
      formData.discountValue <= 0
    )
      newErrors.discountValue = "Discount value must be a positive number";
    if (
      !formData.minOrderValue ||
      isNaN(formData.minOrderValue) ||
      formData.minOrderValue <= 0
    )
      newErrors.minOrderValue = "Minimum order must be a positive number";
    if (!formData.validFrom) newErrors.validFrom = "Start date is required";
    if (!formData.validTill) newErrors.validTill = "End date is required";
    if (
      formData.validFrom &&
      formData.validTill &&
      formData.validTill <= formData.validFrom
    )
      newErrors.validTill = "End date must be after start date";

    if (formData.type === "percentage") {
      if (
        !formData.maxDiscount ||
        isNaN(formData.maxDiscount) ||
        formData.maxDiscount <= 0
      )
        newErrors.maxDiscount =
          "Max discount must be a positive number for percentage offers";
    }

    if (
      formData.usageLimitPerUser &&
      (isNaN(formData.usageLimitPerUser) || formData.usageLimitPerUser <= 0)
    )
      newErrors.usageLimitPerUser = "Must be a positive number";

    if (
      formData.totalUsageLimit &&
      (isNaN(formData.totalUsageLimit) || formData.totalUsageLimit <= 0)
    )
      newErrors.totalUsageLimit = "Must be a positive number";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDateChange = (date, field) => {
    setFormData((prev) => ({
      ...prev,
      [field]: date,
    }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  if (!validate()) return;

  setIsSubmitting(true);
  setError(null);

  try {
    const offerData = {
      title: formData.title,
      description: formData.description,
      discountType: formData.type,
      discountValue: parseFloat(formData.discountValue),
      maxDiscount: formData.maxDiscount ? parseFloat(formData.maxDiscount) : undefined,
      minOrderValue: parseFloat(formData.minOrderValue), // This is the correct property name for the API
      validFrom: formData.validFrom,
      validTill: formData.validTill,
      usageLimitPerUser: formData.usageLimitPerUser ? parseInt(formData.usageLimitPerUser) : undefined,
      totalUsageLimit: formData.totalUsageLimit ? parseInt(formData.totalUsageLimit) : undefined,
    };

    const updatedOffer = await updateRestaurantOffer(offer._id, offerData, restaurantId);
    
    toast.success("Offer updated successfully!");
    onUpdate(updatedOffer);
    onClose();
  } catch (error) {
    console.error("Error updating offer:", error);
    setError(error.response?.data?.message || "Failed to update offer. Please try again.");
  } finally {
    setIsSubmitting(false);
  }
};

  useEffect(() => {
    if (formData.type === "flat") {
      setFormData((prev) => ({
        ...prev,
        maxDiscount: "",
      }));
    }
  }, [formData.type]);

  if (!offer) return null;

  return (
    <div
    style={{ backgroundColor: "rgba(0, 0, 0, 0.9)" }}
    className="fixed inset-0  bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">Edit Offer</h2>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Offer Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md ${
                  errors.title ? "border-red-500" : "border-gray-300"
                } focus:outline-none focus:ring-2 focus:ring-orange-500`}
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <input
                type="text"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Offer Type *
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md ${
                  errors.type ? "border-red-500" : "border-gray-300"
                } focus:outline-none focus:ring-2 focus:ring-orange-500`}
              >
                <option value="percentage">Percentage Discount</option>
                <option value="flat">Flat Discount</option>
              </select>
              {errors.type && (
                <p className="mt-1 text-sm text-red-600">{errors.type}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {formData.type === "percentage"
                  ? "Discount Percentage *"
                  : "Discount Amount *"}
              </label>
              <div className="relative">
                <input
                  type="number"
                  name="discountValue"
                  value={formData.discountValue}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md ${
                    errors.discountValue ? "border-red-500" : "border-gray-300"
                  } focus:outline-none focus:ring-2 focus:ring-orange-500`}
                  placeholder={
                    formData.type === "percentage" ? "e.g. 20" : "e.g. 100"
                  }
                   onWheel={(e) => e.target.blur()} 
                />
                <span className="absolute right-3 top-2.5 text-gray-500">
                  {formData.type === "percentage" ? "%" : "₹"}
                </span>
              </div>
              {errors.discountValue && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.discountValue}
                </p>
              )}
            </div>
          </div>

          {formData.type === "percentage" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Maximum Discount Amount (₹) *
              </label>
              <input
                type="number"
                name="maxDiscount"
                value={formData.maxDiscount}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md ${
                  errors.maxDiscount ? "border-red-500" : "border-gray-300"
                } focus:outline-none focus:ring-2 focus:ring-orange-500`}
                placeholder="e.g. 200"
                 onWheel={(e) => e.target.blur()} 
              />
              {errors.maxDiscount && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.maxDiscount}
                </p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                Maximum amount that can be discounted (applies only for
                percentage discounts)
              </p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Minimum Order Value (₹) *
            </label>
            <input
              type="number"
              name="minOrderValue"
              value={formData.minOrderValue}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md ${
                errors.minOrderValue ? "border-red-500" : "border-gray-300"
              } focus:outline-none focus:ring-2 focus:ring-orange-500`}
              placeholder="e.g. 500"
               onWheel={(e) => e.target.blur()} 
            />
            {errors.minOrderValue && (
              <p className="mt-1 text-sm text-red-600">
                {errors.minOrderValue}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date *
              </label>
              <DatePicker
                selected={formData.validFrom}
                onChange={(date) => handleDateChange(date, "validFrom")}
                selectsStart
                startDate={formData.validFrom}
                endDate={formData.validTill}
                minDate={new Date()}
                className={`w-full px-3 py-2 border rounded-md ${
                  errors.validFrom ? "border-red-500" : "border-gray-300"
                } focus:outline-none focus:ring-2 focus:ring-orange-500`}
                placeholderText="Select start date"
              />
              {errors.validFrom && (
                <p className="mt-1 text-sm text-red-600">{errors.validFrom}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Date *
              </label>
              <DatePicker
                selected={formData.validTill}
                onChange={(date) => handleDateChange(date, "validTill")}
                selectsEnd
                startDate={formData.validFrom}
                endDate={formData.validTill}
                minDate={formData.validFrom || new Date()}
                className={`w-full px-3 py-2 border rounded-md ${
                  errors.validTill ? "border-red-500" : "border-gray-300"
                } focus:outline-none focus:ring-2 focus:ring-orange-500`}
                placeholderText="Select end date"
              />
              {errors.validTill && (
                <p className="mt-1 text-sm text-red-600">{errors.validTill}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Usage Limit Per User (optional)
              </label>
              <input
                type="number"
                name="usageLimitPerUser"
                value={formData.usageLimitPerUser}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md ${
                  errors.usageLimitPerUser
                    ? "border-red-500"
                    : "border-gray-300"
                } focus:outline-none focus:ring-2 focus:ring-orange-500`}
                placeholder="No limit if empty"
                 onWheel={(e) => e.target.blur()} 
              />
              {errors.usageLimitPerUser && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.usageLimitPerUser}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Total Usage Limit (optional)
              </label>
              <input
                type="number"
                name="totalUsageLimit"
                value={formData.totalUsageLimit}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md ${
                  errors.totalUsageLimit ? "border-red-500" : "border-gray-300"
                } focus:outline-none focus:ring-2 focus:ring-orange-500`}
                placeholder="No limit if empty"
                 onWheel={(e) => e.target.blur()} 
              />
              {errors.totalUsageLimit && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.totalUsageLimit}
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 disabled:opacity-50"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Updating..." : "Update Offer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditOfferModal;