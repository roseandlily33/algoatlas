import React from "react";
import styles from "./page.module.css";

const AllAlgorithms = ({ algorithms, selected, setSelected }) => {
  return (
    <aside className={styles.sidebar}>
      <h3 className={styles.sidebarTitle}>All Algorithms</h3>
      <div className={styles.sidebarList}>
        {Object.entries(algorithms).map(([group, algos]) => (
          <div key={group} className={styles.sidebarGroup}>
            <div className={styles.sidebarGroupTitle}>{group}</div>
            <ul className={styles.sidebarAlgoList}>
              {algos.map((algo) => (
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
        ))}
      </div>
    </aside>
  );
};

export default AllAlgorithms;
