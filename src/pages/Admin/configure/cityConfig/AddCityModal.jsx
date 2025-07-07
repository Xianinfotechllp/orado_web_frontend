import { useState } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiMoreVertical } from 'react-icons/fi';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/20/solid';

const AddCityModal = ({ onClose, onSave, geofences = [] }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    geofences: [], // This will store the selected geofence IDs
    isNormalOrderActive: false,
    normalOrderChargeCalculation: false,
    isCustomOrderActive: false,
    customOrderChargeCalculation: false,
    chargeType: 'Fixed Price',
    status: true
  });

  const [errors, setErrors] = useState({
    name: false,
    geofences: false
  });

  const [showGeofencesDropdown, setShowGeofencesDropdown] = useState(false);

  // Format geofences for checkbox options
  const geofenceOptions = geofences.map(geofence => ({
    id: geofence._id,
    name: geofence.regionName,
    center: geofence.center,
    radius: geofence.radius
  }));

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleGeofenceToggle = (geofenceId) => {
    setFormData(prev => {
      const newGeofences = prev.geofences.includes(geofenceId)
        ? prev.geofences.filter(id => id !== geofenceId)
        : [...prev.geofences, geofenceId];
      
      setErrors(prevErrors => ({
        ...prevErrors,
        geofences: newGeofences.length === 0
      }));
      
      return {
        ...prev,
        geofences: newGeofences
      };
    });
  };

  const toggleSelectAllGeofences = (selectAll) => {
    setFormData(prev => {
      const newGeofences = selectAll 
        ? geofenceOptions.map(g => g.id)
        : [];
      
      setErrors(prevErrors => ({
        ...prevErrors,
        geofences: newGeofences.length === 0
      }));
      
      return {
        ...prev,
        geofences: newGeofences
      };
    });
  };

  const validateForm = () => {
    const newErrors = {
      name: formData.name.trim() === '',
      geofences: formData.geofences.length === 0
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const dataToSave = {
        ...formData,
        assignedGeofences: formData.geofences.map(id => 
          geofences.find(g => g._id === id)
        )
      };
      onSave(dataToSave);
    }
  };

  return (
    <div className="fixed inset-0 z-50">
      {/* Blur backdrop */}
      <div 
    className="absolute inset-0 bg-black bg-opacity-30 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal container */}
      <div className="relative flex items-center justify-center min-h-screen p-4">
        <div 
          className="bg-white rounded-lg w-full max-w-md mx-4 shadow-xl transform transition-all"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Modal Header */}
          <div className="border-b px-6 py-4 flex justify-between items-center bg-gray-50 rounded-t-lg">
            <h3 className="text-lg font-semibold text-gray-800">Add City</h3>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Modal Body */}
          <form onSubmit={handleSubmit} className="p-6 max-h-[80vh] overflow-y-auto">
            {/* Name Field */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                maxLength={100}
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#FC8019] focus:border-[#FC8019] outline-none transition-all ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter city name"
              />
              {errors.name && <p className="mt-1 text-sm text-red-500">Name is required</p>}
            </div>

            {/* Description Field */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                maxLength={500}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FC8019] focus:border-[#FC8019] outline-none transition-all"
                placeholder="Enter description"
              />
            </div>

            {/* Geofence Assignment */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Assign Geofence <span className="text-red-500">*</span>
              </label>
              
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowGeofencesDropdown(!showGeofencesDropdown)}
                  className={`w-full px-3 py-2 border rounded-md text-left flex justify-between items-center ${
                    errors.geofences ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <span>
                    {formData.geofences.length > 0 
                      ? `${formData.geofences.length} geofence(s) selected`
                      : 'Select geofences'}
                  </span>
                  {showGeofencesDropdown ? (
                    <ChevronUpIcon className="h-5 w-5 text-gray-400" />
                  ) : (
                    <ChevronDownIcon className="h-5 w-5 text-gray-400" />
                  )}
                </button>
                
                {showGeofencesDropdown && (
                  <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                    <div className="p-2 border-b">
                      <label className="flex items-center px-2 py-1 hover:bg-gray-100 rounded cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.geofences.length === geofenceOptions.length}
                          onChange={(e) => toggleSelectAllGeofences(e.target.checked)}
                          className="h-4 w-4 text-[#FC8019] rounded border-gray-300 focus:ring-[#FC8019]"
                        />
                        <span className="ml-2 text-sm text-gray-700">Select All</span>
                      </label>
                    </div>
                    {geofenceOptions.map(geofence => (
                      <label 
                        key={geofence.id}
                        className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={formData.geofences.includes(geofence.id)}
                          onChange={() => handleGeofenceToggle(geofence.id)}
                          className="h-4 w-4 text-[#FC8019] rounded border-gray-300 focus:ring-[#FC8019]"
                        />
                        <span className="ml-2 text-sm text-gray-700">
                          {geofence.name} (Radius: {geofence.radius}km)
                        </span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
              
              {errors.geofences && (
                <p className="mt-1 text-sm text-red-500">At least one geofence is required</p>
              )}
              
              {formData.geofences.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {formData.geofences.map(geofenceId => {
                    const geofence = geofenceOptions.find(g => g.id === geofenceId);
                    return (
                      <span 
                        key={geofenceId}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#FC8019] text-white"
                      >
                        {geofence?.name || 'Unknown'}
                        <button
                          type="button"
                          onClick={() => handleGeofenceToggle(geofenceId)}
                          className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full hover:bg-[#e67317]"
                        >
                          <svg className="w-2 h-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </span>
                    );
                  })}
                </div>
              )}
            </div>
            {/* Charge Type */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Charge Type
              </label>
              <select
                name="chargeType"
                value={formData.chargeType}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FC8019] focus:border-[#FC8019] outline-none transition-all"
              >
                <option value="Fixed Price">Fixed Price</option>
                <option value="Dynamic">Dynamic</option>
              </select>
            </div>

            {/* Status */}
            <div className="flex items-center mb-6">
              <label className="block text-sm font-medium text-gray-700 mr-3">
                Status
              </label>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="status"
                  checked={formData.status}
                  onChange={handleChange}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FC8019]"></div>
              </label>
            </div>

            {/* Normal Orders Section */}
            <div className="mb-4 p-4 bg-gray-50 rounded-md border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-700">
                  Enable Normal Orders
                </label>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="isNormalOrderActive"
                    checked={formData.isNormalOrderActive}
                    onChange={handleChange}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FC8019]"></div>
                </label>
              </div>

              {formData.isNormalOrderActive && (
                <div className="flex items-center justify-between mt-3">
                  <label className="text-sm text-gray-700">
                    Define delivery charges at city level
                  </label>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      name="normalOrderChargeCalculation"
                      checked={formData.normalOrderChargeCalculation}
                      onChange={handleChange}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FC8019]"></div>
                  </label>
                </div>
              )}
            </div>

            {/* Custom Orders Section */}
            <div className="mb-6 p-4 bg-gray-50 rounded-md border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-700">
                  Enable Custom Orders
                </label>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="isCustomOrderActive"
                    checked={formData.isCustomOrderActive}
                    onChange={handleChange}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FC8019]"></div>
                </label>
              </div>

              {formData.isCustomOrderActive && (
                <div className="flex items-center justify-between mt-3">
                  <label className="text-sm text-gray-700">
                    Define delivery for custom orders at city level
                  </label>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      name="customOrderChargeCalculation"
                      checked={formData.customOrderChargeCalculation}
                      onChange={handleChange}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FC8019]"></div>
                  </label>
                </div>
              )}
            </div>

            {/* Modal Footer */}

          <div className="flex justify-end space-x-3 border-t pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!formData.name || formData.geofences.length === 0}
                className={`px-4 py-2 rounded-md text-sm font-medium text-white transition-colors ${
                  (!formData.name || formData.geofences.length === 0) 
                    ? 'bg-[#FC8019]/50 cursor-not-allowed' 
                    : 'bg-[#FC8019] hover:bg-[#e67317]'
                }`}
              >
                Add City
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddCityModal;