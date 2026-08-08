
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./ContentTracker.css";

function ContentTracker() {
  const [contentItems, setContentItems] = useState([]);

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

  return (
    <div className="content-tracker">

      <h1>Content Tracker</h1>

      <div className="content-grid">

        {contentItems.map((item) => (

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

          </div>

        ))}

      </div>

    </div>
  );
}

export default ContentTracker;

