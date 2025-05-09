import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Footer from '../Footer';
import './Signup.css';

function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    name: '',
    email: '',
    password: ''
  });

  const [signupError, setSignupError] = useState('');

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSignupError(''); 
  
    try {
      const response = await fetch('http://localhost:5000/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
  
      const result = await response.json();
  
      if (response.ok) {
        console.log('Signup success:', result);
        navigate('/login');
      } else {
        setSignupError(result.error || 'Signup failed');
      }
    } catch (error) {
      console.error('Error during signup:', error);
      setSignupError('Network error during signup');
    }
  };

  return (
    <div>
      <div className="signup-page">
        <h1>Create an Account</h1>
        {signupError && <h2>{signupError}</h2>}
        <form className="signup-form" onSubmit={handleSubmit}>
        <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            required
          />
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
