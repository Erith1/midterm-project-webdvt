import { useState, useMemo } from "react";
import { useFixedExpenses } from "../hooks/useFixedExpenses";

const FREQUENCY_PRESETS = ["Monthly", "Quarterly", "Yearly"];

export default function FixedExpenses() {
  const { fixedExpenses, addFixedExpense, updateFixedExpense, markAsPaid, deleteFixedExpense } = useFixedExpenses();
  const [label, setLabel] = useState("");
  const [amount, setAmount] = useState("");
  const [frequency, setFrequency] = useState(FREQUENCY_PRESETS[0]);
  const [customFrequency, setCustomFrequency] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});

  const isCustomFrequency = frequency === "Other";
  const finalFrequency = isCustomFrequency ? customFrequency.trim() : frequency;

  const grouped = useMemo(() => {
    return fixedExpenses.reduce((acc, e) => {
      if (!acc[e.frequency]) acc[e.frequency] = [];
      acc[e.frequency].push(e);
      return acc;
    }, {});
  }, [fixedExpenses]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!label.trim() || Number(amount) <= 0 || !finalFrequency) return;
    addFixedExpense({ label: label.trim(), amount: Number(amount), frequency: finalFrequency });
    setLabel("");
    setAmount("");
    setCustomFrequency("");
  };

  const startEdit = (item) => {
    const isPreset = FREQUENCY_PRESETS.includes(item.frequency);
    setEditingId(item.id);
    setEditData({
      label: item.label,
      amount: item.amount,
      frequency: isPreset ? item.frequency : "Other",
      customFrequency: isPreset ? "" : item.frequency,
    });
  };

  const saveEdit = (id) => {
    const finalEditFrequency =
      editData.frequency === "Other" ? editData.customFrequency.trim() : editData.frequency;
    if (!editData.label.trim() || Number(editData.amount) <= 0 || !finalEditFrequency) return;
    updateFixedExpense(id, {
      label: editData.label,
      amount: Number(editData.amount),
      frequency: finalEditFrequency,
    });
    setEditingId(null);
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this fixed expense?")) {
      deleteFixedExpense(id);
    }
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
            <label>Frequency</label>
            <select value={frequency} onChange={(e) => setFrequency(e.target.value)}>
              {FREQUENCY_PRESETS.map((f) => (
                <option key={f} value={f}>{f}</option>
              ))}
              <option value="Other">Other (specify)</option>
            </select>
          </div>
          {isCustomFrequency && (
            <div className="form-group">
              <label>Custom Frequency</label>
              <input
                type="text"
                value={customFrequency}
                onChange={(e) => setCustomFrequency(e.target.value)}
                placeholder="e.g. Bi-weekly"
              />
            </div>
          )}
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
                  <span>Label</span><span>Amount</span><span>Last Paid</span><span></span>
                </div>
                {items.map((i) =>
                  editingId === i.id ? (
                    <div key={i.id} className="fixed-expense-edit-row">
                      <input
                        type="text"
                        value={editData.label}
                        onChange={(e) => setEditData({ ...editData, label: e.target.value })}
                      />
                      <input
                        type="number"
                        value={editData.amount}
                        onChange={(e) => setEditData({ ...editData, amount: e.target.value })}
                      />
                      <select
                        value={editData.frequency}
                        onChange={(e) => setEditData({ ...editData, frequency: e.target.value })}
                      >
                        {FREQUENCY_PRESETS.map((f) => (
                          <option key={f} value={f}>{f}</option>
                        ))}
                        <option value="Other">Other (specify)</option>
                      </select>
                      {editData.frequency === "Other" && (
                        <input
                          type="text"
                          value={editData.customFrequency}
                          onChange={(e) => setEditData({ ...editData, customFrequency: e.target.value })}
                          placeholder="Custom frequency"
                        />
                      )}
                      <div className="action-row">
                        <button className="btn btn-primary" onClick={() => saveEdit(i.id)}>Save</button>
                        <button className="btn btn-secondary" onClick={() => setEditingId(null)}>Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <div key={i.id} className="fixed-expense-row">
                      <span>{i.label}</span>
                      <span>₱{i.amount.toFixed(2)}</span>
                      <span>{i.lastPaid || "—"}</span>
                      <div className="fixed-expense-actions">
                        <button className="btn-edit-inline" onClick={() => startEdit(i)}>Edit</button>
                        <button className="btn-edit-inline" onClick={() => markAsPaid(i.id)}>Mark Paid</button>
                        <button className="btn-remove-x" onClick={() => handleDelete(i.id)}>✕</button>
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}