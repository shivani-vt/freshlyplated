import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Dashboard.css";

function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:3001/dashboard")
      .then((res) => {
        if (!res.ok) throw new Error("Network response was not ok");
        return res.json();
      })
      .then((dashboardData) => {
        setData(dashboardData);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load dashboard data:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="dashboard loading-state">Loading dashboard...</div>;
  }

  if (!data) {
    return <div className="dashboard error-state">Failed to load dashboard metrics.</div>;
  }

  // Safe destructuring with fallbacks
  const metrics = data.metrics || { recipes: 0, contentItems: 0, pantryItems: 0 };
  const stageCounts = data.stageCounts || {
    planning: 0,
    ready_to_cook: 0,
    editing: 0,
    ready_to_upload: 0,
    published: 0,
  };

  // Normalize todaysTasks whether it arrives as an object or a flat array
  const rawTasks = data.todaysTasks;
  const isArray = Array.isArray(rawTasks);
  
  const cookingTasks = isArray 
    ? rawTasks.filter((t) => t.task_type === "cook")
    : rawTasks?.cooking || [];

  const editingTasks = isArray
    ? rawTasks.filter((t) => t.task_type === "edit")
    : rawTasks?.editing || [];

  const uploadTasks = isArray
    ? rawTasks.filter((t) => t.task_type === "upload")
    : rawTasks?.uploads || [];

  const upcomingList = Array.isArray(data.upcomingContent) ? data.upcomingContent : [];

  return (
    <div className="dashboard">
      <h1>FreshlyPlatedOS</h1>
      <p>Welcome back 👋</p>

      {/* QUICK STATS */}
      <section className="dashboard-section">
        <h2>Quick Stats</h2>
        <div className="stats-grid">
          <div className="stat-card">
            <p>Recipes Saved</p>
            <h3>{metrics.recipes ?? 0}</h3>
          </div>

          <div className="stat-card">
            <p>Content Pipeline</p>
            <h3>{metrics.contentItems ?? 0}</h3>
          </div>

          <div className="stat-card">
            <p>Pantry Stock</p>
            <h3>{metrics.pantryItems ?? 0}</h3>
          </div>
        </div>
      </section>

      {/* CONTENT PROGRESS */}
      <section className="dashboard-section">
        <h2>Content Progress</h2>
        <div className="progress-grid">
          <div className="progress-card">
            <p>📝 Planning</p>
            <h3>{stageCounts.planning ?? 0}</h3>
          </div>

          <div className="progress-card">
            <p>🍳 Ready to Cook</p>
            <h3>{stageCounts.ready_to_cook ?? 0}</h3>
          </div>

          <div className="progress-card">
            <p>🎬 Editing</p>
            <h3>{stageCounts.editing ?? 0}</h3>
          </div>

          <div className="progress-card">
            <p>📤 Ready to Upload</p>
            <h3>{stageCounts.ready_to_upload ?? 0}</h3>
          </div>

          <div className="progress-card">
            <p>🎉 Published</p>
            <h3>{stageCounts.published ?? 0}</h3>
          </div>
        </div>
      </section>

      {/* TODAY'S TASKS */}
      <section className="dashboard-section">
        <h2>Today's Tasks</h2>
        <div className="tasks-grid">
          {/* COOK TODAY */}
          <div className="task-card">
            <h3>🍳 Cook Today</h3>
            {cookingTasks.length === 0 ? (
              <p className="empty-task-text">Nothing scheduled.</p>
            ) : (
              cookingTasks.map((item) => (
                <div key={item.id} className="task-item">
                  <strong>{item.recipe_name}</strong>
                  <p>{item.platform}</p>
                </div>
              ))
            )}
          </div>

          {/* EDIT TODAY */}
          <div className="task-card">
            <h3>🎬 Edit Today</h3>
            {editingTasks.length === 0 ? (
              <p className="empty-task-text">Nothing scheduled.</p>
            ) : (
              editingTasks.map((item) => (
                <div key={item.id} className="task-item">
                  <strong>{item.recipe_name}</strong>
                  <p>{item.platform}</p>
                </div>
              ))
            )}
          </div>

          {/* UPLOAD TODAY */}
          <div className="task-card">
            <h3>📤 Upload Today</h3>
            {uploadTasks.length === 0 ? (
              <p className="empty-task-text">Nothing scheduled.</p>
            ) : (
              uploadTasks.map((item) => (
                <div key={item.id} className="task-item">
                  <strong>{item.recipe_name}</strong>
                  <p>{item.platform}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* UPCOMING 7 DAYS */}
      <section className="dashboard-section">
        <h2>Upcoming — Next 7 Days</h2>
        <div className="upcoming-list">
          {upcomingList.length === 0 ? (
            <p className="empty-task-text">No upcoming tasks for the next 7 days.</p>
          ) : (
            upcomingList.map((item) => (
              <div key={item.id} className="upcoming-card">
                <div>
                  <h3>{item.recipe_name}</h3>
                  <p>{item.platform}</p>
                </div>

                <div className="upcoming-dates">
                  {item.cook_date && (
                    <p>🍳 Cook: {new Date(item.cook_date).toLocaleDateString()}</p>
                  )}
                  {item.edit_deadline && (
                    <p>🎬 Edit: {new Date(item.edit_deadline).toLocaleDateString()}</p>
                  )}
                  {item.upload_date && (
                    <p>📤 Upload: {new Date(item.upload_date).toLocaleDateString()}</p>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}

export default Dashboard;