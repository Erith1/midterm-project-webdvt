import { Link } from "react-router-dom";
import { useTransactions } from "../hooks/useTransactions";

const FIELDS = [
  { key: "description", label: "Description" },
  { key: "amount", label: "Amount" },
  { key: "type", label: "Type" },
  { key: "category", label: "Category" },
  { key: "date", label: "Date" },
];

function formatValue(field, value) {
  if (field === "amount") return `₱${Number(value).toFixed(2)}`;
  return value;
}

export default function EditHistory() {
  const { editHistory } = useTransactions();

  const sorted = [...editHistory].sort(
    (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
  );

  return (
    <div>
      <h1>Edit History</h1>

      {sorted.length === 0 ? (
        <div className="panel">
          <p className="empty-state">No edits have been made yet.</p>
        </div>
      ) : (
        sorted.map((entry) => {
          const changedFields = FIELDS.filter(
            (f) => String(entry.before[f.key]) !== String(entry.after[f.key])
          );

          return (
            <div key={entry.id} className="panel-standalone" style={{ marginBottom: 16 }}>
              <div className="history-header">
                <span>
                  Edited on {new Date(entry.timestamp).toLocaleString()}
                </span>
                <Link to={`/transaction/${entry.transactionId}`} className="btn btn-secondary">
                  View Transaction
                </Link>
              </div>

              <div className="history-diff-grid">
                <span className="label"></span>
                <span className="label">Before</span>
                <span className="label">After</span>

                {FIELDS.map((f) => {
                  const isChanged = changedFields.some((c) => c.key === f.key);
                  return (
                    <>
                      <span key={`${f.key}-label`} className="label">{f.label}</span>
                      <span
                        key={`${f.key}-before`}
                        className={isChanged ? "history-changed-before" : ""}
                      >
                        {formatValue(f.key, entry.before[f.key])}
                      </span>
                      <span
                        key={`${f.key}-after`}
                        className={isChanged ? "history-changed-after" : ""}
                      >
                        {formatValue(f.key, entry.after[f.key])}
                      </span>
                    </>
                  );
                })}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}