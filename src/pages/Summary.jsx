import { useMemo } from "react";
import { useTransactions } from "../hooks/useTransactions";
import { useTheme } from "../context/ThemeContext";

export default function Summary() {
  const { transactions } = useTransactions();
  const { theme, toggleTheme } = useTheme();

  const byCategory = useMemo(() => {
    return transactions
      .filter((t) => t.type === "Expense")
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + Number(t.amount);
        return acc;
      }, {});
  }, [transactions]);

  return (
    <div>
      <h1>Summary</h1>

      <button onClick={toggleTheme}>
        Switch to {theme === "light" ? "dark" : "light"} mode
      </button>

      <h2>Spending by Category</h2>
      {Object.keys(byCategory).length === 0 ? (
        <p>No expenses recorded yet.</p>
      ) : (
        <ul>
          {Object.entries(byCategory).map(([category, total]) => (
            <li key={category}>
              {category}: ₱{total.toFixed(2)}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}