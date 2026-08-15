import { Link } from "react-router-dom";
import "./RecipeCard.css";

function RecipeCard({ recipe, onDelete }) {
  const formatStatus = (status) => {
    switch (status) {
      case "ready_to_cook":
        return "Ready to Cook";
      case "ready_to_upload":
        return "Ready to Upload";
      default:
        return status ? status.charAt(0).toUpperCase() + status.slice(1) : "Draft";
    }
  };

  const totalTime = (recipe.prep_time_minutes || 0) + (recipe.cook_time_minutes || 0);

  return (
    <div className="recipe-card-modern">
      <Link to={`/recipes/${recipe.id}`} className="card-image-link">
        <div className="card-image-wrapper">
          {recipe.image_url ? (
            <img src={recipe.image_url} alt={recipe.name} className="card-image" />
          ) : (
            <div className="card-image-placeholder">
              <span>🍳</span>
            </div>
          )}
          <span className={`status-pill status-${recipe.status || "planning"}`}>
            {formatStatus(recipe.status)}
          </span>
        </div>
      </Link>

      <div className="card-content">
        <div className="card-header-row">
          <Link to={`/recipes/${recipe.id}`} className="card-title-link">
            <h3 className="card-title">{recipe.name}</h3>
          </Link>
        </div>

        {recipe.tags && (
          <div className="card-tags">
            {recipe.tags.split(",").slice(0, 3).map((tag, i) => (
              <span key={i} className="tag-chip">
                #{tag.trim()}
              </span>
            ))}
          </div>
        )}

        <div className="card-meta">
          <div className="meta-item">
            <span className="meta-icon">⏱️</span>
            <span>{totalTime > 0 ? `${totalTime} mins` : "Quick"}</span>
          </div>
          {recipe.ingredients && (
            <div className="meta-item">
              <span className="meta-icon">🛒</span>
              <span>{recipe.ingredients.split("\n").filter(Boolean).length} items</span>
            </div>
          )}
        </div>

        <div className="card-actions">
          <Link to={`/recipes/${recipe.id}`} className="btn-view">
            View Recipe
          </Link>
          {onDelete && (
            <button
              onClick={() => onDelete(recipe.id)}
              className="btn-delete-icon"
              title="Delete recipe"
            >
              🗑️
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default RecipeCard;