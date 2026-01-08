import React from "react";
// import styles from "./randomFive.module.css";
import styles from "../WeeklyAlgorithms/weeklyFocus.module.css";
import AlgorithmCard from "../AlgorithmCard/algorithmCard.component";
import PrimaryButton from "../../../components/buttons/primaryButton.component";

const RandomFive = ({
  randomFive,
  handleRandomFive,
  progressMap,
  handleGoToAlgo,
}) => {
  return (
    <section className={styles.section}>
      <div className={styles.sectionHeader}>
        <h3 style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          Random 5{" "}
          <PrimaryButton onClick={handleRandomFive}>Shuffle</PrimaryButton>
        </h3>
      </div>
      <div className={styles.algoList}>
        {randomFive.map((algo) => {
          const progress = progressMap[algo._id];
          // Check if lastPracticed is today
          let practicedToday = false;
          if (progress?.lastPracticed) {
            const last = new Date(progress.lastPracticed);
            const now = new Date();
            practicedToday =
              last.getFullYear() === now.getFullYear() &&
              last.getMonth() === now.getMonth() &&
              last.getDate() === now.getDate();
          }
          return (
            <div
              key={algo._id}
              style={{
                position: "relative",
                // border: practicedToday ? "2.5px solid #1db954" : undefined,
                borderRadius: practicedToday ? 12 : undefined,
                boxSizing: "border-box",
              }}
            >
              <AlgorithmCard
                algo={algo}
                progress={progress}
                onGoTo={() => handleGoToAlgo(algo._id)}
              />
              <div
                style={{ fontSize: "0.9rem", color: "#888", marginTop: 2 }}
              >
                Last practiced:{" "}
                {progress?.lastPracticed
                  ? new Date(progress.lastPracticed).toLocaleString(undefined, {
                    year: "numeric",
                    month: "short",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                  : "-"}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default RandomFive;
