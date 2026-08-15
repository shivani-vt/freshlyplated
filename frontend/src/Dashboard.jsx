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

  const { metrics, stageCounts, todaysTasks, upcomingContent } = data;

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
            <h3>{metrics.recipes}</h3>
          </div>

          <div className="stat-card">
            <p>Content Pipeline</p>
            <h3>{metrics.contentItems}</h3>
          </div>

          <div className="stat-card">
            <p>Pantry Stock</p>
            <h3>{metrics.pantryItems}</h3>
          </div>
        </div>
      </section>

      {/* CONTENT PROGRESS */}
      <section className="dashboard-section">
        <h2>Content Progress</h2>
        <div className="progress-grid">
          <div className="progress-card">
            <p>📝 Planning</p>
            <h3>{stageCounts.planning}</h3>
          </div>

          <div className="progress-card">
            <p>🍳 Ready to Cook</p>
            <h3>{stageCounts.ready_to_cook}</h3>
          </div>

          <div className="progress-card">
            <p>🎬 Editing</p>
            <h3>{stageCounts.editing}</h3>
          </div>

          <div className="progress-card">
            <p>📤 Ready to Upload</p>
            <h3>{stageCounts.ready_to_upload}</h3>
          </div>

          <div className="progress-card">
            <p>🎉 Published</p>
            <h3>{stageCounts.published}</h3>
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
            {todaysTasks.cooking.length === 0 ? (
              <p className="empty-task-text">Nothing scheduled.</p>
            ) : (
              todaysTasks.cooking.map((item) => (
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
            {todaysTasks.editing.length === 0 ? (
              <p className="empty-task-text">Nothing scheduled.</p>
            ) : (
              todaysTasks.editing.map((item) => (
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
            {todaysTasks.uploads.length === 0 ? (
              <p className="empty-task-text">Nothing scheduled.</p>
            ) : (
              todaysTasks.uploads.map((item) => (
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
          {upcomingContent.length === 0 ? (
            <p className="empty-task-text">No upcoming tasks for the next 7 days.</p>
          ) : (
            upcomingContent.map((item) => (
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