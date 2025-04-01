import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext';
import Footer from '../Footer';
import './Signup.css';

function Login() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext); 

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

  const handleSubmit = (e) => {
    e.preventDefault();

    const storedData = JSON.parse(localStorage.getItem('userData'));

    if (
      storedData &&
      loginData.email === storedData.email &&
      loginData.password === storedData.password
    ) {
      login(loginData); 
      navigate('/');    
    } else {
      alert('Invalid credentials');
    }
  };

  return (
    <div>
      <div className="signup-page">
        <h1>Log In</h1>
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
