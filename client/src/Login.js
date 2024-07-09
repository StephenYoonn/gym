import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const log = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/login', formData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      setMessage(response.data.message); // Set the message from the response
    } catch (error) {
      setMessage('There was an error logging in!'); // Set an error message
      console.error('There was an error logging in!', error);
    }
  };

  const navigateToSignup = () => {
    navigate('/signup'); // Navigate to the signup page
  };

  
  return (
    <div>
      <form onSubmit={log}>
        <h3 align="center">Log In</h3>
        <div className="form-group" align="center">
          <label htmlFor="email" style={{ paddingBottom: '25px' }}>Email Address</label>
          <input
            type="text"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="form-control"
            placeholder="Enter Email"
            autoComplete="off"
            
          />
          <br></br>
          <label htmlFor="password" style={{ padding: '20px' }}>Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="form-control"
            placeholder="Enter Password"
            autoComplete="off"
          />

          <br />
          <div style={{ padding: "20px", display: 'flex', justifyContent: 'center', gap: '20px' }}>
            <button className="btn btn-primary" type="submit">Log In</button>
            <button onClick={navigateToSignup} className="btn btn-secondary" type="button">Sign Up</button>
          </div>

        </div>
      </form>

      

      {message && <p>{message}</p>}
    </div>
  );
};


export default Login;









