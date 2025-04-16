import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext';
import Footer from '../Footer';
import './Signup.css';

function Login() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [loginError, setLoginError] = useState('');

  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setLoginData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await fetch('http://localhost:5000/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData),
        credentials: 'include',
      });
  
      const result = await response.json();
  
      if (response.ok) {
        console.log('Login success:', result);
        login(loginData);
        navigate('/');
      } else {
        setLoginError(result.error || 'Login failed');
      }
    } catch (err) {
      console.error('Login error:', err);
      setLoginError('Network error. Please try again later.');
    }
  };

  return (
    <div>
      <div className="signup-page">
        <h1>Log In</h1>
        {loginError && <h2>{loginError}</h2>}
        <form className="signup-form" onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={loginData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={loginData.password}
            onChange={handleChange}
            required
          />
          <button type="submit">Log In</button>
        </form>
        <p className='signup-login-redirect'>
          Forgot your password?{' '}
          <Link to="/forgot-password" className='login-link'>
            Click here.
          </Link>
        </p>
        <p className="signup-login-redirect">
          Don't have an account?{' '}
          <Link to="/sign-up" className="login-link">
            Click here to sign-up.
          </Link>
        </p>
      </div>
      <Footer />
    </div>
  );
}

export default Login;
