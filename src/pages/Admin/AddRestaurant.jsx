import React, { useState, useRef, useEffect } from "react";
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
} from "lucide-react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";

import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { createRestaurant } from "../../apis/restaurantApi";
const AddRestaurant = () => {
  const [formData, setFormData] = useState({
    name: "",
    ownerName: "",
    phone: "",
    email: "",
    fssaiNumber: "",
    gstNumber: "",
    aadharNumber: "",
    password: "", // Add this
    confirmPassword: "",
    address: {
      street: "",
      city: "",
      state: "",
      zip: "",
      latitude: "",
      longitude: "",
      openingHours: [],
    },
    foodType: "veg",
    minOrderAmount: 100,
    openingHours: JSON.stringify([]),
    paymentMethods: "online",
  });

  const [documents, setDocuments] = useState({
    fssaiDoc: null,
    gstDoc: null,
    aadharDoc: null,
  });
  console.log(formData);
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.includes("address.")) {
      const key = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        address: { ...prev.address, [key]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setDocuments((prev) => ({
      ...prev,
      [name]: files[0],
    }));
  };

  const addOpeningHour = () => {
    setFormData((prev) => ({
      ...prev,
      openingHours: [...prev.openingHours, { day: "", open: "", close: "" }],
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
    updated[index][field] = value;
    setFormData((prev) => ({ ...prev, openingHours: updated }));
  };

  const handleLocationSelect = (locationDetails) => {
    setFormData((prev) => ({
      ...prev,
      address: {
        ...prev.address,
        street: locationDetails.street || "",
        city: locationDetails.city || "",
        state: locationDetails.state || "",
        zip: locationDetails.zip || "",
        latitude: locationDetails.latitude || "",
        longitude: locationDetails.longitude || "",
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

  if (formData.password !== formData.confirmPassword) {
    alert('Passwords do not match');
    return;
  }

    setLoading(true);

    // Create FormData object with a different name
    const formDataToSend = new FormData();

    // Basic information
    formDataToSend.append("name", formData.name);
    formDataToSend.append("ownerName", formData.ownerName);
    formDataToSend.append("phone", formData.phone);
    formDataToSend.append("email", formData.email);

    // Business details
    formDataToSend.append("fssaiNumber", formData.fssaiNumber);
    formDataToSend.append("gstNumber", formData.gstNumber);
    formDataToSend.append("aadharNumber", formData.aadharNumber);
    formDataToSend.append("foodType", formData.foodType);
    formDataToSend.append("minOrderAmount", formData.minOrderAmount);

    // Opening hours
    formDataToSend.append(
      "openingHours",
      JSON.stringify(formData.openingHours)
    );

    // Address details - need to append each field separately
    formDataToSend.append("address[street]", formData.address.street);
    formDataToSend.append("address[city]", formData.address.city);
    formDataToSend.append("address[state]", formData.address.state);
    formDataToSend.append("address[zip]", formData.address.zip);
    formDataToSend.append("address[latitude]", formData.address.latitude);
    formDataToSend.append("address[longitude]", formData.address.longitude);

    // Payment methods
    formDataToSend.append("paymentMethods", formData.paymentMethods);

    // File uploads
    if (documents.fssaiDoc)
      formDataToSend.append("fssaiDoc", documents.fssaiDoc);
    if (documents.gstDoc) formDataToSend.append("gstDoc", documents.gstDoc);
    if (documents.aadharDoc)
      formDataToSend.append("aadharDoc", documents.aadharDoc);

    try {
      // For testing - log what's being sent
      for (let [key, value] of formDataToSend.entries()) {
        console.log(key, value);
      }

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
      await createRestaurant(formData);
      alert("Restaurant Created Successfully!");
    } catch (err) {
      alert("Error: " + (err.response?.data?.message || "Unknown Error"));
    } finally {
      setLoading(false);
    }
  };
  const steps = [
    { id: 1, title: "Basic Information", icon: Building },
    { id: 2, title: "Address Details", icon: MapPin },
    { id: 3, title: "Business Details", icon: FileText },
    { id: 4, title: "Documents", icon: Upload },
  ];

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, 4));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  // Enhanced Location Picker Component
  const LocationPicker = ({ onSelectLocation }) => {
    const [position, setPosition] = useState([20.5937, 78.9629]); // Default to India
    const [currentAddress, setCurrentAddress] = useState("");

    const customIcon = new L.Icon({
      iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
      iconSize: [25, 41],
      iconAnchor: [12, 41],
    });

    const reverseGeocode = async (lat, lon) => {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`
      );
      const data = await response.json();
      setCurrentAddress(data.display_name);
      onSelectLocation({
        address: data.display_name,
        latitude: lat,
        longitude: lon,
      });
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

        <p>
          <strong>Selected Address:</strong> {currentAddress}
        </p>
      </div>
    );
  };

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

                <div className="grid md:grid-cols-2 gap-6">
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
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                      <User className="w-4 h-4 mr-2 text-orange-500" />
                      Owner Name
                    </label>
                    <input
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 hover:border-orange-300"
                      name="ownerName"
                      value={formData.ownerName}
                      onChange={handleChange}
                      placeholder="Enter owner name"
                      required
                    />
                  </div>
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
        {formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword && (
          <p className="text-red-500 text-sm mt-1">Passwords do not match</p>
        )}
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
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Zip Code
                    </label>
                    <input
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 hover:border-orange-300"
                      name="address.zip"
                      value={formData.address.zip}
                      onChange={handleChange}
                      placeholder="Enter zip code"
                    />
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

                    {Array.isArray(formData.openingHours) &&
                      formData.openingHours.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <input
                            type="text"
                            placeholder="Day"
                            value={item.day}
                            onChange={(e) =>
                              handleOpeningHoursChange(
                                idx,
                                "day",
                                e.target.value
                              )
                            }
                            className="w-1/3 px-3 py-2 border rounded-lg"
                          />
                          <input
                            type="time"
                            value={item.open}
                            onChange={(e) =>
                              handleOpeningHoursChange(
                                idx,
                                "open",
                                e.target.value
                              )
                            }
                            className="w-1/4 px-3 py-2 border rounded-lg"
                          />
                          <input
                            type="time"
                            value={item.close}
                            onChange={(e) =>
                              handleOpeningHoursChange(
                                idx,
                                "close",
                                e.target.value
                              )
                            }
                            className="w-1/4 px-3 py-2 border rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => removeOpeningHour(idx)}
                            className="text-red-500 hover:text-red-700"
                          >
                            ✖
                          </button>
                        </div>
                      ))}

                    <button
                      type="button"
                      onClick={addOpeningHour}
                      className="flex items-center gap-1 text-orange-600 hover:text-orange-800 mt-2"
                    >
                      ➕ Add Day
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Documents */}
            {currentStep === 4 && (
              <div className="space-y-6">
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
                  {loading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Creating Restaurant...
                    </div>
                  ) : (
                    "Create Restaurant"
                  )}
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
