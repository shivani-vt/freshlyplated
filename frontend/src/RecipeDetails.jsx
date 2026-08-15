import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import "./RecipeDetails.css";

function RecipeDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:3001/recipes/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setRecipe(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load recipe details:", err);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return <div className="recipe-details-container loading-state">Loading recipe...</div>;
  }

  if (!recipe) {
    return (
      <div className="recipe-details-container error-state">
        <h2>Recipe not found</h2>
        <Link to="/" className="btn-back">← Back to Library</Link>
      </div>
    );
  }

  // Parse ingredients separated by newlines
  const ingredientList = recipe.ingredients
    ? recipe.ingredients.split("\n").filter((item) => item.trim().length > 0)
    : [];

  return (
    <div className="recipe-details-container">
      {/* Header Bar */}
      <div className="recipe-details-header">
        <div>
          <Link to="/" className="back-link">← Back to Recipes</Link>
          <h1>{recipe.name}</h1>
          <div className="recipe-meta-badges">
            <span className="badge-status">{recipe.status?.replace("_", " ")}</span>
            {recipe.prep_time_minutes && (
              <span className="badge-time">⏱️ Prep: {recipe.prep_time_minutes}m</span>
            )}
            {recipe.cook_time_minutes && (
              <span className="badge-time">🍳 Cook: {recipe.cook_time_minutes}m</span>
            )}
            {recipe.tags && <span className="badge-tags">🏷️ {recipe.tags}</span>}
          </div>
        </div>

        <div className="header-action-buttons">
          <Link to={`/recipes/${recipe.id}/edit`} className="btn-edit-recipe">
            ✏️ Edit Recipe
          </Link>
          <button
            onClick={() => navigate("/content-items/new", { state: { defaultRecipeId: recipe.id } })}
            className="btn-schedule-content"
          >
            🎬 Schedule Content
          </button>
        </div>
      </div>

      {/* Main Grid: Comparison & Recipe Specs */}
      <div className="recipe-main-grid">
        {/* Left Column: Ingredients & Method */}
        <div className="recipe-info-card">
          {recipe.image_url && (
            <img
              src={recipe.image_url}
              alt={recipe.name}
              className="recipe-detail-image"
            />
          )}

          <div className="recipe-section">
            <h2>🛒 Ingredients</h2>
            {ingredientList.length === 0 ? (
              <p className="empty-text">No ingredients listed.</p>
            ) : (
              <ul className="ingredients-checklist">
                {ingredientList.map((ing, idx) => (
                  <li key={idx}>{ing}</li>
                ))}
              </ul>
            )}
          </div>

          <div className="recipe-section">
            <h2>👩‍🍳 Method & Instructions</h2>
            {recipe.method ? (
              <div className="method-text">{recipe.method}</div>
            ) : (
              <p className="empty-text">No cooking instructions provided.</p>
            )}
          </div>
        </div>

        {/* Right Column: Dual View (Original vs Adjusted Recipe) */}
        <div className="dual-view-card">
          <h2>Recipe Transformation</h2>
          <p className="dual-view-subtitle">
            Side-by-side comparison between the inspiration source and your version.
          </p>

          <div className="comparison-grid">
            {/* Original Source */}
            <div className="comparison-box original">
              <div className="comparison-header">
                <h3>Original Recipe</h3>
                {recipe.original_recipe_link && (
                  <a
                    href={recipe.original_recipe_link}
                    target="_blank"
                    rel="noreferrer"
                    className="source-link"
                  >
                    View Link ↗
                  </a>
                )}
              </div>
              <div className="comparison-content">
                {recipe.original_recipe_text ? (
                  <pre>{recipe.original_recipe_text}</pre>
                ) : (
                  <p className="empty-text">No original recipe text saved.</p>
                )}
              </div>
            </div>

            {/* FreshlyPlated Adjusted Version */}
            <div className="comparison-box adjusted">
              <div className="comparison-header">
                <h3>FreshlyPlated Version</h3>
                <span className="adjusted-tag">Modified</span>
              </div>
              <div className="comparison-content">
                {recipe.adjusted_recipe_text ? (
                  <pre>{recipe.adjusted_recipe_text}</pre>
                ) : (
                  <p className="empty-text">No custom adjustments recorded yet.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RecipeDetails;