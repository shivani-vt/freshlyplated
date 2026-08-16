import { Link, NavLink } from "react-router-dom";

function Navbar() {
  const navBarStyle = {
    backgroundColor: "#ffffff",
    borderBottom: "1px solid #e2e8f0",
    position: "sticky",
    top: 0,
    zIndex: 1000,
    width: "100%",
    boxShadow: "0 1px 4px rgba(0, 0, 0, 0.04)",
  };

  const containerStyle = {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "0 24px",
    height: "64px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  };

  const logoStyle = {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    textDecoration: "none",
    fontSize: "1.25rem",
    fontWeight: "800",
    color: "#0f172a",
    letterSpacing: "-0.02em",
  };

  const linksGroupStyle = {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  };

  const getLinkStyle = (isActive) => ({
    textDecoration: "none",
    fontSize: "0.92rem",
    fontWeight: "600",
    color: isActive ? "#7c3aed" : "#64748b",
    backgroundColor: isActive ? "#f5f3ff" : "transparent",
    padding: "8px 16px",
    borderRadius: "10px",
    transition: "all 0.2s ease",
  });

  return (
    <header style={navBarStyle}>
      <div style={containerStyle}>
        <Link to="/" style={logoStyle}>
          <span style={{ fontSize: "1.3rem" }}>🍽️</span>
          <span>FreshlyPlated</span>
        </Link>

        <nav style={linksGroupStyle}>
          <NavLink
            to="/dashboard"
            style={({ isActive }) => getLinkStyle(isActive)}
          >
            📊 Dashboard
          </NavLink>
          <NavLink
            to="/"
            style={({ isActive }) => getLinkStyle(isActive)}
          >
            📖 Recipes
          </NavLink>
          <NavLink
            to="/content-tracker"
            style={({ isActive }) => getLinkStyle(isActive)}
          >
            🎬 Content Tracker
          </NavLink>
          <NavLink
            to="/calendar"
            style={({ isActive }) => getLinkStyle(isActive)}
          >
            📅 Calendar
          </NavLink>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;