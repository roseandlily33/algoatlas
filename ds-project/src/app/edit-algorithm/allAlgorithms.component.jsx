
import React, { useState } from "react";
import styles from "./page.module.css";


const AllAlgorithms = ({ algorithms, selected, setSelected }) => {
  const [search, setSearch] = useState("");
  const [openGroups, setOpenGroups] = useState(() => {
    // All groups open by default
    return Object.keys(algorithms || {}).reduce((acc, group) => {
      acc[group] = true;
      return acc;
    }, {});
  });

  const handleToggleGroup = (group) => {
    setOpenGroups((prev) => ({ ...prev, [group]: !prev[group] }));
  };

  const filterAlgos = (algos) => {
    if (!search.trim()) return algos;
    return algos.filter(
      (algo) =>
        (algo.title && algo.title.toLowerCase().includes(search.toLowerCase())) ||
        (algo.leetcodeNumber && algo.leetcodeNumber.toString().includes(search))
    );
  };

  return (
<aside className={styles.sidebar}>
  <div className={styles.sidebarHeader}>
    <p className={styles.sidebarEyebrow}>Practice Library</p>
    <h3 className={styles.sidebarTitle}>All Algorithms</h3>
  </div>

  <div className={styles.searchWrap}>
    <span className={styles.searchIcon}>⌕</span>
    <input
      className={styles.sidebarSearch}
      type="text"
      placeholder="Search by name or #..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
    />
  </div>

  <div className={styles.sidebarList}>
    {Object.entries(algorithms).map(([group, algos]) => {
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

      const filteredAlgos = filterAlgos(sortedAlgos);
      if (filteredAlgos.length === 0) return null;

      return (
        <div key={group} className={styles.sidebarGroup}>
          <button
            className={styles.sidebarGroupTitleBtn}
            onClick={() => handleToggleGroup(group)}
            aria-expanded={openGroups[group]}
            aria-controls={`group-list-${group}`}
          >
            <span>{group}</span>

            <span className={styles.groupMeta}>
              <strong>{filteredAlgos.length}</strong>
              <span>{openGroups[group] ? "▾" : "▸"}</span>
            </span>
          </button>

          {openGroups[group] && (
            <ul
              className={styles.sidebarAlgoList}
              id={`group-list-${group}`}
            >
              {filteredAlgos.map((algo) => (
                <li
                  key={algo._id}
                  className={`${styles.sidebarAlgoItem} ${
                    selected === algo._id ? styles.selectedAlgo : ""
                  }`}
                >
                  <button
                    className={styles.sidebarAlgoBtn}
                    onClick={() => setSelected(algo._id)}
                    title={algo.title}
                  >
                    {algo.leetcodeNumber && (
                      <span className={styles.algoNumber}>
                        #{algo.leetcodeNumber}
                      </span>
                    )}

                    <span className={styles.algoName}>{algo.title}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      );
    })}
  </div>
</aside>
  );
};

export default AllAlgorithms;
