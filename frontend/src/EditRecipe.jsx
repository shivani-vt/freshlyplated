import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./EditRecipe.css";

function EditRecipe() {

  const { id } = useParams();
  const navigate = useNavigate();

  const [recipe, setRecipe] = useState(null);

  const [name, setName] = useState("");
  const [prepTime, setPrepTime] = useState("");
  const [cookTime, setCookTime] = useState("");
  const [status, setStatus] = useState("");
  const [tags, setTags] = useState("");
  const [originalLink, setOriginalLink] = useState("");
  const [originalRecipe, setOriginalRecipe] = useState("");
  const [adjustedRecipe, setAdjustedRecipe] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [method, setMethod] = useState("");


  useEffect(() => {

    fetch(`http://localhost:3001/recipes/${id}`)
      .then(response => response.json())
      .then(data => {
        setRecipe(data);
        setName(data.name);
        setPrepTime(data.prep_time_minutes);
        setCookTime(data.cook_time_minutes);
        setStatus(data.status);
        setTags(data.tags || "");
        setOriginalLink(data.original_recipe_link || "");
        setOriginalRecipe(data.original_recipe_text || "");
        setAdjustedRecipe(data.adjusted_recipe_text || "");
        setImageUrl(data.image_url || "");
        setIngredients(data.ingredients || "");
        setMethod(data.method || "");
    });

  }, [id]);
  
  if (!recipe) {
  return <p>Loading...</p>;
}

  function handleSave() {

  fetch(`http://localhost:3001/recipes/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      name: name,
      prep_time_minutes: prepTime,
      cook_time_minutes: cookTime,
      status: status,
      tags: tags,
      original_recipe_link: originalLink,
      original_recipe_text: originalRecipe,
      adjusted_recipe_text: adjustedRecipe,
      image_url: imageUrl,
      ingredients: ingredients,
      method: method,
    })
})
  .then(response => response.json())
  .then(updatedRecipe => {

    console.log(updatedRecipe);

    navigate("/");

    

  });


}


  
  return (
    <div className= "edit-recipe">

    <h1>Edit {recipe.name}</h1>


    <label>Name</label>
    <input
      type="text"
      value={name}
      onChange={(event) => setName(event.target.value)}
    />


    <label>Prep Time</label>
    <input
      type="number"
      value={prepTime}
      onChange={(event) => setPrepTime(event.target.value)}
    />


    <label>Cook Time</label>
    <input
      type="number"
      value={cookTime}
      onChange={(event) => setCookTime(event.target.value)}
    />

    <label>Status</label>

    <select
        value={status}
        onChange={(event) => setStatus(event.target.value)}
    >
    <option value="planning">Planning</option>
    <option value="cooking">Cooking</option>
    <option value="completed">Completed</option>
    </select>

    <label>Tags</label>
    <input
        type="text"
        value={tags}
        onChange={(event) => setTags(event.target.value)}
        placeholder="chicken, indian, dinner"
    />

    <label>Image URL</label>

    <input
        type="text"
        value={imageUrl}
        onChange={(event) => setImageUrl(event.target.value)}
        placeholder="https://..."
    />
    <label>Original Recipe Link</label>

    <input
        type="text"
        value={originalLink}
        onChange={(event) => setOriginalLink(event.target.value)}
    />
    <label>Ingredients</label>

    <textarea
      value={ingredients}
      onChange={(event) => setIngredients(event.target.value)}
      placeholder="Chicken breast&#10;Yoghurt&#10;Spices"
    />


    <label>Cooking Method</label>

    <textarea
      value={method}
      onChange={(event) => setMethod(event.target.value)}
      placeholder="Step 1: Marinate chicken&#10;Step 2: Cook sauce"
    />

    <label>Original Recipe</label>

    <textarea
        value={originalRecipe}
        onChange={(event) => setOriginalRecipe(event.target.value)}
    />

    <label>FreshlyPlated Version</label>

    <textarea
        value={adjustedRecipe}
        onChange={(event) => setAdjustedRecipe(event.target.value)}
    />

    <button onClick={handleSave}>Save Changes</button>


  </div>
);
}

export default EditRecipe;
