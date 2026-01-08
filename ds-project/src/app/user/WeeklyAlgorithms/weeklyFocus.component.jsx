import React, { useEffect, useState } from "react";
import styles from "./weeklyFocus.module.css";
import AlgorithmCard from "../AlgorithmCard/algorithmCard.component";

function getSundayOfWeek(date = new Date()) {
  const d = new Date(date);
  const day = d.getDay();
  d.setDate(d.getDate() - day);
  d.setHours(0, 0, 0, 0);
  return d;
}

const WeeklyFocus = ({ algorithms, progressMap, handleGoToAlgo }) => {
  const [focusList, setFocusList] = useState([]); // array of alg objects or null
  const [focusIds, setFocusIds] = useState([]); // array of ids
  const [startDate, setStartDate] = useState(getSundayOfWeek());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch weekly focus from backend
    async function fetchWeeklyFocus() {
      setLoading(true);
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/user/weekly-focus`,
          { credentials: "include" }
        );
        if (res.ok) {
          const data = await res.json();
          let sortedFocus = [...data.weeklyFocus];
          sortedFocus.sort((a, b) => {
            // If leetcodeNumber is missing, sort to the end
            if (a.leetcodeNumber == null) return 1;
            if (b.leetcodeNumber == null) return -1;
            return a.leetcodeNumber - b.leetcodeNumber;
          });
          setFocusIds(sortedFocus.map((a) => a._id));
          setFocusList(sortedFocus);
          setStartDate(
            data.weeklyFocusStartDate
              ? new Date(data.weeklyFocusStartDate)
              : getSundayOfWeek()
          );
        }
      } catch {}
      setLoading(false);
    }
    fetchWeeklyFocus();
  }, [algorithms]);

  // Helper: get available algorithms for dropdown (not in focus)
  function getAvailableAlgos() {
    return algorithms
      ?.filter((a) => !focusIds.includes(a._id))
      .sort((a, b) => {
        if (a.leetcodeNumber == null) return 1;
        if (b.leetcodeNumber == null) return -1;
        return a.leetcodeNumber - b.leetcodeNumber;
      });
  }

  // Handle selection from dropdown
  async function handleSelect(idx, algoId) {
    const newIds = [...focusIds];
    newIds[idx] = algoId;
    // Remove duplicates
    for (let i = 0; i < newIds.length; i++) {
      for (let j = i + 1; j < newIds.length; j++) {
        if (newIds[i] === newIds[j]) newIds[j] = null;
      }
    }
    await updateFocus(newIds);
  }

  // Handle removal
  async function handleRemove(idx) {
    const newIds = [...focusIds];
    newIds[idx] = null;
    await updateFocus(newIds);
  }

  // Handle drag-and-drop reorder
  async function handleReorder(fromIdx, toIdx) {
    const newIds = [...focusIds];
    const [moved] = newIds?.splice(fromIdx, 1);
    newIds.splice(toIdx, 0, moved);
    await updateFocus(newIds);
  }

  // Update backend and local state
  async function updateFocus(newIds) {
    const filtered = newIds.filter(Boolean);
    setFocusIds(newIds);
    setFocusList(filtered.map((id) => algorithms.find((a) => a._id === id)));
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/weekly-focus`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        weeklyFocus: filtered,
        weeklyFocusStartDate: startDate,
      }),
    });
  }

  if (loading) return <div>Loading weekly focus...</div>;

  return (
    <section className={styles.section}>
      <h3>
        Weekly Focus
        <span style={{ fontWeight: 400, fontSize: "1rem", marginLeft: 12 }}>
          (Start:{" "}
          {startDate.toLocaleDateString(undefined, {
            year: "numeric",
            month: "short",
            day: "2-digit",
          })}
          )
        </span>
      </h3>
      <div className={styles.algoList}>
        {Array.from({ length: 8 }, (_, idx) => focusList[idx] || null).map(
          (algo, idx) => {
            if (algo) {
              const progress = progressMap[algo._id];
              return (
                <div key={idx} style={{ position: "relative" }}>
                  <AlgorithmCard
                    algo={algo}
                    progress={progress}
                    onGoTo={() => handleGoToAlgo(algo._id)}
                  />
                  <div
                    style={{
                      position: "absolute",
                      top: 8,
                      right: 8,
                      zIndex: 2,
                      display: "flex",
                    }}
                  >
                    <button
                      className={styles.removeBtn}
                      onClick={() => handleRemove(idx)}
                      title="Remove"
                    >
                      ✕
                    </button>
                    {idx > 0 && (
                      <button
                        className={styles.moveBtn}
                        onClick={() => handleReorder(idx, idx - 1)}
                        title="Move up"
                      >
                        ↑
                      </button>
                    )}
                    {idx < 7 && (
                      <button
                        className={styles.moveBtn}
                        onClick={() => handleReorder(idx, idx + 1)}
                        title="Move down"
                      >
                        ↓
                      </button>
                    )}
                  </div>
                  <div
                    style={{ fontSize: "0.9rem", color: "#888", marginTop: 2 }}
                  >
                    Last practiced:{" "}
                    {progress?.lastPracticed
                      ? new Date(progress.lastPracticed).toLocaleString(
                          undefined,
                          {
                            year: "numeric",
                            month: "short",
                            day: "2-digit",
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )
                      : "-"}
                  </div>
                </div>
              );
            } else {
              // Empty slot: dropdown
              const available = getAvailableAlgos();
              return (
                <div
                  key={idx}
                  className={styles.algoCard}
                  style={{
                    minHeight: 120,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <select
                    value=""
                    onChange={(e) => handleSelect(idx, e.target.value)}
                    style={{
                      fontSize: "1rem",
                      padding: "0.5rem",
                      width: "200px",
                      borderRadius: 8,
                    }}
                  >
                    <option value="">Select algorithm...</option>
                    {getAvailableAlgos()?.map((a) => (
                      <option key={a._id} value={a._id}>
                        {a?.leetcodeNumber ? `${a.leetcodeNumber}. ` : ""}
                        {a.title} ({progressMap[a._id]?.status || "-"})
                      </option>
                    ))}
                  </select>
                </div>
              );
            }
          }
        )}
      </div>
    </section>
  );
};

export default WeeklyFocus;
