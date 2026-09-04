import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav>
      <Link to="/">Dashboard</Link>
      <Link to="/add">Add Transaction</Link>
      <Link to="/summary">Summary</Link>
    </nav>
  );
}