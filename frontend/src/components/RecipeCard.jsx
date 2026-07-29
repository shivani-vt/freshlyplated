import "./RecipeCard.css";
function RecipeCard({recipe,deleteRecipe}) {
    return (
        <div className="recipe-card">
            <h2>{recipe.name}</h2>

            {recipe.status === "planning" && (
                <p>📝 Planning</p>
            )}

            {recipe.status === "cooking" && (
                <p>🔥 Cooking</p>
            )}

            {recipe.status === "completed" && (
            <p>✅ Completed</p>
            )}

            <p>Prep time: {recipe.prep_time_minutes} minutes</p>
            <p>Cook time: {recipe.cook_time_minutes} minutes</p>

            <button onClick={() => deleteRecipe(recipe.id)}>Delete</button>

            


        </div>
    );
}

export default RecipeCard;