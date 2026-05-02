"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import styles from "./page.module.css";
import { fetchAlgorithm } from "./hooks/fetchAlgorithm";
import { submitProgress } from "./hooks/submitProgress";
import ProgressHistory from "./progressHistory/progressHistory.component";
import ProgressReportChart from "./progressHistory/progressReportChart.component";
import CheatSheetModal from "./modal/cheatSheetModal.component";
import TechniqueButtons from "./techniqueButtons/techniqueButtons.component";
import AttemptInfo from "./attemptInfo/attemptInfo.component";

const statusOptions = ["Mastered", "Reviewing", "Deep Practice"];

const TakeAlgorithmPage = () => {
  const { algoId } = useParams();
  typeof window !== "undefined"
    ? window.location.pathname.split("/").pop()
    : "";

  const [algorithm, setAlgorithm] = useState(null);
  const [progressHistory, setProgressHistory] = useState([]);
  const [isStarred, setIsStarred] = useState(false);
  const [attemptsToday, setAttemptsToday] = useState(1);
  const [loading, setLoading] = useState(true);
  const [answer, setAnswer] = useState("");
  const [showSolution, setShowSolution] = useState(false);
  const [rank, setRank] = useState(0);
  const [status, setStatus] = useState(statusOptions[1]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [notes, setNotes] = useState("");
  const [starTier, setStarTier] = useState("None");
  // New fields
  const [pattern, setPattern] = useState("");
  const [dataStructure, setDataStructure] = useState("");
  const [traversalOrTechnique, setTraversalOrTechnique] = useState("");

  // Theory field
  const [theory, setTheory] = useState("");
  // Dropdown for theory
  const [showTheory, setShowTheory] = useState(false);

  const [algoList, setAlgoList] = useState([]);
  const [algoIdx, setAlgoIdx] = useState(-1);
  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalContent, setModalContent] = useState(null);
  console.log("Modal content", modalContent);

  useEffect(() => {
    // Fetch algorithm and progress history
    async function fetchAll() {
      try {
        setLoading(true);
        const algo = await fetchAlgorithm(algoId);
        setAlgorithm(algo);
        // Fetch all progress for this algorithm (array of attempts)
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/progress/${algoId}/history`,
          {
            credentials: "include",
          },
        );
        let history = [];
        let latest = null;
        if (res.ok) {
          history = await res.json();
          // Sort by lastPracticed descending to ensure latest is first
          history.sort(
            (a, b) => new Date(b.lastPracticed) - new Date(a.lastPracticed),
          );
          setProgressHistory(history);
          const latest = history.length > 0 ? history[0] : null;
          // Set defaults from latest progress if available
          setIsStarred(latest?.isStarred || false);
          setRank(latest?.rank || 0);
          setStatus(latest?.status || statusOptions[1]);
          setNotes(latest?.notes || "");
          setPattern(latest?.pattern || "");
          setDataStructure(latest?.dataStructure || "");
          setTraversalOrTechnique(latest?.traversalOrTechnique || "");
          setStarTier(latest?.starTier || "None");
        } else {
          setProgressHistory([]);
          setIsStarred(false);
          setRank(0);
          setStatus(statusOptions[1]);
        }
        // Always reset attemptsToday to 1 for a new attempt
        setAttemptsToday(1);
        // Clear new fields if no latest
        if (!latest) {
          setNotes("");
          setPattern("");
          setDataStructure("");
          setTraversalOrTechnique("");
          setTheory(algo?.theory || "");
        }
        setLoading(false);
        // For demo, fake algoList
        setAlgoList(["1", "2", algoId, "4"]);
        setAlgoIdx(2); // index of current algoId
      } catch (err) {
        setLoading(false);
      }
    }
    fetchAll();
  }, [algoId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      await submitProgress(algoId, {
        rank,
        status,
        notes,
        answer,
        isStarred,
        attemptsToday,
        pattern,
        dataStructure,
        traversalOrTechnique,
        theory,
        starTier,
      });
      // Update theory for the algorithm (PATCH/PUT to /api/algorithms/:algoId)
      await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/algorithms/${algoId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ theory }),
        },
      );
      // Refresh history
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/progress/${algoId}/history`,
        {
          credentials: "include",
        },
      );
      if (res.ok) {
        const newHistory = await res.json();
        setProgressHistory(newHistory);
      }
      setAnswer("");
    } catch (err) {
      setError("Failed to submit progress");
    }
    setSubmitting(false);
  };

  if (loading || !algorithm)
    return <div className={styles.loading}>Loading...</div>;

  return (
    <>
      <div className={styles.gradientBg} aria-hidden="true" />
      <main className={styles.algorithmPage}>
        <div className={styles.y2kBrowserShell}>
          <div className={styles.browserBar}>
            <div className={styles.windowBtns}>
              <span className={styles.windowBtn}>🌸</span>
              <span className={styles.windowBtn}>💜</span>
              <span className={styles.windowBtn}>😊</span>
            </div>

            <div className={styles.browserAddress}>
              /take-algorithm/{algorithm.leetcodeNumber || "practice"}
            </div>

            <div className={styles.browserActions}>
              <button
                type="button"
                className={`${styles.starToggleBtn} ${isStarred ? styles.starred : ""}`}
                title={isStarred ? "Unstar focus" : "Star focus"}
                onClick={() => setIsStarred((v) => !v)}
              >
                {isStarred ? "⭐" : "☆"}
              </button>

              <select
                className={styles.starTierSelect}
                value={starTier}
                onChange={(e) => setStarTier(e.target.value)}
              >
                <option value="None">No Star</option>
                <option value="Low">Low ⭐</option>
                <option value="Medium">Medium ⭐⭐</option>
                <option value="High">High ⭐⭐⭐</option>
              </select>
            </div>
          </div>

          <section className={styles.algorithmHero}>
            <div>
              <p className={styles.eyebrow}>Algorithm Practice</p>
              <h1 className={styles.algorithmTitle}>
                {algorithm.leetcodeNumber && (
                  <span>#{algorithm.leetcodeNumber}</span>
                )}
                {algorithm.title}
              </h1>
            </div>

            <div className={styles.heroMeta}>
              <span>{algorithm.type || "No type"}</span>
              <span>Tier: {starTier}</span>
            </div>
          </section>

          <TechniqueButtons
            algorithm={algorithm}
            setModalTitle={setModalTitle}
            setModalContent={setModalContent}
            setModalOpen={setModalOpen}
          />

          <section className={styles.descriptionCard}>
            {algorithm.description}
          </section>

          <section className={styles.examplesSection}>
            <div className={styles.sectionHeader}>
              <p className={styles.eyebrow}>Examples</p>
            </div>

            <div className={styles.examplesList}>
              {algorithm.examples && algorithm.examples.length > 0 ? (
                algorithm.examples.map((ex, i) => (
                  <div key={i} className={styles.exampleCard}>
                    <span className={styles.exampleIcon}>✨</span>
                    <div>
                      <p>
                        <strong>Input:</strong> <code>{ex.input}</code>
                      </p>
                      <p>
                        <strong>Output:</strong> <code>{ex.output}</code>
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className={styles.emptyState}>No examples provided.</div>
              )}
            </div>
          </section>

          {algorithm.theory && algorithm.theory.trim() !== "" && (
            <section className={styles.theoryDropdownWrap}>
              <button
                type="button"
                className={styles.theoryDropdownBtn}
                onClick={() => setShowTheory((v) => !v)}
                aria-expanded={showTheory}
                aria-controls="theory-content"
              >
                <span>{showTheory ? "Hide Theory" : "Show Theory"}</span>
                <strong>{showTheory ? "▼" : "▶"}</strong>
              </button>

              {showTheory && (
                <div
                  id="theory-content"
                  className={styles.theoryDropdownContent}
                >
                  {algorithm.theory}
                </div>
              )}
            </section>
          )}

          <form className={styles.practiceWorkspace} onSubmit={handleSubmit}>
            <div className={styles.workspaceHeader}>
              <div>
                <p className={styles.eyebrow}>Workspace</p>
                <h2>Write Your Solution</h2>
              </div>

              <button
                type="button"
                className={styles.solutionBtn}
                onClick={() => setShowSolution((v) => !v)}
              >
                {showSolution ? "Hide Solution" : "View Solution"}
              </button>
            </div>

            <div
              className={`${styles.editorGrid} ${
                showSolution ? styles.editorGridSplit : ""
              }`}
            >
              <textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                rows={10}
                placeholder="Write your code here..."
                className={styles.codeTextarea}
                id="code-editor"
                tabIndex={0}
              />

              {showSolution && (
                <pre className={styles.solutionBoxSide}>
                  <code>{algorithm.solution}</code>
                </pre>
              )}
            </div>

            <AttemptInfo
              rank={rank}
              setRank={setRank}
              status={status}
              setStatus={setStatus}
              attemptsToday={attemptsToday}
              setAttemptsToday={setAttemptsToday}
              submitting={submitting}
              notes={notes}
              setNotes={setNotes}
              pattern={pattern}
              setPattern={setPattern}
              dataStructure={dataStructure}
              setDataStructure={setDataStructure}
              traversalOrTechnique={traversalOrTechnique}
              setTraversalOrTechnique={setTraversalOrTechnique}
            />

            <section className={styles.theoryWriteBlock}>
              <label className={styles.fieldLabel}>Theory Notes</label>
              <textarea
                value={theory}
                onChange={(e) => setTheory(e.target.value)}
                rows={3}
                placeholder="Add theory, intuition, or explanation for this algorithm..."
                className={styles.theoryTextarea}
              />
            </section>
          </form>

          <ProgressHistory progressHistory={progressHistory} />

          <CheatSheetModal
            open={modalOpen}
            onClose={() => setModalOpen(false)}
            title={modalTitle}
            content={modalContent}
          >
            {modalContent}
          </CheatSheetModal>

          {error && <div className={styles.error}>{error}</div>}
        </div>
      </main>
    </>
  );
};

export default TakeAlgorithmPage;
