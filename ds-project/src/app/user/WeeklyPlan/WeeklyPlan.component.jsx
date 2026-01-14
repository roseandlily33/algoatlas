import React, { useState } from "react";
import styles from "./WeeklyPlan.module.css";

// Helper to get week date ranges
function getWeekRange(startDate, weekOffset) {
  const start = new Date(startDate);
  start.setDate(start.getDate() + weekOffset * 14);
  const end = new Date(start);
  end.setDate(start.getDate() + 13);
  return {
    start: start.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    }),
    end: end.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    }),
  };
}

// Helper to check if practiced today
function isPracticedToday(lastPracticed) {
  if (!lastPracticed) return false;
  const practiced = new Date(lastPracticed);
  const now = new Date();
  return (
    practiced.getFullYear() === now.getFullYear() &&
    practiced.getMonth() === now.getMonth() &&
    practiced.getDate() === now.getDate()
  );
}

// Helper to get current week index based on today's date and startDate
function getCurrentWeekIndex(startDate) {
  const now = new Date();
  const start = new Date(startDate);
  const diffDays = Math.floor((now - start) / (1000 * 60 * 60 * 24));
  // Each plan tab is 2 weeks (14 days)
  const weekIdx = Math.floor(diffDays / 14);
  // Clamp to valid range
  return Math.max(0, Math.min(weekIdx, PLAN.length - 1));
}

const PLAN = [
  {
    key: "week1-2",
    label: "Weeks 1–2",
    pattern: "DFS & BFS (Trees → Graphs)",
    summary: [
      "Instantly know DFS vs BFS",
      "Write visited logic without hesitation",
      "Explain traversal out loud",
      "Trees feel automatic; graphs feel structured (not scary)",
    ],
    mainAlgos: [104, 112, 199, 222, 530, 543, 200, 994, 207, 997, 1376, 1971],
    recommended: [733, 1020, 547],
  },
  {
    key: "week3-4",
    label: "Weeks 3–4",
    pattern: "Sliding Window (Fixed + Variable)",
    summary: [
      "Window expand/shrink feels mechanical",
      "You know what makes a window 'valid'",
      "Hash map window logic is repeatable",
    ],
    mainAlgos: [3, 76, 121, 238, 724],
    recommended: [209, 567],
  },
  {
    key: "week5-6",
    label: "Weeks 5–6",
    pattern: "Heap / Priority Queue",
    summary: [
      "Know when a heap is needed",
      "Min vs max heap is automatic",
      "Heap size logic makes sense",
    ],
    mainAlgos: [215, 347, 692, 295, 378],
    recommended: [703, 973],
  },
  {
    key: "week7-8",
    label: "Weeks 7–8",
    pattern: "Graph Dependencies (Topological Sort)",
    summary: [
      "Instantly recognize dependency problems",
      "Understand in-degree intuitively",
      "Course Schedule feels easy",
    ],
    mainAlgos: [207, 743, 997],
    recommended: [210, 802],
  },
  // Months 5 & 6
  {
    key: "week17-18",
    label: "Weeks 17–18",
    pattern: "Graphs (Advanced Traversal + Variants)",
    summary: [
      "DFS vs BFS choice is automatic",
      "Visited logic is correct the first time",
      "Directed vs undirected is obvious",
      "You handle multiple sources / layers cleanly",
    ],
    mainAlgos: [200, 994, 207, 743, 1376, 1971],
    recommended: [417, 1091, 785],
  },
  {
    key: "week19-20",
    label: "Weeks 19–20",
    pattern: "Heap + Streaming / Selection Problems",
    summary: [
      "Min vs max heap instinct",
      "Heap size management",
      "Heap + hashmap coordination",
      "Streaming input handling",
    ],
    mainAlgos: [215, 347, 692, 295, 378, 933],
    recommended: [703, 1046],
  },

  // Future Focus
  {
    key: "future-focus",
    label: "Future Focus",
    pattern: "Topics for future study",
    summary: [
      "Union Find",
      "Dijkstra (weighted graphs)",
      "More DP (2D)",
      "Bit manipulation (light)",
    ],
    mainAlgos: [],
    recommended: [],
  },
];

const SUBPATTERNS = [
  {
    key: "linkedlist",
    label: "Linked List Pointer Mastery",
    summary: [
      "Dummy nodes feel natural",
      "Fast/slow pointer logic is automatic",
      "Reversal problems don’t intimidate you",
    ],
    algos: [2, 19, 92, 160, 707, 7077],
  },
  {
    key: "interval",
    label: "Interval Problems",
    summary: ["Light focus (sprinkled in)"],
    algos: [56, 42],
    recommended: [986],
  },
  {
    key: "dp",
    label: "Intro DP",
    summary: ["Only maintenance"],
    algos: [746],
    recommended: [70],
  },
  {
    key: "week17-20-sliding",
    label: "Sliding Window (Polish & Speed)",
    pattern: "Sliding Window (Polish & Speed)",
    summary: [
      "Window validity conditions",
      "Shrinking logic clarity",
      "Edge-case handling",
      "Cleaner code",
    ],
    mainAlgos: [3, 76, 121, 1249],
    recommended: [424, 1004],
  },
  {
    key: "week19-20-linkedlist",
    label: "Linked Lists (Complex Pointer Work)",
    pattern: "Linked Lists (Complex Pointer Work)",
    summary: [
      "Dummy nodes feel natural",
      "Fast/slow pointer logic is automatic",
      "Reversal problems don’t intimidate you",
    ],
    mainAlgos: [2, 19, 92, 160, 707, 7077],
    recommended: [138],
  },
  {
    key: "week19-20-trees",
    label: "Trees (Advanced Reasoning)",
    pattern: "Trees (Advanced Reasoning)",
    summary: ["Trees should feel familiar by now — this is refinement."],
    mainAlgos: [222, 543, 530, 617],
    recommended: [236, 124],
  },
];

function WeeklyPlan({ algorithms = [], progress = [], handleGoToAlgo }) {
  const startDate = new Date("2025-12-28");
  const [mainTab, setMainTab] = useState(getCurrentWeekIndex(startDate));
  const [subTab, setSubTab] = useState(null);
  // Auto-update mainTab if the week changes (e.g., at midnight)
  React.useEffect(() => {
    const updateWeek = () => {
      const idx = getCurrentWeekIndex(startDate);
      setMainTab(idx);
    };
    // Check every hour
    const interval = setInterval(updateWeek, 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, [startDate]);

  // Map leetcodeNumber to algo object
  const algoMap = {};
  for (const algo of algorithms) {
    if (algo.leetcodeNumber) algoMap[algo.leetcodeNumber] = algo;
  }
  // Map algoId to progress
  const progressMap = {};
  for (const p of progress) {
    if (p.algorithm && p.algorithm._id) progressMap[p.algorithm._id] = p;
  }

  // Render algorithm list for a pattern
  function renderAlgoList(numbers, recommended = []) {
    const allNums = [...numbers, ...recommended];
    return (
      <ul className={styles.algoList}>
        {allNums.map((num) => {
          const algo = algoMap[num];
          // Only clickable if in main list or recommended for current week
          const isClickable =
            numbers.includes(num) || recommended.includes(num);
          let practicedToday = false;
          let isMastered = false;
          if (algo && progressMap[algo._id]) {
            practicedToday = isPracticedToday(
              progressMap[algo._id].lastPracticed
            );
            isMastered = progressMap[algo._id].status === "Mastered";
          }
          return (
            <li
              key={num}
              className={
                styles.algoItem + (isMastered ? " " + styles.masteredAlgo : "")
              }
            >
              {isClickable && algo ? (
                <button
                  className={styles.algoBtn}
                  onClick={() => handleGoToAlgo(algo._id)}
                  title={algo.title}
                >
                  #{num}: {algo.title}
                  {practicedToday && (
                    <span className={styles.checkmark} title="Practiced today">
                      {/* Green checkmark SVG */}
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 20 20"
                        fill="var(--success)"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 6.293a1 1 0 00-1.414 0L9 12.586l-2.293-2.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l7-7a1 1 0 000-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </span>
                  )}
                </button>
              ) : (
                <span className={styles.algoPending}>
                  #{num}: (to be added)
                </span>
              )}
            </li>
          );
        })}
      </ul>
    );
  }

  // Main tab content
  const main = PLAN[mainTab];
  // For week tabs, show date range; for future focus, omit dates
  const isFutureFocus = main.key === "future-focus";
  const weekRange = isFutureFocus ? null : getWeekRange(startDate, mainTab);

  return (
    <section className={styles.weeklyPlanSection}>
      <h2 className={styles.title}>Weekly Plan</h2>
      <div className={styles.tabsRow}>
        {PLAN.map((tab, idx) => (
          <button
            key={tab.key}
            className={
              styles.tabBtn + (mainTab === idx ? " " + styles.tabActive : "")
            }
            onClick={() => {
              setMainTab(idx);
              setSubTab(null);
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className={styles.subTabsRow}>
        {SUBPATTERNS.map((sub, idx) => (
          <button
            key={sub.key}
            className={
              styles.subTabBtn +
              (subTab === idx ? " " + styles.subTabActive : "")
            }
            onClick={() => setSubTab(idx)}
          >
            {sub.label}
          </button>
        ))}
      </div>
      <div className={styles.tabContent}>
        {subTab === null && (
          <div className={styles.patternContent}>
            <div className={styles.patternTitle}>{main.pattern}</div>
            {!isFutureFocus && (
              <div className={styles.patternDates}>
                <span className={styles.patternDateLabel}>Dates:</span>
                <span className={styles.patternDateValue}>
                  {weekRange.start} – {weekRange.end}
                </span>
              </div>
            )}
            <ul className={styles.patternSummary}>
              {main.summary.map((goal, i) => (
                <li key={i}>{goal}</li>
              ))}
            </ul>
            {isFutureFocus ? (
              <div className={styles.algosHeader}>Topics</div>
            ) : (
              <div className={styles.algosHeader}>Algorithms</div>
            )}
            {isFutureFocus ? (
              <ul className={styles.algoList}>
                {main.summary.map((topic, i) => (
                  <li key={i} className={styles.algoItem}>
                    <span className={styles.algoPending}>{topic}</span>
                  </li>
                ))}
              </ul>
            ) : (
              renderAlgoList(main.mainAlgos, main.recommended)
            )}
          </div>
        )}
        {subTab !== null && (
          <div className={styles.patternContent}>
            <div className={styles.patternTitle}>
              {SUBPATTERNS[subTab].label}
            </div>
            <ul className={styles.patternSummary}>
              {SUBPATTERNS[subTab].summary.map((goal, i) => (
                <li key={i}>{goal}</li>
              ))}
            </ul>
            <div className={styles.algosHeader}>Algorithms</div>
            {renderAlgoList(
              SUBPATTERNS[subTab].algos,
              SUBPATTERNS[subTab].recommended || []
            )}
          </div>
        )}
      </div>
    </section>
  );
}

export default WeeklyPlan;
