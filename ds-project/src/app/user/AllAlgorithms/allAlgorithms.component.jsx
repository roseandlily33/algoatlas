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
  <div className={styles.sidebarHeader}>
    <div>
      <p className={styles.sidebarEyebrow}>Dashboard</p>
      <h3 className={styles.sidebarTitle}>All Algorithms</h3>
    </div>

    <div className={styles.todayPill}>
      <span>Today</span>
      <strong>{todayString}</strong>
    </div>
  </div>

  <div className={styles.sidebarStatsGrid}>
    <div className={styles.statCard}>
      <span>Practiced Today</span>
      <strong>{practicedTodayCount}</strong>
    </div>

    <div className={styles.statCard}>
      <span>Done / Total</span>
      <strong>
        {done}/{total}
      </strong>
    </div>
  </div>

  <section className={styles.sidebarPanel}>
    <div className={styles.panelHeader}>
      <h4>Status</h4>
      {filterStatus && !filterMonth && (
        <button
          className={styles.clearBtn}
          onClick={() => setFilterStatus(null)}
        >
          Clear
        </button>
      )}
    </div>

    <div className={styles.statusFilterList}>
      {statusList.map((status) => (
        <button
          key={status}
          className={`${styles.statusFilterBtn} ${
            filterStatus === status ? styles.statusFilterActive : ""
          }`}
          onClick={() =>
            setFilterStatus(filterStatus === status ? null : status)
          }
          disabled={!!filterMonth}
        >
          <span>{status}</span>
          <strong>
            {statusCounts[status]}
            {total > 0 && statusCounts[status] > 0
              ? ` · ${Math.round((statusCounts[status] / total) * 100)}%`
              : ""}
          </strong>
        </button>
      ))}
    </div>
  </section>

  <section className={styles.sidebarPanel}>
    <div className={styles.panelHeader}>
      <h4>Filter by Month</h4>
      {filterMonth && (
        <button
          className={styles.clearBtn}
          onClick={() => setFilterMonth(null)}
        >
          Clear
        </button>
      )}
    </div>

    <div className={styles.monthFilterGrid}>
      {monthKeys.map((month) => (
        <button
          key={month}
          className={`${styles.monthFilterBtn} ${
            filterMonth === month ? styles.monthFilterActive : ""
          }`}
          onClick={() =>
            setFilterMonth(filterMonth === month ? null : month)
          }
        >
          <span>{month}</span>
          <strong>{monthMap[month].length}</strong>
        </button>
      ))}
    </div>
  </section>

  <button
    className={styles.copyBtn}
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
          return `#${algo.leetcodeNumber ?? "-"}: ${algo.title} [${status}]`;
        })
        .join("\n");

      if (info) {
        await navigator.clipboard.writeText(info);
      }
    }}
  >
    Copy{" "}
    {filterMonth ? `${filterMonth} ` : filterStatus ? `${filterStatus} ` : ""}
    Algorithm Info
  </button>

  <div className={styles.sidebarList}>
    {Object.entries(filteredGroups).map(
      ([group, algos]) =>
        algos.length > 0 && (
          <section key={group} className={styles.sidebarGroup}>
            <div className={styles.sidebarGroupTitle}>
              <span>{group}</span>
              <strong>{algos.length}</strong>
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
                  userProgress.lastPracticed
                );

                return (
                  <li key={algo._id} className={styles.sidebarAlgoItem}>
                    <button
                      className={`${styles.sidebarAlgoBtn} ${
                        statusClass ? styles[statusClass] : ""
                      }`}
                      onClick={() => handleGoToAlgo(algo._id)}
                      title={algo.title}
                    >
                      <div className={styles.algoTopRow}>
                        <span className={styles.algoTitle}>
                          {userProgress.isStarred && (
                            <span className={styles.starIcon} title="Starred">
                              ★
                            </span>
                          )}
                          {algo.leetcodeNumber
                            ? `${algo.leetcodeNumber}. `
                            : ""}
                          {algo.title}
                        </span>
                      </div>

                      <div className={styles.sidebarAlgoStatusRow}>
                        {rank !== "-" && (
                          <span className={styles.sidebarAlgoRank}>
                            Rank {rank}
                          </span>
                        )}

                        <span
                          className={`${styles.sidebarAlgoStatus} ${
                            statusClass ? styles[statusClass] : ""
                          }`}
                        >
                          {status}
                        </span>

                        {practicedToday && (
                          <span
                            className={styles.practicedBadge}
                            title="Practiced today"
                          >
                            ✓ Today
                          </span>
                        )}
                      </div>

                      <div className={styles.lastPracticed}>
                        Last practiced:{" "}
                        {userProgress?.lastPracticed
                          ? new Date(userProgress.lastPracticed).toLocaleString(
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
                    </button>
                  </li>
                );
              })}
            </ul>
          </section>
        )
    )}
  </div>
</aside>
  );
};

export default AllAlgorithms;
