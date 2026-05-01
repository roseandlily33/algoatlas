
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
      <h3 className={styles.sidebarTitle} style={{ marginBottom: '1.2rem' }}>All Algorithms</h3>
      <input
        className={styles.sidebarSearch}
        type="text"
        placeholder="Search by name or #..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        style={{
          width: '100%',
          padding: '0.7rem 1rem',
          borderRadius: '0.7rem',
          border: '1.5px solid var(--indigo-200)',
          marginBottom: '1.2rem',
          fontSize: '1rem',
          background: 'var(--white)',
        }}
      />
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
          const filteredAlgos = filterAlgos(sortedAlgos);
          if (filteredAlgos.length === 0) return null;
          return (
            <div key={group} className={styles.sidebarGroup} style={{ marginBottom: '1.5rem' }}>
              <button
                className={styles.sidebarGroupTitleBtn}
                onClick={() => handleToggleGroup(group)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  background: 'none',
                  border: 'none',
                  width: '100%',
                  fontWeight: 800,
                  fontSize: '1.15rem',
                  color: 'var(--purple-700)',
                  marginBottom: '0.3rem',
                  letterSpacing: '0.01em',
                  textTransform: 'capitalize',
                  fontFamily: 'var(--font-main)',
                  cursor: 'pointer',
                  padding: 0,
                  justifyContent: 'space-between',
                }}
                aria-expanded={openGroups[group]}
                aria-controls={`group-list-${group}`}
              >
                <span>{group}</span>
                <span style={{ fontSize: '1.2rem', color: 'var(--purple-400)' }}>
                  {openGroups[group] ? '▾' : '▸'}
                </span>
              </button>
              {openGroups[group] && (
                <ul
                  className={styles.sidebarAlgoList}
                  id={`group-list-${group}`}
                  style={{ marginTop: '0.2rem' }}
                >
                  {filteredAlgos.map((algo) => (
                    <li
                      key={algo._id}
                      className={
                        styles.sidebarAlgoItem +
                        (selected === algo._id ? " " + styles.selectedAlgo : "")
                      }
                      style={{ listStyle: "none", marginBottom: '0.5rem' }}
                    >
                      <button
                        className={styles.sidebarAlgoBtn}
                        onClick={() => setSelected(algo._id)}
                        title={algo.title}
                        style={{
                          background: selected === algo._id ? 'var(--purple-400)' : 'var(--white)',
                          color: selected === algo._id ? 'var(--white)' : 'var(--indigo-700)',
                          border: selected === algo._id ? '2px solid var(--purple-400)' : '1px solid var(--indigo-200)',
                          fontWeight: selected === algo._id ? 700 : 600,
                          boxShadow: selected === algo._id ? '0 2px 8px 0 rgba(160, 85, 247, 0.13)' : '0 1px 4px 0 rgba(160, 85, 247, 0.07)',
                          transition: 'all 0.18s',
                        }}
                      >
                        {algo.leetcodeNumber ? `${algo.leetcodeNumber}. ` : ""}
                        {algo.title}
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
