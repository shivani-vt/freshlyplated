import { Link } from "react-router-dom";
import "./RecipeCard.css";

function RecipeCard({ recipe, onDelete, deleteRecipe }) {
  if (!recipe) return null;

  const handleDelete = onDelete || deleteRecipe;

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

  const totalTime = (Number(recipe.prep_time_minutes) || 0) + (Number(recipe.cook_time_minutes) || 0);

  // Safe tag parsing
  const tagsList = typeof recipe.tags === "string" 
    ? recipe.tags.split(",").map((t) => t.trim()).filter(Boolean)
    : Array.isArray(recipe.tags) ? recipe.tags : [];

  // Safe ingredients count
  const ingredientsCount = typeof recipe.ingredients === "string"
    ? recipe.ingredients.split("\n").filter(Boolean).length
    : 0;

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
            <h3 className="card-title">{recipe.name || "Untitled Recipe"}</h3>
          </Link>
        </div>

        {tagsList.length > 0 && (
          <div className="card-tags">
            {tagsList.slice(0, 3).map((tag, i) => (
              <span key={i} className="tag-chip">
                #{tag.replace(/^#/, "")}
              </span>
            ))}
          </div>
        )}

        <div className="card-meta">
          <div className="meta-item">
            <span className="meta-icon">⏱️</span>
            <span>{totalTime > 0 ? `${totalTime} mins` : "Quick"}</span>
          </div>
          {ingredientsCount > 0 && (
            <div className="meta-item">
              <span className="meta-icon">🛒</span>
              <span>{ingredientsCount} items</span>
            </div>
          )}
        </div>

        <div className="card-actions">
          <Link to={`/recipes/${recipe.id}`} className="btn-view">
            View Recipe
          </Link>
          {handleDelete && (
            <button
              type="button"
              onClick={() => handleDelete(recipe.id)}
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