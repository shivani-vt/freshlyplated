import { useEffect, useState } from "react";
import "./Pantry.css";

function Pantry() {
  const [items, setItems] = useState([]);

  const [ingredientName, setIngredientName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [editingIngredientName, setEditingIngredientName] = useState("");
  const [editingQuantity, setEditingQuantity] = useState("");
  const [editingUnit, setEditingUnit] = useState("");

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

  const handleDelete = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:3001/pantry-items/${id}`,
        {
          method: "DELETE",
        }
      );

      const deletedItem = await response.json();

      if (!response.ok) {
        throw new Error(
          deletedItem.error || "Failed to delete pantry item"
        );
      }

      setItems((currentItems) =>
        currentItems.filter(
          (item) => item.id !== deletedItem.id
        )
      );
    } catch (error) {
      console.error("Failed to delete pantry item:", error);
      alert("Failed to delete pantry item.");
    }
  };

  const startEditing = (item) => {
    setEditingId(item.id);
    setEditingIngredientName(item.ingredient_name);
    setEditingQuantity(item.quantity);
    setEditingUnit(item.unit);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditingIngredientName("");
    setEditingQuantity("");
    setEditingUnit("");
  };

  const handleEdit = async (id) => {
    if (
      !editingIngredientName ||
      !editingQuantity ||
      !editingUnit
    ) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3001/pantry-items/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ingredient_name: editingIngredientName,
            quantity: Number(editingQuantity),
            unit: editingUnit,
          }),
        }
      );

      const updatedItem = await response.json();

      if (!response.ok) {
        throw new Error(
          updatedItem.error || "Failed to update pantry item"
        );
      }

      setItems((currentItems) =>
        currentItems.map((item) =>
          item.id === updatedItem.id
            ? updatedItem
            : item
        )
      );

      cancelEditing();
    } catch (error) {
      console.error("Failed to update pantry item:", error);
      alert("Failed to update pantry item.");
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
              {editingId === item.id ? (
                <div className="pantry-edit-form">

                  <input
                    type="text"
                    value={editingIngredientName}
                    onChange={(event) =>
                      setEditingIngredientName(
                        event.target.value
                      )
                    }
                  />

                  <input
                    type="number"
                    value={editingQuantity}
                    onChange={(event) =>
                      setEditingQuantity(
                        event.target.value
                      )
                    }
                  />

                  <input
                    type="text"
                    value={editingUnit}
                    onChange={(event) =>
                      setEditingUnit(
                        event.target.value
                      )
                    }
                  />

                  <button
                    onClick={() =>
                      handleEdit(item.id)
                    }
                  >
                    Save
                  </button>

                  <button
                    onClick={cancelEditing}
                  >
                    Cancel
                  </button>

                </div>
              ) : (
                <>
                  <div>
                    <strong>
                      {item.ingredient_name}
                    </strong>

                    <p>
                      {item.quantity} {item.unit}
                    </p>
                  </div>

                  <div className="pantry-actions">

                    <button
                      onClick={() =>
                        startEditing(item)
                      }
                    >
                      Edit
                    </button>

                    <button
                      onClick={() =>
                        handleDelete(item.id)
                      }
                    >
                      Delete
                    </button>

                  </div>
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Pantry;
