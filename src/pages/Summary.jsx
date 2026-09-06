import { useMemo } from "react";
import { useTransactions } from "../hooks/useTransactions";

export default function Summary() {
  const { transactions } = useTransactions();

  const byCategory = useMemo(() => {
    return transactions
      .filter((t) => t.type === "Expense")
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + Number(t.amount);
        return acc;
      }, {});
  }, [transactions]);

  const maxValue = Math.max(1, ...Object.values(byCategory));

  return (
    <div>
        <h1>Summary</h1>

      <div className="section-header">📊 Spending by Category</div>
      <div className="panel">
        {Object.keys(byCategory).length === 0 ? (
          <p className="empty-state">No expenses recorded yet.</p>
        ) : (
          Object.entries(byCategory).map(([category, total]) => (
            <div key={category} className="category-bar-row">
              <div className="category-bar-label">
                <span>{category}</span>
                <span>₱{total.toFixed(2)}</span>
              </div>
              <div className="category-bar-track">
                <div
                  className="category-bar-fill"
                  style={{ width: `${(total / maxValue) * 100}%` }}
                />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}