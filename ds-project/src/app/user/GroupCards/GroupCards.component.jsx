import React, { useEffect, useState } from "react";
import styles from "./GroupCards.module.css";

export default function GroupCards({ algorithms, onAssign }) {
  const [groupA, setGroupA] = useState([]);
  const [groupB, setGroupB] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch group data from backend
  useEffect(() => {
    async function fetchGroups() {
      setLoading(true);
      try {
        const [aRes, bRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/group/A`, {
            credentials: "include",
          }),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/group/B`, {
            credentials: "include",
          }),
        ]);
        const aData = await aRes.json();
        const bData = await bRes.json();
        setGroupA(aData.algorithms || []);
        setGroupB(bData.algorithms || []);
      } catch (e) {
        setGroupA([]);
        setGroupB([]);
      }
      setLoading(false);
    }
    fetchGroups();
  }, []);

  // Sort group algorithms by leetcodeNumber
  const sortedGroupA = [...groupA].sort(
    (a, b) => (a.leetcodeNumber || 0) - (b.leetcodeNumber || 0),
  );
  const sortedGroupB = [...groupB].sort(
    (a, b) => (a.leetcodeNumber || 0) - (b.leetcodeNumber || 0),
  );

  // Sort all algorithms by leetcodeNumber for dropdown
  const sortedAlgorithms = [...algorithms].sort(
    (a, b) => (a.leetcodeNumber || 0) - (b.leetcodeNumber || 0),
  );

  // Assign algorithm to group
  async function handleAssign(algoId, groupName) {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/group/${groupName}`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ algoId }),
    });
    // Refresh groups from backend after assignment
    const [aRes, bRes] = await Promise.all([
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/group/A`, {
        credentials: "include",
      }),
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/group/B`, {
        credentials: "include",
      }),
    ]);
    const aData = await aRes.json();
    const bData = await bRes.json();
    setGroupA(aData.algorithms || []);
    setGroupB(bData.algorithms || []);
    if (onAssign) onAssign(algoId, groupName);
  }

  // Remove algorithm from group
  async function handleRemove(algoId, groupName) {
    await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/group/${groupName}/${algoId}`,
      {
        method: "DELETE",
        credentials: "include",
      },
    );
    if (groupName === "A") {
      setGroupA((prev) => prev.filter((a) => a._id !== algoId));
    } else {
      setGroupB((prev) => prev.filter((a) => a._id !== algoId));
    }
  }

  // Card click handler
  function handleGoToAlgo(algoId) {
    if (algoId) {
      window.location.href = `/take-algorithm/${algoId}`;
    }
  }

  // Card info rendering (like StarredAlgs/AlgorithmCard)
  function renderAlgoCard(algo, groupName) {
    // Check if practiced today (assume algo.lastPracticed is a Date or ISO string)
    let practicedToday = false;
    if (algo.lastPracticed) {
      const last = new Date(algo.lastPracticed);
      const now = new Date();
      practicedToday =
        last.getFullYear() === now.getFullYear() &&
        last.getMonth() === now.getMonth() &&
        last.getDate() === now.getDate();
    }
    return (
      <div
        key={algo._id}
        className={styles.starredCardSlot}
        style={{ position: "relative" }}
      >
        <div className={styles.tierSelectWrap}>
          <button
            className={styles.removeBtn}
            style={{
              minWidth: 0,
              padding: "0.18rem 0.7rem",
              fontSize: "0.92rem",
            }}
            onClick={(e) => {
              e.stopPropagation();
              handleRemove(algo._id, groupName);
            }}
            title="Remove from group"
          >
            Remove
          </button>
        </div>
        <div
          className={
            styles.algorithmCard +
            (practicedToday ? " " + styles.practicedToday : "")
          }
          style={{
            cursor: "pointer",
            minHeight: 160,
            border: practicedToday ? "2.5px solid #22c55e" : undefined,
          }}
          onClick={() => handleGoToAlgo(algo._id)}
          title={algo.title}
        >
          <div className={styles.cardHeader}>
            <span className={styles.leetcodeNumber}>
              {algo.leetcodeNumber ? `#${algo.leetcodeNumber}` : ""}
            </span>
            <span className={styles.cardTitle}>{algo.title}</span>
          </div>
          {algo.type && <div className={styles.cardType}>{algo.type}</div>}
        </div>
      </div>
    );
  }

  if (loading) return <div>Loading groups...</div>;

  return (
    <div className={styles.groupCardsContainer}>
      {["A", "B"].map((groupName) => {
        const groupAlgos = groupName === "A" ? sortedGroupA : sortedGroupB;
        return (
          <div key={groupName} className={styles.groupCard}>
            <h2>
              Group {groupName} ({groupAlgos.length})
            </h2>
            <div className={styles.algosList}>
              {groupAlgos.length === 0 && (
                <div className={styles.empty}>No algorithms assigned.</div>
              )}
              {groupAlgos.map((algo) => renderAlgoCard(algo, groupName))}
            </div>
            <div className={styles.assignSection}>
              <select id={`assign-${groupName}`} className={styles.selectAlgo}>
                <option value="">Assign algorithm...</option>
                {sortedAlgorithms
                  .filter((a) => !groupAlgos.some((g) => g._id === a._id))
                  .map((algo) => (
                    <option key={algo._id} value={algo._id}>
                      {algo.leetcodeNumber ? `#${algo.leetcodeNumber}` : ""}{" "}
                      {algo.title}
                    </option>
                  ))}
              </select>
              <button
                className={styles.assignBtn}
                onClick={() => {
                  const select = document.getElementById(`assign-${groupName}`);
                  if (select.value) handleAssign(select.value, groupName);
                }}
              >
                Assign
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
