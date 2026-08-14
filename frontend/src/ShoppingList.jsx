import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./ShoppingList.css";

function ShoppingList() {
  const [shoppingList, setShoppingList] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchLatestList = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("http://localhost:3001/shopping-lists/latest");
      
      if (res.status === 404) {
        setShoppingList(null);
        setItems([]);
        setLoading(false);
        return;
      }

      if (!res.ok) {
        throw new Error("Failed to load shopping list");
      }

      const data = await res.json();
      setShoppingList(data.shopping_list);
      setItems(data.items || []);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLatestList();
  }, []);

  const toggleItemCheck = async (itemId, currentChecked) => {
    const nextChecked = !currentChecked;

    // Optimistic UI update
    setItems((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, checked: nextChecked } : item
      )
    );

    try {
      const res = await fetch(
        `http://localhost:3001/shopping-list-items/${itemId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ checked: nextChecked }),
        }
      );

      if (!res.ok) {
        throw new Error("Failed to update item");
      }
    } catch (err) {
      console.error("Error updating checklist item:", err);
      // Revert state on failure
      setItems((prev) =>
        prev.map((item) =>
          item.id === itemId ? { ...item, checked: currentChecked } : item
        )
      );
      alert("Could not update item. Check your connection.");
    }
  };

  if (loading) {
    return <div className="shopping-container loading-state">Loading shopping list...</div>;
  }

  const completedCount = items.filter((i) => i.checked).length;
  const progressPercent = items.length
    ? Math.round((completedCount / items.length) * 100)
    : 0;

  return (
    <div className="shopping-container">
      <div className="shopping-header">
        <div>
          <h1>Active Shopping List</h1>
          <p>
            {shoppingList
              ? `Created on ${new Date(shoppingList.created_at).toLocaleDateString()}`
              : "No active list found"}
          </p>
        </div>

        <Link to="/" className="btn-secondary">
          + Select Recipes to Generate List
        </Link>
      </div>

      {error && <div className="error-banner">{error}</div>}

      {!shoppingList || items.length === 0 ? (
        <div className="empty-shopping-state">
          <h3>No items to buy!</h3>
          <p>
            Select recipes from your <Link to="/">Recipe Library</Link> and click
            <strong> "Create Shopping List"</strong>. Ingredients already in your{" "}
            <Link to="/pantry">Pantry</Link> will be automatically subtracted.
          </p>
        </div>
      ) : (
        <div className="shopping-card">
          <div className="shopping-card-header">
            <div>
              <h2>{shoppingList.name || "Grocery List"}</h2>
              <span className="items-counter">
                {completedCount} of {items.length} items checked
              </span>
            </div>

            <div className="progress-bar-container">
              <div
                className="progress-bar-fill"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          <ul className="shopping-items-list">
            {items.map((item) => (
              <li
                key={item.id}
                className={`shopping-item ${item.checked ? "is-checked" : ""}`}
                onClick={() => toggleItemCheck(item.id, item.checked)}
              >
                <input
                  type="checkbox"
                  checked={Boolean(item.checked)}
                  onChange={() => {}} // Handled by li click
                  className="item-checkbox"
                />
                <span className="item-name">{item.ingredient_name}</span>
                <span className="item-qty">
                  {item.quantity} {item.unit}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default ShoppingList;