import { memo } from "react";
import { Link } from "react-router-dom";
import Badge from "./Badge";

const TransactionList = memo(function TransactionList({ transactions }) {
  return (
    <div className="transaction-table">
      <div className="transaction-table-header">
        <span>Date</span>
        <span>Label</span>
        <span>Amount</span>
        <span>Type</span>
        <span>Category</span>
      </div>

      {transactions.map((t) => (
        <Link
          key={t.id}
          to={`/transaction/${t.id}`}
          className={`transaction-row ${t.type === "Income" ? "income" : ""}`}
        >
          <span>{t.date}</span>
          <span>{t.description}</span>
          <span className={t.type === "Income" ? "amount-income" : "amount-expense"}>
            {t.type === "Income" ? "+" : "-"}₱{Number(t.amount).toFixed(2)}
          </span>
          <Badge type={t.type === "Income" ? "income" : "expense"}>
  {t.type}
</Badge>
<Badge type="category">{t.category}</Badge>
        </Link>
      ))}
    </div>
  );
});

export default TransactionList;