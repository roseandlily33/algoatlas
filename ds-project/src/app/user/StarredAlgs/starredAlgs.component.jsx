import React, { useState } from "react";
import styles from "../WeeklyAlgorithms/weeklyFocus.module.css";
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
  // Group by tier
  const tierGroups = {};
  for (const tier of TIERS) tierGroups[tier] = [];
  for (const algo of starred) {
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
    <section className={styles.section}>
      <h3>Starred Algorithms</h3>
      {TIERS?.map((tier) => (
        <div key={tier} style={{ marginBottom: "2rem" }}>
          <div
            style={{
              fontWeight: 700,
              fontSize: "1.2rem",
              color: "var(--purple-700)",
              marginBottom: "0.7rem",
            }}
          >
            {tier} Attention
          </div>
          <div className={styles.algoList}>
            {tierGroups[tier].length === 0 ? (
              <div style={{ color: "#aaa", fontSize: "1rem" }}>
                No algorithms in this tier.
              </div>
            ) : (
              tierGroups[tier].map((algo) => {
                const progress = progressMap[algo._id];
                return (
                  <div key={algo._id} style={{ position: "relative" }}>
                    <AlgorithmCard
                      algo={algo}
                      progress={progress}
                      onGoTo={() => handleGoToAlgo(algo._id)}
                    />
                    <div
                      style={{
                        position: "absolute",
                        top: 8,
                        right: 8,
                        zIndex: 2,
                      }}
                    >
                      <select
                        value={localTiers[algo._id] || "Low"}
                        onChange={(e) => handleTierChange(algo._id, e.target.value)}
                        style={{
                          fontSize: "0.95rem",
                          borderRadius: 6,
                          padding: "0.3rem 0.7rem",
                          background: "var(--purple-50)",
                          border: "1.5px solid var(--purple-200)",
                        }}
                      >
                        {TIERS.map((t) => (
                          <option key={t} value={t}>
                            {t} Attention
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      ))}
    </section>
  );
};

export default StarredAlgs;
