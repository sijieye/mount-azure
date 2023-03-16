import './App.css';
import GoogleAutocomplete from 'react-google-autocomplete';
import React, { useState } from 'react';
import MapComponent from './MapComponent';

function App() {
  const [location, setLocation] = useState('');
  const [radius, setRadius] = useState(5);

  function handlePlaceSelect(place) {
    console.log(place);
    setLocation(place.formatted_address);
  }

  function handleRadiusSelect(event) {
    setRadius(event.target.value);
  }

  function handleSubmit(event) {
    event.preventDefault();
    // handle form submission here
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
          <select value={radius} onChange={handleRadiusSelect}>
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="15">15</option>
          </select>
        </label>
        <br />
        <button type="submit">Submit</button>
      </form>
      {location && <MapComponent location={location} radius={radius} />}
    </div>
  );
}
export default App;
