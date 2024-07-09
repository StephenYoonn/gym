import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
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


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/user', formData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      setMessage(response.data.message); // Set the message from the response
    } catch (error) {
      setMessage('There was an error creating the user!'); // Set an error message
      console.error('There was an error creating the user!', error);
    }
  };



  const navigateToLogin = () => {
    navigate('/')
  };

  return (
    <div>
    <form onSubmit={handleSubmit}>
      <h3 align="center">Sign Up</h3>
      <div className="form-group" align = "center">
        <label htmlFor="email">Email Address</label>
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

        <label htmlFor="name">Name</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="form-control"
          placeholder="Enter Name"
          autoComplete="off"
        />
        
        <label htmlFor="password">Password</label>
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
        <div style={{ padding: "20px", display: 'flex', justifyContent: 'center', gap: '20px', align:'center' }}>
          
          <button onClick={navigateToLogin} className="btn btn-secondary" type="button">Back to Login</button>
          <button className="btn btn-primary" type="submit">Sign Up</button>

        </div>
      </div>
    </form>
    {message && <p>{message}</p>}
  </div>
  );
};

export default Signup;
