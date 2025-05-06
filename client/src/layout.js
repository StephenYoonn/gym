import React from 'react';
import { Link } from 'react-router-dom';

const Layout = ({ children }) => {
  return (
    <div>
      <header>
        <h1>Gym Tracking WebApp</h1>
        
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/user">Sign Up</Link></li>
            <li><Link to="/exercise">Exercise</Link></li>
            <li><Link to="/oldexercise">Old Exercise</Link></li>
            <li><Link to="/log">Log Session</Link></li>
            <li><Link to="/visualization">Visualization</Link></li>
            {/* Add more links as needed */}
          </ul>
      
      </header>
      <main>
        {children}
      </main>
    </div>
  );
};

export default Layout;
