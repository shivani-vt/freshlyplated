
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./ContentTracker.css";

function ContentTracker() {
  const [contentItems, setContentItems] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("all");

  const handleStatusChange = (id, newStatus) => {
    fetch(`http://localhost:3001/content-items/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        status: newStatus
      })
    })
      .then(response => response.json())
      .then(updatedItem => {
        setContentItems(currentItems =>
          currentItems.map(item =>
            item.id === updatedItem.id
              ? updatedItem
              : item
          )
        );
      });
  };

  useEffect(() => {
    fetch("http://localhost:3001/content-items")
      .then(response => response.json())
      .then(data => {
        setContentItems(data);
      });
  }, []);

  const filteredItems = contentItems.filter((item) => {
  return (
    selectedStatus === "all" ||
    item.status === selectedStatus
  );
});

const handleDelete = async (id) => {
  const confirmed = window.confirm(
    "Are you sure you want to delete this content item?"
  );

  if (!confirmed) {
    return;
  }

  try {
    const response = await fetch(
      `http://localhost:3001/content-items/${id}`,
      {
        method: "DELETE",
      }
    );

    const deletedItem = await response.json();

    if (!response.ok) {
      throw new Error(
        deletedItem.error || "Failed to delete content item"
      );
    }

    setContentItems((currentItems) =>
      currentItems.filter(
        (item) => item.id !== deletedItem.id
      )
    );

  } catch (error) {
    console.error(
      "Failed to delete content item:",
      error
    );

    alert("Failed to delete content item.");
  }
};

  return (
    <div className="content-tracker">

      <h1>Content Tracker</h1>
      <div className="content-filters">

  <button
  className={selectedStatus === "all" ? "active" : ""}
  onClick={() => setSelectedStatus("all")}
>
    All
  </button>

  <button
  className={selectedStatus === "planning" ? "active" : ""}
  onClick={() => setSelectedStatus("planning")}
>
    Planning
  </button>

  <button
  className={selectedStatus === "ready_to_cook" ? "active" : ""}
  onClick={() => setSelectedStatus("ready_to_cook")}
>
    Ready to Cook
  </button>

  <button
  className={selectedStatus === "editing" ? "active" : ""}
  onClick={() => setSelectedStatus("editing")}
>
    Editing
  </button>

  <button
  className={selectedStatus === "ready_to_upload" ? "active" : ""}
  onClick={() => setSelectedStatus("ready_to_upload")}
>
    Ready to Upload
  </button>

  <button
  className={selectedStatus === "published" ? "active" : ""}
  onClick={() => setSelectedStatus("published")}
>
    Published
  </button>

</div>

      <div className="content-grid">

        {filteredItems.map((item) => (

          <div className="content-card" key={item.id}>

            <div className="content-card-header">

              <select
                className="content-status-select"
                value={item.status}
                onChange={(event) =>
                  handleStatusChange(
                    item.id,
                    event.target.value
                  )
                }
              >
                <option value="planning">Planning</option>
                <option value="ready_to_cook">Ready to Cook</option>
                <option value="editing">Editing</option>
                <option value="ready_to_upload">
                  Ready to Upload
                </option>
                <option value="published">Published</option>
              </select>

              <span className="content-platform">
                {item.platform}
              </span>

            </div>

            <h2>
              <Link to={`/recipes/${item.recipe_id}`}>
                {item.recipe_name}
              </Link>
            </h2>

            <div className="content-dates">

              <p>
                <strong>Cook:</strong>{" "}
                {new Date(item.cook_date).toLocaleDateString()}
              </p>

              <p>
                <strong>Edit:</strong>{" "}
                {new Date(item.edit_deadline).toLocaleDateString()}
              </p>

              <p>
                <strong>Upload:</strong>{" "}
                {new Date(item.upload_date).toLocaleDateString()}
              </p>

            </div>

            <div className="content-hook">
              <strong>Hook</strong>
              <p>{item.hook}</p>
            </div>

            <div className="content-caption">
              <strong>Caption</strong>
              <p>{item.caption}</p>
            </div>

            <Link
              to={`/content-items/${item.id}/edit`}
                className="edit-content-button"
              >
                Edit
            </Link>
            <button
              className="delete-content-button"
              onClick={() => handleDelete(item.id)}
            >Delete</button>

          </div>

        ))}

      </div>

    </div>
  );
}

export default ContentTracker;

