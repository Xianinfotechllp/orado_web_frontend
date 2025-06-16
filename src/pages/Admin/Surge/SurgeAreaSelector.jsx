import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import 'mapbox-gl/dist/mapbox-gl.css';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';
import { createSurgeArea } from "../../../apis/surgeApi";

mapboxgl.accessToken = 'pk.eyJ1IjoiYW1hcm5hZGg2NSIsImEiOiJjbWJ3NmlhcXgwdTh1MmlzMWNuNnNvYmZ3In0.kXrgLZhaz0cmbuCvyxOd6w';

function createCircle(center, radiusInKm) {
  const points = 64;
  const coords = [];
  
  for (let i = 0; i < points; i++) {
    const angle = (i / points) * (2 * Math.PI);
    const dx = radiusInKm * Math.cos(angle) / 111.32;
    const dy = radiusInKm * Math.sin(angle) / (111.32 * Math.cos(center[1] * Math.PI / 180));
    coords.push([center[0] + dx, center[1] + dy]);
  }
  coords.push(coords[0]);
  
  return {
    type: 'Feature',
    geometry: {
      type: 'Polygon',
      coordinates: [coords]
    },
    properties: {
      radius: radiusInKm,
      center: center
    }
  };
}

const SurgeAreaMap = () => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const drawRef = useRef(null);

  const [polygon, setPolygon] = useState(null);
  const [name, setName] = useState('');
  const [reason, setReason] = useState('');
  const [surgeType, setSurgeType] = useState('fixed');
  const [surgeValue, setSurgeValue] = useState(0);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [type, setType] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [circleRadius, setCircleRadius] = useState(0.5);
  const [circleCenter, setCircleCenter] = useState(null);
  const [showRadiusSlider, setShowRadiusSlider] = useState(false);

  const handleDelete = () => {
    if (drawRef.current) {
      drawRef.current.deleteAll();
    }
    setPolygon(null);
    setCircleCenter(null);
    setShowRadiusSlider(false);
  };

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [76.32, 9.995],
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
      const feature = e.features[0];
      setPolygon(feature);
    });

    map.on('draw.delete', handleDelete);

    map.on('click', (e) => {
      if (type === 'Circle' && drawRef.current.getMode() === 'simple_select') {
        const center = [e.lngLat.lng, e.lngLat.lat];
        const circleFeature = createCircle(center, circleRadius);
        drawRef.current.deleteAll();
        drawRef.current.add(circleFeature);
        setPolygon(circleFeature);
        setCircleCenter(center);
        setShowRadiusSlider(true);
      }
    });

    mapRef.current = map;

    return () => map.remove();
  }, [type]);

  useEffect(() => {
    if (circleCenter && polygon && type === 'Circle') {
      const circleFeature = createCircle(circleCenter, circleRadius);
      drawRef.current.deleteAll();
      drawRef.current.add(circleFeature);
      setPolygon(circleFeature);
    }
  }, [circleRadius, circleCenter, type]);

  const handleLocateMe = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        const lng = pos.coords.longitude;
        const lat = pos.coords.latitude;
        mapRef.current.flyTo({ center: [lng, lat], zoom: 14 });
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
        mapRef.current.flyTo({ center: [lng, lat], zoom: 14 });
      } else {
        alert('Location not found.');
      }
    } catch (err) {
      console.error('Search error:', err);
      alert('Search failed. Please try again.');
    }
  };

  const handleDraw = () => {
    if (!type) return alert('Please select a surge area type first.');
    if (type === 'Polygon') {
      drawRef.current.changeMode('draw_polygon');
      setShowRadiusSlider(false);
    } else if (type === 'Circle') {
      drawRef.current.changeMode('simple_select');
      alert('Click on the map to place a circle center');
    }
  };

  const handleSave = async () => {
    if (!polygon) return alert('Please draw a surge area first.');
    if (!name || !reason || !surgeValue || !startTime || !endTime)
      return alert('Please fill all required fields.');

    let payload = {
      name,
      surgeReason: reason,
      surgeType,
      surgeValue: Number(surgeValue),
      startTime,
      endTime
    };

    if (type === 'Polygon' && polygon.geometry.type === 'Polygon') {
      payload = {
        ...payload,
        type: 'Polygon',
        area: {
          type: 'Polygon',
          coordinates: polygon.geometry.coordinates
        }
      };
    } else if (type === 'Circle' && polygon.geometry.type === 'Polygon' && polygon.properties.radius) {
      payload = {
        ...payload,
        type: 'Circle',
        center: polygon.properties.center,
        radius: polygon.properties.radius
      };
    } else {
      return alert('Drawn shape does not match selected type.');
    }

    setIsSubmitting(true);
    try {
      const data = await createSurgeArea(payload);
      if (data.success) {
        alert('Surge area saved!');
        setName('');
        setReason('');
        setSurgeValue(0);
        setStartTime('');
        setEndTime('');
        handleDelete();
      } else {
        alert(data.message || 'Save failed');
      }
    } catch (err) {
      console.error(err);
      alert('Server error. Try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <div style={{ position: 'relative', flex: 1 }}>
        <div ref={mapContainerRef} style={{ height: '100%' }} />
        <div style={{
          position: 'absolute', 
          top: 20, 
          left: 20, 
          background: 'white', 
          padding: 15, 
          borderRadius: 8, 
          width: 340, 
          zIndex: 1,
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}>
          <select
            value={type}
            onChange={(e) => {
              setType(e.target.value);
              setShowRadiusSlider(false);
              setCircleCenter(null);
              handleDelete();
            }}
            style={{ 
              padding: '8px', 
              border: '1px solid #ddd', 
              borderRadius: 4, 
              marginBottom: 10, 
              width: '100%' 
            }}
          >
            <option value="">Select Surge Type</option>
            <option value="Polygon">Polygon</option>
            <option value="Circle">Circle</option>
          </select>

          {type === 'Circle' && showRadiusSlider && (
            <div style={{ marginBottom: 10 }}>
              <label>Radius: {circleRadius} km</label>
              <input 
                type="range" 
                min="0.1" 
                max="10" 
                step="0.1" 
                value={circleRadius} 
                onChange={(e) => setCircleRadius(parseFloat(e.target.value))}
                style={{ width: '100%' }}
              />
            </div>
          )}

          <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
            <input
              type="text"
              placeholder="Search location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ 
                flex: 1, 
                padding: 8, 
                border: '1px solid #ddd', 
                borderRadius: 4 
              }}
            />
            <button 
              onClick={handleSearch} 
              style={{ 
                padding: '8px 12px', 
                border: 'none', 
                background: '#3f51b5', 
                color: 'white', 
                borderRadius: 4 
              }}
            >
              Search
            </button>
            <button 
              onClick={handleLocateMe} 
              style={{ 
                padding: '8px 12px', 
                border: 'none', 
                background: '#4caf50', 
                color: 'white', 
                borderRadius: 4 
              }}
            >
              📍
            </button>
          </div>

          <button
            onClick={handleDraw}
            style={{
              marginTop: 10,
              background: '#4caf50',
              color: 'white',
              padding: '8px 10px',
              border: 'none',
              borderRadius: 4,
              width: '100%',
              cursor: 'pointer'
            }}
          >
            ➕ {type === 'Circle' ? 'Select Center Point' : 'Draw Polygon'}
          </button>

          {polygon && (
            <button
              onClick={handleDelete}
              style={{
                marginTop: 10,
                background: '#f44336',
                color: 'white',
                padding: '8px 10px',
                border: 'none',
                borderRadius: 4,
                width: '100%',
                cursor: 'pointer'
              }}
            >
              🗑️ Delete Area
            </button>
          )}
        </div>
      </div>

      <div style={{ background: 'white', padding: 20, boxShadow: '0 -2px 10px rgba(0,0,0,0.1)' }}>
        <h2 style={{ marginTop: 0 }}>Surge Area Details</h2>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', 
          gap: 15,
          marginBottom: 20
        }}>
          <input 
            value={name} 
            onChange={e => setName(e.target.value)} 
            placeholder="Name*" 
            style={{ padding: 8, border: '1px solid #ddd', borderRadius: 4 }}
          />
          <input 
            value={reason} 
            onChange={e => setReason(e.target.value)} 
            placeholder="Reason*" 
            style={{ padding: 8, border: '1px solid #ddd', borderRadius: 4 }}
          />
          <select 
            value={surgeType} 
            onChange={e => setSurgeType(e.target.value)}
            style={{ padding: 8, border: '1px solid #ddd', borderRadius: 4 }}
          >
            <option value="fixed">Fixed ₹</option>
            <option value="percentage">%</option>
          </select>
          <input 
            type="number" 
            value={surgeValue} 
            onChange={e => setSurgeValue(e.target.value)} 
            placeholder="Value*" 
            style={{ padding: 8, border: '1px solid #ddd', borderRadius: 4 }}
          />
          <input 
            type="datetime-local" 
            value={startTime} 
            onChange={e => setStartTime(e.target.value)} 
            style={{ padding: 8, border: '1px solid #ddd', borderRadius: 4 }}
          />
          <input 
            type="datetime-local" 
            value={endTime} 
            onChange={e => setEndTime(e.target.value)} 
            style={{ padding: 8, border: '1px solid #ddd', borderRadius: 4 }}
          />
        </div>
        <button 
          onClick={handleSave} 
          disabled={isSubmitting}
          style={{ 
            padding: '10px 20px', 
            background: '#4caf50', 
            color: 'white', 
            border: 'none', 
            borderRadius: 4,
            cursor: 'pointer',
            fontSize: '1rem'
          }}
        >
          {isSubmitting ? 'Saving...' : '💾 Save Surge Area'}
        </button>
      </div>
    </div>
  );
};

export default SurgeAreaMap;