import styles from "./algorithmCard.module.css";

function isToday(date) {
  if (!date) return false;
  const d = new Date(date);
  const now = new Date();
  return (
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate()
  );
}

function AlgorithmCard({ algo, progress, onGoTo }) {
  const practicedToday = isToday(progress?.lastPracticed);
  return (
    <div
      className={styles.algoCard}
      style={
        practicedToday
          ? { border: "2.5px solid #7be495", boxShadow: "0 0 0 2px #eafff2" }
          : undefined
      }
    >
      <div className={styles.algoInfo}>
        <div className={styles.algoTitle}>
          {algo.leetcodeNumber ? `${algo.leetcodeNumber}. ` : ""}
          {algo.title}
        </div>
        <div className={styles.statusRow}>
          <span className={styles.rank}>
            Rank: {progress?.rank !== undefined ? progress.rank : "-"}
          </span>
        </div>
        <div className={styles.status}>
          <span
            className={
              styles.statusWord +
              " " +
              (progress?.status === "Deep Practice"
                ? styles.statusDeep
                : progress?.status === "Reviewing"
                ? styles.statusReview
                : progress?.status === "Mastered"
                ? styles.statusMastered
                : "")
            }
          >
            Status: {progress?.status || "-"}
          </span>
        </div>
        <div className={styles.status}>
          <span className={styles.status}>Type: {algo.type || "-"}</span>
        </div>
      </div>
      <button
        className={styles.arrowBtn}
        onClick={onGoTo}
        title="Go to practice"
      >
        <span className={styles.arrow}>&rarr;</span>
      </button>
    </div>
  );
}
export default AlgorithmCard;
