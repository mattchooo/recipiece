import React, { useState } from 'react';
import Footer from '../Footer';
import './Search.css';
import { Button } from '../Button';
import Card from '../Card'; // t

function Search() {
  const [query, setQuery] = useState('');
  const [showResult, setShowResult] = useState(false);

  const handleInputChange = (e) => {
    setQuery(e.target.value.toLowerCase());
  };

  const handleSearch = () => {
    if ('cheeseburger'.startsWith(query)) {
      setShowResult(true);
    } else {
      setShowResult(false);
    }
  };

  return (
    <div>
      <div className='search-page'>
        <div className="search-bar-container">
          <input
            type="text"
            className="giant-search-bar"
            placeholder="Search Item"
            value={query}
            onChange={handleInputChange}
          />
          <Button
            className='btns'
            buttonStyle='btn--search'
            buttonSize='btn--large'
            onClick={handleSearch}
          >
            <i className="fas fa-search" />
          </Button>
        </div>
        <div className='results-container'>
        {showResult && (
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
        )}
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Search;
