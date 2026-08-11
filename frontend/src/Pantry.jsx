import { useEffect, useState } from "react";
import "./Pantry.css";

function Pantry() {
  const [items, setItems] = useState([]);
  const [ingredientName, setIngredientName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState("");

  useEffect(() => {
    fetch("http://localhost:3001/pantry-items")
      .then((response) => response.json())
      .then((data) => {
        setItems(data);
      })
      .catch((error) => {
        console.error("Failed to fetch pantry:", error);
      });
  }, []);

  const handleAddItem = async (event) => {
    event.preventDefault();

    if (!ingredientName || !quantity || !unit) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:3001/pantry-items",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ingredient_name: ingredientName,
            quantity: Number(quantity),
            unit: unit,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to add pantry item"
        );
      }

      setItems((currentItems) => [...currentItems, data]);

      setIngredientName("");
      setQuantity("");
      setUnit("");
    } catch (error) {
      console.error("Failed to add pantry item:", error);
      alert("Failed to add pantry item.");
    }
  };

  return (
    <div className="pantry-page">
      <h1>Pantry 🏠</h1>

      <p>
        Keep track of ingredients you already have at home.
      </p>

      <form
        className="pantry-form"
        onSubmit={handleAddItem}
      >
        <input
          type="text"
          placeholder="Ingredient"
          value={ingredientName}
          onChange={(event) =>
            setIngredientName(event.target.value)
          }
        />

        <input
          type="number"
          placeholder="Quantity"
          value={quantity}
          onChange={(event) =>
            setQuantity(event.target.value)
          }
        />

        <input
          type="text"
          placeholder="Unit"
          value={unit}
          onChange={(event) =>
            setUnit(event.target.value)
          }
        />

        <button type="submit">
          Add Ingredient
        </button>
      </form>

      <div className="pantry-list">
        {items.length === 0 ? (
          <p>Your pantry is empty.</p>
        ) : (
          items.map((item) => (
            <div
              className="pantry-item"
              key={item.id}
            >
              <span>
                {item.ingredient_name}
              </span>

              <span>
                {item.quantity} {item.unit}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Pantry;