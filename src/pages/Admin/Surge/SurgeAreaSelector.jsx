import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';

const SurgeAreaSelector = () => {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [currentShape, setCurrentShape] = useState(null);
  const [drawingMode, setDrawingMode] = useState(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPoint, setStartPoint] = useState(null);
  const [searchInput, setSearchInput] = useState('');
  const [surgeMultiplier, setSurgeMultiplier] = useState(1.5);
  const [surgeType, setSurgeType] = useState('high-demand');
  const [mapLoaded, setMapLoaded] = useState(false);
  const [surgeZones, setSurgeZones] = useState([]);

  // Helper functions for coordinate conversion
  const circleToPolygon = (center, radius, points = 32) => {
    const coordinates = [];
    for (let i = 0; i < points; i++) {
      const angle = (i * 2 * Math.PI) / points;
      const lat = center.lat + (radius / 111320) * Math.cos(angle);
      const lng = center.lng + (radius / (111320 * Math.cos(center.lat * (Math.PI / 180)))) * Math.sin(angle);
      coordinates.push([lng, lat]);
    }
    coordinates.push(coordinates[0]);
    return coordinates;
  };

  const rectangleToPolygon = (bounds) => {
    const ne = bounds.getNorthEast();
    const sw = bounds.getSouthWest();
    return [
      [ne.lng, ne.lat],
      [sw.lng, ne.lat],
      [sw.lng, sw.lat],
      [ne.lng, sw.lat],
      [ne.lng, ne.lat]
    ];
  };

  // Predefined locations
  const locations = {
    'delhi': [28.6139, 77.2090],
    'mumbai': [19.0760, 72.8777],
    'bangalore': [12.9716, 77.5946]
  };

  const surgeColors = {
    'high-demand': '#ef4444',
    'medium-demand': '#f97316',
    'event-based': '#8b5cf6'
  };

  // Load Leaflet
  useEffect(() => {
    const loadLeaflet = async () => {
      if (typeof window !== 'undefined') {
        // Load CSS
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        link.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
        link.crossOrigin = '';
        document.head.appendChild(link);

        // Load JS
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
        script.integrity = 'sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=';
        script.crossOrigin = '';
        script.onload = initMap;
        document.head.appendChild(script);
      }
    };

    const initMap = () => {
      if (mapRef.current && !map && window.L) {
        const leafletMap = window.L.map(mapRef.current).setView([28.6139, 77.2090], 11);
        
        window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors',
          maxZoom: 18
        }).addTo(leafletMap);

        setMap(leafletMap);
        setMapLoaded(true);
      }
    };

    loadLeaflet();

    return () => {
      if (map) {
        map.remove();
      }
    };
  }, []);

  // Drawing event handlers
  useEffect(() => {
    if (!map) return;

    const handleMouseDown = (e) => {
      if (!drawingMode) return;
      setIsDrawing(true);
      setStartPoint(e.latlng);
      if (currentShape) {
        map.removeLayer(currentShape);
        setCurrentShape(null);
      }
    };

    const handleMouseMove = (e) => {
      if (!isDrawing || !startPoint) return;
      if (currentShape) map.removeLayer(currentShape);
      
      const color = surgeColors[surgeType];
      let shape;

      if (drawingMode === 'circle') {
        const radius = startPoint.distanceTo(e.latlng);
        shape = window.L.circle(startPoint, {
          radius,
          color,
          fillColor: color,
          fillOpacity: 0.3,
          weight: 3
        }).addTo(map);
      } else if (drawingMode === 'rectangle') {
        const bounds = window.L.latLngBounds(startPoint, e.latlng);
        shape = window.L.rectangle(bounds, {
          color,
          fillColor: color,
          fillOpacity: 0.3,
          weight: 3
        }).addTo(map);
      }

      setCurrentShape(shape);
    };

    const handleMouseUp = async (e) => {
      if (!isDrawing || !startPoint) return;
      setIsDrawing(false);

      if (currentShape) {
        let polygonCoordinates;
        if (drawingMode === 'circle') {
          const radius = startPoint.distanceTo(e.latlng);
          polygonCoordinates = circleToPolygon(startPoint, radius);
        } else if (drawingMode === 'rectangle') {
          const bounds = currentShape.getBounds();
          polygonCoordinates = rectangleToPolygon(bounds);
        }

        const newZone = {
          id: Date.now(),
          type: surgeType,
          multiplier: surgeMultiplier,
          coordinates: polygonCoordinates
        };

        setSurgeZones(prev => [...prev, newZone]);
        await submitSurgeZone(newZone);
      }

      resetDrawingMode();
    };

    if (drawingMode) {
      map.on('mousedown', handleMouseDown);
      map.on('mousemove', handleMouseMove);
      map.on('mouseup', handleMouseUp);
      map.getContainer().style.cursor = 'crosshair';
    }

    return () => {
      map.off('mousedown', handleMouseDown);
      map.off('mousemove', handleMouseMove);
      map.off('mouseup', handleMouseUp);
      map.getContainer().style.cursor = '';
    };
  }, [map, drawingMode, isDrawing, startPoint, currentShape]);

  const resetDrawingMode = () => {
    setDrawingMode(null);
    setIsDrawing(false);
    setStartPoint(null);
    if (map) map.getContainer().style.cursor = '';
  };

  const startDrawing = (type) => {
    setDrawingMode(type);
  };

  const submitSurgeZone = async (zone) => {
    try {
      toast.success(`Created ${zone.type} zone with ${zone.multiplier}x multiplier`);
      console.log('Zone coordinates:', zone.coordinates);
    } catch (error) {
      toast.error('Failed to save zone');
      console.error(error);
    }
  };

  const searchLocation = () => {
    const query = searchInput.trim().toLowerCase();
    if (!query || !map) return;

    for (let city in locations) {
      if (city.includes(query)) {
        const [lat, lng] = locations[city];
        map.setView([lat, lng], 13);
        
        window.L.marker([lat, lng])
          .addTo(map)
          .bindPopup(`📍 ${city.charAt(0).toUpperCase() + city.slice(1)}`)
          .openPopup();
        return;
      }
    }
    toast.error('Location not found');
  };

  const clearAllZones = () => {
    if (!map) return;
    
    map.eachLayer(layer => {
      if (layer instanceof window.L.Circle || 
          layer instanceof window.L.Rectangle || 
          layer instanceof window.L.Marker) {
        map.removeLayer(layer);
      }
    });
    
    setSurgeZones([]);
    resetDrawingMode();
  };

  return (
    <div className="h-screen bg-gray-100 p-4">
      <div className="h-full bg-white rounded-xl shadow-lg overflow-hidden flex flex-col">
        <div className="bg-blue-600 text-white p-4">
          <h1 className="text-xl font-bold">⚡ Surge Area Selector</h1>
        </div>
        
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <div className="w-64 bg-gray-50 p-4 border-r overflow-y-auto">
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Search Location</h3>
                <div className="flex">
                  <input
                    type="text"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    placeholder="Enter city"
                    className="flex-1 border p-2 rounded-l"
                  />
                  <button 
                    onClick={searchLocation}
                    className="bg-blue-500 text-white px-3 rounded-r"
                  >
                    🔍
                  </button>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Drawing Tools</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => startDrawing('circle')}
                    className={`w-full p-2 rounded ${drawingMode === 'circle' ? 'bg-blue-100 border-blue-500 border' : 'bg-gray-100'}`}
                  >
                    ⭕ Draw Circle
                  </button>
                  <button
                    onClick={() => startDrawing('rectangle')}
                    className={`w-full p-2 rounded ${drawingMode === 'rectangle' ? 'bg-blue-100 border-blue-500 border' : 'bg-gray-100'}`}
                  >
                    ▭ Draw Rectangle
                  </button>
                  <button
                    onClick={clearAllZones}
                    className="w-full p-2 bg-red-100 text-red-600 rounded"
                  >
                    🗑️ Clear All
                  </button>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Surge Settings</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm mb-1">Multiplier</label>
                    <input
                      type="number"
                      min="1.0"
                      max="5.0"
                      step="0.1"
                      value={surgeMultiplier}
                      onChange={(e) => setSurgeMultiplier(parseFloat(e.target.value))}
                      className="w-full border p-2 rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-1">Type</label>
                    <select
                      value={surgeType}
                      onChange={(e) => setSurgeType(e.target.value)}
                      className="w-full border p-2 rounded"
                    >
                      {Object.keys(surgeColors).map(type => (
                        <option key={type} value={type}>
                          {type.replace('-', ' ')}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {surgeZones.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">Active Zones ({surgeZones.length})</h3>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {surgeZones.map((zone, i) => (
                      <div key={zone.id} className="p-2 border rounded text-sm">
                        <div className="flex justify-between">
                          <span>Zone {i + 1}</span>
                          <span className="font-bold">{zone.multiplier}x</span>
                        </div>
                        <div className="text-xs text-gray-500">{zone.type}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Map */}
          <div className="flex-1 relative">
            <div 
              ref={mapRef} 
              className="w-full h-full"
              style={{ minHeight: '400px' }}
            >
              {!mapLoaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mx-auto mb-2"></div>
                    <p>Loading map...</p>
                  </div>
                </div>
              )}
            </div>

            {isDrawing && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg">
                <p className="text-sm">Drawing {drawingMode}...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SurgeAreaSelector;