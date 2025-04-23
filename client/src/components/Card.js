import React from 'react';
import './pages/Confirm.css'; 

function Card({ recipe, isSelected, onSelect, onClick }) {
  if (!recipe) return null;

  return (
    <div className="recipe-card-link">
      <div
        className={`recipe-card ${isSelected ? 'selected' : ''}`}
        onClick={onClick}
      >
        <img src={recipe.thumbnail} alt={recipe.name} />
        <h3>{recipe.name}</h3>
        {onSelect && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelect(recipe.id);
            }}
          >
            {isSelected ? 'Selected' : 'Select'}
          </button>
        )}
      </div>
    </div>
  );
}

export default Card;