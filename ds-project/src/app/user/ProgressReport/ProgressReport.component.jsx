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

  // progress is now [{ date, algorithms: [...] }], already grouped and sorted by backend
  const sortedDays = Array.isArray(progress) ? progress : [];

  return (
    <section className={styles.progressSection}>
      <h2 className={styles.title}>Progress Report</h2>
      <div className={styles.cardsContainer}>
        {sortedDays?.map((day) => {
          const algos = day.algorithms || [];
          return (
            <div className={styles.card} key={day.date}>
              <div className={styles.cardHeader}>
                <span className={styles.date}>{formatDate(day.date)}</span>
                <span className={styles.total}>
                  {algos.length} {algos.length === 1 ? "algorithm" : "algorithms"}
                </span>
              </div>
              <div className={styles.breakdown}>
                {algos?.map((algo, idx) => {
                  const name = algo?.name || algo?.title || "Unnamed Algorithm";
                  const id = algo?._id || algo?.id || algo;
                  return (
                    <div className={styles.typeRow} key={id || idx}>
                      <a
                        className={styles.type}
                        href={`/take-algorithm/${id}`}
                        style={{ textDecoration: "underline", color: "#0070f3", cursor: "pointer" }}
                      >
                        {name}
                      </a>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default ProgressReport;
