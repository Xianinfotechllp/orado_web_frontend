import React, { useState } from "react";
import { useSelector } from "react-redux";
import {
  Check,
  ArrowLeft,
  ArrowRight,
  Store,
  MapPin,
  Clock,
  Camera,
  FileText,
  CreditCard,
} from "lucide-react";
import { createRestaurant } from "../../../../apis/restaurantApi";
import LocationInput from "../Input/LocationInput";

const RestaurantRegistration = ({ onBack, onComplete }) => {
  const user = useSelector((state) => state.auth.user);
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState(new Set());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    ownerId: user.id,
    foodType: "both",
    address: {
      street: "",
      city: "",
      state: "",
      zip: "",
      longitude: "",
      latitude: "",
    },
    openingHours: JSON.stringify([
      { day: "monday", openingTime: "09:00", closingTime: "21:00" },
      { day: "tuesday", openingTime: "09:00", closingTime: "21:00" },
      { day: "wednesday", openingTime: "09:00", closingTime: "21:00" },
      { day: "thursday", openingTime: "09:00", closingTime: "21:00" },
      { day: "friday", openingTime: "09:00", closingTime: "21:00" },
      { day: "saturday", openingTime: "09:00", closingTime: "21:00" },
      { day: "sunday", openingTime: "09:00", closingTime: "21:00" },
    ]),
    paymentMethods: ["online"],
    minOrderAmount: 100,
    fssaiNumber: "",
    gstNumber: "",
    aadharNumber: "",
    fssaiDoc: null,
    gstDoc: null,
    aadharDoc: null,
    images: [],
  });

  const steps = [
    {
      id: 1,
      title: "Basic Info",
      icon: Store,
      description: "Restaurant details",
    },
    {
      id: 2,
      title: "Location",
      icon: MapPin,
      description: "Address & coordinates",
    },
    { id: 3, title: "Hours", icon: Clock, description: "Operating hours" },
    {
      id: 4,
      title: "Payment",
      icon: CreditCard,
      description: "Payment methods",
    },
    { id: 5, title: "Documents", icon: FileText, description: "KYC documents" },
    { id: 6, title: "Images", icon: Camera, description: "Photos" },
  ];

  const foodTypes = [
    { value: "veg", label: "Vegetarian" },
    { value: "non-veg", label: "Non-Vegetarian" },
    { value: "both", label: "Vegetarian & Non-Vegetarian" },
  ];

  const paymentOptions = [
    { value: "online", label: "Online" },
    { value: "cod", label: "Cash on Delivery" },
    { value: "wallet", label: "Wallet" },
  ];

  const daysOfWeek = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ];

  const handleNext = () => {
    if (validateCurrentStep()) {
      setCompletedSteps((prev) => new Set([...prev, currentStep]));
      if (currentStep < steps.length) {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStepClick = (stepId) => {
    if (stepId <= currentStep || completedSteps.has(stepId)) {
      setCurrentStep(stepId);
    }
  };

  const validateCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return formData.name.trim() !== "";
      case 2:
        return (
          formData.address.street &&
          formData.address.city &&
          formData.address.state &&
          formData.address.longitude &&
          formData.address.latitude
        );
      case 3:
        try {
          const hours = JSON.parse(formData.openingHours);
          return hours.some((day) => day.openingTime && day.closingTime);
        } catch {
          return false;
        }
      case 4:
        return formData.paymentMethods.length > 0;
      case 5:
        return (
          formData.fssaiNumber && formData.gstNumber && formData.aadharNumber
        );
      case 6:
        return true;
      default:
        return true;
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNestedInputChange = (parentField, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [parentField]: {
        ...prev[parentField],
        [field]: value,
      },
    }));
  };

  const handleBusinessHoursChange = (day, field, value) => {
    try {
      const hours = JSON.parse(formData.openingHours);
      const updatedHours = hours.map((h) => {
        if (h.day === day) {
          return { ...h, [field]: value };
        }
        return h;
      });
      setFormData((prev) => ({
        ...prev,
        openingHours: JSON.stringify(updatedHours),
      }));
    } catch (err) {
      console.error("Error updating business hours:", err);
    }
  };

  const handlePaymentMethodToggle = (method) => {
    setFormData((prev) => {
      const methods = [...prev.paymentMethods];
      const index = methods.indexOf(method);

      if (index === -1) {
        methods.push(method);
      } else {
        methods.splice(index, 1);
      }

      return { ...prev, paymentMethods: methods };
    });
  };

  const handleFileUpload = (field, file) => {
    setFormData((prev) => ({ ...prev, [field]: file }));
  };

  const handleMultipleFileUpload = (field, files) => {
    setFormData((prev) => ({
      ...prev,
      [field]: [...prev[field], ...Array.from(files)],
    }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      const formDataToSend = new FormData();

      Object.keys(formData).forEach((key) => {
        if (
          key !== "address" &&
          key !== "openingHours" &&
          key !== "fssaiDoc" &&
          key !== "gstDoc" &&
          key !== "aadharDoc" &&
          key !== "images"
        ) {
          formDataToSend.append(key, formData[key]);
        }
      });

      Object.keys(formData.address).forEach((key) => {
        formDataToSend.append(`address[${key}]`, formData.address[key]);
      });

      if (formData.fssaiDoc)
        formDataToSend.append("fssaiDoc", formData.fssaiDoc);
      if (formData.gstDoc) formDataToSend.append("gstDoc", formData.gstDoc);
      if (formData.aadharDoc)
        formDataToSend.append("aadharDoc", formData.aadharDoc);

      formData.images.forEach((image) => {
        formDataToSend.append("images", image);
      });

      formDataToSend.append("openingHours", formData.openingHours);

      const response = await createRestaurant(formDataToSend);
      onComplete(response.data);
    } catch (err) {
      console.error("Registration failed:", err);
      setError(
        err.response?.data?.message || "Registration failed. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return <div>Please log in to register a restaurant</div>;
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="flex items-center mb-6">
              <div className="bg-gradient-to-r from-red-500 to-orange-500 p-3 rounded-full mr-4">
                <Store className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">
                  Basic Restaurant Information
                </h3>
                <p className="text-gray-600">Tell us about your restaurant</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Restaurant Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg  focus:border-transparent transition-all duration-200"
                  placeholder="Enter restaurant name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Food Type *
                </label>
                <select
                  value={formData.foodType}
                  onChange={(e) =>
                    handleInputChange("foodType", e.target.value)
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg  focus:border-transparent transition-all duration-200"
                >
                  {foodTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
           
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="flex items-center mb-6">
              <div className="bg-gradient-to-r from-red-500 to-orange-500 p-3 rounded-full mr-4">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">
                  Location & Coordinates
                </h3>
                <p className="text-gray-600">
                  Where is your restaurant located?
                </p>
              </div>
            </div>
            <div className="space-y-4">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Search Location *
                </label>
                <LocationInput
                  onLocationSelect={(locationData) => {
                    if (locationData) {
                      setFormData((prev) => ({
                        ...prev,
                        address: {
                          street: locationData.street || "",
                          city: locationData.city || "",
                          state: locationData.state || "",
                          zip: locationData.zip || "",
                          longitude: locationData.longitude || "",
                          latitude: locationData.latitude || "",
                        },
                      }));
                    }
                  }}
                />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Street Address *
                </label>
                <input
                  type="text"
                  value={formData.address.street}
                  onChange={(e) =>
                    handleNestedInputChange("address", "street", e.target.value)
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg  focus:border-transparent transition-all duration-200"
                  placeholder="Enter street address"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City *
                  </label>
                  <input
                    type="text"
                    value={formData.address.city}
                    onChange={(e) =>
                      handleNestedInputChange("address", "city", e.target.value)
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg  focus:border-transparent transition-all duration-200"
                    placeholder="City"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    State *
                  </label>
                  <input
                    type="text"
                    value={formData.address.state}
                    onChange={(e) =>
                      handleNestedInputChange(
                        "address",
                        "state",
                        e.target.value
                      )
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg  focus:border-transparent transition-all duration-200"
                    placeholder="State"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ZIP Code
                  </label>
                  <input
                    type="text"
                    value={formData.address.zip}
                    onChange={(e) =>
                      handleNestedInputChange("address", "zip", e.target.value)
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg  focus:border-transparent transition-all duration-200"
                    placeholder="ZIP"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="flex items-center mb-6">
              <div className="bg-gradient-to-r from-red-500 to-orange-500 p-3 rounded-full mr-4">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">
                  Business Hours
                </h3>
                <p className="text-gray-600">Set your operating schedule</p>
              </div>
            </div>
            <div className="space-y-4">
              {JSON.parse(formData.openingHours).map((dayObj) => {
                const day = dayObj.day;
                return (
                  <div key={day} className="bg-gray-50 p-4 rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                      <div className="capitalize font-medium text-gray-700 text-lg">
                        {day.charAt(0).toUpperCase() + day.slice(1)}
                      </div>
                      <div>
                        <label className="block text-sm text-gray-500 mb-1">
                          Opening Time
                        </label>
                        <input
                          type="time"
                          value={dayObj.openingTime}
                          onChange={(e) =>
                            handleBusinessHoursChange(
                              day,
                              "openingTime",
                              e.target.value
                            )
                          }
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg  focus:border-transparent transition-all duration-200"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-500 mb-1">
                          Closing Time
                        </label>
                        <input
                          type="time"
                          value={dayObj.closingTime}
                          onChange={(e) =>
                            handleBusinessHoursChange(
                              day,
                              "closingTime",
                              e.target.value
                            )
                          }
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg  focus:border-transparent transition-all duration-200"
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="flex items-center mb-6">
              <div className="bg-gradient-to-r from-red-500 to-orange-500 p-3 rounded-full mr-4">
                <CreditCard className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">
                  Payment Settings
                </h3>
                <p className="text-gray-600">Configure payment options</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-6 rounded-lg">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Minimum Order Amount
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                    ₹
                  </span>
                  <input
                    type="number"
                    value={formData.minOrderAmount}
                    onChange={(e) =>
                      handleInputChange("minOrderAmount", e.target.value)
                    }
                    className="w-full pl-8 px-4 py-3 border border-gray-300 rounded-lg  focus:border-transparent transition-all duration-200"
                    placeholder="100"
                    min="0"
                     onWheel={(e) => e.target.blur()} 
                  />
                </div>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg">
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  Accepted Payment Methods *
                </label>
                <div className="space-y-3">
                  {paymentOptions.map((option) => (
                    <label
                      key={option.value}
                      className="flex items-center space-x-3 cursor-pointer hover:bg-white p-2 rounded transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={formData.paymentMethods.includes(option.value)}
                        onChange={() => handlePaymentMethodToggle(option.value)}
                        className="w-5 h-5 text-red-500 border-gray-300 rounded focus:ring-red-500"
                      />
                      <span className="text-sm text-gray-700 font-medium">
                        {option.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="flex items-center mb-6">
              <div className="bg-gradient-to-r from-red-500 to-orange-500 p-3 rounded-full mr-4">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">
                  KYC Documents
                </h3>
                <p className="text-gray-600">Upload required documents</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-6 rounded-lg">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  FSSAI Number *
                </label>
                <input
                  type="text"
                  value={formData.fssaiNumber}
                  onChange={(e) =>
                    handleInputChange("fssaiNumber", e.target.value)
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg  focus:border-transparent transition-all duration-200 mb-4"
                  placeholder="Enter FSSAI number"
                />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    FSSAI Document
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-red-300 transition-colors">
                    <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">
                      Upload FSSAI document
                    </p>
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) =>
                        handleFileUpload("fssaiDoc", e.target.files[0])
                      }
                      className="mt-2 text-sm text-gray-600 mx-auto"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  GST Number *
                </label>
                <input
                  type="text"
                  value={formData.gstNumber}
                  onChange={(e) =>
                    handleInputChange("gstNumber", e.target.value)
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg  focus:border-transparent transition-all duration-200 mb-4"
                  placeholder="Enter GST number"
                />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    GST Document
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-red-300 transition-colors">
                    <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Upload GST document</p>
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) =>
                        handleFileUpload("gstDoc", e.target.files[0])
                      }
                      className="mt-2 text-sm text-gray-600 mx-auto"
                    />
                  </div>
                </div>
              </div>

              <div className="md:col-span-2 bg-gray-50 p-6 rounded-lg">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Aadhar Number *
                </label>
                <input
                  type="text"
                  value={formData.aadharNumber}
                  onChange={(e) =>
                    handleInputChange("aadharNumber", e.target.value)
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg  focus:border-transparent transition-all duration-200 mb-4"
                  placeholder="Enter Aadhar number"
                />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Aadhar Document
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-red-300 transition-colors">
                    <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">
                      Upload Aadhar document
                    </p>
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) =>
                        handleFileUpload("aadharDoc", e.target.files[0])
                      }
                      className="mt-2 text-sm text-gray-600 mx-auto"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <div className="flex items-center mb-6">
              <div className="bg-gradient-to-r from-red-500 to-orange-500 p-3 rounded-full mr-4">
                <Camera className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">
                  Restaurant Images
                </h3>
                <p className="text-gray-600">
                  Upload photos of your restaurant
                </p>
              </div>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Restaurant Images
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-red-300 transition-colors">
                <Camera className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-lg text-gray-600 mb-2">
                  Upload restaurant images
                </p>
                <p className="text-sm text-gray-500 mb-4">
                  Maximum 10 images, JPG/PNG format
                </p>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) =>
                    handleMultipleFileUpload("images", e.target.files)
                  }
                  className="text-sm text-gray-600 mx-auto"
                />
              </div>
              {formData.images.length > 0 && (
                <div className="mt-6">
                  <p className="text-sm font-medium text-gray-700 mb-3">
                    {formData.images.length} image(s) selected
                  </p>
                  <div className="grid grid-cols-4 gap-4">
                    {formData.images.map((img, index) => (
                      <div
                        key={index}
                        className="aspect-square bg-gray-200 rounded-lg overflow-hidden border-2 border-gray-300"
                      >
                        <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                          <Camera className="w-8 h-8 text-gray-400" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header with Back Button */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={onBack}
            className="flex items-center px-6 py-3 text-gray-600 hover:text-gray-900 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </button>
          <div className="text-center">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
              Register Your Restaurant
            </h1>
            <p className="text-gray-600 mt-1">
              Complete all steps to list your restaurant
            </p>
          </div>
          <div className="w-32"></div> {/* Spacer for balance */}
        </div>

        {/* Step Progress */}
        <div className="mb-12">
          <div className="flex items-center justify-center">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                {/* Step Circle */}
                <div className="flex flex-col items-center">
                  <div
                    onClick={() => handleStepClick(step.id)}
                    className={`relative flex items-center justify-center w-16 h-16 rounded-full transition-all duration-300 cursor-pointer ${
                      completedSteps.has(step.id)
                        ? "bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-lg scale-110"
                        : currentStep === step.id
                        ? "bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-lg scale-110"
                        : "bg-white text-gray-400 hover:bg-gray-50 border-2 border-gray-200"
                    }`}
                  >
                    {completedSteps.has(step.id) ? (
                      <Check className="w-7 h-7" />
                    ) : (
                      <step.icon className="w-7 h-7" />
                    )}
                  </div>

                  {/* Step Details */}
                  <div className="mt-3 text-center">
                    <p
                      className={`text-sm font-semibold ${
                        completedSteps.has(step.id) || currentStep === step.id
                          ? "text-red-600"
                          : "text-gray-500"
                      }`}
                    >
                      {step.title}
                    </p>
                    <p className="text-xs text-gray-400">{step.description}</p>
                  </div>
                </div>

                {/* Connecting Line */}
                {index < steps.length - 1 && (
                  <div
                    className={`w-20 h-2 mx-6 rounded-full transition-all duration-300 ${
                      completedSteps.has(step.id)
                        ? "bg-gradient-to-r from-red-500 to-orange-500"
                        : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-8 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r-lg">
            <p className="font-medium">{error}</p>
          </div>
        )}

        {/* Step Content */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          {renderStepContent()}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className={`flex items-center px-8 py-4 rounded-xl font-semibold transition-all duration-200 ${
              currentStep === 1
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-white text-gray-700 hover:bg-gray-50 shadow-md hover:shadow-lg border border-gray-200"
            }`}
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Previous
          </button>

          {currentStep === steps.length ? (
            <button
              onClick={handleSubmit}
              disabled={!validateCurrentStep() || isSubmitting}
              className={`flex items-center px-10 py-4 rounded-xl font-semibold transition-all duration-200 ${
                validateCurrentStep() && !isSubmitting
                  ? "bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white shadow-lg hover:shadow-xl transform hover:scale-105"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
              }`}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Registering...
                </>
              ) : (
                "Register Restaurant"
              )}
            </button>
          ) : (
            <button
              onClick={handleNext}
              disabled={!validateCurrentStep()}
              className={`flex items-center px-8 py-4 rounded-xl font-semibold transition-all duration-200 ${
                validateCurrentStep()
                  ? "bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white shadow-lg hover:shadow-xl transform hover:scale-105"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
              }`}
            >
              Next Step
              <ArrowRight className="w-5 h-5 ml-2" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default RestaurantRegistration;
