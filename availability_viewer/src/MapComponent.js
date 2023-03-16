import React, { useState, useEffect } from 'react';

function MapComponent({ location, radius }) {
  const [map, setMap] = useState(null);
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
          zoom: Math.round(14 - Math.log(radius) / Math.LN2),
        });
        setMap(map);
        setCenter(latLng);
      }
    });
  }, [location, radius]);

  return (
    <div id="map" style={{ height: '400px', width: '100%' }}>
      {/* The Google Maps API will render the map here */}
    </div>
  );
}

export default MapComponent;

