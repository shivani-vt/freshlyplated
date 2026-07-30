import { useState } from "react";

function AddRecipeForm() {
    const [recipeName, setRecipeName] = useState("");

    function handleSubmit() {
        //sending data to backend's recipe route
        fetch("http://localhost:3001/recipes", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
        },
        body: JSON.stringify({
            name: recipeName,
            status: "planning",
            prep_time_minutes: 20,
            cook_time_minutes: 40
    })
  });


    }
  return (
    <div>
      <h2>Add Recipe</h2>
      <input
        type="text"
        placeholder="Recipe name"
        value={recipeName}
        onChange={(event) => setRecipeName(event.target.value)}
      />
      <button onClick={handleSubmit}>Add Recipe</button>
    </div>
  );
}

export default AddRecipeForm;