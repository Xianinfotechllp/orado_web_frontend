import React, { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

// Set your Mapbox access token
mapboxgl.accessToken = 'pk.eyJ1IjoiYW1hcm5hZGg2NSIsImEiOiJjbWJ3NmlhcXgwdTh1MmlzMWNuNnNvYmZ3In0.kXrgLZhaz0cmbuCvyxOd6w';

const PolygonMap = ({ polygonCoordinates, restaurantLocation, userLocation,restaurantName  }) => {
  const mapContainer = useRef(null);
  const map = useRef(null);

  // Calculate center of polygon
  const getCenter = (coordinates) => {
    const lats = coordinates[0].map(c => c[1]);
    const lngs = coordinates[0].map(c => c[0]);
    return [
      (Math.min(...lngs) + Math.max(...lngs)) / 2,
      (Math.min(...lats) + Math.max(...lats)) / 2
    ];
  };

  useEffect(() => {
    if (!mapContainer.current || !polygonCoordinates) return;

    // Initialize Map
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: getCenter(polygonCoordinates),
      zoom: 13,
    });

    map.current.on("load", () => {
      // Add polygon geojson
      map.current.addSource("service-area", {
        type: "geojson",
        data: {
          type: "Feature",
          geometry: {
            type: "Polygon",
            coordinates: polygonCoordinates,
          },
        },
      });

      // Fill layer
      map.current.addLayer({
        id: "service-area-fill",
        type: "fill",
        source: "service-area",
        paint: {
          "fill-color": "#FF5722",
          "fill-opacity": 0.4,
        },
      });

      // Outline layer
      map.current.addLayer({
        id: "service-area-outline",
        type: "line",
        source: "service-area",
        paint: {
          "line-color": "#FF5722",
          "line-width": 2,
        },
      });

      // Add restaurant location marker (if available)
     if (restaurantLocation?.length === 2) {



       map.current.flyTo({
    center: restaurantLocation,
    zoom: 12,          // zoom level you prefer
    speed: 1.5,        // animation speed (default is 1.2)
    curve: 1.42,       // smoothing of the animation
    essential: true    // this ensures animation happens even if user has prefers-reduced-motion enabled
  });
  // Create the marker
  const marker = new mapboxgl.Marker({ color: "green" })
    .setLngLat(restaurantLocation)
    .addTo(map.current);

  // Create a popup with restaurant name
  const popup = new mapboxgl.Popup({ offset: 25 }).setText(restaurantName);

  // Attach popup to marker
  marker.setPopup(popup).togglePopup();  // `togglePopup()` will open it by default
}

      // Add user location marker (if available)
      if (userLocation) {
        new mapboxgl.Marker({ color: "blue" })
          .setLngLat(userLocation)
          .addTo(map.current);
      }
    });

    return () => {
      if (map.current) map.current.remove();
    };
  }, [polygonCoordinates, restaurantLocation, userLocation]);

  return (
    <div
      ref={mapContainer}
      style={{ width: "100%", height: "500px", border: "1px solid #ddd" }}
    />
  );
};

export default PolygonMap;
