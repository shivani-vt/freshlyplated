import { Routes, Route } from "react-router-dom";
import RecipeDetails from "./RecipeDetails";
import { useState, useEffect } from "react";
import RecipeCard from "./components/RecipeCard";
import "./App.css";
import AddRecipeForm from "./components/AddRecipeForm";
import EditRecipe from "./EditRecipe";
import ContentTracker from "./pages/ContentTracker";
import CreateContentItem from "./CreateContentItem";
import Dashboard from "./Dashboard";

function App() {

  const [recipes, setRecipes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");


  function fetchRecipes() {

  fetch("http://localhost:3001/recipes")
    .then(response => response.json())
    .then(data => {
      setRecipes(data);
    });

  }


  useEffect(() => {
  fetchRecipes();
  }, []);


  function deleteRecipe(id) {

    fetch(`http://localhost:3001/recipes/${id}`, {
      method: "DELETE"
    });

    setRecipes(
      recipes.filter(recipe => recipe.id !== id)
    );

  }


  function updateStatus(id, newStatus) {

  const recipe = recipes.find(recipe => recipe.id === id);

  fetch(`http://localhost:3001/recipes/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      name: recipe.name,
      status: newStatus,
      prep_time_minutes: recipe.prep_time_minutes,
      cook_time_minutes: recipe.cook_time_minutes
    })
  })
  .then(response => response.json())
  .then(updatedRecipe => {

    setRecipes(
      recipes.map(recipe =>
        recipe.id === id ? updatedRecipe : recipe
      )
    );

  });

}
const totalRecipes = recipes.length;

const planningCount = recipes.filter(
  recipe => recipe.status === "planning"
).length;

const cookingCount = recipes.filter(
  recipe => recipe.status === "cooking"
).length;

const completedCount = recipes.filter(
  recipe => recipe.status === "completed"
).length;



const filteredRecipes = recipes.filter(recipe => {

  const matchesSearch = recipe.name
    .toLowerCase()
    .includes(searchTerm.toLowerCase());


  const matchesStatus =
    selectedStatus === "all" ||
    recipe.status === selectedStatus;


  return matchesSearch && matchesStatus;

});


  

  return (
    <Routes>

    <Route
      path="/"
      element={
    <div>

      <div className="intro">

      <h1>FreshlyPlated 🍽️</h1>

      <p>
        Healthy recipes, takeaway favourites,
        and meal inspiration.
      </p>

      </div>


      <input
        type="text"
        placeholder="Search recipes..."
        value={searchTerm}
        onChange={(event) => setSearchTerm(event.target.value)}
      />


      <select
        value={selectedStatus}
        onChange={(event) => setSelectedStatus(event.target.value)}
      >
        <option value="all">All</option>
        <option value="planning">Planning</option>
        <option value="cooking">Cooking</option>
        <option value="completed">Completed</option>
      </select>

    <div className="stats-container">

      <div className="stat-card">
        <h3>📚</h3>
        <p>Total Recipes</p>
        <h2>{totalRecipes}</h2>
        </div>

      <div className="stat-card">
        <h3>📝</h3>
        <p>Planning</p>
        <h2>{planningCount}</h2>
      </div>

      <div className="stat-card">
        <h3>🔥</h3>
        <p>Cooking</p>
        <h2>{cookingCount}</h2>
      </div>

      <div className="stat-card">
        <h3>✅</h3>
        <p>Completed</p>
        <h2>{completedCount}</h2>
        </div>

    </div>


      <div className="add-recipe-section">
        <AddRecipeForm fetchRecipes={fetchRecipes} />
      </div>

      <div className="recipe-container">

        {filteredRecipes.length === 0 ? (
          <p>No recipes found</p>
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
      }
    />
      <Route
        path="/recipes/:id"
        element={<RecipeDetails />}
    />
      <Route
        path="/recipes/:id/edit"
        element={<EditRecipe />}
    />

      <Route
        path="/content-tracker"
        element={<ContentTracker />}
    />
      <Route
        path="/content-items/new"
        element={<CreateContentItem />}
    /> 
    <Route
      path="/dashboard"
      element={<Dashboard />}
    />

    </Routes>

  );
  
}


export default App;