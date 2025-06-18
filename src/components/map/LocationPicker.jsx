import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import axios from "axios";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix default icon issue in leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

function LocationMarker({ onSelectLocation }) {
  const [position, setPosition] = useState(null);

  useMapEvents({
    async click(e) {
      setPosition(e.latlng);

      // Fetch address details using Nominatim reverse geocoding
      const { lat, lng } = e.latlng;
      try {
        const response = await axios.get(
          `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
        );

        const address = response.data.address;
        const locationDetails = {
          latitude: lat,
          longitude: lng,
          street: address.road || "",
          city: address.city || address.town || address.village || "",
          state: address.state || "",
          zip: address.postcode || "",
          displayName: response.data.display_name,
        };

     

        if (onSelectLocation) {
          onSelectLocation(locationDetails);
        }
      } catch (error) {
        console.error("Error fetching address:", error);
      }
    },
  });

  return position === null ? null : <Marker position={position}></Marker>;
}

const LocationPicker = ({ onSelectLocation }) => {
  return (
    <div className="w-full h-[400px] rounded overflow-hidden border">
      <MapContainer
        center={[9.9312, 76.2673]}
        zoom={13}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker onSelectLocation={onSelectLocation} />
      </MapContainer>
    </div>
  );
};

export default LocationPicker;
