import styles from "./attemptInfo.module.css";
import React from "react";

const statusOptions = ["Mastered", "Reviewing", "Deep Practice"];
const AttemptInfo = ({
  rank,
  setRank,
  status,
  setStatus,
  attemptsToday,
  setAttemptsToday,
  notes,
  setNotes,
  // coreInvariant,
  // setCoreInvariant,
  // baseCases,
  // setBaseCases,
  // commonMistake,
  // setCommonMistake,
  submitting,
}) => {
  return (
<div className={styles.attemptInfoContainer}>
  <div className={styles.attemptHeader}>
    <div>
      <p className={styles.attemptEyebrow}>Progress Check-In</p>
      <h3 className={styles.attemptTitle}>Attempt Info</h3>
    </div>

    <span className={styles.attemptStatusBadge}>{status}</span>
  </div>

  <div className={styles.attemptField}>
    <label className={styles.label}>Rate your attempt</label>

    <div className={styles.stars}>
      {[...Array(10)].map((_, i) => (
        <span
          key={i}
          className={i < rank ? styles.starFilled : styles.star}
          onClick={() => setRank(i + 1)}
          tabIndex={0}
          role="button"
          aria-label={`Set rating to ${i + 1}`}
        >
          {i < rank ? "★" : "☆"}
        </span>
      ))}

      <span className={styles.rankValue}>{rank} / 10</span>
    </div>
  </div>

  <div className={styles.attemptGrid}>
    <div className={styles.attemptField}>
      <label className={styles.label}>Status</label>

      <div className={styles.statusControl}>
        <span className={styles.statusIcon}>
          {status === "Mastered" && "🏆"}
          {status === "Reviewing" && "🔄"}
          {status === "Deep Practice" && "🧠"}
        </span>

        <select
          className={styles.statusSelect}
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          {statusOptions.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>
    </div>

    <div className={styles.attemptField}>
      <label className={styles.label}>Attempts Today</label>

      <input
        type="number"
        min={0}
        value={attemptsToday}
        onChange={(e) => setAttemptsToday(Number(e.target.value))}
        className={styles.attemptsInput}
      />
    </div>
  </div>

  <div className={styles.attemptField}>
    <label className={styles.label}>Notes</label>

    <textarea
      value={notes}
      onChange={(e) => setNotes(e.target.value)}
      rows={3}
      placeholder="Add any notes about your attempt..."
      className={styles.notesTextarea}
    />
  </div>

  <div className={styles.attemptFooter}>
    <button type="submit" className={styles.submitBtn} disabled={submitting}>
      {submitting ? "Saving..." : "Update Progress"}
    </button>
  </div>
</div>
  );
};

export default AttemptInfo;
