import React, { useState, useEffect } from 'react';

interface MapProps {
  location: string;
  radius: number;
  onLoad: (map: google.maps.Map) => void;
  onMarkerLoad: (marker: google.maps.Marker) => void;
}

function MapComponent({ location, radius, onLoad, onMarkerLoad }: MapProps) {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [center, setCenter] = useState<google.maps.LatLng | null>(null);
  const [marker, setMarker] = useState<google.maps.Marker | null>(null);

  
  useEffect(() => {
    // Create a new Google Maps API instance
    const googleMaps = window.google.maps;

    // Geocode the selected location to get its coordinates
    const geocoder = new googleMaps.Geocoder();
    geocoder.geocode({ address: location }, (results, status) => {
      if (status === googleMaps.GeocoderStatus.OK && results) {
        const latLng = results[0].geometry.location;

        // Create the map centered on the selected location
        const map = new googleMaps.Map(document.getElementById('map')!, {
          center: latLng,
          zoom: Math.round(14 - Math.log(radius) / Math.LN2),
        });
        setMap(map);
        setCenter(latLng);

        // Call the onLoad function with the map instance
        onLoad(map);

        // Create a marker at the selected location
        const marker = new googleMaps.Marker({
          position: latLng,
          map,
          visible: false,
          title: location,
        });
        setMarker(marker);

        // Call the onMarkerLoad function with the marker instance
        onMarkerLoad(marker);
      }
    });
  }, [location, radius]);

  return (
    <div id="map" style={{ height: '600px', width: '100%' }}>
      {/* The Google Maps API will render the map here */}
    </div>
  );
}

export default MapComponent;

