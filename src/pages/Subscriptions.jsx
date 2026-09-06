import { useState, useMemo } from "react";
import { useSubscriptions } from "../hooks/useSubscriptions";

const CATEGORY_PRESETS = ["Activities", "Streaming", "Software"];

export default function Subscriptions() {
  const { subscriptions, addSubscription, updateSubscription, toggleStatus, deleteSubscription } = useSubscriptions();
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState(CATEGORY_PRESETS[0]);
  const [customCategory, setCustomCategory] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});

  const isCustomCategory = category === "Other";
  const finalCategory = isCustomCategory ? customCategory.trim() : category;

  const grouped = useMemo(() => {
    return subscriptions.reduce((acc, s) => {
      if (!acc[s.category]) acc[s.category] = [];
      acc[s.category].push(s);
      return acc;
    }, {});
  }, [subscriptions]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || Number(amount) <= 0 || !finalCategory) return;
    addSubscription({ name: name.trim(), amount: Number(amount), category: finalCategory });
    setName("");
    setAmount("");
    setCustomCategory("");
  };

  const startEdit = (sub) => {
    const isPreset = CATEGORY_PRESETS.includes(sub.category);
    setEditingId(sub.id);
    setEditData({
      name: sub.name,
      amount: sub.amount,
      category: isPreset ? sub.category : "Other",
      customCategory: isPreset ? "" : sub.category,
    });
  };

  const saveEdit = (id) => {
    const finalEditCategory =
      editData.category === "Other" ? editData.customCategory.trim() : editData.category;
    if (!editData.name.trim() || Number(editData.amount) <= 0 || !finalEditCategory) return;
    updateSubscription(id, {
      name: editData.name,
      amount: Number(editData.amount),
      category: finalEditCategory,
    });
    setEditingId(null);
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this subscription?")) {
      deleteSubscription(id);
    }
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
              {CATEGORY_PRESETS.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
              <option value="Other">Other (specify)</option>
            </select>
          </div>
          {isCustomCategory && (
            <div className="form-group">
              <label>Custom Category</label>
              <input
                type="text"
                value={customCategory}
                onChange={(e) => setCustomCategory(e.target.value)}
                placeholder="e.g. Gaming"
              />
            </div>
          )}
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
                  {editingId === s.id ? (
                    <div className="subscription-edit-form">
                      <input
                        type="text"
                        value={editData.name}
                        onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                      />
                      <input
                        type="number"
                        value={editData.amount}
                        onChange={(e) => setEditData({ ...editData, amount: e.target.value })}
                      />
                      <select
                        value={editData.category}
                        onChange={(e) => setEditData({ ...editData, category: e.target.value })}
                      >
                        {CATEGORY_PRESETS.map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                        <option value="Other">Other (specify)</option>
                      </select>
                      {editData.category === "Other" && (
                        <input
                          type="text"
                          value={editData.customCategory}
                          onChange={(e) => setEditData({ ...editData, customCategory: e.target.value })}
                          placeholder="Custom category"
                        />
                      )}
                      <div className="action-row">
                        <button className="btn btn-primary" onClick={() => saveEdit(s.id)}>Save</button>
                        <button className="btn btn-secondary" onClick={() => setEditingId(null)}>Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <button className="btn-remove-x float-right" onClick={() => handleDelete(s.id)}>✕</button>
                      <div className="subscription-name">{s.name}</div>
                      <div className="subscription-amount">₱{s.amount.toFixed(2)}</div>
                      <div className="subscription-actions">
                        <button
                          className={`badge ${s.status === "Active" ? "badge-income" : "badge-expense"}`}
                          onClick={() => toggleStatus(s.id)}
                          style={{ border: "none", cursor: "pointer" }}
                        >
                          {s.status}
                        </button>
                        <button className="btn-edit-inline" onClick={() => startEdit(s)}>Edit</button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}