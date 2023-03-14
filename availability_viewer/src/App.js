import logo from './logo.svg';
import './App.css';
import GoogleAutocomplete from 'react-google-autocomplete';



function App() {

  function handlePlaceSelect(place) {
    console.log(place);
    // You can use the selected place object to update your state or perform other actions
  }

  return (
    <div className="App">
      <header >
        
      </header>
      <GoogleAutocomplete
        apiKey={"AIzaSyATZWTQjFZVElmC_pXyTz9XNgSJftqhz5I"}
        onPlaceSelected={handlePlaceSelect}
        types={['(regions)']}
        placeholder="Enter a location"
      />
    </div>
  );
}

export default App;
