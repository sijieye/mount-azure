import React from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route }from "react-router-dom";
import Calendar from "./Calendar";
import Map from "./Map";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/Calendar" element={<Calendar/>}/>
        <Route path="/" element={<Map/>}/>
      </Routes>
    </Router>
  );
}

export default App;