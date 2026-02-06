import React, { useState } from "react";
import styles from "./allAlgorithms.module.css";

// Helper to get status class and label
function getStatusClass(status) {
  if (!status) return "";
  const s = status.toLowerCase();
  if (s === "mastered") return "status-mastered";
  if (s === "reviewing") return "status-reviewing";
  if (s === "deep practice" || s === "deep") return "status-deep";
  return "";
}

const statusList = ["Reviewing", "Mastered", "Deep Practice", "Not Started"];

// Helper to check if lastPracticed is today
function isPracticedToday(lastPracticed) {
  if (!lastPracticed) return false;
  const practiced = new Date(lastPracticed);
  const now = new Date();
  return (
    practiced.getFullYear() === now.getFullYear() &&
    practiced.getMonth() === now.getMonth() &&
    practiced.getDate() === now.getDate()
  );
}

const AllAlgorithms = ({ groups, handleGoToAlgo, progressMap }) => {
  const [filterStatus, setFilterStatus] = useState(null);
  const [filterMonth, setFilterMonth] = useState(null);
  // Flatten all algorithms for summary
  const allAlgos = Object.values(groups).flat();
  const total = allAlgos.length;
  // Count statuses
  const statusCounts = {
    Reviewing: 0,
    Mastered: 0,
    "Deep Practice": 0,
    "Not Started": 0,
  };
  let practicedTodayCount = 0;
  // For month grouping
  const monthMap = {};
  allAlgos.forEach((algo) => {
    const userProgress = progressMap?.[algo._id] || {};
    const status = userProgress.status || "Not Started";
    if (statusList.includes(status)) {
      statusCounts[status]++;
    }
    if (isPracticedToday(userProgress.lastPracticed)) {
      practicedTodayCount++;
    }
    // Month grouping
    let monthKey = "Never";
    if (userProgress.lastPracticed) {
      const d = new Date(userProgress.lastPracticed);
      monthKey = d.toLocaleString(undefined, {
        month: "long",
        year: "numeric",
      });
    }
    if (!monthMap[monthKey]) monthMap[monthKey] = [];
    monthMap[monthKey].push(algo);
  });

  // Get all months sorted descending (most recent first, "Never" last)
  const monthKeys = Object.keys(monthMap).sort((a, b) => {
    if (a === "Never") return 1;
    if (b === "Never") return -1;
    return new Date(b + " 1") - new Date(a + " 1");
  });

  // Get current date string
  const todayString = new Date().toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  // Filtered groups by status or month (separately)
  let filteredGroups = groups;
  if (filterStatus) {
    filteredGroups = Object.fromEntries(
      Object.entries(groups).map(([group, algos]) => [
        group,
        algos.filter((algo) => {
          const userProgress = progressMap?.[algo._id] || {};
          const status = userProgress.status || "Not Started";
          return status === filterStatus;
        }),
      ]),
    );
  } else if (filterMonth) {
    // Only show algorithms from the selected month
    const algosInMonth = monthMap[filterMonth] || [];
    filteredGroups = {
      [filterMonth]: algosInMonth,
    };
  }

  const done = total - statusCounts["Not Started"];

  return (
    <aside className={styles.sidebar}>
      <h3 className={styles.sidebarTitle}>All Algorithms</h3>
      <div
        style={{ marginBottom: "0.7rem", fontWeight: 500, fontSize: "1.08rem" }}
      >
        <span>Today:</span> {todayString}
        <br />
        <span>
          Practiced today: <b>{practicedTodayCount}</b>
        </span>
      </div>
      {/* Month filter UI */}
      <div style={{ marginBottom: "1.1rem" }}>
        <div style={{ fontWeight: 600, marginBottom: 4 }}>Filter by Month:</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {monthKeys.map((month) => (
            <button
              key={month}
              style={{
                background: filterMonth === month ? "#d8b4fe" : "#f3e8ff",
                color: filterMonth === month ? "#6d28d9" : "#3730a3",
                border: "none",
                borderRadius: 8,
                padding: "0.3rem 0.9rem",
                fontWeight: 500,
                fontSize: "1rem",
                cursor: "pointer",
                boxShadow:
                  filterMonth === month ? "0 2px 8px #d8b4fe55" : "none",
                outline: filterMonth === month ? "2px solid #a855f7" : "none",
                transition: "all 0.15s",
              }}
              onClick={() =>
                setFilterMonth(filterMonth === month ? null : month)
              }
            >
              {month}{" "}
              <span style={{ color: "#888", fontWeight: 400 }}>
                ({monthMap[month].length})
              </span>
            </button>
          ))}
        </div>
      </div>
      {/* Button to copy info for all algorithms */}
      <button
        style={{
          marginBottom: "1rem",
          background: "#86aed3",
          color: "#fff",
          border: "none",
          borderRadius: "6px",
          padding: "0.5rem 1rem",
          cursor: "pointer",
          fontWeight: 500,
          fontSize: "1rem",
        }}
        onClick={async () => {
          let algosToCopy = allAlgos;
          if (filterMonth) {
            algosToCopy = monthMap[filterMonth] || [];
          } else if (filterStatus) {
            algosToCopy = allAlgos.filter((algo) => {
              const userProgress = progressMap?.[algo._id] || {};
              const status = userProgress.status || "Not Started";
              return status === filterStatus;
            });
          }
          const info = algosToCopy
            .map((algo) => {
              const userProgress = progressMap?.[algo._id] || {};
              const status = userProgress.status || "Not Started";
              return `#${algo.leetcodeNumber ?? "-"}: ${algo.title
                } [${status}]`;
            })
            .join("\n");
          if (info) {
            await navigator.clipboard.writeText(info);
          }
        }}
      >
        Copy {filterMonth ? filterMonth + " " : filterStatus ? filterStatus + " " : ""}Algorithm Info
      </button>
      <div className={styles.sidebarSummary}>
        <div className={styles.sidebarSummaryRow}>
          <span className={styles.sidebarSummaryLabel}>Done/Total:</span>
          <span className={styles.sidebarSummaryValue}>
            {done}/{total}
          </span>
        </div>
        {statusList.map((status) => (
          <div key={status} className={styles.sidebarSummaryRow}>
            <button
              className={
                styles.sidebarSummaryFilterBtn +
                (filterStatus === status
                  ? " " + styles.sidebarSummaryFilterActive
                  : "")
              }
              onClick={() =>
                setFilterStatus(filterStatus === status ? null : status)
              }
              disabled={!!filterMonth}
            >
              {status}
            </button>
            <span className={styles.sidebarSummaryValue}>
              {statusCounts[status]}
              {total > 0 && statusCounts[status] > 0
                ? ` (${Math.round((statusCounts[status] / total) * 100)}%)`
                : ""}
            </span>
          </div>
        ))}
      </div>
      <div className={styles.sidebarList}>
        {Object.entries(filteredGroups).map(
          ([group, algos]) =>
            algos.length > 0 && (
              <div key={group} className={styles.sidebarGroup}>
                <div className={styles.sidebarGroupTitle}>
                  {group}
                  <span
                    style={{ color: "#888", fontWeight: 500, marginLeft: 8 }}
                  >
                    ({algos.length})
                  </span>
                </div>
                <ul className={styles.sidebarAlgoList}>
                  {algos.map((algo) => {
                    const userProgress = progressMap?.[algo._id] || {};
                    const status = userProgress.status || "Not Started";
                    const rank =
                      typeof userProgress.rank !== "undefined"
                        ? userProgress.rank
                        : "-";
                    const statusClass = getStatusClass(status);
                    const practicedToday = isPracticedToday(
                      userProgress.lastPracticed,
                    );
                    return (
                      <li
                        key={algo._id}
                        className={styles.sidebarAlgoItem}
                        style={{ listStyle: "none" }}
                      >
                        <button
                          className={
                            styles.sidebarAlgoBtn +
                            (statusClass ? " " + styles[statusClass] : "")
                          }
                          onClick={() => handleGoToAlgo(algo._id)}
                          title={algo.title}
                        >
                          {/* Star icon if isStarred */}
                          {userProgress.isStarred && (
                            <span
                              className={styles.starIcon}
                              title="Starred"
                              style={{
                                marginRight: 6,
                                verticalAlign: "middle",
                              }}
                            >
                              {/* SVG star, yellow fill */}
                              <svg
                                width="18"
                                height="18"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                                style={{ color: "#facc15", display: "inline" }}
                                aria-hidden="true"
                              >
                                <path d="M10 15.27L16.18 19l-1.64-7.03L20 7.24l-7.19-.61L10 0 7.19 6.63 0 7.24l5.46 4.73L3.82 19z" />
                              </svg>
                            </span>
                          )}
                          {algo.leetcodeNumber
                            ? `${algo.leetcodeNumber}. `
                            : ""}
                          {algo.title}
                          <div className={styles.sidebarAlgoStatusRow}>
                            {rank !== "-" && (
                              <span className={styles.sidebarAlgoRank}>
                                Rank: {rank}
                              </span>
                            )}
                            <span
                              className={
                                styles.sidebarAlgoStatus +
                                (statusClass ? " " + styles[statusClass] : "")
                              }
                            >
                              {status}
                              {/* Green checkmark if practiced today */}
                              {practicedToday && (
                                <span
                                  title="Practiced today"
                                  style={{
                                    marginLeft: 6,
                                    color: "#22c55e",
                                    verticalAlign: "middle",
                                    display: "inline-flex",
                                  }}
                                >
                                  {/* SVG checkmark */}
                                  <svg
                                    width="16"
                                    height="16"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                    aria-hidden="true"
                                    style={{ display: "inline" }}
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M16.707 6.293a1 1 0 00-1.414 0L9 12.586l-2.293-2.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l7-7a1 1 0 000-1.414z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                </span>
                              )}
                            </span>
                          </div>
                          <div style={{ fontSize: "0.9rem", color: "#888" }}>
                            Last practiced:{" "}
                            {userProgress?.lastPracticed
                              ? new Date(
                                userProgress.lastPracticed,
                              ).toLocaleString(undefined, {
                                year: "numeric",
                                month: "short",
                                day: "2-digit",
                                hour: "2-digit",
                                minute: "2-digit",
                              })
                              : "-"}
                          </div>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ),
        )}
      </div>
    </aside>
  );
};

export default AllAlgorithms;
