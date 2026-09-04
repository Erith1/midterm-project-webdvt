import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTransactions } from "../hooks/useTransactions";

export default function TransactionDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getTransaction, updateTransaction, deleteTransaction } = useTransactions();
  const transaction = getTransaction(id);

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(transaction || {});

  if (!transaction) {
    return <p>Transaction not found.</p>;
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    updateTransaction(id, formData);
    setIsEditing(false);
  };

  const handleDelete = () => {
    deleteTransaction(id);
    navigate("/");
  };

  return (
    <div>
      <h1>Transaction Detail</h1>

      {isEditing ? (
        <div>
          <input name="description" value={formData.description} onChange={handleChange} />
          <input name="amount" type="number" value={formData.amount} onChange={handleChange} />
          <select name="type" value={formData.type} onChange={handleChange}>
            <option value="Income">Income</option>
            <option value="Expense">Expense</option>
          </select>
          <input name="category" value={formData.category} onChange={handleChange} />
          <input name="date" type="date" value={formData.date} onChange={handleChange} />
          <button onClick={handleSave}>Save</button>
          <button onClick={() => setIsEditing(false)}>Cancel</button>
        </div>
      ) : (
        <div>
          <p>Description: {transaction.description}</p>
          <p>Amount: ₱{transaction.amount}</p>
          <p>Type: {transaction.type}</p>
          <p>Category: {transaction.category}</p>
          <p>Date: {transaction.date}</p>
          <button onClick={() => setIsEditing(true)}>Edit</button>
          <button onClick={handleDelete}>Delete</button>
        </div>
      )}
    </div>
  );
}