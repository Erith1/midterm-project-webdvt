import { useState, useEffect } from "react";

const STORAGE_KEY = "fixedExpenses";

export function useFixedExpenses() {
  const [fixedExpenses, setFixedExpenses] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(fixedExpenses));
  }, [fixedExpenses]);

  const addFixedExpense = (expense) => {
  setFixedExpenses((prev) => [
    ...prev,
    { ...expense, id: Date.now().toString(), lastPaid: null },
  ]);
};

  const updateFixedExpense = (id, updated) => {
    setFixedExpenses((prev) =>
      prev.map((e) => (e.id === id ? { ...e, ...updated } : e))
    );
  };

  const markAsPaid = (id) => {
    const today = new Date().toISOString().split("T")[0];
    setFixedExpenses((prev) =>
      prev.map((e) => (e.id === id ? { ...e, lastPaid: today } : e))
    );
  };

  const deleteFixedExpense = (id) => {
    setFixedExpenses((prev) => prev.filter((e) => e.id !== id));
  };

  return {
    fixedExpenses,
    addFixedExpense,
    updateFixedExpense,
    markAsPaid,
    deleteFixedExpense,
  };
}