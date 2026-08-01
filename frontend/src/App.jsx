import { useState, useEffect } from "react";
import RecipeCard from "./components/RecipeCard";
import "./App.css";
import AddRecipeForm from "./components/AddRecipeForm";
//useState gives a React component memory to store data that can change.
// //useEffect - when the data changes using setRecipes(), React automatically re-renders the page.
function App() {

  const [recipes, setRecipes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

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

  const filteredRecipes = recipes.filter(recipe =>
  recipe.name.toLowerCase().includes(searchTerm.toLowerCase())
);

  return (
    <div>
      <h1>FreshlyPlated</h1>
      <p>My recipe collection</p>

      <input
      type="text"
      placeholder="Search recipes..."
      value={searchTerm}
      onChange={(event) => setSearchTerm(event.target.value)}
/>

      <AddRecipeForm />

       <div className="recipe-container">
       {filteredRecipes.length === 0 ? (
        <p>No recipes found </p>
        ) : (
        filteredRecipes.map(recipe => (
          <RecipeCard
            key={recipe.id}
            recipe={recipe}
            deleteRecipe={deleteRecipe}
            updateStatus={updateStatus}
          />
        ))
      )}
        </div>
    </div>
  );
}

function updateStatus(id, newStatus) {

  fetch(`http://localhost:3001/recipes/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      status: newStatus
    })
  })
  .then(response => response.json())
  .then(updatedRecipe => {

    //Go through every recipe. If this is the one we updated, replace it. Otherwise keep it.

    setRecipes(
      recipes.map(recipe =>
        recipe.id === id ? updatedRecipe : recipe
      )
    );

  });

}

export default App;