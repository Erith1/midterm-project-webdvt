import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTransactions } from "../hooks/useTransactions";

const CATEGORY_PRESETS = [
  "Groceries",
  "Electric Bill",
  "Water Bill",
  "Internet/Phone",
  "Rent",
  "Transportation",
  "Entertainment",
  "Dining Out",
  "Health/Medical",
  "Shopping",
  "Salary",
  "Other Income",
];

function getToday() {
  const now = new Date();
  const offset = now.getTimezoneOffset();
  const local = new Date(now.getTime() - offset * 60000);
  return local.toISOString().split("T")[0];
}

export default function AddTransaction() {
  const { addTransaction } = useTransactions();
  const navigate = useNavigate();

  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("Expense");
  const [category, setCategory] = useState(CATEGORY_PRESETS[0]);
  const [customCategory, setCustomCategory] = useState("");
  const [date, setDate] = useState(getToday());
  const [error, setError] = useState("");

  const isCustomCategory = category === "Other";
  const finalCategory = isCustomCategory ? customCategory.trim() : category;

  const handleReset = () => {
    setDescription("");
    setAmount("");
    setType("Expense");
    setCategory(CATEGORY_PRESETS[0]);
    setCustomCategory("");
    setDate(getToday());
    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!description.trim() || !finalCategory || !date) {
      setError("Please fill in all required fields.");
      return;
    }
    if (Number(amount) <= 0 || isNaN(Number(amount))) {
      setError("Amount must be a number greater than 0.");
      return;
    }

    addTransaction({ description, amount: Number(amount), type, category: finalCategory, date });
    navigate("/");
  };

  return (
    <div>
      <h1>Add Transaction</h1>
      <div className="panel-standalone" style={{ maxWidth: 480, margin: "0 auto" }}>
        <form onSubmit={handleSubmit}>
          {error && <div className="alert-error">{error}</div>}

          <div className="form-group">
            <label>Description</label>
            <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>

          <div className="form-group">
            <label>Amount</label>
            <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
          </div>

          <div className="form-group">
            <label>Type</label>
            <select value={type} onChange={(e) => setType(e.target.value)}>
              <option value="Income">Income</option>
              <option value="Expense">Expense</option>
            </select>
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
                placeholder="e.g. Pet Supplies"
              />
            </div>
          )}

          <div className="form-group">
            <label>Date</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>

          <div className="action-row">
            <button type="submit" className="btn btn-primary">Save Transaction</button>
            <button type="button" className="btn btn-secondary" onClick={handleReset}>Reset</button>
          </div>
        </form>
      </div>
    </div>
  );
}