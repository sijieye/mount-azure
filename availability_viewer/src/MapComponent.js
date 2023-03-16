import React, { useState, useEffect } from 'react';

function MapComponent({ location, radius }) {
  const [map, setMap] = useState(null);
  const [circle, setCircle] = useState(null);
  const [center, setCenter] = useState(null);

  useEffect(() => {
    // Create a new Google Maps API instance
    const googleMaps = window.google.maps;

    // Geocode the selected location to get its coordinates
    const geocoder = new googleMaps.Geocoder();
    geocoder.geocode({ address: location }, (results, status) => {
      if (status === googleMaps.GeocoderStatus.OK) {
        const latLng = results[0].geometry.location;

        // Create the map centered on the selected location
        const map = new googleMaps.Map(document.getElementById('map'), {
          center: latLng,
          zoom: 12,
        });
        setMap(map);

        // Create a circle overlay representing the selected radius
        const circle = new googleMaps.Circle({
          strokeColor: '#FF0000',
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: '#FF0000',
          fillOpacity: 0.35,
          map: map,
          center: latLng,
          radius: radius * 1609.34, // Convert miles to meters
        });
        setCircle(circle);

        // Set the center state variable for later use
        setCenter(latLng);
      }
    });
  }, [location, radius]);

  useEffect(() => {
    // Update the circle radius when the radius prop changes
    if (circle) {
      circle.setRadius(radius * 1609.34); // Convert miles to meters
    }
  }, [radius, circle]);

  return (
    <div id="map" style={{ height: '400px', width: '100%' }}>
      {/* The Google Maps API will render the map here */}
    </div>
  );
}

export default MapComponent;

