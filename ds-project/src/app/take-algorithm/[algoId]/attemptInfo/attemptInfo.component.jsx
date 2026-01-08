// import StarRating from "../starRating.component";
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
  coreInvariant,
  setCoreInvariant,
  baseCases,
  setBaseCases,
  commonMistake,
  setCommonMistake,
  submitting,
}) => {
  // ...existing code...
  return (
    <div className={styles.attemptInfoContainer}>
      {/* ...existing fields... */}
      <div className={styles.flexRow}>
        <div className={styles.label}>Rate your attempt:</div>
        <div className={styles.value}>
          <div className={styles.stars}>
            {[...Array(10)].map((_, i) => (
              <span
                key={i}
                className={i < rank ? styles.starFilled : styles.star}
                onClick={() => setRank(i + 1)}
                tabIndex={0}
                role="button"
                aria-label={`Set rating to ${i + 1}`}
                style={{ fontSize: "1.7rem" }}
              >
                {i < rank ? "⭐" : "☆"}
              </span>
            ))}
            <span className={styles.rankValue}>{rank} / 10</span>
          </div>
        </div>
      </div>
      <div className={styles.flexRow}>
        <div className={styles.label}>Status:</div>
        <div className={styles.value}>
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
      <div className={styles.flexRow}>
        <div className={styles.label}>Attempts Today:</div>
        <div className={styles.value}>
          <input
            type="number"
            min={0}
            value={attemptsToday}
            onChange={(e) => setAttemptsToday(Number(e.target.value))}
            className={styles.attemptsInput}
          />
        </div>
      </div>
      {/* New fields start here */}
      {/* <div className={styles.flexRow}>
        <div className={styles.label}>Pattern:</div>
        <div className={styles.value}>
          <input
            type="text"
            value={pattern}
            onChange={(e) => setPattern(e.target.value)}
            className={styles.notesTextarea}
            placeholder="e.g. Sliding Window, Two Pointers..."
          />
        </div>
      </div>
      <div className={styles.flexRow}>
        <div className={styles.label}>Data structure:</div>
        <div className={styles.value}>
          <input
            type="text"
            value={dataStructure}
            onChange={(e) => setDataStructure(e.target.value)}
            className={styles.notesTextarea}
            placeholder="e.g. Array, HashMap, Tree..."
          />
        </div>
      </div>
      <div className={styles.flexRow}>
        <div className={styles.label}>Traversal / Technique:</div>
        <div className={styles.value}>
          <input
            type="text"
            value={traversalOrTechnique}
            onChange={(e) => setTraversalOrTechnique(e.target.value)}
            className={styles.notesTextarea}
            placeholder="e.g. BFS, DFS, Recursion..."
          />
        </div>
      </div> */}
      <div className={styles.flexRow}>
        <div className={styles.label}>Core invariant:</div>
        <div className={styles.value}>
          <input
            type="text"
            value={coreInvariant}
            onChange={(e) => setCoreInvariant(e.target.value)}
            className={styles.notesTextarea}
            placeholder="What must always be true?"
          />
        </div>
      </div>
      <div className={styles.flexRow}>
        <div className={styles.label}>Base cases:</div>
        <div className={styles.value}>
          <input
            type="text"
            value={baseCases}
            onChange={(e) => setBaseCases(e.target.value)}
            className={styles.notesTextarea}
            placeholder="e.g. Empty input, single node..."
          />
        </div>
      </div>
      <div className={styles.flexRow}>
        <div className={styles.label}>Common mistake:</div>
        <div className={styles.value}>
          <input
            type="text"
            value={commonMistake}
            onChange={(e) => setCommonMistake(e.target.value)}
            className={styles.notesTextarea}
            placeholder="What do you often get wrong?"
          />
        </div>
      </div>
      {/* ...existing notes field... */}
      <div className={styles.flexRow}>
        <div className={styles.label}>Notes:</div>
        <div className={styles.value}>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            placeholder="Add any notes about your attempt..."
            className={styles.notesTextarea}
          />
        </div>
      </div>
      <div className={styles.flexRow}>
        <div className={styles.label}></div>
        <div className={styles.value} style={{ justifyContent: 'flex-end' }}>
          <button type="submit" className={styles.submitBtn} disabled={submitting}>
            {submitting ? "Saving..." : "Update Progress"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AttemptInfo;
