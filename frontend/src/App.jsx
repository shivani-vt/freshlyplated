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
import ShoppingList from "./ShoppingList";
import Pantry from "./Pantry";
import EditContentItem from "./EditContentItem";
import CalendarView from "./CalendarView";
import Navbar from "./components/Navbar";

function App() {
  const [recipes, setRecipes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedRecipes, setSelectedRecipes] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);

  function fetchRecipes() {
    fetch("http://localhost:3001/recipes")
      .then((response) => response.json())
      .then((data) => {
        setRecipes(data);
      });
  }

  useEffect(() => {
    fetchRecipes();
  }, []);

  function deleteRecipe(id) {
    fetch(`http://localhost:3001/recipes/${id}`, {
      method: "DELETE",
    });

    setRecipes(
      recipes.filter((recipe) => recipe.id !== id)
    );
  }

function updateStatus(id, newStatus) {
  const recipe = recipes.find((recipe) => recipe.id === id);
  if (!recipe) return;

  fetch(`http://localhost:3001/recipes/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: recipe.name,
      status: newStatus,
      prep_time_minutes: recipe.prep_time_minutes,
      cook_time_minutes: recipe.cook_time_minutes,
      tags: recipe.tags,
      original_recipe_link: recipe.original_recipe_link,
      original_recipe_text: recipe.original_recipe_text,
      adjusted_recipe_text: recipe.adjusted_recipe_text,
      image_url: recipe.image_url,
      ingredients: recipe.ingredients,
      method: recipe.method,
    }),
  })
    .then((response) => response.json())
    .then((updatedRecipe) => {
      setRecipes(
        recipes.map((recipe) =>
          recipe.id === id ? updatedRecipe : recipe
        )
      );
    })
    .catch((error) => console.error("Error updating recipe status:", error));
}

  function toggleRecipeSelection(id) {
    setSelectedRecipes((currentSelected) => {
      if (currentSelected.includes(id)) {
        return currentSelected.filter(
          (recipeId) => recipeId !== id
        );
      }

      return [...currentSelected, id];
    });
  }

  async function createShoppingList() {
    if (selectedRecipes.length === 0) {
      alert("Please select at least one recipe.");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:3001/shopping-lists/from-recipes",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            recipe_ids: selectedRecipes,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to create shopping list"
        );
      }

      console.log("Shopping list created:", data);

      alert("Shopping list created!");

      setSelectedRecipes([]);
    } catch (error) {
      console.error(
        "Failed to create shopping list:",
        error
      );

      alert("Failed to create shopping list.");
    }
  }

  const totalRecipes = recipes.length;

  const planningCount = recipes.filter(
    (recipe) => recipe.status === "planning"
  ).length;

  const cookingCount = recipes.filter(
    (recipe) => recipe.status === "cooking"
  ).length;

  const completedCount = recipes.filter(
    (recipe) => recipe.status === "completed"
  ).length;

  const filteredRecipes = recipes.filter((recipe) => {
    const matchesSearch = recipe.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesStatus =
      selectedStatus === "all" ||
      recipe.status === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  return (
    <>
    <Navbar />
    <Routes>

      <Route
        path="/"
        element={
          <div>
            <div className="library-hero" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <div>
                <h1>FreshlyPlated 🍽️</h1>
                <p>Healthy recipes, takeaway favourites, and meal inspiration.</p>
              </div>

              <button
                type="button"
                onClick={() => setShowAddForm(!showAddForm)}
                style={{
                  background: "#7c3aed",
                  color: "white",
                  border: "none",
                  padding: "10px 18px",
                  borderRadius: "10px",
                  fontWeight: "600",
                  cursor: "pointer",
              }}
          >
                {showAddForm ? "✕ Close Form" : "+ Add Recipe"}
              </button>
      </div>
            <input
              type="text"
              placeholder="Search recipes..."
              value={searchTerm}
              onChange={(event) =>
                setSearchTerm(event.target.value)
              }
            />

            <select
              value={selectedStatus}
              onChange={(event) =>
                setSelectedStatus(event.target.value)
              }
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
            {showAddForm && (

            <div className="add-recipe-section">
              <AddRecipeForm
                fetchRecipes={() => {
                  fetchRecipes();
                  setShowAddForm(false);
                }}
              />
            </div>
            )}

            {/* SHOPPING LIST CONTROLS */}

            {selectedRecipes.length > 0 && (
              <div className="shopping-selection-bar">

                <p>
                  {selectedRecipes.length} recipe
                  {selectedRecipes.length !== 1
                    ? "s"
                    : ""}{" "}
                  selected
                </p>

                <button onClick={createShoppingList}>
                  🛒 Create Shopping List
                </button>

              </div>
            )}

            {/* RECIPES */}

            <div className="recipe-container">

              {filteredRecipes.length === 0 ? (
                <p>No recipes found</p>
              ) : (

                filteredRecipes.map((recipe) => (

                  <div
                    key={recipe.id}
                    className="recipe-wrapper"
                  >

                    <label className="shopping-checkbox">

                      <input
                        type="checkbox"
                        checked={selectedRecipes.includes(
                          recipe.id
                        )}
                        onChange={() =>
                          toggleRecipeSelection(
                            recipe.id
                          )
                        }
                      />

                      Select for shopping list

                    </label>

                    <RecipeCard
                      recipe={recipe}
                      deleteRecipe={deleteRecipe}
                      onDelete={deleteRecipe}
                      updateStatus={updateStatus}
                    />

                  </div>

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

      <Route
        path="/shopping-list"
        element={<ShoppingList />}
      />

      <Route
        path="/pantry"
        element={<Pantry />}
      />
      <Route
        path="/content-items/:id/edit"
        element={<EditContentItem />}
      />

      <Route path="/calendar" element={<CalendarView />} />
    

    </Routes>
      </>
  );
}

export default App;