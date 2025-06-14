import React, { useState, useEffect, useRef } from 'react';

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
  const [areaInfo, setAreaInfo] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [surgeZones, setSurgeZones] = useState([]);

  // Predefined locations for India
  const locations = {
    'delhi': [28.6139, 77.2090],
    'mumbai': [19.0760, 72.8777],
    'bangalore': [12.9716, 77.5946],
    'chennai': [13.0827, 80.2707],
    'kolkata': [22.5726, 88.3639],
    'hyderabad': [17.3850, 78.4867],
    'pune': [18.5204, 73.8567],
    'jaipur': [26.9124, 75.7873],
    'ahmedabad': [23.0225, 72.5714],
    'kochi': [9.9312, 76.2673]
  };

  const surgeColors = {
    'high-demand': '#ef4444', // red
    'medium-demand': '#f97316', // orange
    'event-based': '#8b5cf6', // purple
    'weather-based': '#06b6d4', // cyan
    'airport-zone': '#eab308' // yellow
  };

  // Load Leaflet dynamically
  useEffect(() => {
    const loadLeaflet = async () => {
      if (typeof window !== 'undefined' && !window.L) {
        // Add Leaflet CSS
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.css';
        document.head.appendChild(link);

        // Add Leaflet JS
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js';
        script.onload = () => initMap();
        document.head.appendChild(script);
      } else if (window.L) {
        initMap();
      }
    };

    const initMap = () => {
      try {
        if (mapRef.current && !map) {
          const leafletMap = window.L.map(mapRef.current).setView([28.6139, 77.2090], 11);

          window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 18
          }).addTo(leafletMap);

          setMap(leafletMap);
          setMapLoaded(true);
        }
      } catch (error) {
        console.error('Error initializing map:', error);
      }
    };

    loadLeaflet();

    return () => {
      if (map) {
        map.remove();
      }
    };
  }, []);

  // Add event listeners when drawing mode changes
  useEffect(() => {
    if (!map) return;

    if (drawingMode) {
      map.on('mousedown', handleMapMouseDown);
      map.on('mousemove', handleMapMouseMove);
      map.on('mouseup', handleMapMouseUp);
      map.getContainer().style.cursor = 'crosshair';
    } else {
      map.off('mousedown', handleMapMouseDown);
      map.off('mousemove', handleMapMouseMove);
      map.off('mouseup', handleMapMouseUp);
      map.getContainer().style.cursor = '';
    }

    return () => {
      map.off('mousedown', handleMapMouseDown);
      map.off('mousemove', handleMapMouseMove);
      map.off('mouseup', handleMapMouseUp);
    };
  }, [map, drawingMode]);

  const handleMapMouseDown = (e) => {
    if (!drawingMode) return;
    
    setIsDrawing(true);
    setStartPoint(e.latlng);
    
    if (currentShape) {
      map.removeLayer(currentShape);
      setCurrentShape(null);
    }
  };

  const handleMapMouseMove = (e) => {
    if (!isDrawing || !startPoint || !map) return;
    
    if (currentShape) {
      map.removeLayer(currentShape);
    }
    
    let shape;
    const color = surgeColors[surgeType];
    
    if (drawingMode === 'circle') {
      const radius = startPoint.distanceTo(e.latlng);
      shape = window.L.circle(startPoint, {
        radius: radius,
        color: color,
        fillColor: color,
        fillOpacity: 0.3,
        weight: 3
      }).addTo(map);
    } else if (drawingMode === 'rectangle') {
      const bounds = window.L.latLngBounds(startPoint, e.latlng);
      shape = window.L.rectangle(bounds, {
        color: color,
        fillColor: color,
        fillOpacity: 0.3,
        weight: 3
      }).addTo(map);
    }
    
    setCurrentShape(shape);
  };

  const handleMapMouseUp = (e) => {
    if (!isDrawing || !startPoint || !map) return;
    
    setIsDrawing(false);
    
    if (currentShape) {
      let area, radius;
      
      if (drawingMode === 'circle') {
        radius = startPoint.distanceTo(e.latlng);
        const radiusKm = radius / 1000;
        area = Math.PI * radiusKm * radiusKm;
      } else if (drawingMode === 'rectangle') {
        const bounds = currentShape.getBounds();
        area = calculateRectangleArea(bounds);
      }

      // Add popup to shape
      const popupContent = `
        <div class="text-center p-2">
          <h4 class="font-bold text-lg mb-2">⚡ Surge Zone</h4>
          <p class="text-sm mb-1"><strong>Type:</strong> ${surgeType.replace('-', ' ')}</p>
          <p class="text-sm mb-1"><strong>Multiplier:</strong> ${surgeMultiplier}x</p>
          ${radius ? `<p class="text-sm mb-1"><strong>Radius:</strong> ${(radius/1000).toFixed(2)} km</p>` : ''}
          <p class="text-sm"><strong>Area:</strong> ${area.toFixed(2)} km²</p>
        </div>
      `;
      
      currentShape.bindPopup(popupContent);
      
      // Add to surge zones list
      const newZone = {
        id: Date.now(),
        type: surgeType,
        multiplier: surgeMultiplier,
        area: area.toFixed(2),
        shape: drawingMode,
        color: surgeColors[surgeType]
      };
      
      setSurgeZones(prev => [...prev, newZone]);
      setAreaInfo(newZone);
    }
    
    resetDrawingMode();
  };

  const calculateRectangleArea = (bounds) => {
    const ne = bounds.getNorthEast();
    const sw = bounds.getSouthWest();
    const width = ne.distanceTo(window.L.latLng(ne.lat, sw.lng));
    const height = ne.distanceTo(window.L.latLng(sw.lat, ne.lng));
    return (width * height) / 1000000;
  };

  const resetDrawingMode = () => {
    setDrawingMode(null);
    setIsDrawing(false);
    setStartPoint(null);
    if (map) {
      map.getContainer().style.cursor = '';
    }
  };

  const startDrawing = (type) => {
    if (!map) return;
    
    setDrawingMode(type);
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by this browser.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        
        if (map) {
          map.setView([lat, lng], 15);
          
          window.L.marker([lat, lng])
            .addTo(map)
            .bindPopup('📍 Your Current Location')
            .openPopup();
        }
      },
      (error) => {
        alert('Error getting location: ' + error.message);
      }
    );
  };

  const searchLocation = () => {
    const query = searchInput.trim().toLowerCase();
    if (!query) {
      alert('Please enter a location to search');
      return;
    }

    for (let city in locations) {
      if (city.includes(query) || query.includes(city)) {
        const [lat, lng] = locations[city];
        map.setView([lat, lng], 12);
        
        window.L.marker([lat, lng])
          .addTo(map)
          .bindPopup(`📍 ${city.charAt(0).toUpperCase() + city.slice(1)}`)
          .openPopup();
        
        return;
      }
    }

    alert('Location not found. Try: Delhi, Mumbai, Bangalore, Chennai, etc.');
  };

  const clearAllZones = () => {
    if (map) {
      if (currentShape) {
        map.removeLayer(currentShape);
        setCurrentShape(null);
      }
      
      map.eachLayer((layer) => {
        if (layer instanceof window.L.Marker || 
            layer instanceof window.L.Circle || 
            layer instanceof window.L.Rectangle) {
          map.removeLayer(layer);
        }
      });
    }

    setSurgeZones([]);
    setAreaInfo(null);
    resetDrawingMode();
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      searchLocation();
    }
  };

  return (
    <div className="h-screen bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 p-4">
      <div className="h-full bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white p-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-red-600/20 to-orange-600/20 animate-pulse"></div>
          <div className="relative z-10">
            <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
              ⚡ Surge Area Selector
            </h1>
            <p className="text-red-100">Define dynamic pricing zones with intelligent surge mapping</p>
          </div>
        </div>

        <div className="flex h-[calc(100%-120px)]">
          {/* Sidebar */}
          <div className="w-80 bg-gray-50/90 p-6 overflow-y-auto border-r border-gray-200">
            {/* Location Search */}
            <div className="bg-white rounded-xl p-4 shadow-lg mb-6 border border-gray-100 hover:shadow-xl transition-all duration-300">
              <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                📍 Location Search
              </h3>
              <div className="space-y-3">
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Search location (e.g., Delhi, Mumbai)"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
                />
                <div className="grid grid-cols-1 gap-2">
                  <button
                    onClick={getCurrentLocation}
                    className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 transform hover:scale-105 transition-all duration-300 shadow-lg"
                  >
                    📍 Use My Location
                  </button>
                  <button
                    onClick={searchLocation}
                    className="bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-3 rounded-lg font-semibold hover:from-green-600 hover:to-green-700 transform hover:scale-105 transition-all duration-300 shadow-lg"
                  >
                    🔍 Search Location
                  </button>
                </div>
              </div>
            </div>

            {/* Drawing Tools */}
            <div className="bg-white rounded-xl p-4 shadow-lg mb-6 border border-gray-100 hover:shadow-xl transition-all duration-300">
              <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                🎨 Drawing Tools
              </h3>
              <div className="space-y-3">
                <button
                  onClick={() => startDrawing('circle')}
                  disabled={drawingMode === 'circle'}
                  className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-3 rounded-lg font-semibold hover:from-red-600 hover:to-red-700 transform hover:scale-105 transition-all duration-300 shadow-lg disabled:opacity-50 disabled:transform-none"
                >
                  ⭕ Draw Circle Zone
                </button>
                <button
                  onClick={() => startDrawing('rectangle')}
                  disabled={drawingMode === 'rectangle'}
                  className="w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white px-4 py-3 rounded-lg font-semibold hover:from-purple-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-lg disabled:opacity-50 disabled:transform-none"
                >
                  ⬜ Draw Rectangle Zone
                </button>
                <button
                  onClick={clearAllZones}
                  className="w-full bg-gradient-to-r from-gray-500 to-gray-600 text-white px-4 py-3 rounded-lg font-semibold hover:from-gray-600 hover:to-gray-700 transform hover:scale-105 transition-all duration-300 shadow-lg"
                >
                  🗑️ Clear All Zones
                </button>
              </div>
            </div>

            {/* Surge Settings */}
            <div className="bg-white rounded-xl p-4 shadow-lg mb-6 border border-gray-100 hover:shadow-xl transition-all duration-300">
              <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                ⚙️ Surge Settings
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Surge Multiplier
                  </label>
                  <input
                    type="number"
                    value={surgeMultiplier}
                    onChange={(e) => setSurgeMultiplier(parseFloat(e.target.value))}
                    min="1.1"
                    max="5.0"
                    step="0.1"
                    className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
                  />
                  <p className="text-xs text-gray-500 mt-1">Price will be {surgeMultiplier}x normal rate</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Surge Type
                  </label>
                  <select
                    value={surgeType}
                    onChange={(e) => setSurgeType(e.target.value)}
                    className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
                  >
                    <option value="high-demand">High Demand</option>
                    <option value="medium-demand">Medium Demand</option>
                    <option value="event-based">Event Based</option>
                    <option value="weather-based">Weather Based</option>
                    <option value="airport-zone">Airport Zone</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Active Zones */}
            {surgeZones.length > 0 && (
              <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100">
                <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                  📊 Active Surge Zones ({surgeZones.length})
                </h3>
                <div className="space-y-3 max-h-40 overflow-y-auto">
                  {surgeZones.map((zone, index) => (
                    <div key={zone.id} className="p-3 rounded-lg border border-gray-200 bg-gray-50">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: zone.color }}
                          ></div>
                          <span className="font-medium text-sm">Zone {index + 1}</span>
                        </div>
                        <span className="text-xs font-bold text-red-600">{zone.multiplier}x</span>
                      </div>
                      <p className="text-xs text-gray-600">Type: {zone.type.replace('-', ' ')}</p>
                      <p className="text-xs text-gray-600">Area: {zone.area} km²</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Map Container */}
          <div className="flex-1 relative bg-gray-100">
            <div 
              ref={mapRef} 
              className="w-full h-full"
              style={{ minHeight: '400px' }}
            >
              {!mapLoaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p className="text-gray-600 font-medium">🗺️ Loading Interactive Map...</p>
                  </div>
                </div>
              )}
            </div>
            
            {/* Map Instructions */}
            {mapLoaded && !currentShape && (
              <div className="absolute top-4 left-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg border border-gray-200">
                <p className="text-sm text-gray-700 text-center">
                  <span className="font-semibold">Instructions:</span> Select a drawing tool, then click and drag on the map to create surge zones
                </p>
              </div>
            )}
            
            {/* Drawing Mode Indicator */}
            {drawingMode && (
              <div className="absolute top-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg border border-blue-600">
                <p className="text-sm font-semibold">
                  Drawing: {drawingMode === 'circle' ? '⭕ Circle' : '⬜ Rectangle'} Mode
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SurgeAreaSelector;