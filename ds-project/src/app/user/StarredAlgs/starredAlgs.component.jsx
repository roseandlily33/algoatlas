import React, { useState } from "react";
// import styles from "../WeeklyAlgorithms/weeklyFocus.module.css";
import styles from './starredAlgs.module.css';
import AlgorithmCard from "../AlgorithmCard/algorithmCard.component";

const TIERS = ["High", "Medium", "Low"];

const StarredAlgs = ({ algorithms = [], progressMap = {}, handleGoToAlgo }) => {
  // Local state for starTier per algorithm
  const [localTiers, setLocalTiers] = useState(() => {
    const map = {};
    for (const algo of algorithms) {
      const progress = progressMap[algo._id];
      let tier = progress?.starTier;
      if (!tier || tier === "None") tier = "Low";
      map[algo._id] = tier;
    }
    return map;
  });

  // Filter algorithms that are starred
  const starred = algorithms.filter((algo) => progressMap[algo._id]?.isStarred);

  // Count how many starred have NOT been practiced in the current month, per tier
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  function notPracticedThisMonthCount(algos) {
    return algos.filter((algo) => {
      const last = progressMap[algo._id]?.lastPracticed;
      if (!last) return true;
      const d = new Date(last);
      return d.getFullYear() !== currentYear || d.getMonth() !== currentMonth;
    }).length;
  }
  // Group by tier
  const tierGroups = {};
  for (const tier of TIERS) tierGroups[tier] = [];
  for (const algo of starred) {
    const progress = progressMap[algo._id];
    // If status is Deep Practice, always put in High tier
    if (progress?.status === "Deep Practice") {
      tierGroups["High"].push(algo);
      continue;
    }
    const tier = localTiers[algo._id] || "Low";
    if (TIERS.includes(tier)) tierGroups[tier].push(algo);
  }

  async function handleTierChange(algoId, newTier) {
    // Update backend
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/progress/${algoId}/tier`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ starTier: newTier }),
    });
    // Update local state
    setLocalTiers((prev) => ({ ...prev, [algoId]: newTier }));
  }

  if (!starred.length) {
    return (
      <section className={styles.section}>
        <h3>Starred Algorithms</h3>
        <div style={{ color: "#888", fontSize: "1.1rem" }}>
          No starred algorithms yet.
        </div>
      </section>
    );
  }

  return (
    <section className={styles.starredSection}>
      <div className={styles.starredHeader}>
        <div>
          <p className={styles.starredEyebrow}>Priority Board</p>
          <h3 className={styles.starredTitle}>Starred Algorithms</h3>
        </div>

        <div className={styles.starredCountPill}>
          <span>Total Starred</span>
          <strong>
            {TIERS.reduce((sum, tier) => sum + tierGroups[tier].length, 0)}
          </strong>
        </div>
      </div>

      <div className={styles.starredTierList}>
        {TIERS?.map((tier) => (
          <section key={tier} className={styles.starredTier}>
            <div className={styles.starredTierHeader}>
              <h4>{tier} Attention</h4>
              <span>{tierGroups[tier].length}</span>
              <span style={{ marginLeft: 10, fontWeight: 500, fontSize: "0.98rem", color: "#a21caf", background: "#f3e8ff", borderRadius: 8, padding: "0.13rem 0.6rem", display: "inline-block" }}>
                Not practiced this month: <b>{notPracticedThisMonthCount(tierGroups[tier])}</b>
              </span>
            </div>

            <div className={styles.algoList}>
              {tierGroups[tier].length === 0 ? (
                <div className={styles.emptyTierState}>
                  No algorithms in this tier.
                </div>
              ) : (
                tierGroups[tier].map((algo) => {
                  const progress = progressMap[algo._id];

                  return (
                    <div key={algo._id} className={styles.starredCardSlot}>
                      <div className={styles.tierSelectWrap}>
                        <select
                          value={localTiers[algo._id] || "Low"}
                          onChange={(e) =>
                            handleTierChange(algo._id, e.target.value)
                          }
                          className={styles.tierSelect}
                        >
                          {TIERS.map((t) => (
                            <option key={t} value={t}>
                              {t} Attention
                            </option>
                          ))}
                        </select>
                      </div>

                      <AlgorithmCard
                        algo={algo}
                        progress={progress}
                        onGoTo={() => handleGoToAlgo(algo._id)}
                      />
                    </div>
                  );
                })
              )}
            </div>
          </section>
        ))}
      </div>
    </section>
  );
};

export default StarredAlgs;
