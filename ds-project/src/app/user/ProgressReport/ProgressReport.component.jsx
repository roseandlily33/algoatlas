import React from "react";
import styles from "./ProgressReport.module.css";

// progress: [{ date: "2025-12-25", algorithms: [{ type: "Array", ... }, ...] }]
function groupByType(algorithms) {
  const typeCount = {};
  for (const algo of algorithms) {
    if (!algo.type) continue;
    typeCount[algo.type] = (typeCount[algo.type] || 0) + 1;
  }
  return typeCount;
}

function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    weekday: "short",
  });
}

const ProgressReport = ({ progress }) => {
  console.log("Progress", progress);
  if (!progress || progress.length === 0) {
    return (
      <section className={styles.progressSection}>
        <h2 className={styles.title}>Progress Report</h2>
        <div className={styles.noProgress}>No practice data yet.</div>
      </section>
    );
  }

  // Group progress by day
  const progressByDay = {};
  for (const entry of progress) {
    // entry.date should be a string like "2025-12-25"
    const date = entry.date?.slice(0, 10);
    if (!date) continue;
    if (!progressByDay[date]) progressByDay[date] = [];
    progressByDay[date].push(entry.algorithm);
  }

  // Sort days descending (most recent first)
  const sortedDays = Object.keys(progressByDay).sort((a, b) =>
    b.localeCompare(a)
  );

  return (
    <section className={styles.progressSection}>
      <h2 className={styles.title}>Progress Report</h2>
      <div className={styles.cardsContainer}>
        {sortedDays.map((date) => {
          const algos = progressByDay[date];
          const typeBreakdown = groupByType(algos);
          return (
            <div className={styles.card} key={date}>
              <div className={styles.cardHeader}>
                <span className={styles.date}>{formatDate(date)}</span>
                <span className={styles.total}>
                  {algos.length}{" "}
                  {algos.length === 1 ? "algorithm" : "algorithms"}
                </span>
              </div>
              <div className={styles.breakdown}>
                {Object.entries(typeBreakdown).map(([type, count]) => (
                  <div className={styles.typeRow} key={type}>
                    <span className={styles.type}>{type}</span>
                    <span className={styles.count}>{count}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default ProgressReport;
