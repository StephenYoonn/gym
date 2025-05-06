import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ResetPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  const handleReset = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/reset-password', { email }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      setMessage(response.data.message); // Set success message
    } catch (error) {
      setMessage('There was an error resetting your password!');
      console.error('Error resetting password:', error);
    }
  };

  const navigateToLogin = () => {
    navigate('/login'); // Adjust route if needed
  };

  return (
    <div>
      <form onSubmit={handleReset}>
        <h3 align="center">Reset Password</h3>
        <div className="form-group" align="center">
          <label htmlFor="email" style={{ paddingBottom: '25px' }}>Email Address</label>
          <input
            type="text"
            id="email"
            name="email"
            value={email}
            onChange={handleChange}
            className="form-control"
            placeholder="Enter your email"
            autoComplete="off"
          />

          <br />
          <div style={{ padding: "20px", display: 'flex', justifyContent: 'center', gap: '20px' }}>
            <button className="btn btn-primary" type="submit">Send Reset Link</button>
            <button onClick={navigateToLogin} className="btn btn-secondary" type="button">Back to Login</button>
          </div>
        </div>
      </form>

      {message && <p align="center">{message}</p>}
    </div>
  );
};

export default ResetPassword;
