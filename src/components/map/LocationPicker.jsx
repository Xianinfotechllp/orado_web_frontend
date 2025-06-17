import React, { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import axios from "axios";
import "mapbox-gl/dist/mapbox-gl.css";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";

mapboxgl.accessToken = "pk.eyJ1IjoiYW1hcm5hZGg2NSIsImEiOiJjbWJ3NmlhcXgwdTh1MmlzMWNuNnNvYmZ3In0.kXrgLZhaz0cmbuCvyxOd6w";

export default function LocationPicker({ onSelectLocation }) {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const geocoderRef = useRef(null);

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [77.5946, 12.9716], // Bangalore coordinates
      zoom: 5,
    });

    mapRef.current = map;

    // Geocoder control (India only)
    const geocoder = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      mapboxgl: mapboxgl,
      placeholder: "Search location in India",
      countries: "IN",   // Limit to India 🇮🇳
      marker: false,
    });

    map.addControl(geocoder, 'top-left');
    geocoderRef.current = geocoder;

    geocoder.on("result", (e) => {
      handleGeocoderResult(e.result);
    });

    // On map click
    map.on("click", async (e) => {
      const { lng, lat } = e.lngLat;
      await handleLocationSelection(lng, lat);
    });

    return () => map.remove();
  }, [onSelectLocation]);

  const handleGeocoderResult = (result) => {
    const { center, place_name, context } = result;

    // Remove old marker
    if (markerRef.current) markerRef.current.remove();

    // Add new marker
    const marker = new mapboxgl.Marker().setLngLat(center).addTo(mapRef.current);
    markerRef.current = marker;

    const city = context?.find(c => c.id.includes("place"))?.text || "";
    const state = context?.find(c => c.id.includes("region"))?.text || "";
    const zip = context?.find(c => c.id.includes("postcode"))?.text || "";

    onSelectLocation({
      latitude: center[1],
      longitude: center[0],
      street: place_name,
      city,
      state,
      zip,
    });

    mapRef.current.flyTo({ center, zoom: 14 });
  };

  const handleLocationSelection = async (lng, lat) => {
    if (markerRef.current) markerRef.current.remove();

    const marker = new mapboxgl.Marker().setLngLat([lng, lat]).addTo(mapRef.current);
    markerRef.current = marker;

    try {
      const response = await axios.get(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json`,
        { 
          params: { 
            access_token: mapboxgl.accessToken,
            types: 'address,place,locality,neighborhood,region,postcode'
          } 
        }
      );

      const place = response.data.features[0];
      const address = place?.place_name || `Coordinates: ${lat.toFixed(5)}, ${lng.toFixed(5)}`;

      const context = place?.context || [];
      const city = context.find(c => c.id.includes("place"))?.text || "";
      const state = context.find(c => c.id.includes("region"))?.text || "";
      const zip = context.find(c => c.id.includes("postcode"))?.text || "";

      // Update the geocoder input with the address
      if (geocoderRef.current) {
        geocoderRef.current.setInput(address);
      }

      onSelectLocation({
        latitude: lat,
        longitude: lng,
        street: address,
        city,
        state,
        zip,
      });

      mapRef.current.flyTo({ center: [lng, lat], zoom: 14 });
    } catch (err) {
      console.error("Reverse geocoding failed", err);
      const fallbackAddress = `Coordinates: ${lat.toFixed(5)}, ${lng.toFixed(5)}`;
      
      if (geocoderRef.current) {
        geocoderRef.current.setInput(fallbackAddress);
      }

      onSelectLocation({
        latitude: lat,
        longitude: lng,
        street: fallbackAddress,
        city: "",
        state: "",
        zip: "",
      });
    }
  };

  const locateMe = async () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported by your browser.");
      return;
    }

    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        });
      });

      const { latitude, longitude } = position.coords;
      
      // Fly to the location
      mapRef.current.flyTo({ 
        center: [longitude, latitude], 
        zoom: 14,
        essential: true
      });

      // Handle the location selection (will update marker and address)
      await handleLocationSelection(longitude, latitude);

    } catch (error) {
      console.error("Error getting location:", error);
      alert("Unable to retrieve your location. Please ensure location services are enabled.");
    }
  };

  return (
    <div className="w-full h-full rounded-lg relative">
      <div className="absolute top-2 right-2 z-10 flex gap-2">
        <button
          onClick={locateMe}
          className="bg-blue-600 text-white px-3 py-1 rounded-md shadow hover:bg-blue-700 transition-colors flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Locate Me
        </button>
      </div>
      <div ref={mapContainerRef} className="w-full h-full rounded-lg" />
    </div>
  );
}