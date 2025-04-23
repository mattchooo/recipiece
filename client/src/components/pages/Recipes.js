import React, { useEffect, useState } from 'react';
import Footer from '../Footer';
import Card from '../Card';
import './Recipes.css';

function Recipes() {
  const [recipes, setRecipes] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const res = await fetch('http://localhost:5000/recipes/history', {
          credentials: 'include'
        });
        const data = await res.json();
        if (res.ok) {
          setRecipes(data.recipes);
        } else {
          setError(data.error || 'Failed to fetch recipes.');
        }
      } catch (err) {
        console.error('Error:', err);
        setError('Something went wrong.');
      }
    };

    fetchRecipes();
  }, []);

  return (
    <div>
      <div className="recipes-page">
        <h1>Past Recipes</h1>

        {error && <p style={{ color: 'red' }}>{error}</p>}

        <div className="recipe-grid">
          {recipes.map((recipe) => (
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

export default Recipes;
