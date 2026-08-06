import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";


function RecipeDetails() {
    const { id } = useParams();
    const [recipe, setRecipe] = useState(null);
    useEffect(() => {

    fetch(`http://localhost:3001/recipes/${id}`)
      .then(response => response.json())
      .then(data => {
        setRecipe(data);
      });
    },[id]);

     if (!recipe) {
    return <p>Loading recipe...</p>;
  }

    return (
  <div className="recipe-details">

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



    <section>
      <h2>Original Recipe</h2>
      <p>
        {recipe.original_recipe_text}
      </p>
    </section>



    <section>
      <h2>FreshlyPlated Version</h2>
      <p>
        {recipe.adjusted_recipe_text}
      </p>
    </section>



    <Link to={`/recipes/${recipe.id}/edit`}>
      Edit Recipe
    </Link>


  </div>
);
}

export default RecipeDetails;