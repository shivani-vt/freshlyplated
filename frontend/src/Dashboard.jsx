import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Dashboard.css";

function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:3001/dashboard")
      .then((res) => res.json())
      .then((dashboardData) => {
        setData(dashboardData);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load dashboard:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="dashboard">
        <p className="empty-task-text">Loading creator workspace...</p>
      </div>
    );
  }

  const metrics = data?.metrics || { recipes: 0, contentItems: 0, pendingContent: 0 };
  const stages = data?.stageCounts || {
    planning: 0,
    ready_to_cook: 0,
    editing: 0,
    ready_to_upload: 0,
    published: 0,
  };
  const todaysTasks = data?.todaysTasks || { cooking: [], editing: [], uploads: [] };
  const upcomingContent = data?.upcomingContent || [];

  const publishedCount = stages.published || 0;

  return (
    <div className="dashboard">
      {/* HEADER & QUICK ACTIONS */}
      <div className="dashboard-header-row">
        <div>
          <h1>FreshlyPlated Creator Studio 🎬</h1>
          <p>Your production pipeline, daily task radar, and publishing schedule.</p>
        </div>

        <div className="dashboard-actions">
          <Link to="/content-items/new" className="btn-primary-action">
            + Schedule Post
          </Link>
          <Link to="/" className="btn-secondary-action">
            + Add Recipe
          </Link>
        </div>
      </div>

      {/* CORE KPI SUMMARY */}
      <div className="dashboard-section">
        <h2>Performance Snapshot</h2>
        <div className="stats-grid">
          <div className="metric-card">
            <div className="metric-header">
              <span>📚</span>
              <p>Recipe Vault</p>
            </div>
            <h3>{metrics.recipes}</h3>
            <span className="metric-subtext">Total catalogued recipes</span>
          </div>

          <div className="metric-card">
            <div className="metric-header">
              <span>⏳</span>
              <p>In Production</p>
            </div>
            <h3>{metrics.pendingContent}</h3>
            <span className="metric-subtext">Active content in pipeline</span>
          </div>

          <div className="metric-card">
            <div className="metric-header">
              <span>🎉</span>
              <p>Published Posts</p>
            </div>
            <h3>{publishedCount}</h3>
            <span className="metric-subtext">Live on social platforms</span>
          </div>
        </div>
      </div>

      {/* PRODUCTION FUNNEL */}
      <div className="dashboard-section">
        <h2>Content Pipeline Stages</h2>
        <div className="funnel-grid">
          <Link to="/content-tracker" className="funnel-card planning">
            <span className="funnel-icon">📝</span>
            <div className="funnel-details">
              <p>Planning</p>
              <h3>{stages.planning}</h3>
            </div>
          </Link>

          <Link to="/content-tracker" className="funnel-card cook">
            <span className="funnel-icon">🍳</span>
            <div className="funnel-details">
              <p>Ready to Cook</p>
              <h3>{stages.ready_to_cook}</h3>
            </div>
          </Link>

          <Link to="/content-tracker" className="funnel-card edit">
            <span className="funnel-icon">🎬</span>
            <div className="funnel-details">
              <p>Editing</p>
              <h3>{stages.editing}</h3>
            </div>
          </Link>

          <Link to="/content-tracker" className="funnel-card upload">
            <span className="funnel-icon">🚀</span>
            <div className="funnel-details">
              <p>Ready to Upload</p>
              <h3>{stages.ready_to_upload}</h3>
            </div>
          </Link>
        </div>
      </div>

      {/* TODAY'S FOCUS */}
      <div className="dashboard-section">
        <h2>Today&apos;s Focus</h2>
        <div className="tasks-grid">
          {/* Cooking Today */}
          <div className="task-card">
            <div className="task-card-title">
              <span>🍳</span>
              <h3>Cook Today</h3>
              <span className="badge-count">{todaysTasks.cooking.length}</span>
            </div>
            {todaysTasks.cooking.length === 0 ? (
              <p className="empty-task-text">No shoots scheduled for today.</p>
            ) : (
              todaysTasks.cooking.map((item) => (
                <div key={item.id} className="task-item">
                  <div className="task-item-main">
                    <strong>{item.recipe_name || "Untitled Recipe"}</strong>
                    <span className="platform-tag">{item.platform}</span>
                  </div>
                  {item.hook && <p className="task-hook">&ldquo;{item.hook}&rdquo;</p>}
                  <Link to={`/content-items/${item.id}/edit`} className="task-link">
                    Open Task →
                  </Link>
                </div>
              ))
            )}
          </div>

          {/* Editing Today */}
          <div className="task-card">
            <div className="task-card-title">
              <span>🎬</span>
              <h3>Edit Deadlines</h3>
              <span className="badge-count">{todaysTasks.editing.length}</span>
            </div>
            {todaysTasks.editing.length === 0 ? (
              <p className="empty-task-text">No editing deadlines today.</p>
            ) : (
              todaysTasks.editing.map((item) => (
                <div key={item.id} className="task-item">
                  <div className="task-item-main">
                    <strong>{item.recipe_name || "Untitled Recipe"}</strong>
                    <span className="platform-tag">{item.platform}</span>
                  </div>
                  {item.hook && <p className="task-hook">&ldquo;{item.hook}&rdquo;</p>}
                  <Link to={`/content-items/${item.id}/edit`} className="task-link">
                    Open Task →
                  </Link>
                </div>
              ))
            )}
          </div>

          {/* Uploads Today */}
          <div className="task-card">
            <div className="task-card-title">
              <span>🚀</span>
              <h3>Uploads Today</h3>
              <span className="badge-count">{todaysTasks.uploads.length}</span>
            </div>
            {todaysTasks.uploads.length === 0 ? (
              <p className="empty-task-text">No uploads due today.</p>
            ) : (
              todaysTasks.uploads.map((item) => (
                <div key={item.id} className="task-item">
                  <div className="task-item-main">
                    <strong>{item.recipe_name || "Untitled Recipe"}</strong>
                    <span className="platform-tag">{item.platform}</span>
                  </div>
                  {item.hook && <p className="task-hook">&ldquo;{item.hook}&rdquo;</p>}
                  <Link to={`/content-items/${item.id}/edit`} className="task-link">
                    Open Task →
                  </Link>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* 7-DAY RADAR */}
      <div className="dashboard-section">
        <h2>Upcoming Content Radar (Next 7 Days)</h2>
        {upcomingContent.length === 0 ? (
          <div className="empty-radar-box">
            <p>Your schedule is clear for the next 7 days.</p>
            <Link to="/content-items/new" className="text-link">
              Schedule your next video →
            </Link>
          </div>
        ) : (
          <div className="upcoming-list">
            {upcomingContent.map((item) => (
              <div key={item.id} className="upcoming-item-row">
                <div className="upcoming-main-info">
                  <strong>{item.recipe_name || "Untitled Recipe"}</strong>
                  <span className="platform-pill">{item.platform}</span>
                  <span className="stage-pill">{item.status.replace(/_/g, " ")}</span>
                </div>

                <div className="upcoming-dates-group">
                  {item.cook_date && (
                    <span>🍳 Cook: {new Date(item.cook_date).toLocaleDateString()}</span>
                  )}
                  {item.edit_deadline && (
                    <span>🎬 Edit: {new Date(item.edit_deadline).toLocaleDateString()}</span>
                  )}
                  {item.upload_date && (
                    <span>🚀 Post: {new Date(item.upload_date).toLocaleDateString()}</span>
                  )}
                  <Link to={`/content-items/${item.id}/edit`} className="btn-mini-edit">
                    Edit
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;