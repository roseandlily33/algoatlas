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
  // Format lastPracticed date
  let lastDone = "Never";
  if (progress?.lastPracticed) {
    const d = new Date(progress.lastPracticed);
    lastDone = d.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }
  return (
    <div
      className={`${styles.algoCard} ${
        practicedToday ? styles.practicedToday : ""
      }`}
    >
      {practicedToday && <span className={styles.todayBadge}>✓ Today</span>}

      <div className={styles.algoInfo}>
        <div className={styles.algoTitleBlock}>
          {algo.leetcodeNumber ? (
            <span className={styles.leetcodeNumber}>
              #{algo.leetcodeNumber}
            </span>
          ) : null}

          <h4 className={styles.algoTitle}>{algo.title}</h4>
        </div>

        <div className={styles.metaGrid}>
          <div className={styles.metaItem}>
            <span>Rank</span>
            <strong>
              {progress?.rank !== undefined ? progress.rank : "-"}
            </strong>
          </div>

          <div className={styles.metaItem}>
            <span>Type</span>
            <strong>{algo.type || "-"}</strong>
          </div>
        </div>

        <div className={styles.statusBlock}>
          <span className={styles.metaLabel}>Status</span>

          <span
            className={`${styles.statusPill} ${
              progress?.status === "Deep Practice"
                ? styles.statusDeep
                : progress?.status === "Reviewing"
                  ? styles.statusReview
                  : progress?.status === "Mastered"
                    ? styles.statusMastered
                    : ""
            }`}
          >
            {progress?.status || "-"}
          </span>
        </div>

        <div className={styles.dateGrid}>
          <div className={styles.lastDone}>
            <span>Last Done</span>
            <strong>{lastDone}</strong>
          </div>

          <div className={styles.lastPracticed}>
            <span>Last Practiced</span>
            <strong>
              {progress?.lastPracticed
                ? new Date(progress.lastPracticed).toLocaleString(undefined, {
                    year: "numeric",
                    month: "short",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "-"}
            </strong>
          </div>
        </div>
      </div>

      <button
        className={styles.arrowBtn}
        onClick={onGoTo}
        title="Go to practice"
      >
        <span className={styles.arrow}>→</span>
      </button>
    </div>
  );
}
export default AlgorithmCard;
