import { Link } from "react-router-dom";
import "./RecipeCard.css";

function RecipeCard({ recipe, onDelete }) {
  const tagsArray = Array.isArray(recipe.tags)
    ? recipe.tags
    : recipe.tags
    ? recipe.tags.split(",").map((t) => t.trim())
    : [];

  return (
    <div className="recipe-card">
      <div className="recipe-card-image-wrapper">
        {recipe.image_url ? (
          <img
            src={recipe.image_url}
            alt={recipe.name}
            className="recipe-card-image"
          />
        ) : (
          <div className="recipe-card-placeholder">🍽️</div>
        )}

        <span className={`recipe-status-pill ${recipe.status || "planning"}`}>
          {recipe.status || "planning"}
        </span>
      </div>

      <div className="recipe-card-body">
        <h3 className="recipe-card-title">{recipe.name}</h3>

        {tagsArray.length > 0 && (
          <div className="recipe-tags-list">
            {tagsArray.map((tag, index) => (
              <span key={index} className="recipe-tag">
                #{tag.replace(/^#/, "")}
              </span>
            ))}
          </div>
        )}

        <div className="recipe-meta-row">
          {(recipe.cook_time_minutes || recipe.prep_time_minutes) && (
            <span>
              ⏱️ {Number(recipe.prep_time_minutes || 0) + Number(recipe.cook_time_minutes || 0)} mins
            </span>
          )}
        </div>

        <div className="recipe-actions-row">
          <Link to={`/recipes/${recipe.id}`} className="btn-view-recipe">
            View Recipe
          </Link>
          <button
            type="button"
            className="btn-delete-recipe"
            onClick={() => onDelete(recipe.id)}
            title="Delete Recipe"
          >
            🗑️
          </button>
        </div>
      </div>
    </div>
  );
}

export default RecipeCard;