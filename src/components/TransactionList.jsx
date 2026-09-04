import { memo } from "react";
import { Link } from "react-router-dom";

const TransactionList = memo(function TransactionList({ transactions }) {
  return (
    <ul>
      {transactions.map((t) => (
        <li key={t.id}>
          <Link to={`/transaction/${t.id}`}>
            {t.description} — {t.type} — ₱{t.amount} ({t.category})
          </Link>
        </li>
      ))}
    </ul>
  );
});

export default TransactionList;