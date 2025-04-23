import React from 'react';
import { Link } from 'react-router-dom';
import './NotFound.css'; // Optional for styling

function NotFound() {
  return (
    <div className="not-found-page">
      <h1>404</h1>
      <h2>Page Not Found</h2>
      <p>Sorry, we couldn't find the page you were looking for.</p>
      <Link to="/" className="back-home">← Back to Home</Link>
    </div>
  );
}

export default NotFound;