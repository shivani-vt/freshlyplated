import { useEffect, useState } from "react";
import "./Pantry.css";

function Pantry() {
  const [pantryItems, setPantryItems] = useState([]);
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState("g");
  const [loading, setLoading] = useState(true);

  const fetchPantry = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:3001/pantry-items");
      const data = await res.json();
      setPantryItems(data || []);
    } catch (err) {
      console.error("Failed to load pantry items:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPantry();
  }, []);

  const handleAddItem = async (e) => {
    e.preventDefault();

    if (!name.trim() || !quantity) {
      alert("Please provide an ingredient name and quantity.");
      return;
    }

    try {
      const res = await fetch("http://localhost:3001/pantry-items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ingredient_name: name.trim(),
          quantity: Number(quantity),
          unit: unit.trim(),
        }),
      });

      if (!res.ok) throw new Error("Failed to add pantry item");

      const newItem = await res.json();
      setPantryItems((prev) => [...prev, newItem].sort((a, b) => 
        a.ingredient_name.localeCompare(b.ingredient_name)
      ));

      setName("");
      setQuantity("");
    } catch (err) {
      console.error(err);
      alert("Failed to add item to pantry.");
    }
  };

  const handleDeleteItem = async (id) => {
    try {
      const res = await fetch(`http://localhost:3001/pantry-items/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete item");

      setPantryItems((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete pantry item.");
    }
  };

  return (
    <div className="pantry-container">
      <div className="pantry-header">
        <h1>Pantry & Stock Inventory</h1>
        <p>
          Ingredients added here are automatically deducted when creating a
          recipe shopping list.
        </p>
      </div>

      {/* Add New Item Form */}
      <form onSubmit={handleAddItem} className="pantry-form-card">
        <h3>+ Add Stock</h3>
        <div className="pantry-form-grid">
          <input
            type="text"
            placeholder="Ingredient (e.g. Greek Yoghurt, Olive Oil)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <input
            type="number"
            placeholder="Qty"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            min="0.1"
            step="any"
            required
          />

          <select value={unit} onChange={(e) => setUnit(e.target.value)}>
            <option value="g">g (grams)</option>
            <option value="kg">kg (kilograms)</option>
            <option value="ml">ml (millilitres)</option>
            <option value="l">l (litres)</option>
            <option value="tbsp">tbsp</option>
            <option value="tsp">tsp</option>
            <option value="pcs">pcs</option>
            <option value="cans">cans</option>
          </select>

          <button type="submit" className="btn-add-pantry">
            Add to Pantry
          </button>
        </div>
      </form>

      {/* Pantry List Table */}
      <div className="pantry-list-card">
        <h3>Current Stock ({pantryItems.length})</h3>

        {loading ? (
          <p className="loading-state">Loading pantry items...</p>
        ) : pantryItems.length === 0 ? (
          <p className="empty-pantry-text">
            No items in your pantry. Add your basic ingredients above!
          </p>
        ) : (
          <div className="pantry-table-wrapper">
            <table className="pantry-table">
              <thead>
                <tr>
                  <th>Ingredient</th>
                  <th>Quantity</th>
                  <th>Unit</th>
                  <th style={{ textAlign: "right" }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {pantryItems.map((item) => (
                  <tr key={item.id}>
                    <td className="item-name-cell">{item.ingredient_name}</td>
                    <td>{item.quantity}</td>
                    <td>{item.unit}</td>
                    <td style={{ textAlign: "right" }}>
                      <button
                        onClick={() => handleDeleteItem(item.id)}
                        className="btn-delete-stock"
                        title="Delete from stock"
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default Pantry;