import React from 'react';
import Footer from '../Footer';
import Card from '../Card';
import './Recipes.css';

function Recipes() {
  return (
    <div className="recipes-page">
      <h1>Past Recipes</h1>

      <div className='cards'>
        <div className='cards__container'>
          <div className='cards__wrapper'>
            <ul className='cards__items'>
              <Card
                src='images/cheeseburger.png'
                text='Cheeseburger'
                path='/cheeseburger'
              />
            </ul>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Recipes;

