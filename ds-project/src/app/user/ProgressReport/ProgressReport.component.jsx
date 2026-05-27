import React from "react";
import styles from "./ProgressReport.module.css";

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
      <div className={styles.progressHeader}>
        <div>
          <p className={styles.progressEyebrow}>Activity Log</p>
          <h2 className={styles.title}>Progress Report</h2>
        </div>

        <div className={styles.progressCountPill}>
          <span>Total Days</span>
          <strong>{sortedDays?.length || 0}</strong>
        </div>
      </div>

      <div className={styles.cardsContainer}>
        {sortedDays?.map((day) => {
          const algos = day.algorithms || [];

          return (
            <div className={styles.card} key={day.date}>
              <div className={styles.cardHeader}>
                <div>
                  <span className={styles.date}>{formatDate(day.date)}</span>
                  <span className={styles.total}>
                    {algos.length}{" "}
                    {algos.length === 1 ? "algorithm" : "algorithms"}
                  </span>
                </div>
              </div>

              <div className={styles.breakdown}>
                {algos?.map((algo, idx) => {
                  const name = algo?.name || algo?.title || algo?.algorithm?.title || "Unnamed Algorithm";
                  const id = algo?._id || algo?.id || algo?.algorithm?._id || algo;
                  const mastered = algo?.mastered || algo?.status === "Mastered";
                  const leetcodeNumber = algo?.leetcodeNumber || algo?.algorithm?.leetcodeNumber;
                  // Add a green border if mastered
                  const typeRowClass = `${styles.typeRow} ${mastered ? styles.mastered : ""}`;

                  return (
                    <div className={typeRowClass} key={id || idx}>
                      <span className={styles.algoNumber}></span>
                      <a className={styles.type} href={`/take-algorithm/${id}`}>
                        #{leetcodeNumber} {name}
                        {mastered && (
                          <span title="Mastered" style={{ marginLeft: 6, color: '#22c55e', fontSize: '1.1em', verticalAlign: 'middle' }}>
                            ✓
                          </span>
                        )}
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
