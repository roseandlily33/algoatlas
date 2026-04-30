import React from "react";
import styles from "./progressReportChart.module.css";

// Utility to compute stats from progressHistory
function computeProgressStats(progressHistory) {
    if (!progressHistory || progressHistory.length === 0) return null;
    // Sort by date ascending
    const sorted = [...progressHistory].sort(
        (a, b) => new Date(a.lastPracticed) - new Date(b.lastPracticed)
    );
    const first = sorted[0];
    const last = sorted[sorted.length - 1];
    const totalAttempts = sorted.length;
    const avgRank =
        sorted.reduce((sum, h) => sum + (h.rank || 0), 0) / totalAttempts;
    const days = Array.from(
        new Set(sorted.map((h) => new Date(h.lastPracticed).toDateString()))
    );
    const daysPracticed = days.length;
    // Find first mastery
    const masteryIdx = sorted.findIndex((h) => h.status === "Mastered");
    const attemptsToMastery = masteryIdx !== -1 ? masteryIdx + 1 : null;
    // Time span in days
    const msPerDay = 24 * 60 * 60 * 1000;
    const spanDays =
        Math.round(
            (new Date(last.lastPracticed) - new Date(first.lastPracticed)) / msPerDay
        ) + 1;
    // Streaks
    let maxStreak = 0,
        curStreak = 1;
    for (let i = 1; i < days.length; ++i) {
        const prev = new Date(days[i - 1]);
        const curr = new Date(days[i]);
        if ((curr - prev) / msPerDay === 1) {
            curStreak++;
            maxStreak = Math.max(maxStreak, curStreak);
        } else {
            curStreak = 1;
        }
    }
    maxStreak = Math.max(maxStreak, curStreak);
    return {
        totalAttempts,
        avgRank: avgRank.toFixed(2),
        daysPracticed,
        attemptsToMastery,
        spanDays,
        firstDate: new Date(first.lastPracticed),
        lastDate: new Date(last.lastPracticed),
        maxStreak,
    };
}

const ProgressReportChart = ({ progressHistory }) => {
    const stats = computeProgressStats(progressHistory);
    if (!stats) return null;
    return (
        <div className={styles.reportChartBlock}>
            <div className={styles.reportGrid}>
                <div>
                    <b>Total Attempts:</b> {stats.totalAttempts}
                </div>
                <div>
                    <b>Avg. Rating:</b> {stats.avgRank} / 10
                </div>
                <div>
                    <b>Days Practiced:</b> {stats.daysPracticed}
                </div>
                <div>
                    <b>Attempts Until Mastery:</b>{" "}
                    {stats.attemptsToMastery !== null ? stats.attemptsToMastery : "—"}
                </div>
                <div>
                    <b>Practice Span:</b> {stats.spanDays} days
                </div>
                <div>
                    <b>First Attempt:</b> {stats.firstDate.toLocaleDateString()}
                </div>
                <div>
                    <b>Last Attempt:</b> {stats.lastDate.toLocaleDateString()}
                </div>
                <div>
                    <b>Max Streak:</b> {stats.maxStreak} days
                </div>
            </div>
        </div>
    );
};

export default ProgressReportChart;
