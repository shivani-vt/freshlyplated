import { useState, useEffect } from "react";
import RecipeCard from "./components/RecipeCard";
import "./App.css";
//useState gives a React component memory to store data that can change.
// //useEffect - when the data changes using setRecipes(), React automatically re-renders the page.
function App() {

  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3001/recipes") //fetches data from backend
      .then(response => response.json()) //converts JSON to JS 
      .then(data => {
        console.log(data); 
        setRecipes(data); //updates data 
      });

  }, []);

  function deleteRecipe(id) {

  fetch(`http://localhost:3001/recipes/${id}`, {
    method: "DELETE"
  });
  setRecipes(
    recipes.filter(recipe => recipe.id !== id)
  );

}

  return (
    <div>
      <h1>FreshlyPlated</h1>
      <p>My recipe collection</p>
       <div className="recipe-container">
       {recipes.map(recipe => (
          <RecipeCard 
          recipe={recipe}
          key={recipe.id}
          deleteRecipe={deleteRecipe}
          /> //creates a recipe card for each recipe 
        ))}
        </div>
    </div>
  );
}

export default App;