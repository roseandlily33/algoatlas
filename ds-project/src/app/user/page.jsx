"use client";
import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";
import { fetchUserDashboardData } from "./dashboardData";
import AllAlgorithms from "./AllAlgorithms/allAlgorithms.component";
import WeeklyFocus from "./WeeklyAlgorithms/weeklyFocus.component";
import RandomFive from "./RandomFive/randomFive.component";
import ProgressReport from "./ProgressReport/ProgressReport.component";
import WeeklyPlan from "./WeeklyPlan/WeeklyPlan.component";
import AlgorithmPracticeSteps from "./PracticeTheory/PracticeTheory.component";

function groupAlgorithms(algorithms) {
  // Example: group by type if available, else all in one group
  const groups = {};
  for (const algo of algorithms) {
    const group = algo.type || "Other";
    if (!groups[group]) groups[group] = [];
    groups[group].push(algo);
  }
  // Sort each group by title or leetcodeNumber
  for (const group in groups) {
    groups[group].sort(
      (a, b) => (a.leetcodeNumber || 0) - (b.leetcodeNumber || 0)
    );
  }
  return groups;
}

const UserPage = () => {
  const [algorithms, setAlgorithms] = useState([]);
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);
  const [randomFive, setRandomFive] = useState([]);
  const auth = useAuth() || {};
  const user = auth.user;
  const authLoading = auth.loading;
  // const [weeklyFive, setWeeklyFive] = useState([]);

  // router already declared above
  const router = useRouter();
  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/");
    } else if (user) {
      fetchUserDashboardData()
        .then(({ algorithms, progress }) => {
          setAlgorithms(algorithms);
          setProgress(progress);
          setRandomFive(
            algorithms.length > 5
              ? [...algorithms].sort(() => 0.5 - Math.random()).slice(0, 5)
              : algorithms
          );
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [user, authLoading, router]);

  // Map algoId to progress
  const progressMap = {};
  for (const p of progress) {
    if (p.algorithm && p.algorithm._id) progressMap[p.algorithm._id] = p;
  }

  const groups = groupAlgorithms(algorithms);

  function handleGoToAlgo(algoId) {
    // Use Next.js router for client-side navigation
    router.push(`/take-algorithm/${algoId}`);
  }
  console.log("Algorithms:", algorithms);
  console.log("Progress:", progress);
  function handleRandomFive() {
    if (algorithms.length > 5) {
      setRandomFive(
        [...algorithms].sort(() => 0.5 - Math.random()).slice(0, 5)
      );
    }
  }

  if (loading || authLoading)
    return (
      <main className={styles.main}>
        <div className={styles.loading}>Loading...</div>
      </main>
    );

  return (
    <div className={styles.dashboardLayout}>
      <AllAlgorithms
        groups={groups}
        handleGoToAlgo={handleGoToAlgo}
        progressMap={progressMap}
      />
      <main className={styles.mainContent}>
        <AlgorithmPracticeSteps />
        <WeeklyPlan
          algorithms={algorithms}
          progress={progress}
          handleGoToAlgo={handleGoToAlgo}
        />
        <WeeklyFocus
          algorithms={algorithms}
          // weeklyFive={weeklyFive}
          progressMap={progressMap}
          handleGoToAlgo={handleGoToAlgo}
        />
        {/* <RandomFive
          randomFive={randomFive}
          handleRandomFive={handleRandomFive}
          progressMap={progressMap}
          handleGoToAlgo={handleGoToAlgo}
        /> */}
        <ProgressReport progress={progress} />
      </main>
    </div>
  );
};

export default UserPage;
