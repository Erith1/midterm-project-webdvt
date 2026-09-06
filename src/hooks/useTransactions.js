import { useState, useEffect } from "react";

const STORAGE_KEY = "transactions";
const HISTORY_KEY = "editHistory";

export function useTransactions() {
  const [transactions, setTransactions] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  });

  const [editHistory, setEditHistory] = useState(() => {
    const stored = localStorage.getItem(HISTORY_KEY);
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(editHistory));
  }, [editHistory]);

  const addTransaction = (transaction) => {
    setTransactions((prev) => [
      ...prev,
      { ...transaction, id: Date.now().toString() },
    ]);
  };

  const updateTransaction = (id, updated) => {
    const original = transactions.find((t) => t.id === id);

    if (original) {
      const after = { ...original, ...updated };
      const historyEntry = {
        id: Date.now().toString(),
        transactionId: id,
        timestamp: new Date().toISOString(),
        before: original,
        after,
      };
      setEditHistory((prev) => [...prev, historyEntry]);
    }

    setTransactions((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updated } : t))
    );
  };

  const deleteTransaction = (id) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  const getTransaction = (id) => transactions.find((t) => t.id === id);

  return {
    transactions,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    getTransaction,
    editHistory,
  };
}