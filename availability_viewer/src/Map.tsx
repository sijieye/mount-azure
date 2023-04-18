import './App.css';
import GoogleAutocomplete from 'react-google-autocomplete';
import React, { useState, useEffect } from 'react';
import MapComponent from './MapComponent';
import { Navigate, useNavigate } from 'react-router-dom';
import Calendar from './Calendar';
interface Location {
  lat: number;
  lng: number;
}

interface Item {
  name: string;
  time: string;
  location: Location;
}

function Map() {
  const navigate = useNavigate();
  const goToCalendar = () => {
    navigate('/Calendar'); 
  };
  
  const [location, setLocation] = useState<string>('');
  const [radius, setRadius] = useState<number>(1);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [marker, setMarker] = useState<google.maps.Marker | null>(null);
  const [showMap, setShowMap] = useState<boolean>(false);
  const [mapRendered, setMapRendered] = useState<boolean>(false);
  const [event, setEvent] = useState<object>({});
  const data: Item[] = [
    {
      name: 'Blue Bike',
      time: '2023-03-21T14:30:00-04:00', // example time in Boston
      location: {
        lat: 42.3601,
        lng: -71.0589,
      },
    },
    {
      name: 'Golf Clubs',
      time: '2023-03-21T09:00:00-04:00', // example time in Boston
      location: {
        lat: 42.3505,
        lng: -71.0760,
      },
    },
    {
      name: 'Scooter',
      time: '2023-03-21T12:00:00-04:00', // example time in New York
      location: {
        lat: 40.785091,
        lng: -73.968285,
      },
    },
    {
      name: 'Red Bike',
      time: '2023-03-21T16:00:00-04:00', // example time in Boston
      location: {
        lat: 42.3394,
        lng: -71.0942,
      },
    },
  ];


  useEffect(() => {
    if (map && marker && showMap && !mapRendered) {
      const circle = new window.google.maps.Circle({
        strokeColor: '#FF0000',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#FF0000',
        fillOpacity: 0,
        map,
        center: marker.getPosition(),
        radius: radius * 1609.34,
      });
  
      // Loop through each item in the data array
      data.forEach((item) => {
        const location = new window.google.maps.LatLng(item.location.lat, item.location.lng);
  
        if (circle && circle.getBounds() && location) {
          const bounds = circle.getBounds();
          if (bounds && bounds.contains(location)) {
            // Create a marker for the current item
            const marker = new window.google.maps.Marker({
              position: location,
              map,
              title: item.name,
            });
  
            // Add a click event listener to the marker
            marker.addListener('click', () => {
              const infowindow = new window.google.maps.InfoWindow({
                content: `Available at: ${item.time}`,
              });
              infowindow.open(map, marker);
              goToCalendar();
            });
          }
        }
      });
  
      setMapRendered(true);
    }
  }, [map, marker, radius, data, showMap]);

  function handlePlaceSelect(place: google.maps.places.PlaceResult) {
    setLocation(place.formatted_address || '');
  }

  function handleRadiusSelect(event: React.ChangeEvent<HTMLInputElement>) {
    setRadius(Number(event.target.value));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setShowMap(true);
    setMapRendered(false);
    // handle form submission here
  }

  function handleMapLoad(map: google.maps.Map) {
    setMap(map);
  }
  
  function handleMarkerLoad(marker: google.maps.Marker) {
    setMarker(marker);
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          Enter Location:
          <GoogleAutocomplete
            apiKey={"AIzaSyATZWTQjFZVElmC_pXyTz9XNgSJftqhz5I"}
            onPlaceSelected={handlePlaceSelect}
            types={['(regions)']}
            placeholder="Enter a location"
          />
        </label>
        <br />
        <label>
          Select Radius (in miles):
          <input type="number" value={radius} onChange={handleRadiusSelect} />
        </label>
        <br />
        <button type="submit">Submit</button>
      </form>
      {showMap && location && (
        <MapComponent
          location={location}
          radius={radius}
          onLoad={handleMapLoad}
          onMarkerLoad={handleMarkerLoad}
        />
      )}
    </div>
  )};


export default Map;