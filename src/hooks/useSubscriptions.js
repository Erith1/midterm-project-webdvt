import { useState, useEffect } from "react";

const STORAGE_KEY = "subscriptions";

export function useSubscriptions() {
  const [subscriptions, setSubscriptions] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(subscriptions));
  }, [subscriptions]);

  const addSubscription = (sub) => {
    setSubscriptions((prev) => [
      ...prev,
      { ...sub, id: Date.now().toString(), status: "Active" },
    ]);
  };

  const updateSubscription = (id, updated) => {
    setSubscriptions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updated } : s))
    );
  };

  const toggleStatus = (id) => {
    setSubscriptions((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, status: s.status === "Active" ? "Cancelled" : "Active" } : s
      )
    );
  };

  const deleteSubscription = (id) => {
    setSubscriptions((prev) => prev.filter((s) => s.id !== id));
  };

  return { subscriptions, addSubscription, updateSubscription, toggleStatus, deleteSubscription };
}