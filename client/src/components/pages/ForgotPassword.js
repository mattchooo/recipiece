import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Footer from '../Footer';
import './Signup.css';

function ForgotPassword() {
  const [formData, setFormData] = useState({ email: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ email: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('http://localhost:5000/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok) {
        setSubmitted(true);
      } else {
        alert(data.error || 'Something went wrong.');
      }
    } catch (error) {
      console.error('Forgot password error:', error);
      alert('Server error. Please try again later.');
    }
  };

  return (
    <div>
      <div className="signup-page">
        <h1>Forgot Password</h1>
        {submitted ? (
          <p className="success-message">
            If this email exists, a reset link has been sent!
          </p>
        ) : (
          <form className="signup-form" onSubmit={handleSubmit}>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <button type="submit">Send Reset Email</button>
          </form>
        )}
        <p className="signup-login-redirect">
          Remembered your password?{' '}
          <Link to="/login" className="login-link">
            Click here to log in.
          </Link>
        </p>
      </div>
      <Footer />
    </div>
  );
}

export default ForgotPassword;

