import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

mapboxgl.accessToken = 'pk.eyJ1IjoiYW1hcm5hZGg2NSIsImEiOiJjbWJ3NmlhcXgwdTh1MmlzMWNuNnNvYmZ3In0.kXrgLZhaz0cmbuCvyxOd6w';

const PolygonMap = ({ polygonCoordinates }) => {
  const mapContainer = useRef(null);
  const map = useRef(null);

  // Utility to get approximate center of polygon
  const getCenter = (coordinates) => {
    const lats = coordinates[0].map(coord => coord[1]);
    const lngs = coordinates[0].map(coord => coord[0]);
    const lat = (Math.min(...lats) + Math.max(...lats)) / 2;
    const lng = (Math.min(...lngs) + Math.max(...lngs)) / 2;
    return [lng, lat];
  };

  useEffect(() => {
    if (!mapContainer.current || !polygonCoordinates) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [76.32, 10.0],  // default center
      zoom: 12,
    });

    map.current.on('load', () => {
      map.current.addSource('polygon', {
        type: 'geojson',
        data: {
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: polygonCoordinates,
          },
        },
      });

      map.current.addLayer({
        id: 'polygon-fill',
        type: 'fill',
        source: 'polygon',
        paint: {
          'fill-color': '#3F51B5',
          'fill-opacity': 0.5,
        },
      });

      map.current.addLayer({
        id: 'polygon-outline',
        type: 'line',
        source: 'polygon',
        paint: {
          'line-color': '#3F51B5',
          'line-width': 2,
        },
      });

      // 🚀 Fly to the center of the polygon
      const center = getCenter(polygonCoordinates);
      map.current.flyTo({
        center,
        zoom: 14,
        speed: 1.5,
      });
    });

    return () => {
      if (map.current) map.current.remove();
    };
  }, [polygonCoordinates]);

  return (
    <div
      ref={mapContainer}
      style={{ width: '100%', height: '500px', border: '1px solid #ddd' }}
    />
  );
};

export default PolygonMap;
