import React, { useEffect, useState } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import Footer from '../Footer';
import './Recipe.css';

function Recipe() {
  const { mealId } = useParams();
  const location = useLocation();
  const [recipe, setRecipe] = useState(null);
  const [error, setError] = useState('');
  const [saveCount, setSaveCount] = useState(null);


  const fromPage = location.state?.from;

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const res = await fetch(`http://localhost:5000/recipes/${mealId}`, {
          credentials: 'include'
        });
        const data = await res.json();
        if (res.ok) {
          setRecipe(data.recipe);
        } else {
          setError(data.error);
        }
      } catch (err) {
        setError('Failed to load recipe.');
      }
    };

    const fetchSaveCount = async () => {
      try {
        const res = await fetch(`http://localhost:5000/recipes/savecount/${mealId}`, {
          credentials: 'include'
        });
        const data = await res.json();
        if (res.ok) {
          setSaveCount(data.count);
        }
      } catch (err) {
        console.error('Failed to load save count');
      }
    };

    fetchRecipe();
    fetchSaveCount();
  }, [mealId]);

  return (
    <div>
      {recipe ? (
        <div className="recipe-page">
          <div className="recipe-header">
            <Link
              to={
                fromPage === 'confirm'
                  ? `/confirm?fridgeId=${location.state?.fridgeId}`
                  : "/recipes"
              }
              className="back-button"
            >
              &lt;&lt; {fromPage === 'confirm' ? "Review Recipes" : "Past Recipes"}
            </Link>
          </div>

          <div className="recipe-content">
            <div className="recipe-image">
              <img src={recipe.thumbnail} alt={recipe.name} />
            </div>

            <div className="recipe-info">
              <h2>{recipe.name}</h2>
              {saveCount !== null && (
                <p className="save-count">This recipe has been saved {saveCount} time{saveCount !== 1 ? 's' : ''}.</p>
              )}
              <h3>Ingredients:</h3>
              <ul>
                {recipe.ingredients.split(',').map((item, index) => (
                  <li key={index}>{item.trim()}</li>
                ))}
              </ul>

              <h3>Instructions:</h3>
              <p>{recipe.instructions}</p>
            </div>
          </div>
        </div>
      ) : (
        <p>{error}</p>
      )}
      <Footer />
    </div>
  );
}

export default Recipe;
