import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import {createSurgeArea } from "../../../apis/surgeApi"
mapboxgl.accessToken = 'pk.eyJ1IjoiYW1hcm5hZGg2NSIsImEiOiJjbWJ3NmlhcXgwdTh1MmlzMWNuNnNvYmZ3In0.kXrgLZhaz0cmbuCvyxOd6w';

const SurgeAreaMap = () => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const [circle, setCircle] = useState(null);
  const [radius, setRadius] = useState(1000);
  const [center, setCenter] = useState(null);
  const markerRef = useRef(null);

  // Form state
  const [name, setName] = useState('');
  const [reason, setReason] = useState('');
  const [surgeType, setSurgeType] = useState('fixed');
  const [surgeValue, setSurgeValue] = useState(0);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize map
  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [76.32, 9.995],
      zoom: 13
    });

    map.addControl(new mapboxgl.NavigationControl(), 'top-right');

    mapRef.current = map;

    return () => map.remove();
  }, []);

  // Create circle GeoJSON
  const createCircleGeoJSON = (center, radiusInMeters, points = 64) => {
    const coords = {
      latitude: center[1],
      longitude: center[0]
    };
    const km = radiusInMeters / 1000;
    const ret = [];
    const distanceX = km / (111.320 * Math.cos((coords.latitude * Math.PI) / 180));
    const distanceY = km / 110.574;

    for (let i = 0; i < points; i++) {
      const theta = (i / points) * (2 * Math.PI);
      const x = distanceX * Math.cos(theta);
      const y = distanceY * Math.sin(theta);
      ret.push([coords.longitude + x, coords.latitude + y]);
    }
    ret.push(ret[0]);

    return {
      type: 'Feature',
      properties: {
        radius: radiusInMeters
      },
      geometry: {
        type: 'Polygon',
        coordinates: [ret]
      }
    };
  };

  // Draw or update circle on map
  const drawOrUpdateCircle = (lngLat) => {
    const circleFeature = createCircleGeoJSON(lngLat, radius);

    if (mapRef.current.getSource('surgeCircle')) {
      mapRef.current.getSource('surgeCircle').setData(circleFeature);
    } else {
      mapRef.current.addSource('surgeCircle', {
        type: 'geojson',
        data: circleFeature
      });

      mapRef.current.addLayer({
        id: 'surgeCircleLayer',
        type: 'fill',
        source: 'surgeCircle',
        paint: {
          'fill-color': '#FF5722',
          'fill-opacity': 0.3,
          'fill-outline-color': '#FF5722'
        }
      });

      mapRef.current.addLayer({
        id: 'surgeCircleBorder',
        type: 'line',
        source: 'surgeCircle',
        paint: {
          'line-color': '#FF5722',
          'line-width': 2
        }
      });
    }
    setCircle(circleFeature);
  };

  // Add circle handler
  const handleAddCircle = () => {
    const mapCenter = mapRef.current.getCenter();
    const lngLat = [mapCenter.lng, mapCenter.lat];
    setCenter(lngLat);

    if (markerRef.current) markerRef.current.remove();

    const marker = new mapboxgl.Marker({
      draggable: true,
      color: '#FF5722'
    })
      .setLngLat(lngLat)
      .addTo(mapRef.current);

    marker.on('dragend', () => {
      const newLngLat = [marker.getLngLat().lng, marker.getLngLat().lat];
      setCenter(newLngLat);
      drawOrUpdateCircle(newLngLat);
    });

    markerRef.current = marker;
    drawOrUpdateCircle(lngLat);
  };

  // Update circle when radius changes
  useEffect(() => {
    if (circle && center) drawOrUpdateCircle(center);
  }, [radius]);

  // Save surge area
  const handleSave = async () => {
    if (!center) {
      alert('Please add a surge area first by clicking "Add Surge Zone"');
      return;
    }

    if (!name || !reason || !surgeValue || !startTime || !endTime) {
      alert('Please fill all required fields');
      return;
    }

    const payload = {
      name,
      surgeReason: reason,
      surgeType,
      surgeValue: Number(surgeValue),
      center,
      radius,
      startTime,
      endTime,
      type: 'Circle'
    };

    setIsSubmitting(true);
    
    try {
      console.log(payload)
       

      const data = await createSurgeArea({
  name: payload.name,
 surgeReason:payload.surgeReason,
  type: "Circle",
  center: payload.center,
  radius:  payload.radius,  // in meters
  surgeType: payload.surgeType,
   surgeValue: payload.surgeValue,
  startTime:  payload.startTime,
  endTime: payload.endTime
})
      if (data.success) {
        alert('Surge area saved successfully!');
        // Reset form
        setName('');
        setReason('');
        setSurgeValue(0);
        setStartTime('');
        setEndTime('');
        setCenter(null);
        if (markerRef.current) markerRef.current.remove();
        if (mapRef.current.getSource('surgeCircle')) {
          mapRef.current.removeLayer('surgeCircleLayer');
          mapRef.current.removeLayer('surgeCircleBorder');
          mapRef.current.removeSource('surgeCircle');
        }
      } else {
        alert(data.message || 'Save failed');
      }
    } catch (err) {
      console.error(err);
      alert('Server error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="surge-area-container">
      <div className="map-container">
        <div ref={mapContainerRef} className="map" />
        
        <div className="map-controls">
          <div className="radius-control">
            <label>Radius: {radius}m</label>
            <input
              type="range"
              min="100"
              max="5000"
              value={radius}
              step="50"
              onChange={(e) => setRadius(Number(e.target.value))}
            />
          </div>
          
          <div className="action-buttons">
            <button 
              onClick={handleAddCircle} 
              className="btn btn-primary"
            >
              <i className="icon">➕</i> Add/Move Zone
            </button>
          </div>
        </div>
      </div>

      <div className="form-container">
        <h2 className="form-title">Surge Area Details</h2>
        
        <div className="form-grid">
          <div className="form-group">
            <label>Name*</label>
            <input 
              type="text" 
              placeholder="Area name" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
            />
          </div>
          
          <div className="form-group">
            <label>Reason*</label>
            <input 
              type="text" 
              placeholder="Reason for surge" 
              value={reason} 
              onChange={(e) => setReason(e.target.value)} 
            />
          </div>
          
          <div className="form-group">
            <label>Surge Type*</label>
            <select 
              value={surgeType} 
              onChange={(e) => setSurgeType(e.target.value)}
            >
              <option value="fixed">Fixed Amount (₹)</option>
              <option value="percentage">Percentage (%)</option>
            </select>
          </div>
          
          <div className="form-group">
            <label>Surge Value*</label>
            <input 
              type="number" 
              placeholder={surgeType === 'fixed' ? 'Amount in ₹' : 'Percentage'} 
              value={surgeValue} 
              onChange={(e) => setSurgeValue(e.target.value)} 
            />
          </div>
          
          <div className="form-group">
            <label>Start Time*</label>
            <input 
              type="datetime-local" 
              value={startTime} 
              onChange={(e) => setStartTime(e.target.value)} 
            />
          </div>
          
          <div className="form-group">
            <label>End Time*</label>
            <input 
              type="datetime-local" 
              value={endTime} 
              onChange={(e) => setEndTime(e.target.value)} 
            />
          </div>
        </div>
        
        <div className="form-footer">
          <button 
            onClick={handleSave} 
            className="btn btn-success"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : '💾 Save Surge Area'}
          </button>
          
          {center && (
            <div className="coordinates-info">
              <span>Location: {center[1].toFixed(4)}, {center[0].toFixed(4)}</span>
              <span>Radius: {radius}m</span>
            </div>
          )}
        </div>
      </div>
      
      <style jsx>{`
        .surge-area-container {
          display: flex;
          flex-direction: column;
          height: 100vh;
          background: #f5f7fa;
        }
        
        .map-container {
          position: relative;
          flex: 1;
          min-height: 400px;
        }
        
        .map {
          height: 100%;
          width: 100%;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        
        .map-controls {
          position: absolute;
          top: 20px;
          left: 20px;
          z-index: 1;
          background: white;
          padding: 15px;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          width: 300px;
        }
        
        .radius-control {
          margin-bottom: 15px;
        }
        
        .radius-control label {
          display: block;
          margin-bottom: 5px;
          font-weight: 500;
          color: #333;
        }
        
        .radius-control input {
          width: 100%;
        }
        
        .action-buttons {
          display: flex;
          gap: 10px;
        }
        
        .form-container {
          background: white;
          padding: 25px;
          border-top: 1px solid #e1e5eb;
          box-shadow: 0 -2px 5px rgba(0,0,0,0.05);
        }
        
        .form-title {
          margin-top: 0;
          margin-bottom: 20px;
          color: #2c3e50;
        }
        
        .form-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 20px;
          margin-bottom: 20px;
        }
        
        .form-group {
          margin-bottom: 0;
        }
        
        .form-group label {
          display: block;
          margin-bottom: 8px;
          font-weight: 500;
          color: #555;
        }
        
        .form-group input,
        .form-group select {
          width: 100%;
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 14px;
        }
        
        .form-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 20px;
        }
        
        .coordinates-info {
          display: flex;
          gap: 15px;
          font-size: 14px;
          color: #666;
        }
        
        .btn {
          padding: 10px 20px;
          border: none;
          border-radius: 4px;
          font-weight: 500;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: all 0.2s;
        }
        
        .btn-primary {
          background: #3f51b5;
          color: white;
        }
        
        .btn-primary:hover {
          background: #303f9f;
        }
        
        .btn-success {
          background: #4caf50;
          color: white;
        }
        
        .btn-success:hover {
          background: #388e3c;
        }
        
        .btn-success:disabled {
          background: #a5d6a7;
          cursor: not-allowed;
        }
        
        @media (max-width: 768px) {
          .map-controls {
            width: calc(100% - 40px);
          }
          
          .form-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default SurgeAreaMap;