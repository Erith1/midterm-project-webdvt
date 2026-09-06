import { NavLink } from "react-router-dom";

export default function Navbar() {
  return (
    <div className="navbar">
      <span className="brand">💰 Budget Tracker</span>
      <div className="nav-links">
        <NavLink to="/" end className={({ isActive }) => (isActive ? "active" : "")}>
          📊 Dashboard
        </NavLink>
        <NavLink to="/add" className={({ isActive }) => (isActive ? "active" : "")}>
          ➕ Add Transaction
        </NavLink>
        <NavLink to="/summary" className={({ isActive }) => (isActive ? "active" : "")}>
          📈 Summary
        </NavLink>
        <NavLink to="/history" className={({ isActive }) => (isActive ? "active" : "")}>
          🕘 History
        </NavLink>
      </div>
    </div>
  );
}