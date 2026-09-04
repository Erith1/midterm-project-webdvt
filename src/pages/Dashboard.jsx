import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useTransactions } from "../hooks/useTransactions";
import TransactionList from "../components/TransactionList";

export default function Dashboard() {
  const { transactions } = useTransactions();
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");

  const categories = useMemo(() => {
    const unique = new Set(transactions.map((t) => t.category));
    return ["All", ...unique];
  }, [transactions]);

  const filtered = useMemo(() => {
    return transactions.filter((t) => {
      const categoryMatch =
        categoryFilter === "All" || t.category === categoryFilter;
      const typeMatch = typeFilter === "All" || t.type === typeFilter;
      return categoryMatch && typeMatch;
    });
  }, [transactions, categoryFilter, typeFilter]);

  const balance = useMemo(() => {
    return transactions.reduce((sum, t) => {
      return t.type === "Income" ? sum + Number(t.amount) : sum - Number(t.amount);
    }, 0);
  }, [transactions]);

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Current Balance: ₱{balance.toFixed(2)}</p>

      <Link to="/add">+ Add Transaction</Link>

      <div>
        <label>
          Category:
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>

        <label>
          Type:
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="All">All</option>
            <option value="Income">Income</option>
            <option value="Expense">Expense</option>
          </select>
        </label>
      </div>

      {filtered.length === 0 ? (
        <p>No transactions found.</p>
      ) : (
        <TransactionList transactions={filtered} />
      )}
    </div>
  );
}