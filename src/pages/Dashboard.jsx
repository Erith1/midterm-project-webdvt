import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useTransactions } from "../hooks/useTransactions";
import { useBudgetObjectives } from "../hooks/useBudgetObjectives";
import TransactionList from "../components/TransactionList";

export default function Dashboard() {
  const { transactions } = useTransactions();
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");

  const { objectives, addObjective, toggleObjective, deleteObjective } = useBudgetObjectives();
  const [newObjective, setNewObjective] = useState("");

  const categories = useMemo(() => {
    const unique = new Set(transactions.map((t) => t.category));
    return ["All", ...unique];
  }, [transactions]);

  const filtered = useMemo(() => {
    return transactions.filter((t) => {
      const categoryMatch = categoryFilter === "All" || t.category === categoryFilter;
      const typeMatch = typeFilter === "All" || t.type === typeFilter;
      return categoryMatch && typeMatch;
    });
  }, [transactions, categoryFilter, typeFilter]);

  const { balance, totalIncome, totalExpense } = useMemo(() => {
    let income = 0;
    let expense = 0;
    transactions.forEach((t) => {
      if (t.type === "Income") income += Number(t.amount);
      else expense += Number(t.amount);
    });
    return { balance: income - expense, totalIncome: income, totalExpense: expense };
  }, [transactions]);

  const handleAddObjective = (e) => {
    e.preventDefault();
    if (!newObjective.trim()) return;
    addObjective(newObjective.trim());
    setNewObjective("");
  };

  return (
    <div>
      <h1>Dashboard</h1>

      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-label">Balance</div>
          <div className={`stat-value ${balance >= 0 ? "value-positive" : "value-negative"}`}>
            ₱{balance.toFixed(2)}
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Income</div>
          <div className="stat-value value-positive">₱{totalIncome.toFixed(2)}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Expenses</div>
          <div className="stat-value value-negative">₱{totalExpense.toFixed(2)}</div>
        </div>
      </div>

      <div className="dashboard-layout">
        <div className="dashboard-sidebar">
          <div className="section-header">Budget Objectives</div>
          <div className="panel">
            {objectives.length === 0 ? (
              <p className="empty-state">No objectives yet.</p>
            ) : (
              <ul className="objective-list">
                {objectives.map((o) => (
                  <li key={o.id} className="objective-item">
                    <label>
                      <input
                        type="checkbox"
                        checked={o.completed}
                        onChange={() => toggleObjective(o.id)}
                      />
                      <span className={o.completed ? "objective-done" : ""}>{o.text}</span>
                    </label>
                    <button className="btn-remove-x" onClick={() => deleteObjective(o.id)}>✕</button>
                  </li>
                ))}
              </ul>
            )}
            <form onSubmit={handleAddObjective} className="inline-add-form">
              <input
                type="text"
                placeholder="New objective..."
                value={newObjective}
                onChange={(e) => setNewObjective(e.target.value)}
              />
              <button type="submit" className="btn btn-secondary">Add</button>
            </form>
          </div>
        </div>

        <div className="dashboard-main">
          <div className="toolbar">
            <Link to="/add" className="btn btn-primary">+ Add Transaction</Link>

            <div className="filter-group">
              <label>
                Category:
                <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
                  {categories.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </label>

              <label>
                Type:
                <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
                  <option value="All">All</option>
                  <option value="Income">Income</option>
                  <option value="Expense">Expense</option>
                </select>
              </label>
            </div>
          </div>

          <div className="section-header">Transactions</div>
          <div className="panel" style={{ padding: 0 }}>
            {filtered.length === 0 ? (
              <p className="empty-state">No transactions found.</p>
            ) : (
              <TransactionList transactions={filtered} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}