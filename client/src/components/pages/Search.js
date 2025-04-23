import React, { useState, useEffect } from 'react';
import Footer from '../Footer';
import Card from '../Card';
import './Search.css';
import { Button } from '../Button';

function Search() {
  const [query, setQuery] = useState('');
  const [filtered, setFiltered] = useState([]);
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    const fetchAllRecipes = async () => {
      try {
        const res = await fetch('http://localhost:5000/recipes/all', {
          credentials: 'include'
        });
        const data = await res.json();
        if (res.ok) {
          setRecipes(data.recipes);
        }
      } catch (err) {
        console.error('Failed to load all recipes:', err);
      }
    };

    fetchAllRecipes();
  }, []);

  const handleSearch = () => {
    const filteredList = recipes.filter(recipe =>
      recipe.name.toLowerCase().includes(query.toLowerCase())
    );
    setFiltered(filteredList);
  };

  return (
    <div>
      <div className='search-page'>
        <h1>Search Recipes</h1>

        <div className="search-bar-container">
          <input
            type="text"
            className="giant-search-bar"
            placeholder="Search Item"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
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

        <div className="recipe-grid">
          {filtered.map(recipe => (
            <Card
              key={recipe.id}
              recipe={recipe}
              isSelected={false}
              onClick={() =>
                window.location.href = `/recipes/meal/${recipe.mealId}`
              }
            />
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Search;
