import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useTransactions } from "../hooks/useTransactions";
import Badge from "../components/Badge";

export default function TransactionDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getTransaction, updateTransaction, deleteTransaction } = useTransactions();
  const transaction = getTransaction(id);

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(transaction || {});

  if (!transaction) {
    return (
      <div>
        <h1>Transaction Detail</h1>
        <p className="empty-state">Transaction not found.</p>
        <Link to="/" className="btn btn-secondary">Back to Dashboard</Link>
      </div>
    );
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    updateTransaction(id, formData);
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (window.confirm("Delete this transaction?")) {
      deleteTransaction(id);
      navigate("/");
    }
  };

  return (
    <div>
      <h1>Transaction Detail</h1>
      <div className="panel-standalone" style={{ maxWidth: 480, margin: "0 auto" }}>
        {isEditing ? (
          <div>
            <div className="form-group">
              <label>Description</label>
              <input name="description" value={formData.description} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Amount</label>
              <input name="amount" type="number" value={formData.amount} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Type</label>
              <select name="type" value={formData.type} onChange={handleChange}>
                <option value="Income">Income</option>
                <option value="Expense">Expense</option>
              </select>
            </div>
            <div className="form-group">
              <label>Category</label>
              <input name="category" value={formData.category} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Date</label>
              <input name="date" type="date" value={formData.date} onChange={handleChange} />
            </div>

            <div className="action-row">
              <button className="btn btn-primary" onClick={handleSave}>Save</button>
              <button className="btn btn-secondary" onClick={() => setIsEditing(false)}>Cancel</button>
            </div>
          </div>
        ) : (
          <div>
            <div className="detail-grid">
              <span className="label">Description</span>
              <span>{transaction.description}</span>

              <span className="label">Amount</span>
              <span className={transaction.type === "Income" ? "amount-income" : "amount-expense"}>
                ₱{Number(transaction.amount).toFixed(2)}
              </span>

              <span className="label">Type</span>
              <Badge type={transaction.type === "Income" ? "income" : "expense"}>
                {transaction.type === "Income" ? "⬆ Income" : "⬇ Expense"}
              </Badge>

              <span className="label">Category</span>
              <Badge type="category">🏷 {transaction.category}</Badge>

              <span className="label">Date</span>
              <span>{transaction.date}</span>
            </div>

            <div className="action-row">
              <button className="btn btn-secondary" onClick={() => setIsEditing(true)}>Edit</button>
              <button className="btn btn-danger" onClick={handleDelete}>Delete</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}