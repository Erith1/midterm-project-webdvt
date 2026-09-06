import { useState, useMemo } from "react";
import { useSubscriptions } from "../hooks/useSubscriptions";

export default function Subscriptions() {
  const { subscriptions, addSubscription, toggleStatus, deleteSubscription } = useSubscriptions();
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Activities");

  const grouped = useMemo(() => {
    return subscriptions.reduce((acc, s) => {
      if (!acc[s.category]) acc[s.category] = [];
      acc[s.category].push(s);
      return acc;
    }, {});
  }, [subscriptions]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || Number(amount) <= 0) return;
    addSubscription({ name: name.trim(), amount: Number(amount), category });
    setName("");
    setAmount("");
  };

  return (
    <div>
      <h1>Subscriptions Tracker</h1>

      <div className="panel-standalone" style={{ maxWidth: 480, marginBottom: 20 }}>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Netflix" />
          </div>
          <div className="form-group">
            <label>Amount</label>
            <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Category</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="Activities">Activities</option>
              <option value="Streaming">Streaming</option>
              <option value="Software">Software</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <button type="submit" className="btn btn-primary">Add Subscription</button>
        </form>
      </div>

      {Object.keys(grouped).length === 0 ? (
        <div className="panel"><p className="empty-state">No subscriptions yet.</p></div>
      ) : (
        Object.entries(grouped).map(([cat, subs]) => (
          <div key={cat} style={{ marginBottom: 20 }}>
            <div className="section-header">{cat}</div>
            <div className="panel subscription-grid">
              {subs.map((s) => (
                <div key={s.id} className="subscription-card">
                  <button className="btn-remove-x float-right" onClick={() => deleteSubscription(s.id)}>✕</button>
                  <div className="subscription-name">{s.name}</div>
                  <div className="subscription-amount">₱{s.amount.toFixed(2)}</div>
                  <button
                    className={`badge ${s.status === "Active" ? "badge-income" : "badge-expense"}`}
                    onClick={() => toggleStatus(s.id)}
                    style={{ border: "none", cursor: "pointer" }}
                  >
                    {s.status}
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}