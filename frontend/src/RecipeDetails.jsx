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
         <div>
            <Link to="/">
            ← Back to recipes
            </Link>

      <h1>{recipe.name}</h1>

      <p>Status: {recipe.status}</p>

      <p>
        Prep time: {recipe.prep_time_minutes} minutes
      </p>

      <p>
        Cook time: {recipe.cook_time_minutes} minutes
      </p>

        <p>
        Tags: {recipe.tags}     
        </p>

        <h2>Original Recipe</h2>
        <p>
            {recipe.original_recipe_text}
        </p>

        <h2>FreshlyPlated Version</h2>
        <p>
            {recipe.adjusted_recipe_text}
        </p>

        <Link to={`/recipes/${recipe.id}/edit`}>Edit Recipe</Link>

    </div>
    
  );
}

export default RecipeDetails;