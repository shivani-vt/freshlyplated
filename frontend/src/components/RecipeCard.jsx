import "./RecipeCard.css";
import { Link } from "react-router-dom";

function RecipeCard({ recipe, deleteRecipe, updateStatus }) {
  return (
    <div className="recipe-card">

      <Link 
        to={`/recipes/${recipe.id}`}
        className="recipe-title"
      >
        <h2>{recipe.name}</h2>
      </Link>


      <div className="recipe-info">

        <p>
          ⏱ Prep: {recipe.prep_time_minutes || 0} mins
        </p>

        <p>
          🔥 Cook: {recipe.cook_time_minutes || 0} mins
        </p>

      </div>


      <div className="recipe-status">

        {recipe.status === "planning" && (
          <span>📝 Planning</span>
        )}

        {recipe.status === "cooking" && (
          <span>🔥 Cooking</span>
        )}

        {recipe.status === "completed" && (
          <span>✅ Completed</span>
        )}

      </div>


      {recipe.tags && (
        <p className="recipe-tags">
          🏷 {recipe.tags}
        </p>
      )}


      <div className="recipe-buttons">

        <button 
          onClick={() => updateStatus(recipe.id, "cooking")}
        >
          Start Cooking
        </button>

        <Link to={`/recipes/${recipe.id}/edit`}>
        <button>Edit</button>
        </Link>


        <button 
          onClick={() => deleteRecipe(recipe.id)}
          className="delete-button"
        >
          Delete
        </button>

      </div>


    </div>
  );
}

export default RecipeCard;