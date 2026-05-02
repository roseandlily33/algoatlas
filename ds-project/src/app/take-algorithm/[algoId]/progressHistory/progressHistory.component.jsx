import React, { useState } from "react";
import styles from "./progressHistory.module.css";
import ProgressReportChart from "./progressReportChart.component";

const ProgressHistory = ({ progressHistory }) => {
  const [openIdx, setOpenIdx] = useState(null);
  return (
<div className={styles.historyBlock}>
  <div className={styles.historyHeader}>
    <div>
      <p className={styles.historyEyebrow}>Attempt Log</p>
      <div className={styles.historyTitle}>Progress History</div>
    </div>

    <span className={styles.historyCount}>
      {progressHistory.length} attempts
    </span>
  </div>

  <div className={styles.chartWrap}>
    <ProgressReportChart progressHistory={progressHistory} />
  </div>

  <div className={styles.historyTableWrap}>
    <table className={styles.historyTable}>
      <thead>
        <tr>
          <th></th>
          <th>Date</th>
          <th>Rating</th>
          <th>Status</th>
          <th>Attempts</th>
        </tr>
      </thead>

      <tbody>
        {progressHistory.map((h, i) => {
          const dateObj = new Date(h.lastPracticed);
          const formatted = dateObj.toLocaleString(undefined, {
            year: "numeric",
            month: "short",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          });

          const isOpen = openIdx === i;

          return (
            <React.Fragment key={i}>
              <tr className={styles.historyRow}>
                <td className={styles.expandCell}>
                  <button
                    type="button"
                    aria-label={isOpen ? "Hide details" : "Show details"}
                    onClick={() => setOpenIdx(isOpen ? null : i)}
                    className={`${styles.expandBtn} ${
                      isOpen ? styles.expandBtnOpen : ""
                    }`}
                  >
                    {isOpen ? "▼" : "▶"}
                  </button>
                </td>

                <td>{formatted}</td>

                <td>
                  <span className={styles.ratingPill}>{h.rank}/10</span>
                </td>

                <td>
                  <span
                    className={`${styles.statusPill} ${
                      h.status === "Deep Practice"
                        ? styles.statusDeep
                        : h.status === "Reviewing"
                          ? styles.statusReview
                          : h.status === "Mastered"
                            ? styles.statusMastered
                            : ""
                    }`}
                  >
                    {h.status}
                  </span>
                </td>

                <td>
                  <span className={styles.attemptPill}>
                    {h.attemptsToday}
                  </span>
                </td>
              </tr>

              {isOpen && (
                <tr className={styles.detailsRow}>
                  <td colSpan={5}>
                    <div className={styles.historyDetails}>
                      {h.notes && (
                        <div className={styles.detailItem}>
                          <strong>Notes</strong>
                          <span>{h.notes}</span>
                        </div>
                      )}

                      {h.coreInvariant && (
                        <div className={styles.detailItem}>
                          <strong>Core Invariant</strong>
                          <span>{h.coreInvariant}</span>
                        </div>
                      )}

                      {h.baseCases && (
                        <div className={styles.detailItem}>
                          <strong>Base Cases</strong>
                          <span>{h.baseCases}</span>
                        </div>
                      )}

                      {h.commonMistake && (
                        <div className={styles.detailItem}>
                          <strong>Common Mistake</strong>
                          <span>{h.commonMistake}</span>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          );
        })}
      </tbody>
    </table>
  </div>
</div>
  );
};

export default ProgressHistory;
