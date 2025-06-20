import mapboxgl from 'mapbox-gl';

// Initialize Mapbox
export const initMapbox = (accessToken) => {
  mapboxgl.accessToken = accessToken;
};

// Convert Mapbox result to your location format
export const mapboxToLocation = (result) => {
  return {
    name: result.place_name,
    lat: result.center[1],
    lon: result.center[0],
    address: result.text,
    context: result.context
  };
};