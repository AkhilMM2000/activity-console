import React, { useEffect, useState } from "react";

type Task = { id: string; title: string; updatedAt: number };

export function TaskTicker({ apiBase }: { apiBase: string }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  // (A) Keep a running clock for "x seconds ago" using functional update to avoid stale closure
  useEffect(() => {
    const intervalId = setInterval(() => {
      setTick((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(intervalId);
  }, []);

  // (B) Refetch task details with abort controllers, null-guards, and error handling
  useEffect(() => {
    if (selectedId === null) return;

    const controller = new AbortController();

    fetch(`${apiBase}/api/tasks/${selectedId}`, { signal: controller.signal })
      .then((r) => {
        if (!r.ok) {
          throw new Error(`Failed to fetch task: status ${r.status}`);
        }
        return r.json();
      })
      .then((t) => {
        // Defensive check: Ensure response payload is a valid Task before updating state
        if (!t || typeof t.id !== "string" || typeof t.updatedAt !== "number") {
          return;
        }

        setTasks((prev) => {
          // Avoid duplicate task list entries
          const exists = prev.some((x) => x.id === t.id);
          if (exists) {
            return prev.map((x) => (x.id === t.id ? t : x));
          }
          return [...prev, t];
        });
      })
      .catch((err) => {
        if (err.name !== "AbortError") {
          console.error("[TaskTicker] Fetch error:", err);
        }
      });

    return () => {
      controller.abort();
    };
  }, [selectedId, apiBase]);

  // (C) Newest first: Clone the tasks list first to avoid mutating component state in-place
  const sorted = [...tasks].sort((a, b) => b.updatedAt - a.updatedAt);

  return (
    <ul>
      {sorted.map((t) => (
        <li key={t.id} onClick={() => setSelectedId(t.id)}>
          {t.title} (updated {Math.floor((Date.now() - t.updatedAt) / 1000)}s ago)
        </li>
      ))}
    </ul>
  );
}
