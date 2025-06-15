import React, { useState, useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import AddServiceModal from "./AddServiceModal";
import RestaurantSlider from "../Slider/RestaurantSlider";
import { getServiceAreas } from "../../../../apis/restaurantApi";

// Set Mapbox access token
mapboxgl.accessToken =
  "pk.eyJ1IjoiYW1hcm5hZGg2NSIsImEiOiJjbWJ3NmlhcXgwdTh1MmlzMWNuNnNvYmZ3In0.kXrgLZhaz0cmbuCvyxOd6w";

const ServiceAreaManagement = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [restaurants, setRestaurants] = useState([]);
  const [serviceAreas, setServiceAreas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);

  const mapContainer = useRef(null);
  const map = useRef(null);

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [76.32, 10.0],
      zoom: 12,
    });

    map.current.on("load", () => {
      setMapLoaded(true);
    });

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!mapLoaded || !map.current) return;

    // Clear existing layers and sources
    const existingLayers = map.current.getStyle().layers || [];
    existingLayers.forEach((layer) => {
      if (layer.id.startsWith("service-area-")) {
        map.current.removeLayer(layer.id);
      }
    });

    const existingSources = Object.keys(map.current.getStyle().sources);
    existingSources.forEach((source) => {
      if (source.startsWith("service-area-")) {
        map.current.removeSource(source);
      }
    });

    if (serviceAreas.length === 0) return;

    const bounds = new mapboxgl.LngLatBounds();
    let hasBounds = false;

    serviceAreas.forEach((area, index) => {
      try {
        const sourceId = `service-area-${index}`;
        const layerId = `service-area-layer-${index}`;

        // Handle both possible data structures
        const coordinates = area.geometry?.coordinates || area.coordinates;
        const properties = area.properties || {};

        if (!coordinates || !Array.isArray(coordinates)) {
          console.error("Invalid coordinates format:", coordinates);
          return;
        }

        map.current.addSource(sourceId, {
          type: "geojson",
          data: {
            type: "Feature",
            geometry: {
              type: "Polygon",
              coordinates: coordinates,
            },
            properties: properties,
          },
        });

        map.current.addLayer({
          id: layerId,
          type: "fill",
          source: sourceId,
          layout: {},
          paint: {
            "fill-color": "#0080ff",
            "fill-opacity": 0.3,
          },
        });

        map.current.addLayer({
          id: `${layerId}-outline`,
          type: "line",
          source: sourceId,
          layout: {},
          paint: {
            "line-color": "#0080ff",
            "line-width": 2,
          },
        });

        coordinates[0].forEach((coord) => {
          bounds.extend(coord);
          hasBounds = true;
        });
      } catch (error) {
        console.error("Error rendering service area:", error);
      }
    });

    if (hasBounds) {
      map.current.fitBounds(bounds, {
        padding: 50,
        maxZoom: 14,
      });
    }
  }, [serviceAreas, mapLoaded]);

  useEffect(() => {
    if (selectedRestaurant?.id) {
      fetchServiceAreas();
    }
  }, [selectedRestaurant]);

  const fetchServiceAreas = async () => {
    if (!selectedRestaurant?.id) return;

    setLoading(true);
    try {
      const response = await getServiceAreas(selectedRestaurant.id);
      if (response.messageType === "success") {
        // Normalize the data structure
        const normalizedAreas =
          response.data?.map((area) => {
            if (area.geometry) return area;
            return {
              geometry: {
                type: "Polygon",
                coordinates: area.coordinates,
              },
              properties: {
                name: area.name,
                description: area.description,
                ...(area.properties || {}),
              },
            };
          }) || [];

        setServiceAreas(normalizedAreas);
      }
    } catch (error) {
      console.error("Error fetching service areas:", error);
      setServiceAreas([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddService = () => {
    if (!selectedRestaurant) {
      alert("Please select a restaurant first");
      return;
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleServiceAdded = () => {
    handleCloseModal();
    fetchServiceAreas();
  };

  const handleRestaurantSelect = (restaurant) => {
    setSelectedRestaurant(restaurant);
  };

  const handleRestaurantsLoad = (restaurantList) => {
    setRestaurants(restaurantList);
  };

  const handleEdit = (serviceArea) => {
    console.log("Edit service area:", serviceArea);
  };

  const handleDelete = (serviceAreaId) => {
    if (window.confirm("Are you sure you want to delete this service area?")) {
      console.log("Delete service area:", serviceAreaId);
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
      <div className="space-y-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Service Areas</h3>
          <span className="text-sm text-gray-600">
            {serviceAreas.length} area{serviceAreas.length !== 1 ? "s" : ""}{" "}
            found
          </span>
        </div>
        {serviceAreas.length > 0 && (
          <div
            ref={mapContainer}
            className="w-full h-96 rounded-lg border border-gray-200 mb-4"
          >
            {!mapLoaded && (
              <div className="flex items-center justify-center h-full bg-gray-50">
                <div className="text-gray-500">Loading map...</div>
              </div>
            )}
          </div>
        )}

        {serviceAreas.map((area, index) => (
          <div
            key={area._id || index}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-4"
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h4 className="font-medium text-gray-800 mb-2">
                  {area.name || `Service Area ${index + 1}`}
                </h4>
                {area.description && (
                  <p className="text-gray-600 text-sm mb-2">
                    {area.description}
                  </p>
                )}
                {area.radius && (
                  <p className="text-gray-500 text-sm">
                    Radius: {area.radius} km
                  </p>
                )}
                {area.areas && area.areas.length > 0 && (
                  <div className="mt-2">
                    <span className="text-sm text-gray-500">Areas: </span>
                    <span className="text-sm text-gray-700">
                      {area.areas.join(", ")}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex gap-2 ml-4">
                <button
                  onClick={() => handleEdit(area)}
                  className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
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
                  className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1"
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
        ))}
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
        />
      </div>
    </>
  );
};

export default ServiceAreaManagement;
