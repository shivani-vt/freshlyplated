import { useState, useEffect } from "react";

function App() {

  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3001/recipes")
      .then(response => response.json())
      .then(data => {
        console.log(data);
        setRecipes(data);
      });

  }, []);

  return (
    <div>
      <h1>FreshlyPlated</h1>
      <p>My recipe collection</p>
    </div>
  );
}

export default App;