import React, { useState } from "react";
import LocationPicker from "../map/LocationPicker";

export default function NewAddressForm({ userId, onClose, onAdd }) {
  const [form, setForm] = useState({
    type: "Other",
    street: "",
    city: "",
    state: "",
    zip: "",
    location: {
      latitude: "",
      longitude: "",
    },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLocationSelect = (location) => {
    console.log(location)
    setForm((prev) => ({
      ...prev,
      street: location.street,
      city: location.city,
      state: location.state,
      zip: location.zip,
      location: {
        latitude: location.latitude,
        longitude: location.longitude,
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const newAddress = {
        addressId: "",
        ...form,
      };
      onAdd(newAddress);
      onClose();
    } catch (error) {
      console.error("Failed to add new address", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const addressTypes = [
    { value: "Home", label: "🏠 Home" },
    { value: "Work", label: "💼 Work" },
    { value: "Other", label: "📍 Other" },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold text-gray-800">Add New Address</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
            aria-label="Close"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-col md:flex-row flex-1 overflow-auto">
          {/* Map Section */}
          <div className="w-full md:w-1/2 p-4 border-b md:border-b-0 md:border-r">
            <div className="h-64 md:h-full rounded-lg overflow-hidden">
              <LocationPicker onSelectLocation={handleLocationSelect} />
            </div>
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">
                {form.street ? (
                  <>
                    <span className="font-medium">Selected Location:</span> {form.street}, {form.city}
                  </>
                ) : (
                  "Search and select a location on the map"
                )}
              </p>
            </div>
          </div>

          {/* Form Section */}
          <div className="w-full md:w-1/2 p-6 overflow-y-auto">
            <form onSubmit={handleSubmit}>
              {/* Address Type */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address Type
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {addressTypes.map((type) => (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => setForm({ ...form, type: type.value })}
                      className={`py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                        form.type === type.value
                          ? "bg-blue-100 text-blue-700 border border-blue-300"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {type.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Address Details */}
              <div className="space-y-4">
                <div>
                  <label htmlFor="street" className="block text-sm font-medium text-gray-700 mb-1">
                    Street Address
                  </label>
                  <input
                    id="street"
                    name="street"
                    type="text"
                    value={form.street}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                      City
                    </label>
                    <input
                      id="city"
                      name="city"
                      type="text"
                      value={form.city}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                      State/Province
                    </label>
                    <input
                      id="state"
                      name="state"
                      type="text"
                      value={form.state}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="zip" className="block text-sm font-medium text-gray-700 mb-1">
                    ZIP/Postal Code
                  </label>
                  <input
                    id="zip"
                    name="zip"
                    type="text"
                    value={form.zip}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="mt-8">
                <button
                  type="submit"
                  disabled={isSubmitting || !form.street || !form.city || !form.state || !form.zip}
                  className={`w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                    isSubmitting || !form.street || !form.city || !form.state || !form.zip
                      ? "opacity-70 cursor-not-allowed"
                      : ""
                  }`}
                >
                  {isSubmitting ? "Saving..." : "Save Address"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}