import React, { useState, useEffect } from "react";
import {
  Upload,
  MapPin,
  Phone,
  Mail,
  FileText,
  Clock,
  CreditCard,
  User,
  Building,
  ChevronDown,
  Info,
  AlertCircle,
  Image,
  X,
} from "lucide-react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { createRestaurant } from "../../apis/restaurantApi";
import axios from "axios";
import LoadingForAdmins from "./AdminUtils/LoadingForAdmins";
import apiClient from "../../apis/apiClient/apiClient";

const AddRestaurant = () => {
  const [formData, setFormData] = useState({
    name: "",
    ownerId: "",
    ownerName: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
    fssaiNumber: "",
    gstNumber: "",
    aadharNumber: "",
    address: {
      street: "",
      city: "",
      state: "",
      pincode: "",
      latitude: "",
      longitude: "",
    },
    foodType: "veg",
    minOrderAmount: 100,
    openingHours: [],
    paymentMethods: ["online"],
  });

  const [documents, setDocuments] = useState({
    fssaiDoc: null,
    gstDoc: null,
    aadharDoc: null,
    images: [], // Changed to array to hold multiple images
  });

  const [merchants, setMerchants] = useState([]);
  const [selectedMerchant, setSelectedMerchant] = useState(null);
  const [merchantLoading, setMerchantLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0); // Start with merchant selection

  // Fetch merchants on component mount
  useEffect(() => {
    const fetchMerchants = async () => {
      setMerchantLoading(true);
      try {
        const response = await apiClient.get(
          "/admin/merchant/getallmerchants"
        );
        setMerchants(response.data.data || []);
      } catch (error) {
        console.error("Error fetching merchants:", error);
      } finally {
        setMerchantLoading(false);
      }
    };

    fetchMerchants();
  }, []);

  const handleMerchantSelect = (merchantId) => {
    const merchant = merchants.find((m) => m._id === merchantId);
    if (merchant) {
      setSelectedMerchant(merchant);
      setFormData((prev) => ({
        ...prev,
        ownerId: merchant._id,
        ownerName: merchant.name,
        phone: merchant.phone || "",
        email: merchant.email || "",
      }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.includes("address.")) {
      const key = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        address: { ...prev.address, [key]: value },
      }));
    } else if (name === "paymentMethods") {
      const methods = value.split(",").map((m) => m.trim());
      setFormData((prev) => ({ ...prev, [name]: methods }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;

    if (name === "images") {
      // For images, we want to keep previous images and add new ones
      setDocuments((prev) => ({
        ...prev,
        images: [...prev.images, ...Array.from(files)].slice(0, 5), // Limit to 5 images
      }));
    } else {
      // For single file uploads
      setDocuments((prev) => ({
        ...prev,
        [name]: files[0],
      }));
    }
  };

  const addOpeningHour = () => {
    setFormData((prev) => ({
      ...prev,
      openingHours: [
        ...prev.openingHours,
        {
          day: "monday",
          openingTime: "09:00",
          closingTime: "18:00",
          isClosed: false,
        },
      ],
    }));
  };

  const removeOpeningHour = (index) => {
    setFormData((prev) => ({
      ...prev,
      openingHours: prev.openingHours.filter((_, i) => i !== index),
    }));
  };

  const handleOpeningHoursChange = (index, field, value) => {
    const updated = [...formData.openingHours];

    if (field === "isClosed") {
      updated[index][field] = !updated[index][field];
    } else {
      updated[index][field] = value;
    }

    setFormData((prev) => ({ ...prev, openingHours: updated }));
  };

  const handleLocationSelect = (locationDetails) => {
    setFormData((prev) => ({
      ...prev,
      address: {
        ...prev.address,
        street: locationDetails.address || "",
        city: locationDetails.city || "",
        state: locationDetails.state || "",
        pincode: locationDetails.zip || "",
        latitude: locationDetails.latitude || "",
        longitude: locationDetails.longitude || "",
      },
    }));
  };

  const validateStep = (step) => {
    const newErrors = {};
    const requiredFields = [
      "name",
      "ownerName",
      "phone",
      "email",
      "password",
      "fssaiNumber",
      "ownerId",
      "gstNumber",
      "aadharNumber",
      "address.street",
      "address.city",
      "address.state",
      "foodType",
      "openingHours",
    ];

    if (step === 0) {
      if (!formData.ownerId) newErrors.ownerId = "Please select a merchant";
    } else if (step === 1) {
      if (!formData.name.trim()) newErrors.name = "Restaurant name is required";
      if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
      if (!formData.email.trim()) newErrors.email = "Email is required";
      else if (!/^\S+@\S+\.\S+$/.test(formData.email))
        newErrors.email = "Invalid email format";
      if (!formData.password) newErrors.password = "Password is required";
      else if (formData.password.length < 8)
        newErrors.password = "Password must be at least 8 characters";
      if (!formData.confirmPassword)
        newErrors.confirmPassword = "Please confirm password";
      else if (formData.password !== formData.confirmPassword)
        newErrors.confirmPassword = "Passwords don't match";
    } else if (step === 2) {
      if (!formData.address.street.trim())
        newErrors.street = "Street address is required";
      if (!formData.address.city.trim()) newErrors.city = "City is required";
      if (!formData.address.state.trim()) newErrors.state = "State is required";
      if (!formData.address.pincode.trim())
        newErrors.pincode = "Pincode is required";
      if (!formData.address.latitude || !formData.address.longitude)
        newErrors.location = "Please select a location on the map";
    } else if (step === 3) {
      if (!formData.fssaiNumber.trim())
        newErrors.fssaiNumber = "FSSAI number is required";
      if (!formData.gstNumber.trim())
        newErrors.gstNumber = "GST number is required";
      if (!formData.aadharNumber.trim())
        newErrors.aadharNumber = "Aadhar number is required";
      if (formData.openingHours.length === 0)
        newErrors.openingHours = "At least one opening hour entry is required";
      else {
        formData.openingHours.forEach((hour, index) => {
          if (!hour.day) newErrors[`day-${index}`] = "Day is required";
          if (!hour.openingTime && !hour.isClosed)
            newErrors[`open-${index}`] = "Opening time is required";
          if (!hour.closingTime && !hour.isClosed)
            newErrors[`close-${index}`] = "Closing time is required";
        });
      }
    } else if (step === 4) {
      if (!documents.fssaiDoc)
        newErrors.fssaiDoc = "FSSAI document is required";
      if (!documents.gstDoc) newErrors.gstDoc = "GST document is required";
      if (!documents.aadharDoc)
        newErrors.aadharDoc = "Aadhar document is required";
      if (documents.images.length < 1)
        newErrors.images = "Please upload at least 1 image";
      if (documents.images.length > 5)
        newErrors.images = "Maximum 5 images allowed";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 4));
    }
  };

  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 0));

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateStep(4)) return;

    setLoading(true);

    const formDataToSend = new FormData();

    // Basic information
    formDataToSend.append("name", formData.name);
    formDataToSend.append("ownerId", formData.ownerId);
    formDataToSend.append("ownerName", formData.ownerName);
    formDataToSend.append("phone", formData.phone);
    formDataToSend.append("email", formData.email);
    formDataToSend.append("password", formData.password);

    // Business details
    formDataToSend.append("fssaiNumber", formData.fssaiNumber);
    formDataToSend.append("gstNumber", formData.gstNumber);
    formDataToSend.append("aadharNumber", formData.aadharNumber);
    formDataToSend.append("foodType", formData.foodType);
    formDataToSend.append("minOrderAmount", formData.minOrderAmount);
    formDataToSend.append("paymentMethods", formData.paymentMethods.join(","));

    // Address details
    formDataToSend.append("address[street]", formData.address.street);
    formDataToSend.append("address[city]", formData.address.city);
    formDataToSend.append("address[state]", formData.address.state);
    formDataToSend.append("address[pincode]", formData.address.pincode);
    formDataToSend.append("address[latitude]", formData.address.latitude);
    formDataToSend.append("address[longitude]", formData.address.longitude);

    // Opening hours
    formDataToSend.append(
      "openingHours",
      JSON.stringify(formData.openingHours)
    );

    // File uploads
    if (documents.fssaiDoc)
      formDataToSend.append("fssaiDoc", documents.fssaiDoc);
    if (documents.gstDoc) formDataToSend.append("gstDoc", documents.gstDoc);
    if (documents.aadharDoc)
      formDataToSend.append("aadharDoc", documents.aadharDoc);
    // Append each image
    documents.images.forEach((image, index) => {
      formDataToSend.append(`images`, image);
    });

    try {
      const response = await createRestaurant(formDataToSend);
      alert("Restaurant Created Successfully!");
      // Optionally reset form or redirect
    } catch (err) {
      alert("Error: " + (err.response?.data?.message || "Unknown Error"));
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { id: 0, title: "Merchant Selection", icon: User },
    { id: 1, title: "Basic Information", icon: Building },
    { id: 2, title: "Address Details", icon: MapPin },
    { id: 3, title: "Business Details", icon: FileText },
    { id: 4, title: "Documents", icon: Upload },
  ];

  const LocationPicker = ({ onSelectLocation }) => {
    const [position, setPosition] = useState([20.5937, 78.9629]); // Default to India
    const [currentAddress, setCurrentAddress] = useState("");

    const customIcon = new L.Icon({
      iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
      iconSize: [25, 41],
      iconAnchor: [12, 41],
    });

    const reverseGeocode = async (lat, lon) => {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`
        );
        const data = await response.json();
        setCurrentAddress(data.display_name);

        const addressDetails = {
          address: data.display_name,
          city:
            data.address?.city ||
            data.address?.town ||
            data.address?.village ||
            "",
          state: data.address?.state || "",
          zip: data.address?.postcode || "",
          latitude: lat,
          longitude: lon,
        };

        onSelectLocation(addressDetails);
      } catch (error) {
        console.error("Geocoding error:", error);
      }
    };

    const MapClickHandler = () => {
      useMapEvents({
        click(e) {
          const { lat, lng } = e.latlng;
          setPosition([lat, lng]);
          reverseGeocode(lat, lng);
        },
      });
      return null;
    };

    return (
      <div>
        <MapContainer
          center={position}
          zoom={5}
          style={{ height: "400px", width: "100%" }}
        >
          <TileLayer
            attribution="© OpenStreetMap"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={position} icon={customIcon} />
          <MapClickHandler />
        </MapContainer>

        <p className="mt-2">
          <strong>Selected Address:</strong> {currentAddress}
        </p>
        {errors.location && (
          <p className="text-red-500 text-sm mt-1">{errors.location}</p>
        )}
      </div>
    );
  };

  const daysOfWeek = [
    { value: "monday", label: "Monday" },
    { value: "tuesday", label: "Tuesday" },
    { value: "wednesday", label: "Wednesday" },
    { value: "thursday", label: "Thursday" },
    { value: "friday", label: "Friday" },
    { value: "saturday", label: "Saturday" },
    { value: "sunday", label: "Sunday" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full mb-4">
            <Building className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Partner with Us
          </h1>
          <p className="text-gray-600">
            Join our network of amazing restaurants
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div
                className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-300 ${
                  currentStep >= step.id
                    ? "bg-gradient-to-r from-orange-500 to-red-500 border-orange-500 text-white"
                    : "bg-white border-gray-300 text-gray-400"
                }`}
              >
                <step.icon className="w-5 h-5" />
              </div>
              <div
                className={`ml-3 ${
                  currentStep >= step.id ? "text-orange-600" : "text-gray-400"
                }`}
              >
                <p className="text-sm font-medium">{step.title}</p>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`w-20 h-0.5 mx-4 ${
                    currentStep > step.id ? "bg-orange-500" : "bg-gray-300"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="p-8">
            {/* Step 0: Merchant Selection */}
            {currentStep === 0 && (
              <div className="space-y-6">
                <div className="border-l-4 border-orange-500 pl-4 mb-6">
                  <h3 className="text-xl font-semibold text-gray-800">
                    Select Merchant
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Choose the merchant who owns this restaurant
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <User className="w-4 h-4 mr-2 text-orange-500" />
                    Merchant
                  </label>
                  <div className="relative">
                    <select
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 hover:border-orange-300 appearance-none"
                      name="ownerId"
                      value={formData.ownerId}
                      onChange={(e) => handleMerchantSelect(e.target.value)}
                      required
                    >
                      <option value="">Select a merchant</option>
                      {merchants.map((merchant) => (
                        <option key={merchant._id} value={merchant._id}>
                          {merchant.name} ({merchant.email})
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-3.5 w-5 h-5 text-gray-400 pointer-events-none" />
                  </div>
                  {errors.ownerId && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.ownerId}
                    </p>
                  )}
                </div>

                {selectedMerchant && (
                  <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
                    <h4 className="font-medium text-gray-800 mb-3 flex items-center">
                      <Info className="w-5 h-5 text-blue-500 mr-2" />
                      Merchant Details
                    </h4>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Name</p>
                        <p className="font-medium">{selectedMerchant.name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Email</p>
                        <p className="font-medium">{selectedMerchant.email}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Phone</p>
                        <p className="font-medium">
                          {selectedMerchant.phone || "Not provided"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Status</p>
                        <p className="font-medium">
                          {selectedMerchant.isActive ? "Active" : "Inactive"}
                        </p>
                      </div>
                    </div>
                    <div className="mt-3">
                      <p className="text-sm text-gray-600">Merchant ID</p>
                      <p className="text-xs font-mono bg-gray-100 p-2 rounded">
                        {selectedMerchant._id}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Step 1: Basic Information */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="border-l-4 border-orange-500 pl-4 mb-6">
                  <h3 className="text-xl font-semibold text-gray-800">
                    Basic Information
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Tell us about your restaurant
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <Building className="w-4 h-4 mr-2 text-orange-500" />
                    Restaurant Name
                  </label>
                  <input
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 hover:border-orange-300"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter restaurant name"
                    required
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                  )}
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                      <Phone className="w-4 h-4 mr-2 text-orange-500" />
                      Phone Number
                    </label>
                    <input
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 hover:border-orange-300"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Enter phone number"
                      required
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.phone}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                      <Mail className="w-4 h-4 mr-2 text-orange-500" />
                      Email Address
                    </label>
                    <input
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 hover:border-orange-300"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter email address"
                      required
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.email}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                      Password
                    </label>
                    <input
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 hover:border-orange-300"
                      name="password"
                      type="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Create a password"
                      required
                    />
                    {errors.password && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.password}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                      Confirm Password
                    </label>
                    <input
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 hover:border-orange-300"
                      name="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Confirm password"
                      required
                    />
                    {errors.confirmPassword && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.confirmPassword}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
                  <div className="flex items-start">
                    <AlertCircle className="w-5 h-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-blue-800">
                        <strong>Associated Merchant:</strong>{" "}
                        {formData.ownerName}
                      </p>
                      <p className="text-xs text-blue-600 mt-1">
                        Merchant ID: {formData.ownerId}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Address Details */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="border-l-4 border-orange-500 pl-4 mb-6">
                  <h3 className="text-xl font-semibold text-gray-800">
                    Address Details
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Where is your restaurant located?
                  </p>
                </div>

                {/* Location Picker Map */}
                <div className="mb-6">
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <MapPin className="w-4 h-4 mr-2 text-orange-500" />
                    Select Location on Map
                  </label>
                  <LocationPicker onSelectLocation={handleLocationSelect} />
                </div>

                <div className="space-y-2">
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <MapPin className="w-4 h-4 mr-2 text-orange-500" />
                    Street Address
                  </label>
                  <input
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 hover:border-orange-300"
                    name="address.street"
                    value={formData.address.street}
                    onChange={handleChange}
                    placeholder="Enter street address"
                  />
                  {errors.street && (
                    <p className="text-red-500 text-sm mt-1">{errors.street}</p>
                  )}
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      City
                    </label>
                    <input
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 hover:border-orange-300"
                      name="address.city"
                      value={formData.address.city}
                      onChange={handleChange}
                      placeholder="Enter city"
                    />
                    {errors.city && (
                      <p className="text-red-500 text-sm mt-1">{errors.city}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      State
                    </label>
                    <input
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 hover:border-orange-300"
                      name="address.state"
                      value={formData.address.state}
                      onChange={handleChange}
                      placeholder="Enter state"
                    />
                    {errors.state && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.state}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Zip Code
                    </label>
                    <input
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 hover:border-orange-300"
                      name="address.pincode"
                      value={formData.address.pincode}
                      onChange={handleChange}
                      placeholder="Enter zip code"
                    />
                    {errors.pincode && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.pincode}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Latitude
                    </label>
                    <input
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 hover:border-orange-300"
                      name="address.latitude"
                      value={formData.address.latitude}
                      onChange={handleChange}
                      placeholder="Latitude"
                      readOnly
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Longitude
                    </label>
                    <input
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 hover:border-orange-300"
                      name="address.longitude"
                      value={formData.address.longitude}
                      onChange={handleChange}
                      placeholder="Longitude"
                      readOnly
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Business Details */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="border-l-4 border-orange-500 pl-4 mb-6">
                  <h3 className="text-xl font-semibold text-gray-800">
                    Business Details
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Legal and operational information
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                      <FileText className="w-4 h-4 mr-2 text-orange-500" />
                      FSSAI Number
                    </label>
                    <input
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 hover:border-orange-300"
                      name="fssaiNumber"
                      value={formData.fssaiNumber}
                      onChange={handleChange}
                      placeholder="Enter FSSAI number"
                      required
                    />
                    {errors.fssaiNumber && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.fssaiNumber}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                      <FileText className="w-4 h-4 mr-2 text-orange-500" />
                      GST Number
                    </label>
                    <input
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 hover:border-orange-300"
                      name="gstNumber"
                      value={formData.gstNumber}
                      onChange={handleChange}
                      placeholder="Enter GST number"
                      required
                    />
                    {errors.gstNumber && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.gstNumber}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <FileText className="w-4 h-4 mr-2 text-orange-500" />
                    Aadhar Number
                  </label>
                  <input
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 hover:border-orange-300"
                    name="aadharNumber"
                    value={formData.aadharNumber}
                    onChange={handleChange}
                    placeholder="Enter Aadhar number"
                    required
                  />
                  {errors.aadharNumber && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.aadharNumber}
                    </p>
                  )}
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Food Type
                    </label>
                    <select
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 hover:border-orange-300"
                      name="foodType"
                      value={formData.foodType}
                      onChange={handleChange}
                    >
                      <option value="veg">Vegetarian</option>
                      <option value="non-veg">Non-Vegetarian</option>
                      <option value="both">Both</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Minimum Order Amount
                    </label>
                    <input
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 hover:border-orange-300"
                      name="minOrderAmount"
                      type="number"
                      value={formData.minOrderAmount}
                      onChange={handleChange}
                      placeholder="₹100"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                      <CreditCard className="w-4 h-4 mr-2 text-orange-500" />
                      Payment Methods
                    </label>
                    <input
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 hover:border-orange-300"
                      name="paymentMethods"
                      value={formData.paymentMethods}
                      onChange={handleChange}
                      placeholder="online, cash, card"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                      <Clock className="w-4 h-4 mr-2 text-orange-500" />
                      Opening Hours
                    </label>

                    {formData.openingHours.length === 0 && (
                      <p className="text-sm text-gray-500">
                        No opening hours added yet
                      </p>
                    )}

                    {formData.openingHours.map((item, idx) => (
                      <div key={idx} className="mb-4 p-4 bg-gray-50 rounded-lg">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Day
                            </label>
                            <select
                              value={item.day}
                              onChange={(e) =>
                                handleOpeningHoursChange(
                                  idx,
                                  "day",
                                  e.target.value
                                )
                              }
                              className="w-full px-3 py-2 border rounded-lg"
                            >
                              {daysOfWeek.map((day) => (
                                <option key={day.value} value={day.value}>
                                  {day.label}
                                </option>
                              ))}
                            </select>
                            {errors[`day-${idx}`] && (
                              <p className="text-red-500 text-xs mt-1">
                                {errors[`day-${idx}`]}
                              </p>
                            )}
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Opening Time
                            </label>
                            <input
                              type="time"
                              value={item.openingTime}
                              onChange={(e) =>
                                handleOpeningHoursChange(
                                  idx,
                                  "openingTime",
                                  e.target.value
                                )
                              }
                              className="w-full px-3 py-2 border rounded-lg"
                              disabled={item.isClosed}
                            />
                            {errors[`open-${idx}`] && (
                              <p className="text-red-500 text-xs mt-1">
                                {errors[`open-${idx}`]}
                              </p>
                            )}
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Closing Time
                            </label>
                            <input
                              type="time"
                              value={item.closingTime}
                              onChange={(e) =>
                                handleOpeningHoursChange(
                                  idx,
                                  "closingTime",
                                  e.target.value
                                )
                              }
                              className="w-full px-3 py-2 border rounded-lg"
                              disabled={item.isClosed}
                            />
                            {errors[`close-${idx}`] && (
                              <p className="text-red-500 text-xs mt-1">
                                {errors[`close-${idx}`]}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <label className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              checked={item.isClosed}
                              onChange={() =>
                                handleOpeningHoursChange(idx, "isClosed")
                              }
                              className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                            />
                            <span className="text-sm text-gray-700">
                              Closed on this day
                            </span>
                          </label>

                          <button
                            type="button"
                            onClick={() => removeOpeningHour(idx)}
                            className="text-red-500 hover:text-red-700 text-sm"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}

                    <button
                      type="button"
                      onClick={addOpeningHour}
                      className="flex items-center gap-2 text-orange-600 hover:text-orange-800 mt-2"
                    >
                      <span>+</span>
                      <span>Add Opening Hours</span>
                    </button>
                    {errors.openingHours && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.openingHours}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Documents */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div className="mt-8">
                  <div className="border-l-4 border-orange-500 pl-4 mb-6">
                    <h3 className="text-xl font-semibold text-gray-800">
                      Restaurant Images
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Upload at least 5 images of your restaurant (max 5)
                    </p>
                  </div>

                  <div className="space-y-3">
                    <label className="flex items-center text-sm font-medium text-gray-700">
                      <Image className="w-4 h-4 mr-2 text-orange-500" />
                      Restaurant Photos
                    </label>

                    {/* Image upload area */}
                    <div className="relative">
                      <input
                        type="file"
                        name="images"
                        onChange={handleFileChange}
                        multiple
                        accept="image/*"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-orange-400 transition-colors duration-300">
                        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600">
                          Click to upload images (5 max)
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          JPG, PNG (5MB max each)
                        </p>
                      </div>
                    </div>

                    {/* Preview of selected images */}
                    {documents.images.length > 0 && (
                      <div className="mt-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">
                          Selected Images ({documents.images.length}/5)
                        </h4>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                          {documents.images.map((image, index) => (
                            <div key={index} className="relative group">
                              <img
                                src={URL.createObjectURL(image)}
                                alt={`Restaurant preview ${index + 1}`}
                                className="w-full h-24 object-cover rounded-lg"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  setDocuments((prev) => ({
                                    ...prev,
                                    images: prev.images.filter(
                                      (_, i) => i !== index
                                    ),
                                  }));
                                }}
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="border-l-4 border-orange-500 pl-4 mb-6">
                  <h3 className="text-xl font-semibold text-gray-800">
                    Required Documents
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Upload your business documents
                  </p>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  {[
                    {
                      name: "fssaiDoc",
                      label: "FSSAI Certificate",
                      icon: FileText,
                    },
                    {
                      name: "gstDoc",
                      label: "GST Certificate",
                      icon: FileText,
                    },
                    {
                      name: "aadharDoc",
                      label: "Aadhar Document",
                      icon: FileText,
                    },
                  ].map((doc) => (
                    <div key={doc.name} className="space-y-3">
                      <label className="flex items-center text-sm font-medium text-gray-700">
                        <doc.icon className="w-4 h-4 mr-2 text-orange-500" />
                        {doc.label}
                      </label>
                      <div className="relative">
                        <input
                          type="file"
                          name={doc.name}
                          onChange={handleFileChange}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          required
                        />
                        <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-orange-400 transition-colors duration-300">
                          <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                          <p className="text-sm text-gray-600">
                            Click to upload
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            PDF, JPG, PNG
                          </p>
                        </div>
                      </div>
                      {documents[doc.name] && (
                        <p className="text-sm text-green-600 flex items-center">
                          <FileText className="w-4 h-4 mr-1" />
                          {documents[doc.name].name}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-8 border-t border-gray-200 mt-8">
              <button
                type="button"
                onClick={prevStep}
                disabled={currentStep === 1}
                className="px-6 py-3 border border-gray-300 text-gray-600 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
              >
                Previous
              </button>

              {currentStep < 4 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="px-8 py-3 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
                >
                  Next Step
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="px-8 py-3 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {loading ? <LoadingForAdmins /> : "Create Restaurant"}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-500 text-sm">
          <p>
            By registering, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
};

export default AddRestaurant;
