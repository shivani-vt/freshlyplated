import { NavLink } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  return (
    <header className="main-navbar">
      <div className="nav-logo">
        <NavLink to="/dashboard">
          FreshlyPlated<span>OS</span>
        </NavLink>
      </div>

      <nav className="nav-links">
        <NavLink
          to="/dashboard"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          📊 Dashboard
        </NavLink>
        <NavLink
          to="/"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          🥘 Recipes
        </NavLink>
        <NavLink
          to="/content-tracker"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          🎬 Pipeline
        </NavLink>
        <NavLink
          to="/calendar"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          📅 Calendar
        </NavLink>
        <NavLink
          to="/shopping-list"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          🛒 Shopping List
        </NavLink>
        <NavLink
          to="/pantry"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          🥫 Pantry
        </NavLink>
      </nav>

      <div className="nav-actions">
        <NavLink to="/content-items/new" className="btn-primary">
          + New Content
        </NavLink>
      </div>
    </header>
  );
}

export default Navbar;