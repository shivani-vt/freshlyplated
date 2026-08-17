import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";

function Navbar() {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("app_theme") || "light";
  });

  useEffect(() => {
    document.body.setAttribute("data-theme", theme);
    localStorage.setItem("app_theme", theme);
  }, [theme]);

  function toggleTheme() {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  }

  const isDark = theme === "dark";

  return (
    <header
      style={{
        backgroundColor: "var(--nav-bg)",
        borderBottom: "1px solid var(--nav-border)",
        position: "sticky",
        top: 0,
        zIndex: 1000,
        width: "100%",
        boxShadow: "var(--shadow-card)",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "0 24px",
          height: "64px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Link
          to="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            textDecoration: "none",
            fontSize: "1.25rem",
            fontWeight: "800",
            color: "var(--text-main)",
            letterSpacing: "-0.02em",
          }}
        >
          <span style={{ fontSize: "1.3rem" }}>🍽️</span>
          <span>FreshlyPlated</span>
        </Link>

        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <nav style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <NavLink
              to="/dashboard"
              style={({ isActive }) => ({
                textDecoration: "none",
                fontSize: "0.92rem",
                fontWeight: "600",
                color: isActive ? "var(--primary)" : "var(--text-muted)",
                backgroundColor: isActive ? "var(--primary-subtle)" : "transparent",
                padding: "8px 14px",
                borderRadius: "10px",
              })}
            >
              📊 Dashboard
            </NavLink>
            <NavLink
              to="/"
              style={({ isActive }) => ({
                textDecoration: "none",
                fontSize: "0.92rem",
                fontWeight: "600",
                color: isActive ? "var(--primary)" : "var(--text-muted)",
                backgroundColor: isActive ? "var(--primary-subtle)" : "transparent",
                padding: "8px 14px",
                borderRadius: "10px",
              })}
            >
              📖 Recipes
            </NavLink>
            <NavLink
              to="/content-tracker"
              style={({ isActive }) => ({
                textDecoration: "none",
                fontSize: "0.92rem",
                fontWeight: "600",
                color: isActive ? "var(--primary)" : "var(--text-muted)",
                backgroundColor: isActive ? "var(--primary-subtle)" : "transparent",
                padding: "8px 14px",
                borderRadius: "10px",
              })}
            >
              🎬 Content Tracker
            </NavLink>
            <NavLink
              to="/calendar"
              style={({ isActive }) => ({
                textDecoration: "none",
                fontSize: "0.92rem",
                fontWeight: "600",
                color: isActive ? "var(--primary)" : "var(--text-muted)",
                backgroundColor: isActive ? "var(--primary-subtle)" : "transparent",
                padding: "8px 14px",
                borderRadius: "10px",
              })}
            >
              📅 Calendar
            </NavLink>
          </nav>

          <button
            type="button"
            onClick={toggleTheme}
            style={{
              background: "var(--bg-subtle)",
              border: "1px solid var(--border-color)",
              color: "var(--text-main)",
              padding: "8px 14px",
              borderRadius: "10px",
              cursor: "pointer",
              fontSize: "0.88rem",
              fontWeight: "600",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            {isDark ? "☀️ Light" : "🌙 Dark"}
          </button>
        </div>
      </div>
    </header>
  );
}

export default Navbar;