import React, { useState, useRef, useEffect } from 'react';
import { Upload, MapPin, Phone, Mail, FileText, Clock, CreditCard, User, Building } from 'lucide-react';

const AddRestaurant = () => {
  const [formData, setFormData] = useState({
    name: '',
    ownerName: '',
    phone: '',
    email: '',
    fssaiNumber: '',
    gstNumber: '',
    aadharNumber: '',
    address: {
      street: '',
      city: '',
      state: '',
      zip: '',
      latitude: '',
      longitude: '',
    },
    foodType: 'veg',
    minOrderAmount: 100,
    openingHours: JSON.stringify([]),
    paymentMethods: 'online',
  });

  const [documents, setDocuments] = useState({});
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('address.')) {
      const key = name.split('.')[1];
      setFormData((prev) => ({
        ...prev,
        address: { ...prev.address, [key]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (e) => {
    setDocuments({ ...documents, [e.target.name]: e.target.files[0] });
  };

  const handleLocationSelect = (locationDetails) => {
    setFormData(prev => ({
      ...prev,
      address: {
        ...prev.address,
        street: locationDetails.street || '',
        city: locationDetails.city || '',
        state: locationDetails.state || '',
        zip: locationDetails.zip || '',
        latitude: locationDetails.latitude || '',
        longitude: locationDetails.longitude || ''
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const form = new FormData();
    for (let key in formData) {
      if (typeof formData[key] === 'object') {
        form.append(key, JSON.stringify(formData[key]));
      } else {
        form.append(key, formData[key]);
      }
    }
    Object.keys(documents).forEach((key) => {
      form.append(key, documents[key]);
    });

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      alert('Restaurant Created Successfully!');
    } catch (err) {
      alert('Error: ' + (err.response?.data?.message || 'Unknown Error'));
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { id: 1, title: 'Basic Information', icon: Building },
    { id: 2, title: 'Address Details', icon: MapPin },
    { id: 3, title: 'Business Details', icon: FileText },
    { id: 4, title: 'Documents', icon: Upload }
  ];

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 4));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  // Enhanced Location Picker Component
  const LocationPicker = ({ onSelectLocation }) => {
    const mapRef = useRef(null);
    const [map, setMap] = useState(null);
    const [marker, setMarker] = useState(null);
    const [geocoder, setGeocoder] = useState(null);
    const [currentAddress, setCurrentAddress] = useState('');
    const [apiLoaded, setApiLoaded] = useState(false);

    // Load Google Maps API
    useEffect(() => {
      if (!window.google) {
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places`;
        script.async = true;
        script.defer = true;
        script.onload = () => setApiLoaded(true);
        document.head.appendChild(script);
      } else {
        setApiLoaded(true);
      }

      return () => {
        if (window.google) {
          // Clean up if needed
        }
      };
    }, []);

    // Initialize map when API is loaded
    useEffect(() => {
      if (!apiLoaded) return;

      const initMap = () => {
        const initialLocation = { lat: 20.5937, lng: 78.9629 }; // Default to India
        const mapInstance = new window.google.maps.Map(mapRef.current, {
          center: initialLocation,
          zoom: 5,
        });

        const markerInstance = new window.google.maps.Marker({
          position: initialLocation,
          map: mapInstance,
          draggable: true,
        });

        const geocoderInstance = new window.google.maps.Geocoder();

        // Add click listener to place marker
        mapInstance.addListener('click', (e) => {
          markerInstance.setPosition(e.latLng);
          reverseGeocode(e.latLng, geocoderInstance);
        });

        // Add dragend listener to marker
        markerInstance.addListener('dragend', (e) => {
          reverseGeocode(e.latLng, geocoderInstance);
        });

        setMap(mapInstance);
        setMarker(markerInstance);
        setGeocoder(geocoderInstance);
      };

      initMap();
    }, [apiLoaded]);

    const reverseGeocode = (latLng, geocoder) => {
      geocoder.geocode({ location: latLng }, (results, status) => {
        if (status === 'OK' && results[0]) {
          const addressComponents = results[0].address_components;
          let street = '';
          let city = '';
          let state = '';
          let zip = '';

          addressComponents.forEach(component => {
            if (component.types.includes('route')) {
              street = component.long_name;
            }
            if (component.types.includes('locality')) {
              city = component.long_name;
            }
            if (component.types.includes('administrative_area_level_1')) {
              state = component.long_name;
            }
            if (component.types.includes('postal_code')) {
              zip = component.long_name;
            }
          });

          setCurrentAddress(results[0].formatted_address);
          
          onSelectLocation({
            street: street,
            city: city,
            state: state,
            zip: zip,
            latitude: latLng.lat(),
            longitude: latLng.lng()
          });
        }
      });
    };

    const handleSearch = (e) => {
      e.preventDefault();
      if (!geocoder || !currentAddress.trim()) return;

      geocoder.geocode({ address: currentAddress }, (results, status) => {
        if (status === 'OK' && results[0]) {
          const location = results[0].geometry.location;
          map.setCenter(location);
          marker.setPosition(location);
          reverseGeocode(location, geocoder);
        }
      });
    };

    return (
      <div className="space-y-4">
        <div className="flex items-center">
          <input
            type="text"
            value={currentAddress}
            onChange={(e) => setCurrentAddress(e.target.value)}
            placeholder="Search for an address"
            className="flex-grow px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          <button
            onClick={handleSearch}
            className="px-4 py-2 bg-orange-500 text-white rounded-r-lg hover:bg-orange-600 transition-colors"
          >
            Search
          </button>
        </div>
        
        <div 
          ref={mapRef} 
          className="w-full h-96 rounded-lg border border-gray-300"
          style={{ minHeight: '400px' }}
        />
        
        <div className="p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-gray-700 mb-2">Selected Location Details</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-500">Latitude</label>
              <div className="mt-1">{formData.address.latitude || 'Not selected'}</div>
            </div>
            <div>
              <label className="block text-sm text-gray-500">Longitude</label>
              <div className="mt-1">{formData.address.longitude || 'Not selected'}</div>
            </div>
            <div>
              <label className="block text-sm text-gray-500">Street</label>
              <div className="mt-1">{formData.address.street || 'Not selected'}</div>
            </div>
            <div>
              <label className="block text-sm text-gray-500">City</label>
              <div className="mt-1">{formData.address.city || 'Not selected'}</div>
            </div>
          </div>
        </div>
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
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Partner with Us</h1>
          <p className="text-gray-600">Join our network of amazing restaurants</p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-300 ${
                currentStep >= step.id 
                  ? 'bg-gradient-to-r from-orange-500 to-red-500 border-orange-500 text-white' 
                  : 'bg-white border-gray-300 text-gray-400'
              }`}>
                <step.icon className="w-5 h-5" />
              </div>
              <div className={`ml-3 ${currentStep >= step.id ? 'text-orange-600' : 'text-gray-400'}`}>
                <p className="text-sm font-medium">{step.title}</p>
              </div>
              {index < steps.length - 1 && (
                <div className={`w-20 h-0.5 mx-4 ${currentStep > step.id ? 'bg-orange-500' : 'bg-gray-300'}`} />
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
                  <h3 className="text-xl font-semibold text-gray-800">Basic Information</h3>
                  <p className="text-gray-600 text-sm">Tell us about your restaurant</p>
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
              </div>
            )}

            {/* Step 2: Address Details */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="border-l-4 border-orange-500 pl-4 mb-6">
                  <h3 className="text-xl font-semibold text-gray-800">Address Details</h3>
                  <p className="text-gray-600 text-sm">Where is your restaurant located?</p>
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
                    <label className="text-sm font-medium text-gray-700">City</label>
                    <input 
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 hover:border-orange-300" 
                      name="address.city" 
                      value={formData.address.city} 
                      onChange={handleChange} 
                      placeholder="Enter city" 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">State</label>
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
                    <label className="text-sm font-medium text-gray-700">Zip Code</label>
                    <input 
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 hover:border-orange-300" 
                      name="address.zip" 
                      value={formData.address.zip} 
                      onChange={handleChange} 
                      placeholder="Enter zip code" 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Latitude</label>
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
                    <label className="text-sm font-medium text-gray-700">Longitude</label>
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
                  <h3 className="text-xl font-semibold text-gray-800">Business Details</h3>
                  <p className="text-gray-600 text-sm">Legal and operational information</p>
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
                    <label className="text-sm font-medium text-gray-700">Food Type</label>
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
                    <label className="text-sm font-medium text-gray-700">Minimum Order Amount</label>
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
                    <input 
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 hover:border-orange-300" 
                      name="openingHours" 
                      value={formData.openingHours} 
                      onChange={handleChange} 
                      placeholder='JSON format: [{"day": "Monday", "open": "09:00", "close": "22:00"}]' 
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Documents */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div className="border-l-4 border-orange-500 pl-4 mb-6">
                  <h3 className="text-xl font-semibold text-gray-800">Required Documents</h3>
                  <p className="text-gray-600 text-sm">Upload your business documents</p>
                </div>
                
                <div className="grid md:grid-cols-3 gap-6">
                  {[
                    { name: 'fssaiDoc', label: 'FSSAI Certificate', icon: FileText },
                    { name: 'gstDoc', label: 'GST Certificate', icon: FileText },
                    { name: 'aadharDoc', label: 'Aadhar Document', icon: FileText }
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
                          <p className="text-sm text-gray-600">Click to upload</p>
                          <p className="text-xs text-gray-400 mt-1">PDF, JPG, PNG</p>
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
                    'Create Restaurant'
                  )}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-500 text-sm">
          <p>By registering, you agree to our Terms of Service and Privacy Policy</p>
        </div>
      </div>
    </div>
  );
};

export default AddRestaurant;