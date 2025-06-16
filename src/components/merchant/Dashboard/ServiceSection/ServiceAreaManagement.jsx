import React, { useState, useEffect } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import AddServiceModal from "./AddServiceModal";
import RestaurantSlider from "../Slider/RestaurantSlider";
import { getServiceAreas } from "../../../../apis/restaurantApi";
import PolygonMap from "./PolygonMap";

// Set Mapbox access token
mapboxgl.accessToken = "pk.eyJ1IjoiYW1hcm5hZGg2NSIsImEiOiJjbWJ3NmlhcXgwdTh1MmlzMWNuNnNvYmZ3In0.kXrgLZhaz0cmbuCvyxOd6w";

const ServiceAreaManagement = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [restaurants, setRestaurants] = useState([]);
  const [serviceAreas, setServiceAreas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedArea, setSelectedArea] = useState(null);

  const fetchServiceAreas = async () => {
    if (!selectedRestaurant?.id) return;

    setLoading(true);
    try {
      const response = await getServiceAreas(selectedRestaurant.id);
      if (response.messageType === "success") {
        setServiceAreas(response.data || []);
      }
    } catch (error) {
      console.error("Error fetching service areas:", error);
      setServiceAreas([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedRestaurant?.id) {
      fetchServiceAreas();
    }
  }, [selectedRestaurant]);

  const handleAddService = () => {
    if (!selectedRestaurant) {
      alert("Please select a restaurant first");
      return;
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedArea(null);
  };

  const handleServiceAdded = () => {
    handleCloseModal();
    fetchServiceAreas();
  };

  const handleRestaurantSelect = (restaurant) => {
    setSelectedRestaurant(restaurant);
    setSelectedArea(null);
  };

  const handleRestaurantsLoad = (restaurantList) => {
    setRestaurants(restaurantList);
  };

  const handleEdit = (serviceArea) => {
    setSelectedArea(serviceArea);
    setIsModalOpen(true);
  };

  const handleDelete = async (serviceAreaId) => {
    if (window.confirm("Are you sure you want to delete this service area?")) {
      try {
        // TODO: Add delete API call here
        console.log("Delete service area:", serviceAreaId);
        await fetchServiceAreas();
      } catch (error) {
        console.error("Error deleting service area:", error);
      }
    }
  };

  const renderServiceAreas = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
        </div>
      );
    }

    if (!selectedRestaurant) {
      return (
        <div className="text-center py-8 text-gray-500">
          Please select a restaurant to view service areas
        </div>
      );
    }

    if (serviceAreas.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <div className="text-gray-400 mb-4">
            <svg
              className="w-16 h-16 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-600 mb-2">
            No Service Areas Found
          </h3>
          <p className="text-gray-500 mb-6">
            This restaurant doesn't have any service areas yet.
          </p>
          <button
            onClick={handleAddService}
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
          >
            <span className="flex items-center gap-2">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Add Service Area
            </span>
          </button>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-800">Service Areas</h3>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              {serviceAreas.length} area{serviceAreas.length !== 1 ? "s" : ""} found
            </span>
            <button
              onClick={handleAddService}
              className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
            >
              Add New Area
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {serviceAreas.map((area, index) => (
            <div
              key={area._id || index}
              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
            >
              <div className="h-64">
                <PolygonMap polygonCoordinates={area.coordinates} />
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium text-gray-800 mb-1">
                      {area.name || `Service Area ${index + 1}`}
                    </h4>
                    <p className="text-gray-500 text-sm">
                      ID: {area._id || 'N/A'}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(area)}
                      className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md transition-colors duration-200"
                      title="Edit service area"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDelete(area._id)}
                      className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition-colors duration-200"
                      title="Delete service area"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <>
      <RestaurantSlider
        onRestaurantSelect={handleRestaurantSelect}
        onRestaurantsLoad={handleRestaurantsLoad}
      />

      <div className="p-5">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          {renderServiceAreas()}
        </div>

        <AddServiceModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          restaurantId={selectedRestaurant?.id}
          onServiceAdded={handleServiceAdded}
          initialData={selectedArea}
        />
      </div>
    </>
  );
};

export default ServiceAreaManagement;