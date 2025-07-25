import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { FiSearch, FiZoomIn, FiZoomOut, FiCompass, FiList, FiTruck } from 'react-icons/fi';
import { MdMyLocation, MdRestaurant, MdDeliveryDining } from 'react-icons/md';
import { fetchOrdersLocationForMap, fetchRestauantsLocationForMap } from '../../apis/adminApis/adminFuntionsApi';
import restaurantMapicons from "../../../src/assets/restauratnMapicon.png";

// Initialize Mapbox token
mapboxgl.accessToken = 'pk.eyJ1IjoiYW1hcm5hZGg2NSIsImEiOiJjbWJ3NmlhcXgwdTh1MmlzMWNuNnNvYmZ3In0.kXrgLZhaz0cmbuCvyxOd6w';

const MapView = ({ agents = [] }) => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [lng, setLng] = useState(76.32);
  const [lat, setLat] = useState(9.995);
  const [zoom, setZoom] = useState(13);
  const [showList, setShowList] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [showRestaurants, setShowRestaurants] = useState(true);
  const [showDeliveries, setShowDeliveries] = useState(true);
  const [restaurants, setRestaurants] = useState([]);
  const [orders, setOrders] = useState([]);
  const [markers, setMarkers] = useState([]);

  const fetchRouteGeoJSON = async (start, end) => {
    const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${start[0]},${start[1]};${end[0]},${end[1]}?geometries=geojson&access_token=${mapboxgl.accessToken}`;
    const response = await fetch(url);
    const data = await response.json();
    if (!data.routes.length) return null;
    return data.routes[0].geometry;
  };

  const showRouteBetween = async (startLocation, endLocation) => {
    const start = [startLocation.lng, startLocation.lat];
    const end = [endLocation.lng, endLocation.lat];
    const routeGeoJSON = await fetchRouteGeoJSON(start, end);
    if (routeGeoJSON) {
      drawRouteOnMap(routeGeoJSON);
    } else {
      alert("Could not fetch route");
    }
  };

  const drawRouteOnMap = (routeGeoJSON) => {
    const map = mapRef.current;
    if (!map || !map.isStyleLoaded()) return;

    if (!map.getSource('route-line')) {
      map.addSource('route-line', {
        type: 'geojson',
        data: {
          type: 'Feature',
          geometry: routeGeoJSON
        }
      });

      map.addLayer({
        id: 'route-line',
        type: 'line',
        source: 'route-line',
        layout: {
          'line-join': 'round',
          'line-cap': 'round'
        },
        paint: {
          'line-color': '#ff5733',
          'line-width': 5
        }
      });
    } else {
      map.getSource('route-line').setData({
        type: 'Feature',
        geometry: routeGeoJSON
      });
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [restaurantsRes, ordersRes] = await Promise.all([
          fetchRestauantsLocationForMap(),
          fetchOrdersLocationForMap()
        ]);
        setRestaurants(restaurantsRes.data || []);
        setOrders(ordersRes.data || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  // Initialize map and add markers
useEffect(() => {
  if (!mapContainerRef.current) return;

  const map = new mapboxgl.Map({
    container: mapContainerRef.current,
    style: 'mapbox://styles/mapbox/streets-v11',
    center: [lng, lat],
    zoom: zoom,
  });

  map.addControl(new mapboxgl.NavigationControl(), 'top-right');
  map.addControl(new mapboxgl.ScaleControl(), 'bottom-left');
  mapRef.current = map;

  map.on('move', () => {
    setLng(map.getCenter().lng.toFixed(4));
    setLat(map.getCenter().lat.toFixed(4));
    setZoom(map.getZoom().toFixed(2));
  });

  const newMarkers = [];

  map.on('load', () => {
    // === Restaurants ===
    restaurants.forEach((restaurant) => {
      if (!restaurant?.lng || !restaurant?.lat) return;

      const el = document.createElement('div');
      el.className = 'custom-marker-restaurant';
      el.innerHTML = `
        <div style="
          width: 30px;
          height: 40px;
          background: #ff6b6b;
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 10px 0 0 10px;
        ">
          <div style="transform: rotate(45deg); color: white; font-weight: bold; font-size: 12px;">
            ${restaurant.name?.charAt(0).toUpperCase() || 'R'}
          </div>
        </div>
      `;

      const marker = new mapboxgl.Marker({ color: "red" })
        .setLngLat([restaurant.lng, restaurant.lat])
        .addTo(map);

      marker.getElement().addEventListener('click', () => {
        setSelectedLocation({ ...restaurant, type: 'restaurant' });
      });

      newMarkers.push({ marker, type: 'restaurant', id: restaurant.id });
    });

    // === Orders ===
    orders.forEach((order) => {
      if (!order?.lng || !order?.lat) return;

      const marker = new mapboxgl.Marker({ color: '#457b9d', scale: 0.8 })
        .setLngLat([order.lng, order.lat])
        .addTo(map);

      marker.getElement().addEventListener('click', () => {
        setSelectedLocation({ ...order, type: 'delivery' });
        if (order.restaurant?.location?.coordinates) {
          showRouteBetween(
            {
              lng: order.restaurant.location.coordinates[0],
              lat: order.restaurant.location.coordinates[1],
            },
            { lng: order.lng, lat: order.lat }
          );
        }
      });

      newMarkers.push({ marker, type: 'delivery', id: order.id });
    });

    // === Agents ===
    agents.forEach((agent) => {
      if (!agent?.location || agent.location.lat == null || agent.location.lng == null) return;

      const status = agent.currentStatus || "AVAILABLE";
      const color =
        status === 'AVAILABLE'
          ? '#2a9d8f'
          : status === 'ORDER_ASSIGNED'
          ? '#e63946'
          : status === 'PICKED_UP'
          ? '#f4a261'
          : '#ccc';

      const el = document.createElement('div');
      el.className = 'custom-marker-agent';
      el.innerHTML = `
        <div style="
          width: 24px;
          height: 24px;
          background: ${color};
          border-radius: 50%;
          border: 2px solid white;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
          font-size: 10px;
        ">
          ${agent.name?.charAt(0).toUpperCase() || 'A'}
        </div>
        <div style="
          position: absolute;
          bottom: -5px;
          left: 50%;
          transform: translateX(-50%);
          width: 0;
          height: 0;
          border-left: 5px solid transparent;
          border-right: 5px solid transparent;
          border-top: 5px solid ${color};
        "></div>
      `;

      const marker = new mapboxgl.Marker({element:el})
        .setLngLat([agent.location.lng, agent.location.lat])
        .addTo(map);

      marker.getElement().addEventListener('click', () => {
        setSelectedLocation({
          ...agent,
          type: 'agent',
          status: status,
          accuracy: agent.location.accuracy,
        });
      });

      newMarkers.push({ marker, type: 'agent', id: agent.id });
    });
  });

  setMarkers(newMarkers);

  return () => {
    newMarkers.forEach(({ marker }) => marker.remove());
    map.remove();
  };
}, [restaurants, orders, agents]);

  // Toggle marker visibility
  useEffect(() => {
    markers.forEach(({ marker, type }) => {
      if (type === 'restaurant') {
        marker.getElement().style.display = showRestaurants ? '' : 'none';
      } else if (type === 'delivery') {
        marker.getElement().style.display = showDeliveries ? '' : 'none';
      }
    });
  }, [showRestaurants, showDeliveries, markers]);

  // Fly to location
  const flyToLocation = (location) => {
    if (!location.lng || !location.lat) return;
    setSelectedLocation(location);
    mapRef.current?.flyTo({
      center: [location.lng, location.lat],
      zoom: 15,
      essential: true
    });
  };

  // Handle location search
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(searchQuery)}.json?access_token=${mapboxgl.accessToken}`
      );
      const data = await response.json();
      if (data.features?.length > 0) {
        const [longitude, latitude] = data.features[0].center;
        mapRef.current?.flyTo({
          center: [longitude, latitude],
          zoom: 14
        });
        new mapboxgl.Marker()
          .setLngLat([longitude, latitude])
          .addTo(mapRef.current);
      } else {
        alert('Location not found');
      }
    } catch (error) {
      console.error('Search error:', error);
      alert('Search failed. Please try again.');
    }
  };

  // Handle geolocation
  const handleLocateMe = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { longitude, latitude } = position.coords;
          mapRef.current?.flyTo({
            center: [longitude, latitude],
            zoom: 14
          });
          new mapboxgl.Marker({ color: '#4285F4' })
            .setLngLat([longitude, latitude])
            .addTo(mapRef.current);
        },
        (error) => {
          console.error('Geolocation error:', error);
          alert('Could not get your location. Please ensure location permissions are granted.');
        }
      );
    } else {
      alert('Geolocation is not supported by your browser.');
    }
  };

  return (
    <div className="relative flex-1 bg-gray-200">
      {/* Map container */}
      <div 
        ref={mapContainerRef} 
        className="absolute top-0 left-0 w-full h-full"
      />
      
      {/* Search box */}
      <div className="absolute top-4 left-4 right-4 z-10">
        <div className="flex bg-white rounded-lg shadow-md overflow-hidden max-w-md mx-auto">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Search for a place..."
            className="flex-1 px-4 py-2 focus:outline-none"
          />
          <button 
            onClick={handleSearch}
            className="px-4 bg-blue-500 text-white hover:bg-blue-600 transition-colors"
          >
            <FiSearch className="h-5 w-5" />
          </button>
        </div>
      </div>
      
      {/* Location List Sidebar */}
      {showList && (
        <div className="absolute top-20 left-4 w-64 bg-white rounded-lg shadow-lg z-10 max-h-[70vh] overflow-y-auto">
          <div className="p-4 border-b flex justify-between items-center">
            <h3 className="font-bold text-lg flex items-center">
              {showRestaurants ? (
                <MdRestaurant className="mr-2 text-red-500" />
              ) : (
                <MdDeliveryDining className="mr-2 text-blue-500" />
              )}
              {showRestaurants ? 'Nearby Restaurants' : 'Active Deliveries'}
            </h3>
            <div className="flex space-x-2">
              <button 
                onClick={() => setShowRestaurants(!showRestaurants)}
                className={`p-1 rounded ${showRestaurants ? 'bg-red-100 text-red-500' : 'bg-gray-100'}`}
                title="Toggle restaurants"
              >
                <MdRestaurant className="h-4 w-4" />
              </button>
              <button 
                onClick={() => setShowDeliveries(!showDeliveries)}
                className={`p-1 rounded ${showDeliveries ? 'bg-blue-100 text-blue-500' : 'bg-gray-100'}`}
                title="Toggle deliveries"
              >
                <FiTruck className="h-4 w-4" />
              </button>
            </div>
          </div>
          
          <ul className="divide-y divide-gray-200">
            {showRestaurants ? (
              restaurants.map(restaurant => (
                <li 
                  key={restaurant.id} 
                  className={`p-3 hover:bg-gray-50 cursor-pointer ${selectedLocation?.id === restaurant.id ? 'bg-blue-50' : ''}`}
                  onClick={() => flyToLocation({ ...restaurant, type: 'restaurant' })}
                >
                  <div className="font-medium">{restaurant.name}</div>
                  <div className="flex items-center mt-1 text-sm">
                    <span className="text-yellow-500">
                      {'★'.repeat(Math.floor(restaurant.rating || 0))}{'☆'.repeat(5 - Math.floor(restaurant.rating || 0))}
                    </span>
                    <span className="ml-1 text-gray-600">{restaurant.rating || 0}</span>
                  </div>
                </li>
              ))
            ) : (
              orders.map(order => (
                <li 
                  key={order.id} 
                  className={`p-3 hover:bg-gray-50 cursor-pointer ${selectedLocation?.id === order.id ? 'bg-blue-50' : ''}`}
                  onClick={() => flyToLocation({ ...order, type: 'delivery' })}
                >
                  <div className="font-medium">Order {order.orderId}</div>
                  <div className={`mt-1 text-sm ${
                    order.status === 'Delivered' ? 'text-green-500' : 
                    order.status === 'In Transit' ? 'text-blue-500' : 
                    'text-yellow-500'
                  }`}>
                    {order.status || 'Pending'}
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>
      )}
      
      {/* Location info */}
      <div className="absolute bottom-4 left-4 bg-white bg-opacity-90 rounded-lg p-2 text-xs shadow-md z-10">
        <div>Longitude: {lng}</div>
        <div>Latitude: {lat}</div>
        <div>Zoom: {zoom}</div>
      </div>
      
      {/* Custom controls */}
      <div className="absolute right-4 top-20 flex flex-col space-y-2 z-10">
        <button 
          onClick={() => setShowList(!showList)}
          className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
          title={showList ? "Hide list" : "Show list"}
        >
          <FiList className="h-5 w-5" />
        </button>
        <button 
          onClick={() => setShowRestaurants(!showRestaurants)}
          className={`p-2 rounded-full shadow-md transition-colors ${showRestaurants ? 'bg-red-100 text-red-500' : 'bg-white hover:bg-gray-100'}`}
          title="Toggle restaurants"
        >
          <MdRestaurant className="h-5 w-5" />
        </button>
        <button 
          onClick={() => setShowDeliveries(!showDeliveries)}
          className={`p-2 rounded-full shadow-md transition-colors ${showDeliveries ? 'bg-blue-100 text-blue-500' : 'bg-white hover:bg-gray-100'}`}
          title="Toggle deliveries"
        >
          <FiTruck className="h-5 w-5" />
        </button>
        <button 
          onClick={() => mapRef.current?.zoomIn()}
          className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
          title="Zoom in"
        >
          <FiZoomIn className="h-5 w-5" />
        </button>
        <button 
          onClick={() => mapRef.current?.zoomOut()}
          className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
          title="Zoom out"
        >
          <FiZoomOut className="h-5 w-5" />
        </button>
        <button 
          onClick={() => mapRef.current?.resetNorthPitch()}
          className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
          title="Reset bearing to north"
        >
          <FiCompass className="h-5 w-5" />
        </button>
        <button 
          onClick={handleLocateMe}
          className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
          title="Locate me"
        >
          <MdMyLocation className="h-5 w-5 text-blue-500" />
        </button>
      </div>

      {/* Selected Location Info */}
      {selectedLocation && (
        <div className="absolute bottom-20 right-4 w-64 bg-white rounded-lg shadow-lg z-10 p-4">
          <h3 className="font-bold text-lg">
            {selectedLocation.type === 'restaurant' ? (
              selectedLocation.name
            ) : selectedLocation.type === 'delivery' ? (
              `Order ${selectedLocation.orderId}`
            ) : (
              `Agent ${selectedLocation.name}`
            )}
          </h3>
          
          {selectedLocation.type === 'restaurant' && (
            <>
              <div className="flex items-center mt-1">
                <span className="text-yellow-500">
                  {'★'.repeat(Math.floor(selectedLocation.rating || 0))}{'☆'.repeat(5 - Math.floor(selectedLocation.rating || 0))}
                </span>
                <span className="ml-1 text-sm text-gray-600">{selectedLocation.rating || 0}</span>
              </div>
            </>
          )}
          
          {selectedLocation.type === 'delivery' && (
            <div className={`mt-1 text-sm ${
              selectedLocation.status === 'Delivered' ? 'text-green-500' : 
              selectedLocation.status === 'In Transit' ? 'text-blue-500' : 
              'text-yellow-500'
            }`}>
              Status: {selectedLocation.status || 'Pending'}
              <div className="text-sm text-gray-600">
                From: <span className="font-semibold">{selectedLocation?.restaurant?.name || 'Unknown'}</span>
              </div>
              <div className="text-sm text-gray-600">
                Customer Name: <span className="font-semibold">{selectedLocation?.customer?.name || 'Unknown'}</span>
              </div>
              <div className="text-sm text-gray-600">
                Customer Phone: <span className="font-semibold">{selectedLocation?.customer?.phone || 'Unknown'}</span>
              </div>
            </div>
          )}
          
          {selectedLocation.type === 'agent' && (
            <div className="mt-2 space-y-1">
              <div className="flex items-center">
                <div className={`w-3 h-3 rounded-full mr-2 ${
                  selectedLocation.currentStatus === 'AVAILABLE' ? 'bg-green-500' :
                  selectedLocation.currentStatus === 'ORDER_ASSIGNED' ? 'bg-red-500' : 'bg-yellow-500'
                }`}></div>
                <span className="text-sm capitalize">
                  {selectedLocation.currentStatus?.toLowerCase().replace('_', ' ') || 'Unknown status'}
                </span>
              </div>
              <div className="text-sm text-gray-600">
                Phone: {selectedLocation.phone || 'Unknown'}
              </div>
              {selectedLocation.accuracy && (
                <div className="text-sm text-gray-600">
                  Accuracy: {Math.round(selectedLocation.accuracy)} meters
                </div>
              )}
            </div>
          )}
          
          <button 
            onClick={() => setSelectedLocation(null)}
            className="mt-3 w-full py-1 bg-gray-100 hover:bg-gray-200 rounded text-sm transition-colors"
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
};

export default MapView;