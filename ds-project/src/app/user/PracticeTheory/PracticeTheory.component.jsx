import React from "react";
import styles from "./PracticeTheory.module.css";

export default function AlgorithmPracticeSteps() {
  return (
<div className={styles.practiceTheoryContainer}>
  <div className={styles.practiceTheoryHeader}>
    <p className={styles.practiceTheoryEyebrow}>Study System</p>
    <h2 className={styles.practiceTheoryTitle}>Algorithm Practice Loop</h2>
    <p className={styles.practiceTheoryIntro}>
      Use this loop when reviewing, rebuilding, or testing whether you actually
      understand the pattern.
    </p>
  </div>

  <div className={styles.practiceTheoryStepsRow}>
    <div className={styles.practiceTheoryStepCard}>
      <span className={styles.practiceTheoryStepNumber}>01</span>
      <span className={styles.practiceTheoryStepTitle}>
        Recognition & Story
      </span>
      <ul className={styles.practiceTheorySubList}>
        <li>What pattern is this?</li>
        <li>What is the story in plain English?</li>
        <li>What state am I tracking?</li>
      </ul>
    </div>

    <div className={styles.practiceTheoryStepCard}>
      <span className={styles.practiceTheoryStepNumber}>02</span>
      <span className={styles.practiceTheoryStepTitle}>
        Skeleton From Memory
      </span>
      <ul className={styles.practiceTheorySubList}>
        <li>Write structure only.</li>
        <li>No syntax stress.</li>
        <li>Loops, DFS/BFS shape, helpers.</li>
      </ul>
    </div>

    <div className={styles.practiceTheoryStepCard}>
      <span className={styles.practiceTheoryStepNumber}>03</span>
      <span className={styles.practiceTheoryStepTitle}>
        Full Code + Walkthrough
      </span>
      <ul className={styles.practiceTheorySubList}>
        <li>Write full solution.</li>
        <li>Walk through one example by hand.</li>
        <li>Track pointers, visited, queue/stack.</li>
      </ul>
    </div>

    <div className={styles.practiceTheoryStepCard}>
      <span className={styles.practiceTheoryStepNumber}>04</span>
      <span className={styles.practiceTheoryStepTitle}>
        Small Variations
      </span>
      <ul className={styles.practiceTheorySubList}>
        <li>DFS ↔ BFS</li>
        <li>Change data structure.</li>
        <li>Flip edge direction or condition.</li>
      </ul>
    </div>
  </div>

  <div className={styles.practiceTheoryBottomGrid}>
    <div className={styles.practiceTheoryRulesCard}>
      <p className={styles.practiceTheoryRulesTitle}>Rules of Thumb</p>

      <div className={styles.ruleRow}>
        <span>New / Hard</span>
        <strong>3–5 passes over 2 weeks</strong>
      </div>

      <div className={styles.ruleRow}>
        <span>Medium</span>
        <strong>2–3 passes</strong>
      </div>

      <div className={styles.ruleRow}>
        <span>Mastered</span>
        <strong>1 fast pass monthly</strong>
      </div>
    </div>

    <div className={styles.practiceTheoryReminder}>
      <span className={styles.reminderIcon}>✦</span>
      <p>
        <strong>Reminder:</strong> Forgetting details is normal. Rebuilding the
        solution <em>is</em> the practice.
      </p>
    </div>
  </div>
</div>
  );
}
