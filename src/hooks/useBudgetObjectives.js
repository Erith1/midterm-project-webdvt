import { useState, useEffect } from "react";

const STORAGE_KEY = "budgetObjectives";

export function useBudgetObjectives() {
  const [objectives, setObjectives] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(objectives));
  }, [objectives]);

  const addObjective = (text, amount) => {
    setObjectives((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        text,
        amount: amount ? Number(amount) : 0,
        completed: false,
        linkedTransactionId: null,
      },
    ]);
  };

  const setObjectiveState = (id, completed, linkedTransactionId) => {
    setObjectives((prev) =>
      prev.map((o) => (o.id === id ? { ...o, completed, linkedTransactionId } : o))
    );
  };

  const deleteObjective = (id) => {
    setObjectives((prev) => prev.filter((o) => o.id !== id));
  };

  return { objectives, addObjective, setObjectiveState, deleteObjective };
}