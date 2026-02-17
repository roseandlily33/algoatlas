import React from "react";
import styles from "./page.module.css";

const AllAlgorithms = ({ algorithms, selected, setSelected }) => {
  return (
    <aside className={styles.sidebar}>
      <h3 className={styles.sidebarTitle}>All Algorithms</h3>
      <div className={styles.sidebarList}>
        {Object.entries(algorithms).map(([group, algos]) => {
          // Sort by leetcodeNumber ascending (or title if missing)
          const sortedAlgos = [...algos].sort((a, b) => {
            if (a.leetcodeNumber && b.leetcodeNumber) {
              return a.leetcodeNumber - b.leetcodeNumber;
            } else if (a.leetcodeNumber) {
              return -1;
            } else if (b.leetcodeNumber) {
              return 1;
            } else {
              return (a.title || "").localeCompare(b.title || "");
            }
          });
          return (
            <div key={group} className={styles.sidebarGroup}>
              <div className={styles.sidebarGroupTitle} style={{
                fontWeight: 800,
                fontSize: "1.25rem",
                color: "var(--purple-700)",
                marginBottom: "0.5rem",
                letterSpacing: "0.01em",
                textTransform: "capitalize",
                fontFamily: "var(--font-main)",
              }}>{group}</div>
              <ul className={styles.sidebarAlgoList}>
                {sortedAlgos.map((algo) => (
                  <li
                    key={algo._id}
                    className={
                      styles.sidebarAlgoItem +
                      (selected === algo._id ? " " + styles.selectedAlgo : "")
                    }
                    style={{ listStyle: "none" }}
                  >
                    <button
                      className={styles.sidebarAlgoBtn}
                      onClick={() => setSelected(algo._id)}
                      title={algo.title}
                    >
                      {algo.leetcodeNumber ? `${algo.leetcodeNumber}. ` : ""}
                      {algo.title}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </aside>
  );
};

export default AllAlgorithms;
