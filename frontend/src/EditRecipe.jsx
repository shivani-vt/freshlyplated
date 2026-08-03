import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function EditRecipe() {

  const { id } = useParams();
  const navigate = useNavigate();

  const [recipe, setRecipe] = useState(null);

  const [name, setName] = useState("");
  const [prepTime, setPrepTime] = useState("");
  const [cookTime, setCookTime] = useState("");


  useEffect(() => {

    fetch(`http://localhost:3001/recipes/${id}`)
      .then(response => response.json())
      .then(data => {
        setRecipe(data);
        setName(data.name);
        setPrepTime(data.prep_time_minutes);
        setCookTime(data.cook_time_minutes);
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
      status: recipe.status
    })
  })
  .then(response => response.json())
  .then(updatedRecipe => {

    console.log(updatedRecipe);

    navigate("/");

    

  });


}


  
  return (
  <div>

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
    <button onClick={handleSave}>Save Changes
    </button>


  </div>
);
}

export default EditRecipe;
