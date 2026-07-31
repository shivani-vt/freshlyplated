import { useState } from "react";

function AddRecipeForm() {
    const [recipeName, setRecipeName] = useState("");
    const [status, setStatus] = useState("planning");
    const [prepTime, setPrepTime] = useState("");
    const [cookTime, setCookTime] = useState("");

    function handleSubmit() {
        //sending data to backend's recipe route
        console.log({
            name: recipeName,
            status: status,
            prep_time_minutes: prepTime,
            cook_time_minutes: cookTime
        });

        fetch("http://localhost:3001/recipes", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
        },
        body: JSON.stringify({
            name: recipeName,
            status: status,
            prep_time_minutes: prepTime,
            cook_time_minutes: cookTime
    })
})
        .then(() => {
            setRecipeName("");
            setPrepTime("");
            setCookTime("");
            setStatus("planning");
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
      <label>Status</label>

      <select
        value={status}
        onChange={(event) => setStatus(event.target.value)}
      >
        <option value="planning">Planning</option>
        <option value="cooking">Cooking</option>
        <option value="completed">Completed</option>
      </select>

      <label>Prep Time</label>

    <input
        type="number"
        value={prepTime}
        onChange={(event) => setPrepTime(event.target.value)}
    />
    <label>Cook Time</label>
     <input type="number"
      value={cookTime}
       onChange={(event) => setCookTime(event.target.value)} />

 
      <button onClick={handleSubmit}>Add Recipe</button>
    </div>
  );
}

export default AddRecipeForm;