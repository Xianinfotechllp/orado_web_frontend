import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents, Popup } from "react-leaflet";
import axios from "axios";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import  LoadingScreen from "../utils/LoadingScreen"
const LocationPicker = ({ onSelectLocation = () => {}, initialCoordinates }) => {
  const [mapReady, setMapReady] = useState(false);

  // Custom marker icon
  const customIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    shadowSize: [41, 41]
  });

  function LocationMarker({ onSelectLocation, initialPosition }) {
    const [position, setPosition] = useState(initialPosition);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchAddress = async (lat, lng) => {
      try {
        // Solution 1: Use a proxy server
        const response = await axios.get(`/api/nominatim-proxy`, {
          params: { lat, lon: lng, format: 'json' },
          headers: {
            'Accept-Language': 'en'
          }
        });

        // Solution 2: If you can't use a proxy, add the app name to the URL
        // const response = await axios.get(
        //   `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&email=your@email.com`
        // );

        const address = response.data.address;
        return {
          latitude: lat,
          longitude: lng,
          street: address.road || address.pedestrian || "",
          city: address.city || address.town || address.village || address.county || "",
          state: address.state || address.region || "",
          zip: address.postcode || "",
          country: address.country || "",
          displayName: response.data.display_name,
        };
      } catch (error) {
        console.error("Error fetching address:", error);
        throw error;
      }
    };

    useMapEvents({
      async click(e) {
        setLoading(true);
        setError(null);
        setPosition(e.latlng);

        try {
          const { lat, lng } = e.latlng;
          const locationDetails = await fetchAddress(lat, lng);
          onSelectLocation(locationDetails);
        } catch (error) {
          setError("Failed to fetch address details. Please try again.");
        } finally {
          setLoading(false);
        }
      },
    });

    if (!position) return null;

    return (
      <Marker position={position} icon={customIcon}>
        {loading && (
          <Popup>
            <div className="flex items-center gap-2">
                <LoadingScreen/>
              <span>Loading address...</span>
            </div>
          </Popup>
        )}
        {error && (
          <Popup>
            <div className="text-red-500 text-sm">{error}</div>
          </Popup>
        )}
      </Marker>
    );
  }

  useEffect(() => {
    setMapReady(true);
  }, []);

  const handleLocateMe = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const locationDetails = {
              latitude,
              longitude,
              displayName: "Your current location"
            };
            onSelectLocation(locationDetails);
          } catch (error) {
            console.error("Geolocation error:", error);
          }
        },
        (error) => {
          console.error("Geolocation error:", error);
        }
      );
    }
  };

  if (!mapReady) {
    return (
      <div className="w-full h-[400px] flex items-center justify-center bg-gray-100 rounded-lg">
        <LoadingScreen/>
      </div>
    );
  }

  return (
    <div className="w-full h-[400px] rounded-lg overflow-hidden border border-gray-200 shadow-sm relative">
      <MapContainer
        center={initialCoordinates || [9.9312, 76.2673]}
        zoom={initialCoordinates ? 15 : 13}
        style={{ height: "100%", width: "100%" }}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker 
          onSelectLocation={onSelectLocation} 
          initialPosition={initialCoordinates ? L.latLng(initialCoordinates[0], initialCoordinates[1]) : null}
        />
      </MapContainer>

      <div className="absolute top-4 right-4 z-[1000] space-y-2">
        <button
          onClick={handleLocateMe}
          className="bg-white p-2 rounded-full shadow-md hover:bg-gray-50 transition-colors"
          title="Locate me"
          aria-label="Use my current location"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
      </div>

      <div className="absolute bottom-4 left-0 right-0 flex justify-center z-[1000]">
        <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm text-sm text-gray-700">
          Click on the map to select a location
        </div>
      </div>
    </div>
  );
};

export default LocationPicker;