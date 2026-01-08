import React from "react";
import styles from "./PracticeTheory.module.css";

export default function AlgorithmPracticeSteps() {
    return (
        <div className={styles.practiceTheoryContainer}>
            <h2 className={styles.practiceTheoryTitle}>Algorithm Practice Loop</h2>

            <div className={styles.practiceTheoryStepsRow}>
                <div className={styles.practiceTheoryStepCard}>
                    <span className={styles.practiceTheoryStepTitle}>Pass 1 — Recognition & Story</span>
                    <ul className={styles.practiceTheorySubList}>
                        <li>What pattern is this?</li>
                        <li>What is the story in plain English?</li>
                        <li>What state am I tracking?</li>
                    </ul>
                </div>
                <div className={styles.practiceTheoryStepCard}>
                    <span className={styles.practiceTheoryStepTitle}>Pass 2 — Skeleton From Memory</span>
                    <ul className={styles.practiceTheorySubList}>
                        <li>Write structure only (no syntax stress).</li>
                        <li>Loops, DFS/BFS shape, helpers.</li>
                    </ul>
                </div>
                <div className={styles.practiceTheoryStepCard}>
                    <span className={styles.practiceTheoryStepTitle}>Pass 3 — Full Code + Walkthrough</span>
                    <ul className={styles.practiceTheorySubList}>
                        <li>Write full solution.</li>
                        <li>Walk through one example by hand.</li>
                        <li>Track pointers, visited, queue/stack.</li>
                    </ul>
                </div>
                <div className={styles.practiceTheoryStepCard}>
                    <span className={styles.practiceTheoryStepTitle}>Pass 4 — Small Variations</span>
                    <ul className={styles.practiceTheorySubList}>
                        <li>DFS ↔ BFS</li>
                        <li>Change data structure (Set → array).</li>
                        <li>Mentally flip edge direction or condition.</li>
                    </ul>
                </div>
            </div>

            <hr className={styles.practiceTheoryDivider} />

            <p className={styles.practiceTheoryRulesTitle}><strong>Rules of Thumb</strong></p>
            <ul className={styles.practiceTheoryRulesList}>
                <li>New/Hard → 3–5 passes over 2 weeks</li>
                <li>Medium → 2–3 passes</li>
                <li>Mastered → 1 fast pass monthly</li>
            </ul>

            <p className={styles.practiceTheoryReminder}><strong>Reminder:</strong> Forgetting details is normal. Rebuilding the solution <em>is</em> the practice.</p>
        </div>
    );
}
