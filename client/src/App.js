import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Signup from './Signup'; // Adjust the path if needed
import Layout from './layout'; 
import Login from './Login'
import Exercise from './Exercise'
import OldExercise from './OldExercise'
import LogSession from './LogSession';
import VisualizationRecharts from './VisualizationRecharts';



function App() {
  return (
    <div>
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Login/>} /> {/* Set Signup as the home page */}
          <Route path="/user" element={<Signup />} /> {/* Route for the signup page */}
          <Route path="/exercise" element={<Exercise />} />{/* Route for the signup page */}
          <Route path="/oldexercise" element={<OldExercise />} />{/* Route for the signup page */}
          <Route path="/log" element={<LogSession />} />{/* Route for the signup page */}
          <Route path="/visualization" element={<VisualizationRecharts />} />{/* Route for the signup page */}
          {/* Add more routes as needed */}
        </Routes>
      </Layout>
    </Router>
    </div>
  );
}




export default App;
