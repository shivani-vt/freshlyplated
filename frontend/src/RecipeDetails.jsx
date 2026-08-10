import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import "./RecipeDetails.css";

function RecipeDetails() {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);

  const handleAddToShoppingList = async () => {
    try {
      const response = await fetch(
        "http://localhost:3001/shopping-lists/from-recipes",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            recipe_ids: [id],
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create shopping list");
      }

      console.log("Shopping list created:", data);

      alert("Recipe added to shopping list!");
    } catch (error) {
      console.error("Failed to create shopping list:", error);
      alert("Failed to add recipe to shopping list.");
    }
  };

  useEffect(() => {
    fetch(`http://localhost:3001/recipes/${id}`)
      .then((response) => response.json())
      .then((data) => {
        setRecipe(data);
      });
  }, [id]);

  if (!recipe) {
    return <p>Loading recipe...</p>;
  }

  return (
    <div>
      <Link to="/">
        ← Back to recipes
      </Link>

      {recipe.image_url && (
        <img
          className="recipe-details-image"
          src={recipe.image_url}
          alt={recipe.name}
        />
      )}

      <h1>{recipe.name}</h1>

      <div className="details-stats">
        <div>
          <p>⏱ Prep Time</p>
          <h3>{recipe.prep_time_minutes} mins</h3>
        </div>

        <div>
          <p>🔥 Cook Time</p>
          <h3>{recipe.cook_time_minutes} mins</h3>
        </div>

        <div>
          <p>Status</p>
          <h3>{recipe.status}</h3>
        </div>
      </div>

      {recipe.tags && (
        <div className="recipe-details-tags">
          {recipe.tags.split(",").map((tag, index) => (
            <span key={index}>
              {tag.trim()}
            </span>
          ))}
        </div>
      )}

      {recipe.ingredients && (
        <section>
          <h2>Ingredients</h2>

          <ul className="ingredients-list">
            {recipe.ingredients.split("\n").map((ingredient, index) => (
              <li key={index}>
                {ingredient}
              </li>
            ))}
          </ul>
        </section>
      )}

      {recipe.method && (
        <section>
          <h2>Cooking Method</h2>

          <ol className="method-list">
            {recipe.method.split("\n").map((step, index) => (
              <li key={index}>
                {step}
              </li>
            ))}
          </ol>
        </section>
      )}

      <section>
        <h2>Original Recipe</h2>

        <p className="recipe-text">
          {recipe.original_recipe_text}
        </p>
      </section>

      <section>
        <h2>FreshlyPlated Version</h2>

        <p className="recipe-text">
          {recipe.adjusted_recipe_text}
        </p>
      </section>

      <Link to={`/recipes/${recipe.id}/edit`}>
        Edit Recipe
      </Link>

      <button onClick={handleAddToShoppingList}>
        🛒 Add to Shopping List
      </button>
    </div>
  );
}

export default RecipeDetails;