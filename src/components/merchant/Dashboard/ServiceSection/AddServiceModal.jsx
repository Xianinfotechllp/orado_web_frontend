import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import 'mapbox-gl/dist/mapbox-gl.css';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';
import { addServiceArea } from "../../../../apis/restaurantApi";

mapboxgl.accessToken = 'pk.eyJ1IjoiYW1hcm5hZGg2NSIsImEiOiJjbWJ3NmlhcXgwdTh1MmlzMWNuNnNvYmZ3In0.kXrgLZhaz0cmbuCvyxOd6w';

const AddServiceModal = ({
  isOpen, onClose, restaurantId, onServiceAdded,
  restaurantLocation, restaurantName
}) => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const drawRef = useRef(null);

  const [polygon, setPolygon] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [errors, setErrors] = useState({});

  // Initialize map when modal opens
  useEffect(() => {
    if (!isOpen) return;

    const timer = setTimeout(() => {
      if (mapContainerRef.current && !mapRef.current) {
        const map = new mapboxgl.Map({
          container: mapContainerRef.current,
          style: 'mapbox://styles/mapbox/streets-v12',
          center: restaurantLocation || [76.32, 9.995],
          zoom: 13
        });

        map.addControl(new mapboxgl.NavigationControl(), 'top-right');

        const draw = new MapboxDraw({
          displayControlsDefault: false,
          controls: {
            polygon: true,
            trash: true
          }
        });
        map.addControl(draw, 'top-left');
        drawRef.current = draw;

        map.on('draw.create', (e) => {
          const newPolygon = e.features[0];
          setPolygon(newPolygon);
        });

        map.on('draw.delete', () => {
          setPolygon(null);
        });

        // Add restaurant marker if location is provided
        if (restaurantLocation) {
          const marker = new mapboxgl.Marker({ color: "green" })
            .setLngLat(restaurantLocation)
            .addTo(map);

          const popup = new mapboxgl.Popup({ offset: 25 })
            .setText(restaurantName || "Restaurant");
          marker.setPopup(popup).togglePopup();
        }

        mapRef.current = map;
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [isOpen, restaurantLocation, restaurantName]);

  // Cleanup map when modal closes
  useEffect(() => {
    if (!isOpen && mapRef.current) {
      mapRef.current.remove();
      mapRef.current = null;
      drawRef.current = null;
      setPolygon(null);
    }
  }, [isOpen]);

  const handleLocateMe = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        const lng = pos.coords.longitude;
        const lat = pos.coords.latitude;
        mapRef.current?.flyTo({ center: [lng, lat], zoom: 14 });
      });
    } else {
      alert("Geolocation not supported.");
    }
  };

  const handleSearch = async () => {
    if (!searchQuery) return;
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(searchQuery)}.json?access_token=${mapboxgl.accessToken}`
      );
      const data = await response.json();
      if (data.features?.length > 0) {
        const [lng, lat] = data.features[0].geometry.coordinates;
        mapRef.current?.flyTo({ center: [lng, lat], zoom: 14 });
      } else {
        alert('Location not found.');
      }
    } catch (error) {
      console.error('Search error:', error);
      alert('Search failed. Please try again.');
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!restaurantId) newErrors.restaurant = 'Restaurant is required';
    if (!polygon) newErrors.polygon = 'Please draw a service area polygon';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;
    if (!restaurantId) {
      alert('Restaurant ID is missing');
      return;
    }

    const serviceAreas = [{
      type: 'Polygon',
      coordinates: polygon.geometry.coordinates,
    }];

    setIsSubmitting(true);
    try {
      const response = await addServiceArea(restaurantId, serviceAreas);
      if (response.messageType === 'success') {
        alert('Service area saved successfully!');
        setPolygon(null);
        drawRef.current?.deleteAll();
        onServiceAdded?.();
      } else {
        alert(response.message || 'Failed to save service area');
      }
    } catch (error) {
      console.error('Save error:', error);
      alert(error.response?.data?.message || 'Server error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setPolygon(null);
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        width: '95vw',
        height: '95vh',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{
          padding: '20px',
          borderBottom: '1px solid #ddd',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <h2 style={{ margin: 0 }}>Add Service Area</h2>
            {restaurantId && (
              <p style={{ margin: '5px 0 0', color: '#666', fontSize: '14px' }}>
                Restaurant ID: <strong>{restaurantId}</strong>
              </p>
            )}
          </div>
          <button onClick={handleClose} style={{
            background: 'none',
            border: 'none',
            fontSize: '24px',
            cursor: 'pointer',
            padding: '5px'
          }}>×</button>
        </div>

        {/* Map */}
        <div style={{ position: 'relative', flex: 1, margin: '0 20px' }}>
          <div ref={mapContainerRef} style={{ height: '100%', borderRadius: '8px' }} />
          <div style={{
            position: 'absolute', top: 20, left: 20, background: 'white',
            padding: 15, borderRadius: 8, width: 340, zIndex: 1,
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
          }}>
            <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
              <input
                type="text"
                placeholder="Search location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ flex: 1, padding: 8, border: '1px solid #ddd', borderRadius: 4 }}
              />
              <button onClick={handleSearch} style={{
                padding: '8px 12px', border: 'none',
                background: '#3f51b5', color: 'white', borderRadius: 4
              }}>Search</button>
              <button onClick={handleLocateMe} style={{
                padding: '8px 12px', border: 'none',
                background: '#4caf50', color: 'white', borderRadius: 4
              }}>📍</button>
            </div>

            <button onClick={() => drawRef.current?.changeMode('draw_polygon')}
              disabled={!restaurantId}
              style={{
                marginTop: 10, width: '100%',
                background: !restaurantId ? '#ccc' : (polygon ? '#4caf50' : '#ff9800'),
                color: 'white', padding: '10px', border: 'none', borderRadius: 4,
                fontWeight: 'bold', cursor: !restaurantId ? 'not-allowed' : 'pointer'
              }}>
              {!restaurantId ? 'No Restaurant Selected' : (polygon ? '✓ Polygon Ready' : '➕ Draw Service Area')}
            </button>
            {errors.polygon && <p style={{ color: 'red', fontSize: 12, marginTop: 5 }}>{errors.polygon}</p>}
          </div>
        </div>

        {/* Footer */}
        <div style={{ background: 'white', padding: 20, borderTop: '1px solid #ddd' }}>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
            <button onClick={handleClose} style={{
              padding: '10px 25px', background: '#9e9e9e',
              color: 'white', border: 'none', borderRadius: 4, fontSize: 16, cursor: 'pointer'
            }}>Cancel</button>
            <button onClick={handleSave}
              disabled={isSubmitting || !restaurantId}
              style={{
                padding: '10px 25px',
                background: (isSubmitting || !restaurantId) ? '#9e9e9e' : '#4caf50',
                color: 'white', border: 'none', borderRadius: 4,
                fontSize: 16, cursor: (isSubmitting || !restaurantId) ? 'not-allowed' : 'pointer'
              }}>
              {isSubmitting ? 'Saving...' : '💾 Save Service Area'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddServiceModal;
