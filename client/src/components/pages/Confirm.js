import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Footer from '../Footer';
import './Confirm.css';

function Confirm() {
  const [recipes, setRecipes] = useState([]);
  const [error, setError] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedIds, setSelectedIds] = useState([]);

  const queryParams = new URLSearchParams(location.search);
  const fridgeId = queryParams.get('fridgeId');

  const handleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await fetch(`http://localhost:5000/recipes/batch/${fridgeId}`, {
          credentials: 'include'
        });
        const data = await response.json();
        if (response.ok) {
          setRecipes(data.recipes);
        } else {
          setError(data.error || 'Something went wrong.');
        }
      } catch (err) {
        setError('Failed to load recipes.');
      }
    };

    if (fridgeId) {
      fetchRecipes();
    } else {
      setError('No fridge ID provided in URL.');
    }
  }, [fridgeId]);

  const handleConfirm = async () => {
    try {
      const res = await fetch('http://localhost:5000/recipes/confirm', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ selectedIds })
      });

      if (res.ok) {
        window.location.href = '/recipes';
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to save recipes.');
      }
    } catch (err) {
      console.error('Error saving recipes:', err);
      alert('Something went wrong.');
    }
  };


  return (
    <div>
      <div className="confirm-page">
        <h1>Review Your Recipes</h1>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <div className="recipe-grid">
          {recipes.map((recipe) => (
            <div key={recipe.id} className="recipe-card-link">
              <div
                className={`recipe-card ${selectedIds.includes(recipe.id) ? 'selected' : ''}`}
                onClick={() =>
                  navigate(`/recipes/meal/${recipe.mealId}`, {
                    state: { from: 'confirm', fridgeId }
                  })
                }
              >
                <img src={recipe.thumbnail} alt={recipe.name} />
                <h3>{recipe.name}</h3>
                <p>{recipe.matchPercent}% match</p>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelect(recipe.id);
                  }}
                >
                  {selectedIds.includes(recipe.id) ? 'Selected' : 'Select'}
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="confirm-link-container">
          <button onClick={handleConfirm} className="confirm-link">Confirm Recipes</button>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Confirm;
