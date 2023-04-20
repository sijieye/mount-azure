import React from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route }from "react-router-dom";
import Calendar from "./Calendar";
import Map from "./Map";
import { useParams } from 'react-router-dom';

function App() {
  
  return (
    <Router>
      <Routes>
        <Route path="/Calendar/:id" element={<CalendarWrapper/>}/>
        <Route path="/" element={<Map/>}/>
      </Routes>
    </Router>
  );
}

// wrapper function to check if the id field is available
// display the calendar if it is
function CalendarWrapper() {
  const {id} = useParams();
  const renderCalendar = () => { 
    if (id === undefined) {
      return <p>Error</p>
    }
    return <Calendar item_id={id} />
  }
  return (
    renderCalendar()
  )
}

export default App;