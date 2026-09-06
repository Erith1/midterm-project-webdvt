import { useState, useMemo } from "react";
import { useFixedExpenses } from "../hooks/useFixedExpenses";

export default function FixedExpenses() {
  const { fixedExpenses, addFixedExpense, deleteFixedExpense } = useFixedExpenses();
  const [label, setLabel] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Rent");
  const [frequency, setFrequency] = useState("Monthly");

  const grouped = useMemo(() => {
    return fixedExpenses.reduce((acc, e) => {
      if (!acc[e.frequency]) acc[e.frequency] = [];
      acc[e.frequency].push(e);
      return acc;
    }, {});
  }, [fixedExpenses]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!label.trim() || Number(amount) <= 0) return;
    addFixedExpense({ label: label.trim(), amount: Number(amount), category, frequency });
    setLabel("");
    setAmount("");
  };

  return (
    <div>
      <h1>Fixed Expenses</h1>

      <div className="panel-standalone" style={{ maxWidth: 480, marginBottom: 20 }}>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Label</label>
            <input type="text" value={label} onChange={(e) => setLabel(e.target.value)} placeholder="e.g. Rent" />
          </div>
          <div className="form-group">
            <label>Amount</label>
            <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Category</label>
            <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Frequency</label>
            <select value={frequency} onChange={(e) => setFrequency(e.target.value)}>
              <option value="Monthly">Monthly</option>
              <option value="Quarterly">Quarterly</option>
              <option value="Yearly">Yearly</option>
            </select>
          </div>
          <button type="submit" className="btn btn-primary">Add Fixed Expense</button>
        </form>
      </div>

      {Object.keys(grouped).length === 0 ? (
        <div className="panel"><p className="empty-state">No fixed expenses yet.</p></div>
      ) : (
        Object.entries(grouped).map(([freq, items]) => {
          const total = items.reduce((sum, i) => sum + i.amount, 0);
          return (
            <div key={freq} style={{ marginBottom: 20 }}>
              <div className="section-header">{freq} — ₱{total.toFixed(2)}</div>
              <div className="transaction-table">
                <div className="fixed-expense-header">
                  <span>Label</span><span>Amount</span><span>Category</span><span></span>
                </div>
                {items.map((i) => (
                  <div key={i.id} className="fixed-expense-row">
                    <span>{i.label}</span>
                    <span>₱{i.amount.toFixed(2)}</span>
                    <span className="badge badge-category">{i.category}</span>
                    <button className="btn-remove-x" onClick={() => deleteFixedExpense(i.id)}>✕</button>
                  </div>
                ))}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}