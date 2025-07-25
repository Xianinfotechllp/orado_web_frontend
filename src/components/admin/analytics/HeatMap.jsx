// Heatmap.jsx
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = 'pk.eyJ1IjoiYW1hcm5hZGg2NSIsImEiOiJjbWJ3NmlhcXgwdTh1MmlzMWNuNnNvYmZ3In0.kXrgLZhaz0cmbuCvyxOd6w';

const Heatmap = () => {
  const mapContainer = useRef(null);
  const mapRef = useRef(null);
  const [selectedStyle, setSelectedStyle] = useState('light');
  const [showStats, setShowStats] = useState(true);

  // ✅ Mock delivery points
  const points = [
    { lat: 12.9716, lng: 77.5946, weight: 1 },
    { lat: 12.9721, lng: 77.595, weight: 1 },
    { lat: 12.969, lng: 77.591, weight: 1 },
    { lat: 12.9685, lng: 77.5975, weight: 1 },
    { lat: 12.9732, lng: 77.592, weight: 1 },
    { lat: 12.9705, lng: 77.5925, weight: 1 },
    { lat: 12.9695, lng: 77.5942, weight: 1 },
    { lat: 12.971, lng: 77.596, weight: 1 },
    { lat: 12.9728, lng: 77.5958, weight: 1 },
    { lat: 12.9700, lng: 77.593, weight: 1 }
  ];

  const mapStyles = {
    light: 'mapbox://styles/mapbox/light-v11',
    streets: 'mapbox://styles/mapbox/streets-v12',
    satellite: 'mapbox://styles/mapbox/satellite-streets-v12'
  };

  useEffect(() => {
    if (!mapContainer.current) return;

    if (mapRef.current) {
      mapRef.current.remove(); // Remove previous map
    }

    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: mapStyles[selectedStyle],
      center: [77.5946, 12.9716], // Bangalore
      zoom: 12
    });

    mapRef.current = map;

    map.on('load', () => {
      map.addSource('orders', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: points.map(p => ({
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [p.lng, p.lat]
            },
            properties: {
              weight: p.weight
            }
          }))
        }
      });

      map.addLayer({
        id: 'orders-heat',
        type: 'heatmap',
        source: 'orders',
        maxzoom: 15,
        paint: {
          'heatmap-weight': ['get', 'weight'],
          'heatmap-intensity': 1,
          'heatmap-radius': 25,
          'heatmap-opacity': 0.8,
          'heatmap-color': [
            'interpolate',
            ['linear'],
            ['heatmap-density'],
            0, 'rgba(33,102,172,0)',
            0.2, 'rgb(103,169,207)',
            0.4, 'rgb(209,229,240)',
            0.6, 'rgb(253,219,199)',
            0.8, 'rgb(239,138,98)',
            1, 'rgb(178,24,43)'
          ]
        }
      });
    });

    return () => map.remove();
  }, [selectedStyle]);

  return (
    <div className="w-full max-w-6xl mx-auto p-6 bg-white rounded-xl shadow-xl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Delivery Heatmap</h2>
          <p className="text-gray-500">Live delivery density in Bangalore</p>
        </div>
        <div className="flex gap-4">
          <button
            onClick={() => setShowStats(!showStats)}
            className="bg-blue-100 px-4 py-2 rounded text-blue-700 hover:bg-blue-200"
          >
            {showStats ? 'Hide Stats' : 'Show Stats'}
          </button>
          <select
            value={selectedStyle}
            onChange={(e) => setSelectedStyle(e.target.value)}
            className="border px-3 py-2 rounded"
          >
            <option value="light">Light</option>
            <option value="streets">Streets</option>
            <option value="satellite">Satellite</option>
          </select>
        </div>
      </div>

      {showStats && (
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-500 text-white p-4 rounded-xl shadow">
            <p>Total Deliveries</p>
            <h3 className="text-xl font-bold">{points.length}</h3>
          </div>
          <div className="bg-green-500 text-white p-4 rounded-xl shadow">
            <p>Hot Zones</p>
            <h3 className="text-xl font-bold">3</h3>
          </div>
          <div className="bg-purple-500 text-white p-4 rounded-xl shadow">
            <p>Coverage Area</p>
            <h3 className="text-xl font-bold">12 km²</h3>
          </div>
          <div className="bg-orange-500 text-white p-4 rounded-xl shadow">
            <p>Avg Density</p>
            <h3 className="text-xl font-bold">8.3</h3>
          </div>
        </div>
      )}

      <div ref={mapContainer} className="w-full h-[500px] rounded-xl border shadow" />

      <div className="mt-4 text-sm text-gray-500 flex justify-between">
        <span>Last updated: {new Date().toLocaleTimeString()}</span>
        <span>Refresh every 5 minutes</span>
      </div>
    </div>
  );
};

export default Heatmap;
