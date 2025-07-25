
import React, { useEffect, useRef, useState, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { FiSearch, FiZoomIn, FiZoomOut, FiCompass, FiList, FiTruck } from 'react-icons/fi';
import { MdMyLocation, MdRestaurant, MdDeliveryDining } from 'react-icons/md';
import { fetchOrdersLocationForMap, fetchRestauantsLocationForMap } from '../../apis/adminApis/adminFuntionsApi';
import socket from '../../services/socket';

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
  const restaurantMarkersRef = useRef({});
  const orderMarkersRef = useRef({});
  const agentMarkersRef = useRef({});
  const [liveAgents, setLiveAgents] = useState(agents);
  const routeLayerRef = useRef(null);
  const [socketConnected, setSocketConnected] = useState(false);

  const fetchRouteGeoJSON = useCallback(async (start, end) => {
    const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${start[0]},${start[1]};${end[0]},${end[1]}?geometries=geojson&access_token=${mapboxgl.accessToken}`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      if (!data.routes.length) return null;
      return data.routes[0].geometry;
    } catch (error) {
      console.error("Error fetching route:", error);
      return null;
    }
  }, []);

  const showRouteBetween = useCallback(async (startLocation, endLocation) => {
    const start = [startLocation.lng, startLocation.lat];
    const end = [endLocation.lng, endLocation.lat];
    const routeGeoJSON = await fetchRouteGeoJSON(start, end);
    
    if (routeGeoJSON) {
      drawRouteOnMap(routeGeoJSON);
    } else {
      console.error("Could not fetch route");
    }
  }, [fetchRouteGeoJSON]);

  const drawRouteOnMap = useCallback((routeGeoJSON) => {
    const map = mapRef.current;
    if (!map || !map.isStyleLoaded()) return;

    // Remove existing route if any
    if (routeLayerRef.current) {
      if (map.getLayer('route-line')) map.removeLayer('route-line');
      if (map.getSource('route-line')) map.removeSource('route-line');
      routeLayerRef.current = null;
    }

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

    routeLayerRef.current = true;
  }, []);

  const updateAgentMarkerStatus = useCallback((agentId, status) => {
    if (!agentMarkersRef.current[agentId]) return;
    
    const marker = agentMarkersRef.current[agentId];
    const el = marker.getElement();
    
    const color =
      status === 'AVAILABLE'
        ? '#2a9d8f'
        : status === 'ORDER_ASSIGNED'
        ? '#e63946'
        : status === 'PICKED_UP'
        ? '#f4a261'
        : '#ccc';
    
    // Update the marker color
    const markerDiv = el.querySelector('div');
    const pointerDiv = el.querySelector('div + div');
    
    if (markerDiv) markerDiv.style.background = color;
    if (pointerDiv) pointerDiv.style.borderTopColor = color;
  }, []);

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [lng, lat],
      zoom: zoom,
      attributionControl: false
    });

    // Disable mapbox telemetry
    map._requestManager._skuToken = '';
    
    map.addControl(new mapboxgl.NavigationControl(), 'top-right');
    map.addControl(new mapboxgl.ScaleControl(), 'bottom-left');
    mapRef.current = map;

    map.on('move', () => {
      setLng(map.getCenter().lng.toFixed(4));
      setLat(map.getCenter().lat.toFixed(4));
      setZoom(map.getZoom().toFixed(2));
    });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Socket connection and event handlers
 useEffect(() => {
  const handleLocationUpdate = (data) => {
    setLiveAgents(prev => {
      // Update existing agent or add new one
      const existingIndex = prev.findIndex(a => a.id === data.agentId);
      
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = { 
          ...updated[existingIndex],
          location: { lat: data.lat, lng: data.lng },
          currentStatus: data.currentStatus || updated[existingIndex].currentStatus,
          accuracy: data.accuracy || updated[existingIndex].accuracy
        };
        return updated;
      } else {
        return [
          ...prev,
          {
            id: data.agentId,
            name: `Agent ${data.agentId}`,
            location: { lat: data.lat, lng: data.lng },
            currentStatus: data.currentStatus || 'AVAILABLE',
            accuracy: data.accuracy || null
          }
        ];
      }
    });
  };

  socket.on('admin:updateLocation', handleLocationUpdate);

  return () => {
    socket.off('admin:updateLocation', handleLocationUpdate);
  };
}, []);
  // Fetch initial data
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
useEffect(() => {
  console.log('Attempting to connect to socket...');
  socket.on('connect', () => {
    console.log('Socket connected:', socket.id);
    setSocketConnected(true);
  });
  
  socket.on('disconnect', () => {
    console.log('Socket disconnected');
    setSocketConnected(false);
  });
  
  socket.on('connect_error', (err) => {
    console.error('Socket connection error:', err);
  });

  // Your existing location update handler
const handleLocationUpdate = (data) => {
  if (!mounted) return;
  
  setLiveAgents(prev => {
    const existingIndex = prev.findIndex(a => a.id === data.agentId);
    
    if (existingIndex >= 0) {
      const updated = [...prev];
      const prevLocation = updated[existingIndex].location;
      const newLocation = { lat: data.lat, lng: data.lng };
      
      // Animate the marker if it exists
      if (agentMarkersRef.current[data.agentId]) {
        animateMarkerMovement(
          agentMarkersRef.current[data.agentId],
          newLocation,
          1000 // 1 second animation
        );
      }
      
      updated[existingIndex] = { 
        ...updated[existingIndex],
        location: newLocation,
        currentStatus: data.currentStatus || updated[existingIndex].currentStatus,
        accuracy: data.accuracy || updated[existingIndex].accuracy,
        deviceInfo: data.deviceInfo || updated[existingIndex].deviceInfo,
        name: data.name || updated[existingIndex].name
      };
      return updated;
    } else {
      // New agent - create marker
      createAgentMarker({
        id: data.agentId,
        name: data.name || `Agent ${data.agentId}`,
        location: { lat: data.lat, lng: data.lng },
        currentStatus: data.currentStatus || 'AVAILABLE',
        accuracy: data.accuracy || null,
        deviceInfo: data.deviceInfo || null
      });
      
      return [
        ...prev,
        {
          id: data.agentId,
          name: data.name || `Agent ${data.agentId}`,
          location: { lat: data.lat, lng: data.lng },
          currentStatus: data.currentStatus || 'AVAILABLE',
          accuracy: data.accuracy || null,
          deviceInfo: data.deviceInfo || null
        }
      ];
    }
  });
};

  socket.on('admin:updateLocation', handleLocationUpdate);

  return () => {
    socket.off('admin:updateLocation', handleLocationUpdate);
    socket.off('connect');
    socket.off('disconnect');
    socket.off('connect_error');
  };
}, []);

  // Add restaurant markers
  useEffect(() => {
    if (!mapRef.current || !restaurants.length) return;

    const map = mapRef.current;
    
    // Only add markers if the map is loaded
    if (!map.isStyleLoaded()) {
      map.on('load', () => addRestaurantMarkers());
    } else {
      addRestaurantMarkers();
    }

    function addRestaurantMarkers() {
      // Clear existing restaurant markers
      Object.values(restaurantMarkersRef.current).forEach(marker => marker.remove());
      restaurantMarkersRef.current = {};

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

        const marker = new mapboxgl.Marker({ element: el })
          .setLngLat([restaurant.lng, restaurant.lat])
          .addTo(map);

        marker.getElement().addEventListener('click', () => {
          setSelectedLocation({ ...restaurant, type: 'restaurant' });
        });

        restaurantMarkersRef.current[restaurant.id] = marker;
      });
    }

    return () => {
      Object.values(restaurantMarkersRef.current).forEach(marker => marker.remove());
      restaurantMarkersRef.current = {};
    };
  }, [restaurants]);

  // Add order markers
  useEffect(() => {
    if (!mapRef.current || !orders.length) return;

    const map = mapRef.current;
    
    if (!map.isStyleLoaded()) {
      map.on('load', () => addOrderMarkers());
    } else {
      addOrderMarkers();
    }

    function addOrderMarkers() {
      // Clear existing order markers
      Object.values(orderMarkersRef.current).forEach(marker => marker.remove());
      orderMarkersRef.current = {};

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

        orderMarkersRef.current[order.id] = marker;
      });
    }

    return () => {
      Object.values(orderMarkersRef.current).forEach(marker => marker.remove());
      orderMarkersRef.current = {};
    };
  }, [orders]);

  // Add agent markers
// Socket connection and event handlers - REPLACE YOUR EXISTING USEFFECT WITH THIS
useEffect(() => {
  let mounted = true; // Define mounted here

  const onConnect = () => {
    console.log('Socket connected:', socket.id);
    setSocketConnected(true);
  };
  
  const onDisconnect = () => {
    console.log('Socket disconnected');
    setSocketConnected(false);
  };

  socket.on('connect', onConnect);
  socket.on('disconnect', onDisconnect);
  socket.on('connect_error', (err) => {
    console.error('Socket connection error:', err);
  });

  const handleLocationUpdate = (data) => {
    if (!mounted) return; // Now this will work
    
    // Rest of your handleLocationUpdate implementation
    // ...
  };

  socket.on('admin:updateLocation', handleLocationUpdate);

  return () => {
    mounted = false; // Cleanup
    socket.off('admin:updateLocation', handleLocationUpdate);
    socket.off('connect', onConnect);
    socket.off('disconnect', onDisconnect);
  };
}, [updateAgentMarkerStatus]);

// Add this helper function to your component
const createAgentMarker = (agent) => {
  if (!mapRef.current || !agent?.location) return;

  const status = agent.currentStatus || "AVAILABLE";
  const color =
    status === 'AVAILABLE' ? '#2a9d8f' :
    status === 'ORDER_ASSIGNED' ? '#e63946' :
    status === 'PICKED_UP' ? '#f4a261' : '#ccc';

  // Use first name initial if name is long
  const displayInitial = agent.name 
    ? agent.name.split(' ')[0].charAt(0).toUpperCase()
    : 'A';

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
      transition: transform 0.5s ease-out;
    ">
      ${displayInitial}
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

  const marker = new mapboxgl.Marker({ 
    element: el,
    // Enable marker rotation
    rotationAlignment: 'map',
    pitchAlignment: 'map'
  })
    .setLngLat([agent.location.lng, agent.location.lat])
    .addTo(mapRef.current);

  // Store the marker element for animation
  marker.getElement().style.transition = 'transform 0.5s ease-out';
  
  marker.getElement().addEventListener('click', () => {
    setSelectedLocation({
      ...agent,
      type: 'agent',
      currentStatus: status,
      accuracy: agent.location.accuracy,
      deviceInfo: agent.deviceInfo
    });
  });

  agentMarkersRef.current[agent.id] = marker;
};



// Add these helper functions to your component
const animateMarkerMovement = (marker, newLngLat, duration = 1000) => {
  if (!marker) return;
  
  const startLngLat = marker.getLngLat();
  const startTime = performance.now();
  
  const animate = (currentTime) => {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    // Linear interpolation between start and end positions
    const lng = startLngLat.lng + (newLngLat.lng - startLngLat.lng) * progress;
    const lat = startLngLat.lat + (newLngLat.lat - startLngLat.lat) * progress;
    
    marker.setLngLat([lng, lat]);
    
    // Calculate bearing (direction) for rotation
    if (progress > 0 && progress < 1) {
      const bearing = Math.atan2(
        newLngLat.lng - startLngLat.lng,
        newLngLat.lat - startLngLat.lat
      ) * 180 / Math.PI;
      
      // Apply rotation effect
      const markerElement = marker.getElement().querySelector('div:first-child');
      if (markerElement) {
        markerElement.style.transform = `rotate(${bearing}deg)`;
      }
    }
    
    if (progress < 1) {
      requestAnimationFrame(animate);
    }
  };
  
  requestAnimationFrame(animate);
};

// const createAgentMarker = (agent) => {
//   if (!mapRef.current || !agent?.location) return;

//   const status = agent.currentStatus || "AVAILABLE";
//   const color =
//     status === 'AVAILABLE' ? '#2a9d8f' :
//     status === 'ORDER_ASSIGNED' ? '#e63946' :
//     status === 'PICKED_UP' ? '#f4a261' : '#ccc';

//   const displayInitial = agent.name 
//     ? agent.name.split(' ')[0].charAt(0).toUpperCase()
//     : 'A';

//   const el = document.createElement('div');
//   el.className = 'custom-marker-agent';
//   el.innerHTML = `
//     <div style="
//       width: 24px;
//       height: 24px;
//       background: ${color};
//       border-radius: 50%;
//       border: 2px solid white;
//       display: flex;
//       align-items: center;
//       justify-content: center;
//       color: white;
//       font-weight: bold;
//       font-size: 10px;
//       transition: transform 0.5s ease-out;
//     ">
//       ${displayInitial}
//     </div>
//     <div style="
//       position: absolute;
//       bottom: -5px;
//       left: 50%;
//       transform: translateX(-50%);
//       width: 0;
//       height: 0;
//       border-left: 5px solid transparent;
//       border-right: 5px solid transparent;
//       border-top: 5px solid ${color};
//     "></div>
//   `;

//   const marker = new mapboxgl.Marker({ 
//     element: el,
//     rotationAlignment: 'map',
//     pitchAlignment: 'map'
//   })
//     .setLngLat([agent.location.lng, agent.location.lat])
//     .addTo(mapRef.current);

//   marker.getElement().addEventListener('click', () => {
//     setSelectedLocation({
//       ...agent,
//       type: 'agent',
//       currentStatus: status,
//       accuracy: agent.location.accuracy,
//       deviceInfo: agent.deviceInfo
//     });
//   });

//   agentMarkersRef.current[agent.id] = marker;
//   return marker;
// };

// Update your socket handler to use animation
const handleLocationUpdate = (data) => {
  if (!mounted) return;
  
  setLiveAgents(prev => {
    const existingIndex = prev.findIndex(a => a.id === data.agentId);
    
    if (existingIndex >= 0) {
      const updated = [...prev];
      const prevLocation = updated[existingIndex].location;
      const newLocation = { lat: data.lat, lng: data.lng };
      
      // Animate the marker if it exists
      if (agentMarkersRef.current[data.agentId]) {
        animateMarkerMovement(
          agentMarkersRef.current[data.agentId],
          newLocation,
          1000 // 1 second animation
        );
      }
      
      updated[existingIndex] = { 
        ...updated[existingIndex],
        location: newLocation,
        currentStatus: data.currentStatus || updated[existingIndex].currentStatus,
        accuracy: data.accuracy || updated[existingIndex].accuracy,
        deviceInfo: data.deviceInfo || updated[existingIndex].deviceInfo,
        name: data.name || updated[existingIndex].name
      };
      return updated;
    } else {
      // New agent - create marker
      createAgentMarker({
        id: data.agentId,
        name: data.name || `Agent ${data.agentId}`,
        location: { lat: data.lat, lng: data.lng },
        currentStatus: data.currentStatus || 'AVAILABLE',
        accuracy: data.accuracy || null,
        deviceInfo: data.deviceInfo || null
      });
      
      return [
        ...prev,
        {
          id: data.agentId,
          name: data.name || `Agent ${data.agentId}`,
          location: { lat: data.lat, lng: data.lng },
          currentStatus: data.currentStatus || 'AVAILABLE',
          accuracy: data.accuracy || null,
          deviceInfo: data.deviceInfo || null
        }
      ];
    }
  });
};
// Update your agent markers useEffect to handle initial markers
// Add/update agent markers
useEffect(() => {
  if (!mapRef.current) return;

  const map = mapRef.current;
  
  liveAgents.forEach(agent => {
    if (!agent?.location) return;
    
    // Update existing marker
    if (agentMarkersRef.current[agent.id]) {
      agentMarkersRef.current[agent.id].setLngLat([agent.location.lng, agent.location.lat]);
      updateAgentMarkerStatus(agent.id, agent.currentStatus);
    } 
    // Create new marker
    else {
      const color = 
        agent.currentStatus === 'AVAILABLE' ? '#2a9d8f' :
        agent.currentStatus === 'ORDER_ASSIGNED' ? '#e63946' :
        agent.currentStatus === 'PICKED_UP' ? '#f4a261' : '#ccc';
      
      const el = document.createElement('div');
      el.className = 'agent-marker';
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
          ${agent.name?.charAt(0) || 'A'}
        </div>
      `;

      const marker = new mapboxgl.Marker({ element: el })
        .setLngLat([agent.location.lng, agent.location.lat])
        .addTo(map);

      marker.getElement().addEventListener('click', () => {
        setSelectedLocation({
          ...agent,
          type: 'agent'
        });
      });

      agentMarkersRef.current[agent.id] = marker;
    }
  });

  // Cleanup removed agents
  Object.keys(agentMarkersRef.current).forEach(agentId => {
    if (!liveAgents.some(a => a.id === agentId)) {
      agentMarkersRef.current[agentId].remove();
      delete agentMarkersRef.current[agentId];
    }
  });
}, [liveAgents]);
  // Toggle marker visibility
  useEffect(() => {
    Object.values(restaurantMarkersRef.current).forEach(marker => {
      marker.getElement().style.display = showRestaurants ? '' : 'none';
    });
    Object.values(orderMarkersRef.current).forEach(marker => {
      marker.getElement().style.display = showDeliveries ? '' : 'none';
    });
  }, [showRestaurants, showDeliveries]);

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

{/* Selected Location Info - This should be outside any conditionals */}
{selectedLocation && (
  <div className="absolute bottom-20 right-4 w-64 bg-white rounded-lg shadow-lg z-10 p-4">
    {selectedLocation.type === 'agent' ? (
      <>
        <h3 className="font-bold text-lg">{selectedLocation.name}</h3>
        <div className="mt-2 space-y-1">
          <div className="flex items-center">
            <div className={`w-3 h-3 rounded-full mr-2 ${
              selectedLocation.currentStatus === 'AVAILABLE' ? 'bg-green-500' :
              selectedLocation.currentStatus === 'ORDER_ASSIGNED' ? 'bg-red-500' : 
              'bg-yellow-500'
            }`}></div>
            <span className="text-sm capitalize">
              {selectedLocation.currentStatus?.toLowerCase().replace('_', ' ') || 'Unknown status'}
            </span>
          </div>
          {selectedLocation.accuracy && (
            <div className="text-sm text-gray-600">
              Accuracy: {Math.round(selectedLocation.accuracy)} meters
            </div>
          )}
          {selectedLocation.deviceInfo && (
            <div className="mt-2 text-xs text-gray-600">
              <div><span className="font-semibold">Device:</span> {selectedLocation.deviceInfo.model}</div>
              <div><span className="font-semibold">OS:</span> {selectedLocation.deviceInfo.os} {selectedLocation.deviceInfo.osVersion}</div>
              <div><span className="font-semibold">Battery:</span> {selectedLocation.deviceInfo.batteryLevel}%</div>
              <div><span className="font-semibold">Network:</span> {selectedLocation.deviceInfo.networkType}</div>
            </div>
          )}
        </div>
      </>
    ) : selectedLocation.type === 'restaurant' ? (
      <>
        <h3 className="font-bold text-lg">{selectedLocation.name}</h3>
        <div className="flex items-center mt-1">
          <span className="text-yellow-500">
            {'★'.repeat(Math.floor(selectedLocation.rating || 0))}
            {'☆'.repeat(5 - Math.floor(selectedLocation.rating || 0))}
          </span>
          <span className="ml-1 text-sm text-gray-600">{selectedLocation.rating || 0}</span>
        </div>
      </>
    ) : (
      <>
        <h3 className="font-bold text-lg">Order {selectedLocation.orderId}</h3>
        <div className={`mt-1 text-sm ${
          selectedLocation.status === 'Delivered' ? 'text-green-500' : 
          selectedLocation.status === 'In Transit' ? 'text-blue-500' : 
          'text-yellow-500'
        }`}>
          Status: {selectedLocation.status || 'Pending'}
        </div>
        <div className="text-sm text-gray-600">
          From: <span className="font-semibold">{selectedLocation?.restaurant?.name || 'Unknown'}</span>
        </div>
      </>
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