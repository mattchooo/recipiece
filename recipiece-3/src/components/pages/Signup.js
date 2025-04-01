import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../Button';
import Footer from '../Footer';
import './Signup.css';

function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('User signed up:', formData);
    localStorage.setItem('userData', JSON.stringify(formData));
    navigate('/login');
  };

  return (
    <div>
      <div className="signup-page">
        <h1>Create an Account</h1>
        <form className="signup-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <button type="submit">Sign Up</button>
        </form>
        <p className="signup-login-redirect">
          Already have an account?{' '}
          <Link to="/login" className="login-link">
            Click here to log in.
          </Link>
        </p>
      </div>
      <Footer />
    </div>
  );
}

export default Signup;
