import React from 'react';
import './Cheeseburger.css'; 
//import cheeseburgerImage from '../../images/cheeseburger.png'; 
import { Link } from 'react-router-dom';
import Footer from '../Footer';

function Cheeseburger() {
  return (
    <div>
    <div className="recipe-page">
      <div className="recipe-header">
        <Link to="/recipes" className="back-button">&lt;&lt; Past Recipes</Link>
      </div>
      <div className="recipe-content">
        <div className="recipe-image">
          {/*<img src={cheeseburgerImage} alt="Cheeseburger" />*/}
        </div>

        <div className="recipe-info">
          <h2>Cheeseburger:</h2>
          <p className="made-count">You made this recipe 5 times before</p>

          <div className="ratings">
            <span>98 <i className="fas fa-thumbs-up" /></span>
            <span>7 <i className="fas fa-thumbs-down" /></span>
          </div>

          <h3>Ingredients:</h3>
          <ul>
            <li>1.5 lbs of ground beef (80/20 mix is perfect)</li>
            <li>1 heaping tablespoon of sweet relish</li>
            <li>1 Tablespoon of yellow mustard</li>
            <li>1 Tablespoon of kitchen bouquet browning sauce or soy sauce</li>
          </ul>
        </div>
      </div>
    </div>
    <Footer />
    </div>
  );
}

export default Cheeseburger;

