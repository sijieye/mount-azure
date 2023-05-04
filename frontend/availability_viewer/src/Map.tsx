import './Map.css';
import GoogleAutocomplete from 'react-google-autocomplete';
import React, { useState, useEffect } from 'react';
import MapComponent from './MapComponent';
import { useNavigate } from 'react-router-dom';


interface Location {
  lat: number;
  lng: number;
}

interface Item {
  item_id: string;
  name: string;

  location: Location; 
}
 
function Map() {

  const navigate = useNavigate();
  const goToCalendar = (item_id:string) => {
    navigate(`/Calendar/${item_id}`); 
  };

  const [location, setLocation] = useState<string>('');
  const [radius, setRadius] = useState<number>(1);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [marker, setMarker] = useState<google.maps.Marker | null>(null);
  const [showMap, setShowMap] = useState<boolean>(false);
  const [mapRendered, setMapRendered] = useState<boolean>(false);
  
  // link to the json-server on port 3001
  const api = "https://mountserver.onrender.com"

  const [data, setData] = useState<Item[]>([]);

  
  const getData = async () => {
    // fetch the amentities data from the json-server
    const response = await fetch(`${api}/amentities`);
    const data = await response.json();
    setData(data);
  };
  useEffect(() => {
    getData();
    if (map && marker && showMap) {
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
                content: `Available at: ${item.item_id}`,
              });
              infowindow.open(map, marker);
              goToCalendar(item.item_id); //change this to item.id when the data is available
            });
          }
        }
      });
  
      setMapRendered(true);
    }
  }, [map, marker, radius,showMap]);

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
    <div className='form-div'>
      <div className='title' style={{fontSize: '48px'}}>
          Availability Viewer
      </div>
        <div className='description' style={{fontSize: '40px'}}>
        Check out our availability and book the date and time that works for you!
        </div>
        <hr>
        </hr>
      <form onSubmit={handleSubmit}>
        <div className='location'>
          <label style={{fontSize: '40px'}}>
            Enter Location:
            <GoogleAutocomplete
              apiKey={process.env.REACT_APP_GOOGLE_API_KEY}
              onPlaceSelected={handlePlaceSelect}
              types={['(regions)']}
              placeholder="Enter a location"
              id="autocomplete"
              style={{ width: '400px', height: '40px', fontSize: '40px' }}
            /> 
          </label>
        
        </div>
        <div>
          <label className='radius' style={{fontSize: '40px'}}>
            Select Radius (in miles):  
            <input type="number" value={radius} onChange={handleRadiusSelect} style={{ width: '400px', height: '40px', fontSize: '40px' }}/>
          </label>
          
        </div>

        <button className="booking-button" type="submit">Submit</button>
      </form>
    </div>
    
    <div className='map-div'>
      {showMap && location && (
        <MapComponent
          location={location}
          radius={radius}
          onLoad={handleMapLoad}
          onMarkerLoad={handleMarkerLoad}
        />
      )}
    </div>
    </div>
  )};


export default Map;