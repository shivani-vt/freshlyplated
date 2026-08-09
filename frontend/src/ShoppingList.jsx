import { useEffect, useState } from "react";
import "./ShoppingList.css";

function ShoppingList() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3001/shopping-lists/latest")
      .then((response) => response.json())
      .then((data) => {
        setItems(data.items);
      })
      .catch((error) => {
        console.error("Failed to fetch shopping list:", error);
      });
  }, []);

  const handleCheck = (id, checked) => {
    fetch(`http://localhost:3001/shopping-list-items/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        checked: checked,
      }),
    })
      .then((response) => response.json())
      .then((updatedItem) => {
        setItems((currentItems) =>
          currentItems.map((item) =>
            item.id === updatedItem.id ? updatedItem : item
          )
        );
      })
      .catch((error) => {
        console.error("Failed to update shopping item:", error);
      });
  };

  const remainingItems = items.filter((item) => !item.checked);

  return (
    <div className="shopping-list-page">
      <h1>Shopping List</h1>

      <p>
        {remainingItems.length}{" "}
        {remainingItems.length === 1 ? "item" : "items"} remaining
      </p>

      <div className="shopping-list">
        {items.length === 0 ? (
          <p>Your shopping list is empty.</p>
        ) : (
          items.map((item) => (
            <div className="shopping-item" key={item.id}>
              <label>
                <input
                  type="checkbox"
                  checked={item.checked}
                  onChange={(event) =>
                    handleCheck(item.id, event.target.checked)
                  }
                />

                <span className={item.checked ? "checked" : ""}>
                  {item.ingredient_name}
                </span>
              </label>

              <span className="shopping-quantity">
                {item.quantity} {item.unit}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default ShoppingList;