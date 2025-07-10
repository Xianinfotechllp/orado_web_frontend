import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import { useNavigate } from "react-router-dom";
import { deleteGeofence, getGeofences } from "../../../../apis/adminApis/geoFenceApi";
import "mapbox-gl/dist/mapbox-gl.css";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";

mapboxgl.accessToken = "pk.eyJ1IjoiYW1hcm5hZGg2NSIsImEiOiJjbWJ3NmlhcXgwdTh1MmlzMWNuNnNvYmZ3In0.kXrgLZhaz0cmbuCvyxOd6w";

const GeofencePage = () => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const [geofences, setGeofences] = useState([]);
  const [activeGeofence, setActiveGeofence] = useState(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const navigate = useNavigate();

  const fetchGeofences = async () => {
    try {
      const { data } = await getGeofences();
      const transformed = data.map((item) => ({
        id: item._id,
        _id: item._id,
        name: item.regionName,
        description: item.regionDescription,
        points: item.geometry.coordinates[0],
        lastUpdated: new Date(item.updatedAt).toISOString().split("T")[0],
        showMenu: false
      }));
      setGeofences(transformed);
    } catch (err) {
      console.error("Failed to fetch geofences", err);
    }
  };

  useEffect(() => {
    fetchGeofences();
  }, []);

  // Initialize map
  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [76.2673, 9.9312],
      zoom: 13,
    });

    mapRef.current = map;

    // Add geocoder control
    const geocoder = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      mapboxgl: mapboxgl,
      placeholder: "Search for a location",
      countries: "IN",
      marker: false,
    });

    map.addControl(geocoder, "top-left");

    // Handle geocoder result
    geocoder.on("result", (e) => {
      const { center } = e.result;
      map.flyTo({ center, zoom: 14 });
    });

    map.on('load', () => {
      setIsMapLoaded(true);
      // Draw initial geofences if they exist
      if (geofences.length > 0) {
        drawGeofences();
      }
    });

    // Cleanup
    return () => {
      map.remove();
      setIsMapLoaded(false);
    };
  }, []);

  // Draw geofences on the map
  const drawGeofences = () => {
    if (!mapRef.current || !isMapLoaded) return;

    // Clear existing geofence layers
    geofences.forEach((_, index) => {
      if (mapRef.current.getLayer(`geofence-${index}`)) {
        mapRef.current.removeLayer(`geofence-${index}`);
      }
      if (mapRef.current.getSource(`geofence-${index}`)) {
        mapRef.current.removeSource(`geofence-${index}`);
      }
    });

    // Draw each geofence
    geofences.forEach((geofence, index) => {
      mapRef.current.addSource(`geofence-${index}`, {
        type: "geojson",
        data: {
          type: "Feature",
          geometry: {
            type: "Polygon",
            coordinates: [geofence.points],
          },
        },
      });

      mapRef.current.addLayer({
        id: `geofence-${index}`,
        type: "fill",
        source: `geofence-${index}`,
        layout: {},
        paint: {
          "fill-color": index === activeGeofence ? "green" : "yellow",
          "fill-opacity": 0.4,
          "fill-outline-color": index === activeGeofence ? "#1d4ed8" : "#555",
        },
      });
    });
  };

  useEffect(() => {
    if (isMapLoaded) {
      drawGeofences();
    }
  }, [geofences, activeGeofence, isMapLoaded]);

  useEffect(() => {
    const handleClickOutside = () => {
      setGeofences(prev => prev.map(g => ({ ...g, showMenu: false })));
    };
    
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const handleAddGeofence = () => {
    navigate("/admin/dashboard/geofence/add");
  };

  const HandledeleteGeofence = async (index) => {
    try {
      const geofenceToDelete = geofences[index];
      await deleteGeofence(geofenceToDelete.id);
      setGeofences((prev) => prev.filter((_, i) => i !== index));
      if (activeGeofence === index) setActiveGeofence(null);
    } catch (error) {
      console.error("Error deleting geofence:", error);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center p-4 border-b">
        <svg
          width="48"
          height="48"
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g style={{ mixBlendMode: "darken" }}>
            <path
              d="M48 24C48 10.7452 37.2548 0 24 0C10.7452 0 0 10.7452 0 24C0 37.2548 10.7452 48 24 48C37.2548 48 48 37.2548 48 24Z"
              fill="#E3E7EA"
            ></path>
            <g clipPath="url(#clip0_18_16)">
              <path
                d="M18 28V32H22V28M22 24V18L20 16L18 18V24M26 28V32H30V28M30 24V18L28 16L26 18V24M16 24V28H32V24H16Z"
                stroke="#111827"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>
          </g>
        </svg>
        <h2 className="text-xl font-bold ml-2">Geofence</h2>
      </div>

      <div className="flex flex-col md:flex-row h-full">
        {/* Geofence List */}
        <div className="w-full md:w-1/3 p-4 border-r overflow-y-auto">
          <div className="mb-4">
            <p className="text-gray-600 mb-4">
              A geofence is a virtual perimeter for a real-world geographic
              area. Different geofences can be assigned to a single city.
            </p>

            <div className="flex gap-2 mb-4">
              <button
                onClick={handleAddGeofence}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
              >
                Add Geofence
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {geofences.map((geofence, index) => (
              <div
                key={geofence._id}
                className={`p-3 border rounded cursor-pointer relative ${
                  activeGeofence === index
                    ? "bg-blue-50 border-blue-300"
                    : "bg-white"
                }`}
                onClick={() => {
                  setActiveGeofence(index);
                  if (geofence.points && geofence.points.length > 0) {
                    const bounds = new mapboxgl.LngLatBounds();
                    geofence.points.forEach((coord) => {
                      bounds.extend(coord);
                    });
                    mapRef.current.fitBounds(bounds, {
                      padding: 60,
                      maxZoom: 15,
                      duration: 1000,
                    });
                  }
                }}
              >
                <div className="flex justify-between items-start">
                  <h3 className="font-medium">{geofence.name}</h3>
                  
                  <div className="relative">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveGeofence(index);
                        const updatedGeofences = geofences.map((g, i) => ({
                          ...g,
                          showMenu: i === index ? !g.showMenu : false
                        }));
                        setGeofences(updatedGeofences);
                      }}
                      className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                      </svg>
                    </button>
                    
                    {geofence.showMenu && (
                      <div 
                        className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg z-10 border border-gray-200"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="py-1">
                          <button
                            onClick={() => {
                              if (window.confirm("Are you sure you want to delete this geofence?")) {
                                HandledeleteGeofence(index);
                              }
                            }}
                            className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                {geofence.description && (
                  <p className="text-sm text-gray-600 mt-1 truncate">
                    {geofence.description}
                  </p>
                )}
                <p className="text-xs text-gray-500 mt-2">
                  Last Updated:{" "}
                  <span className="font-medium">{geofence.lastUpdated}</span>
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Map */}
        <div className="w-full md:w-2/3 h-96 md:h-auto">
          <div ref={mapContainerRef} className="w-full h-full" />
        </div>
      </div>
    </div>
  );
};

export default GeofencePage;