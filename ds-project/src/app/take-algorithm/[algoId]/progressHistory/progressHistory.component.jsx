import React, { useState } from "react";
import styles from "./progressHistory.module.css";

const ProgressHistory = ({ progressHistory }) => {
  const [openIdx, setOpenIdx] = useState(null);
  return (
    <div className={styles.historyBlock}>
      <div className={styles.historyTitle}>
        Progress History ({progressHistory.length} attempts):
      </div>
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
                <tr>
                  <td style={{ textAlign: "center" }}>
                    <button
                      type="button"
                      aria-label={isOpen ? "Hide details" : "Show details"}
                      onClick={() => setOpenIdx(isOpen ? null : i)}
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        fontSize: "1.2rem",
                        color: isOpen ? "var(--purple-600)" : "var(--gray-500)",
                        outline: "none",
                        padding: 0,
                      }}
                    >
                      {isOpen ? "▼" : "▶"}
                    </button>
                  </td>
                  <td>{formatted}</td>
                  <td>{h.rank}</td>
                  <td>{h.status}</td>
                  <td>{h.attemptsToday}</td>
                </tr>
                {isOpen && (
                  <tr>
                    <td
                      colSpan={5}
                      style={{
                        background: "var(--purple-50)",
                        padding: "0.7rem 1.2rem",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "0.4rem",
                          fontSize: "1.01rem",
                          color: "var(--gray-800)",
                        }}
                      >
                        {h.notes && (
                          <div>
                            <b>Notes:</b> {h.notes}
                          </div>
                        )}
                        {h.coreInvariant && (
                          <div>
                            <b>Core Invariant:</b> {h.coreInvariant}
                          </div>
                        )}
                        {h.baseCases && (
                          <div>
                            <b>Base Cases:</b> {h.baseCases}
                          </div>
                        )}
                        {h.commonMistake && (
                          <div>
                            <b>Common Mistake:</b> {h.commonMistake}
                          </div>
                        )}
                        {/* Add more fields as needed */}
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
  );
};

export default ProgressHistory;
