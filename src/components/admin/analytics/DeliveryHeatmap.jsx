import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

// ✅ Use your own token or set via .env
mapboxgl.accessToken = 'pk.eyJ1IjoiYW1hcm5hZGg2NSIsImEiOiJjbWJ3NmlhcXgwdTh1MmlzMWNuNnNvYmZ3In0.kXrgLZhaz0cmbuCvyxOd6w';

const mockDeliveryData = {
  type: 'FeatureCollection',
  features: [
    { type: 'Feature', geometry: { type: 'Point', coordinates: [76.2999, 9.9816] }, properties: { delivery_count: 3 } },
    { type: 'Feature', geometry: { type: 'Point', coordinates: [76.3050, 9.9850] }, properties: { delivery_count: 5 } },
    { type: 'Feature', geometry: { type: 'Point', coordinates: [76.3085, 9.9900] }, properties: { delivery_count: 2 } },
    { type: 'Feature', geometry: { type: 'Point', coordinates: [76.3100, 9.9700] }, properties: { delivery_count: 7 } },
    { type: 'Feature', geometry: { type: 'Point', coordinates: [76.3120, 9.9740] }, properties: { delivery_count: 4 } },
    { type: 'Feature', geometry: { type: 'Point', coordinates: [76.2970, 9.9760] }, properties: { delivery_count: 6 } },
    { type: 'Feature', geometry: { type: 'Point', coordinates: [76.3150, 9.9800] }, properties: { delivery_count: 8 } },
  ],
};

const DeliveryHeatmap = () => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(76.2999); // Kochi longitude
  const [lat, setLat] = useState(9.9816);  // Kochi latitude
  const [zoom, setZoom] = useState(13);

  useEffect(() => {
    if (map.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v10', // ✅ White mode theme
      center: [lng, lat],
      zoom: zoom,
    });

    map.current.on('load', () => {
      map.current.addSource('deliveries', {
        type: 'geojson',
        data: mockDeliveryData,
      });

      // 🔥 Heatmap Layer
      map.current.addLayer({
        id: 'deliveries-heatmap',
        type: 'heatmap',
        source: 'deliveries',
        maxzoom: 15,
        paint: {
          'heatmap-weight': ['interpolate', ['linear'], ['get', 'delivery_count'], 0, 0, 10, 1],
          'heatmap-intensity': ['interpolate', ['linear'], ['zoom'], 0, 1, 13, 3],
          'heatmap-color': [
            'interpolate',
            ['linear'],
            ['heatmap-density'],
            0, 'rgba(0,0,255,0)',
            0.2, 'rgba(0,255,255,0.5)',
            0.4, 'rgba(0,255,0,0.5)',
            0.6, 'rgba(255,255,0,0.5)',
            0.8, 'rgba(255,165,0,0.8)',
            1, 'rgba(255,0,0,1)',
          ],
          'heatmap-radius': ['interpolate', ['linear'], ['zoom'], 0, 2, 15, 25],
          'heatmap-opacity': ['interpolate', ['linear'], ['zoom'], 14, 1, 15, 0],
        },
      });

      // 🟢 Circles for detailed zoom
      map.current.addLayer({
        id: 'delivery-points',
        type: 'circle',
        source: 'deliveries',
        minzoom: 14,
        paint: {
          'circle-radius': ['interpolate', ['linear'], ['zoom'], 14, 4, 16, 6],
          'circle-color': '#007cbf',
          'circle-stroke-color': '#fff',
          'circle-stroke-width': 1,
          'circle-opacity': ['interpolate', ['linear'], ['zoom'], 14, 0, 15, 1],
        },
      });
    });

    map.current.on('move', () => {
      setLng(map.current.getCenter().lng.toFixed(4));
      setLat(map.current.getCenter().lat.toFixed(4));
      setZoom(map.current.getZoom().toFixed(2));
    });

    return () => map.current.remove();
  }, []);

  return (
    <div className="h-screen w-screen flex flex-col">
      <div className="bg-white p-3 border-b flex justify-between items-center">
        <h2 className="font-semibold text-xl">Kochi Delivery Heatmap</h2>
        <span className="text-sm text-gray-600">
          Lat: {lat}, Lng: {lng}, Zoom: {zoom}
        </span>
      </div>
      <div ref={mapContainer} className="flex-grow" />
    </div>
  );
};

export default DeliveryHeatmap;
