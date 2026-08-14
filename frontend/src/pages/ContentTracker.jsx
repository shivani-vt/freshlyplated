import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./ContentTracker.css";

const STAGES = [
  { key: "planning", label: "Planning", icon: "📝" },
  { key: "ready_to_cook", label: "Ready to Cook", icon: "🍳" },
  { key: "editing", label: "Editing", icon: "🎬" },
  { key: "ready_to_upload", label: "Ready to Upload", icon: "📤" },
  { key: "published", label: "Published", icon: "🎉" },
];

function ContentTracker() {
  const [contentItems, setContentItems] = useState([]);
  const [showArchived, setShowArchived] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch all content items from backend
  const fetchContentItems = () => {
    setLoading(true);
    fetch("http://localhost:3001/content-items")
      .then((res) => res.json())
      .then((data) => {
        setContentItems(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch content items:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchContentItems();
  }, []);

  // Update status (Move forward or backward in pipeline)
  const handleStatusChange = async (item, newStatus) => {
    try {
      const res = await fetch(
        `http://localhost:3001/content-items/${item.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            recipe_id: item.recipe_id,
            status: newStatus,
            platform: item.platform,
            cook_date: item.cook_date,
            edit_deadline: item.edit_deadline,
            upload_date: item.upload_date,
            hook: item.hook,
            caption: item.caption,
            hashtags: item.hashtags,
          }),
        }
      );

      if (!res.ok) throw new Error("Failed to update status");

      const updatedItem = await res.json();
      setContentItems((prev) =>
        prev.map((i) =>
          i.id === item.id ? { ...i, ...updatedItem } : i
        )
      );
    } catch (error) {
      console.error("Error moving item stage:", error);
      alert("Failed to update pipeline stage.");
    }
  };

  // Delete content item
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;

    try {
      const res = await fetch(`http://localhost:3001/content-items/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete content item");

      setContentItems((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Error deleting content item:", error);
      alert("Failed to delete content item.");
    }
  };

  if (loading) {
    return <div className="kanban-loading">Loading content pipeline...</div>;
  }

  return (
    <div className="content-tracker-container">
      {/* Header Bar */}
      <div className="tracker-header">
        <div>
          <h1>Content Pipeline</h1>
          <p>Manage your recipes from initial concept to published post.</p>
        </div>

        <div className="tracker-actions">
          <label className="toggle-archive">
            <input
              type="checkbox"
              checked={showArchived}
              onChange={(e) => setShowArchived(e.target.checked)}
            />
            Show Published / Archived
          </label>

          <Link to="/content-items/new" className="btn-new-content">
            + Add Content Item
          </Link>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="kanban-board">
        {STAGES.map((stage, stageIndex) => {
          // If hiding published, do not render published column
          if (stage.key === "published" && !showArchived) return null;

          const stageItems = contentItems.filter(
            (item) => item.status === stage.key
          );

          return (
            <div key={stage.key} className="kanban-column">
              <div className="column-header">
                <span className="stage-badge">
                  {stage.icon} {stage.label}
                </span>
                <span className="stage-count">{stageItems.length}</span>
              </div>

              <div className="column-cards">
                {stageItems.length === 0 ? (
                  <div className="empty-column-placeholder">No items</div>
                ) : (
                  stageItems.map((item) => (
                    <div key={item.id} className="kanban-card">
                      <div className="card-top">
                        <span className={`platform-tag ${item.platform?.toLowerCase().replace(/\s+/g, "-")}`}>
                          {item.platform}
                        </span>

                        <div className="card-actions">
                          <Link
                            to={`/content-items/${item.id}/edit`}
                            className="btn-card-action"
                            title="Edit"
                          >
                            ✏️
                          </Link>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="btn-card-action btn-delete"
                            title="Delete"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>

                      <h3 className="card-title">
                        {item.recipe_name || "Untitled Recipe"}
                      </h3>

                      {item.hook && <p className="card-hook">"{item.hook}"</p>}

                      {/* Dates Summary */}
                      <div className="card-dates">
                        {item.cook_date && (
                          <div className="date-badge cook">
                            🍳 {item.cook_date.split("T")[0]}
                          </div>
                        )}
                        {item.edit_deadline && (
                          <div className="date-badge edit">
                            🎬 {item.edit_deadline.split("T")[0]}
                          </div>
                        )}
                        {item.upload_date && (
                          <div className="date-badge upload">
                            📤 {item.upload_date.split("T")[0]}
                          </div>
                        )}
                      </div>

                      {/* Stage Shift Buttons */}
                      <div className="stage-controls">
                        {stageIndex > 0 && (
                          <button
                            className="btn-shift"
                            onClick={() =>
                              handleStatusChange(
                                item,
                                STAGES[stageIndex - 1].key
                              )
                            }
                            title={`Move back to ${STAGES[stageIndex - 1].label}`}
                          >
                            ← {STAGES[stageIndex - 1].label}
                          </button>
                        )}

                        {stageIndex < STAGES.length - 1 && (
                          <button
                            className="btn-shift btn-next"
                            onClick={() =>
                              handleStatusChange(
                                item,
                                STAGES[stageIndex + 1].key
                              )
                            }
                            title={`Advance to ${STAGES[stageIndex + 1].label}`}
                          >
                            {STAGES[stageIndex + 1].label} →
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ContentTracker;
