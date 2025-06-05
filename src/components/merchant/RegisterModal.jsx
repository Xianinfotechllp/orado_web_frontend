import {
  User,
  Lock,
  Mail,
  Phone,
  FileText,
  FileDigit,
  FileInput,
} from "lucide-react";
import { useLayoutEffect, useState } from "react";
import { createRestaurant } from "../../apis/restaurantApi";
import LocationInput from "./Input/LocationInput";
import { toast } from "react-toastify";

const RegisterModal = ({ isOpen, onClose, onLoginClick }) => {
  const [formData, setFormData] = useState({
    name: "",
    ownerName: "", // Added this required field
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    address: {
      street: "",
      city: "",
      state: "",
      pincode: "",
      latitude: "",
      longitude: "",
    },
    openingHours: JSON.stringify([
      // Changed to match backend format
      { day: "Monday", open: "09:00", close: "21:00" },
      { day: "Tuesday", open: "09:00", close: "21:00" },
      { day: "Wednesday", open: "09:00", close: "21:00" },
      { day: "Thursday", open: "09:00", close: "21:00" },
      { day: "Friday", open: "09:00", close: "21:00" },
      { day: "Saturday", open: "09:00", close: "21:00" },
      { day: "Sunday", open: "09:00", close: "21:00" },
    ]),
    foodType: "both", // Changed to match backend options
    minOrderAmount: 100,
    paymentMethods: ["online"], // Changed to match backend options
    fssaiNumber: "",
    gstNumber: "",
    aadharNumber: "",
  });

  const [kycDocs, setKycDocs] = useState({
    fssaiDoc: null,
    gstDoc: null,
    aadharDoc: null,
  });

  const [restaurantImages, setRestaurantImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useLayoutEffect(() => {
    if (isOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }

    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith("address.")) {
      const addressField = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleFileChange = (e, docType) => {
    if (e.target.files && e.target.files[0]) {
      setKycDocs((prev) => ({
        ...prev,
        [docType]: e.target.files[0],
      }));
    }
  };

  const handleImageUpload = (e) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setRestaurantImages(files);
    }
  };

  const handleOpeningHoursChange = (day, field, value) => {
    try {
      const currentHours = JSON.parse(formData.openingHours);
      const updatedHours = currentHours.map((hour) =>
        hour.day === day ? { ...hour, [field]: value } : hour
      );
      setFormData((prev) => ({
        ...prev,
        openingHours: JSON.stringify(updatedHours),
      }));
    } catch (error) {
      console.error("Error updating opening hours:", error);
    }
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  // Password validations
  if (formData.password.length < 8) {
    toast.error('Password must be at least 8 characters long');
    return;
  }

  if (formData.password !== formData.confirmPassword) {
    toast.error('Passwords do not match!');
    return;
  }

  // Validate password complexity (optional but recommended)
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  if (!passwordRegex.test(formData.password)) {
    toast.error(
      'Password must contain at least:\n' +
      '- One uppercase letter\n' +
      '- One lowercase letter\n' +
      '- One number\n' +
      '- One special character (@$!%*?&)'
    );
    return;
  }

  // Validate required fields
  const requiredFields = [
    'name', 'ownerName', 'phone', 'email',
    'fssaiNumber', 'gstNumber', 'aadharNumber'
  ];
  const missingFields = requiredFields.filter(field => !formData[field]);

  if (missingFields.length > 0) {
    toast.error(`Missing required fields: ${missingFields.join(', ')}`);
    return;
  }

  // Validate address fields
  const requiredAddressFields = ['street', 'city', 'state', 'pincode'];
  const missingAddressFields = requiredAddressFields.filter(
    field => !formData.address[field]
  );

  if (missingAddressFields.length > 0) {
    toast.error(
      `Missing address fields: ${missingAddressFields.join(', ')}`
    );
    return;
  }

  // Validate foodType
  const validFoodTypes = ['veg', 'non-veg', 'both'];
  if (!validFoodTypes.includes(formData.foodType)) {
    toast.error(`Invalid food type. Allowed: ${validFoodTypes.join(', ')}`);
    return;
  }

  // Validate openingHours
  try {
    JSON.parse(formData.openingHours);
  } catch (error) {
    toast.error('Invalid opening hours format');
    return;
  }

  // Validate KYC documents
  if (!kycDocs.fssaiDoc || !kycDocs.gstDoc || !kycDocs.aadharDoc) {
    toast.error('Please upload all required KYC documents');
    return;
  }

  // Validate document file types
  const validFileTypes = ['image/jpeg', 'image/png', 'application/pdf'];
  const invalidDocs = Object.entries(kycDocs)
    .filter(([_, file]) => file && !validFileTypes.includes(file.type))
    .map(([type, _]) => type);

  if (invalidDocs.length > 0) {
    toast.error(
      `Invalid file types for: ${invalidDocs.join(', ')}. Only JPEG, PNG, or PDF allowed.`
    );
    return;
  }

  setIsSubmitting(true);

  try {
    const formDataToSend = new FormData();

    // Append all form data except address
    Object.entries(formData).forEach(([key, value]) => {
      if (key !== 'address') {
        if (key === 'paymentMethods') {
          formDataToSend.append(key, value.join(","));
        } else if (key === 'openingHours') {
          // Ensure openingHours is properly formatted
          try {
            const parsedHours = JSON.parse(value);
            formDataToSend.append(key, JSON.stringify(parsedHours));
          } catch (error) {
            throw new Error('Invalid opening hours format');
          }
        } else {
          formDataToSend.append(key, value);
        }
      }
    });

    // Append address fields
    Object.entries(formData.address).forEach(([key, value]) => {
      formDataToSend.append(`address[${key}]`, value);
    });

    // Append KYC documents
    Object.entries(kycDocs).forEach(([key, file]) => {
      if (file) {
        formDataToSend.append(key, file);
      }
    });

    // Append restaurant images if any
    restaurantImages.forEach((image, index) => {
      formDataToSend.append('images', image);
    });

    const response = await createRestaurant(formDataToSend);
    
    if (response.success) {
      toast.success('Restaurant created successfully! Awaiting admin approval.');
      onClose();
      // Reset form after successful submission
      setFormData({
        name: "",
        ownerName: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
        address: {
          street: "",
          city: "",
          state: "",
          pincode: "",
          latitude: "",
          longitude: "",
        },
        openingHours: JSON.stringify([
          { day: "Monday", open: "09:00", close: "21:00" },
          { day: "Tuesday", open: "09:00", close: "21:00" },
          { day: "Wednesday", open: "09:00", close: "21:00" },
          { day: "Thursday", open: "09:00", close: "21:00" },
          { day: "Friday", open: "09:00", close: "21:00" },
          { day: "Saturday", open: "09:00", close: "21:00" },
          { day: "Sunday", open: "09:00", close: "21:00" },
        ]),
        foodType: "both",
        minOrderAmount: 100,
        paymentMethods: ["online"],
        fssaiNumber: "",
        gstNumber: "",
        aadharNumber: "",
      });
      setKycDocs({
        fssaiDoc: null,
        gstDoc: null,
        aadharDoc: null,
      });
      setRestaurantImages([]);
    } else {
      throw new Error(response.message || 'Failed to create restaurant');
    }
  } catch (error) {
    console.error('Error creating restaurant:', error);
    toast.error(
      error.response?.data?.message ||
      error.message ||
      'Failed to create restaurant. Please try again.'
    );
  } finally {
    setIsSubmitting(false);
  }
};

  // Render opening hours inputs
  const renderOpeningHours = () => {
    try {
      const hours = JSON.parse(formData.openingHours);
      return (
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Opening Hours*
          </label>
          {hours.map((day, index) => (
            <div key={day.day} className="grid grid-cols-3 gap-2 items-center">
              <span className="text-sm">{day.day}</span>
              <input
                type="time"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={day.open}
                onChange={(e) =>
                  handleOpeningHoursChange(day.day, "open", e.target.value)
                }
              />
              <input
                type="time"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={day.close}
                onChange={(e) =>
                  handleOpeningHoursChange(day.day, "close", e.target.value)
                }
              />
            </div>
          ))}
        </div>
      );
    } catch (error) {
      return <p className="text-red-500">Invalid opening hours format</p>;
    }
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300 ${
        isOpen
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none"
      }`}
      style={{ backgroundColor: "rgba(0, 0, 0, 0.9)" }}
    >
      <div
        className={`relative w-full max-w-2xl rounded-lg bg-white p-6 shadow-lg transform transition-all duration-300 ${
          isOpen ? "scale-100" : "scale-95"
        }`}
      >
        <div className="flex flex-col space-y-1.5 text-center mb-6">
          <h2 className="text-2xl font-bold">Register Your Restaurant</h2>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-4 max-h-[80vh] overflow-y-auto p-2"
        >
          {/* Basic Information Section */}
          <div className="border-b pb-4 mb-4">
            <h3 className="text-lg font-medium mb-3">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Restaurant Name*
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pl-10 text-sm"
                    placeholder="Restaurant name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Owner Name*
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pl-10 text-sm"
                    placeholder="Owner name"
                    name="ownerName"
                    value={formData.ownerName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              
             
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Email*
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pl-10 text-sm"
                    placeholder="Email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Phone Number*
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pl-10 text-sm"
                    placeholder="Phone number"
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Address Section */}
          <div className="border-b pb-4 mb-4">
            <h3 className="text-lg font-medium mb-3">Address Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Street*
                </label>
                <input
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  placeholder="Street address"
                  name="address.street"
                  value={formData.address.street}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  City*
                </label>
                <input
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  placeholder="City"
                  name="address.city"
                  value={formData.address.city}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  State*
                </label>
                <input
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  placeholder="State"
                  name="address.state"
                  value={formData.address.state}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Pincode*
                </label>
                <input
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  placeholder="Pincode"
                  name="address.pincode"
                  value={formData.address.pincode}
                  onChange={handleInputChange}
                  required
                />
              </div>
               <div className="col-span-2">
                <LocationInput
                  onLocationSelect={(location) => {
                    if (location) {
                      setFormData((prev) => ({
                        ...prev,
                        address: {
                          ...prev.address,
                          street: location.street || prev.address.street,
                          city: location.city || prev.address.city,
                          state: location.state || prev.address.state,
                          pincode: location.zip || prev.address.pincode,
                          latitude: location.latitude,
                          longitude: location.longitude,
                        },
                      }));
                    }
                  }}
                />
              </div>

            </div>
          </div>

          {/* Business Information Section */}
          <div className="border-b pb-4 mb-4">
            <h3 className="text-lg font-medium mb-3">Business Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Food Type*
                </label>
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  name="foodType"
                  value={formData.foodType}
                  onChange={handleInputChange}
                  required
                >
                  <option value="veg">Vegetarian</option>
                  <option value="non-veg">Non-Vegetarian</option>
                  <option value="both">Both</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Minimum Order Amount*
                </label>
                <input
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  placeholder="100"
                  type="number"
                  name="minOrderAmount"
                  value={formData.minOrderAmount}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Payment Methods*
                </label>
                <div className="flex flex-wrap gap-2">
                  {["online", "cod", "wallet"].map((method) => (
                    <label key={method} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.paymentMethods.includes(method)}
                        onChange={(e) => {
                          const newMethods = e.target.checked
                            ? [...formData.paymentMethods, method]
                            : formData.paymentMethods.filter(
                                (m) => m !== method
                              );
                          setFormData((prev) => ({
                            ...prev,
                            paymentMethods: newMethods,
                          }));
                        }}
                      />
                      <span>{method.toUpperCase()}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Opening Hours Section */}
            <div className="mt-4">{renderOpeningHours()}</div>
          </div>

          {/* KYC Information Section */}
          <div className="border-b pb-4 mb-4">
            <h3 className="text-lg font-medium mb-3">KYC Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  FSSAI Number*
                </label>
                <div className="relative">
                  <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pl-10 text-sm"
                    placeholder="FSSAI Number"
                    name="fssaiNumber"
                    value={formData.fssaiNumber}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  GST Number*
                </label>
                <div className="relative">
                  <FileDigit className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pl-10 text-sm"
                    placeholder="GST Number"
                    name="gstNumber"
                    value={formData.gstNumber}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Aadhar Number*
                </label>
                <div className="relative">
                  <FileInput className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pl-10 text-sm"
                    placeholder="Aadhar Number"
                    name="aadharNumber"
                    value={formData.aadharNumber}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  FSSAI Document*
                </label>
                <input
                  type="file"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  onChange={(e) => handleFileChange(e, "fssaiDoc")}
                  required
                  accept=".pdf,.jpg,.jpeg,.png"
                />
                {kycDocs.fssaiDoc && (
                  <p className="text-xs text-green-600">
                    File selected: {kycDocs.fssaiDoc.name}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  GST Document*
                </label>
                <input
                  type="file"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  onChange={(e) => handleFileChange(e, "gstDoc")}
                  required
                  accept=".pdf,.jpg,.jpeg,.png"
                />
                {kycDocs.gstDoc && (
                  <p className="text-xs text-green-600">
                    File selected: {kycDocs.gstDoc.name}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Aadhar Document*
                </label>
                <input
                  type="file"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  onChange={(e) => handleFileChange(e, "aadharDoc")}
                  required
                  accept=".pdf,.jpg,.jpeg,.png"
                />
                {kycDocs.aadharDoc && (
                  <p className="text-xs text-green-600">
                    File selected: {kycDocs.aadharDoc.name}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Restaurant Images Section */}
          <div className="mb-4">
            <h3 className="text-lg font-medium mb-3">Restaurant Images</h3>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Upload Restaurant Images (Max 5)
              </label>
              <input
                type="file"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                onChange={handleImageUpload}
                multiple
                accept="image/*"
                max={5}
              />
              {restaurantImages.length > 0 && (
                <p className="text-xs text-green-600">
                  {restaurantImages.length} image(s) selected
                </p>
              )}
            </div>
          </div>

          {/* Account Security Section */}
          <div className="mb-4">
            <h3 className="text-lg font-medium mb-3">Account Security</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Password*
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pl-10 text-sm"
                    placeholder="Create a password"
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    minLength={8}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Confirm Password*
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pl-10 text-sm"
                    placeholder="Confirm your password"
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    required
                    minLength={8}
                  />
                </div>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white h-10 px-4 py-2 w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating Restaurant..." : "Register Restaurant"}
          </button>

          <div className="text-center">
            <span className="text-sm text-gray-600">
              Already have an account?{" "}
            </span>
            <button
              type="button"
              onClick={onLoginClick}
              className="text-sm text-orange-600 hover:text-orange-700 font-medium"
            >
              Login here
            </button>
          </div>
        </form>

        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-md hover:bg-gray-100"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-gray-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default RegisterModal;
