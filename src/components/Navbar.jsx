import { NavLink } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="navbar">
      <span className="brand">💰 Budget Tracker</span>
      <div className="nav-links">
        <NavLink to="/" end className={({ isActive }) => (isActive ? "active" : "")}>📊 Dashboard</NavLink>
        <NavLink to="/add" className={({ isActive }) => (isActive ? "active" : "")}>➕ Add</NavLink>
        <NavLink to="/summary" className={({ isActive }) => (isActive ? "active" : "")}>📈 Summary</NavLink>
        <NavLink to="/subscriptions" className={({ isActive }) => (isActive ? "active" : "")}>🔁 Subscriptions</NavLink>
        <NavLink to="/fixed-expenses" className={({ isActive }) => (isActive ? "active" : "")}>📌 Fixed Expenses</NavLink>
        <NavLink to="/history" className={({ isActive }) => (isActive ? "active" : "")}>🕘 History</NavLink>
        <button className="btn btn-secondary theme-toggle-nav" onClick={toggleTheme}>
          {theme === "light" ? "🌙 Dark" : "☀️ Light"}
        </button>
      </div>
    </div>
  );
}