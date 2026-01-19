"use client";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
// import Prism from "prismjs";
// import "prismjs/components/prism-javascript";
// import "prismjs/themes/prism.css";
import { useRouter, useParams } from "next/navigation";
import styles from "./page.module.css";
import { fetchAlgorithm } from "./hooks/fetchAlgorithm";
import { submitProgress } from "./hooks/submitProgress";
import ProgressHistory from "./progressHistory/progressHistory.component";
import CheatSheetModal from "./modal/cheatSheetModal.component";
import TechniqueButtons from "./techniqueButtons/techniqueButtons.component";
import AttemptInfo from "./attemptInfo/attemptInfo.component";

const statusOptions = ["Mastered", "Reviewing", "Deep Practice"];

// Dynamically import react-simple-code-editor to avoid SSR issues
const SimpleCodeEditor = dynamic(() => import("react-simple-code-editor"), {
  ssr: false,
});

const TakeAlgorithmPage = () => {
  const router = useRouter();
  const { algoId } = useParams();
  typeof window !== "undefined"
    ? window.location.pathname.split("/").pop()
    : "";

  const [algorithm, setAlgorithm] = useState(null);
  const [progressHistory, setProgressHistory] = useState([]);
  const [isStarred, setIsStarred] = useState(false);
  const [attemptsToday, setAttemptsToday] = useState(0);
  const [loading, setLoading] = useState(true);
  const [answer, setAnswer] = useState("");
  const [showSolution, setShowSolution] = useState(false);
  const [rank, setRank] = useState(0);
  const [status, setStatus] = useState(statusOptions[1]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [notes, setNotes] = useState("");
  // New fields
  const [pattern, setPattern] = useState("");
  const [dataStructure, setDataStructure] = useState("");
  const [traversalOrTechnique, setTraversalOrTechnique] = useState("");
  const [coreInvariant, setCoreInvariant] = useState("");
  const [baseCases, setBaseCases] = useState("");
  const [commonMistake, setCommonMistake] = useState("");
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
          }
        );
        let history = [];
        let latest = null;
        if (res.ok) {
          history = await res.json();
          // Sort by lastPracticed descending to ensure latest is first
          history.sort(
            (a, b) => new Date(b.lastPracticed) - new Date(a.lastPracticed)
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
          setCoreInvariant(latest?.coreInvariant || "");
          setBaseCases(latest?.baseCases || "");
          setCommonMistake(latest?.commonMistake || "");
          setTheory(algo?.theory || "");
        } else {
          setProgressHistory([]);
          setIsStarred(false);
          setRank(0);
          setStatus(statusOptions[1]);
        }
        // Always reset attemptsToday to 0 for a new attempt
        setAttemptsToday(0);
        // Clear new fields if no latest
        if (!latest) {
          setNotes("");
          setPattern("");
          setDataStructure("");
          setTraversalOrTechnique("");
          setCoreInvariant("");
          setBaseCases("");
          setCommonMistake("");
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
        coreInvariant,
        baseCases,
        commonMistake,
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
        }
      );
      // Refresh history
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/progress/${algoId}/history`,
        {
          credentials: "include",
        }
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
    <div className={styles.y2kBrowserShell}>
      {/* Faux browser bar */}
      <div className={styles.browserBar}>
        <div className={styles.windowBtns}>
          <span className={styles.windowBtn} title="Flower">
            🌸
          </span>
          <span className={styles.windowBtn} title="Heart">
            💜
          </span>
          <span className={styles.windowBtn} title="Smile">
            😊
          </span>
          {/* Star toggle */}
          <span
            className={styles.windowBtn}
            title={isStarred ? "Unstar (focus)" : "Star (focus)"}
            style={{
              cursor: "pointer",
              marginLeft: "1.2rem",
              fontSize: "1.5rem",
            }}
            onClick={() => setIsStarred((v) => !v)}
          >
            {isStarred ? "⭐" : "☆"}
          </span>
        </div>
      </div>

      {/* Title and description row */}
      <div className={styles.titleDescRow}>
        <div className={styles.leetcodeNumber}>#{algorithm.leetcodeNumber}</div>
        <div className={styles.title}>{algorithm.title}</div>
      </div>
      <div className={styles.description}>{algorithm.description}</div>
      {/* Theory dropdown */}
      {algorithm.theory && algorithm.theory.trim() !== "" && (
        <div className={styles.theoryDropdownWrap}>
          <button
            type="button"
            className={styles.theoryDropdownBtn}
            onClick={() => setShowTheory((v) => !v)}
            aria-expanded={showTheory}
            aria-controls="theory-content"
          >
            {showTheory ? "Hide Theory" : "Show Theory"}
            <span style={{ fontSize: "1.1em" }}>{showTheory ? "▼" : "▶"}</span>
          </button>
          {showTheory && (
            <div id="theory-content" className={styles.theoryDropdownContent}>
              {algorithm.theory}
            </div>
          )}
        </div>
      )}
      {/* Type and Techniques pills */}
      <TechniqueButtons
        algorithm={algorithm}
        setModalTitle={setModalTitle}
        setModalContent={setModalContent}
        setModalOpen={setModalOpen}
      />

      {/* Examples row */}
      <div className={styles.examplesRow}>
        <div className={styles.examplesTitle}>Examples:</div>
        {algorithm.examples && algorithm.examples.length > 0 ? (
          algorithm.examples.map((ex, i) => (
            <div key={i} className={styles.exampleRow}>
              <span className={styles.exampleIcon}>✨</span>
              <span>
                <b>Input:</b> <code>{ex.input}</code>
              </span>
              <span>
                <b>Output:</b> <code>{ex.output}</code>
              </span>
            </div>
          ))
        ) : (
          <div>No examples provided.</div>
        )}
      </div>

      {/* Answer/controls row (side-by-side with solution if open) */}
      <div className={styles.answerSolutionsRow}>
        <form className={styles.answerForm} onSubmit={handleSubmit}>
          <div className={styles.answerLabelRow}>
            <span className={styles.answerLabelText}>Your Answer:</span>
            <button
              type="button"
              className={styles.solutionBtn}
              onClick={() => setShowSolution((v) => !v)}
            >
              {showSolution ? "Hide Solution" : "View Solution"}
            </button>
          </div>
          <div className={styles.answerSolutionFlex}>
            <div style={{ width: "100%" }}>
              <SimpleCodeEditor
                value={answer}
                onValueChange={setAnswer}
                highlight={(code) =>
                  Prism.highlight(
                    code,
                    Prism.languages.javascript,
                    "javascript"
                  )
                }
                padding={12}
                style={{
                  fontFamily:
                    'var(--font-mono, "Fira Mono", "Menlo", "Monaco", "Consolas", "monospace")',
                  fontSize: 16,
                  minHeight: 180,
                  borderRadius: "0.8rem",
                  border: "1.5px solid var(--purple-200)",
                  background: "var(--gray-100, #f8f8fa)",
                  outline: "none",
                  width: "100%",
                  boxSizing: "border-box",
                  marginBottom: 0,
                  transition: "border 0.2s",
                }}
                textareaId="code-editor"
                textareaClassName={styles.codeTextarea}
                placeholder="Write your code here..."
                tabSize={2}
                insertSpaces={true}
                onKeyDown={(e) => {
                  // Auto-pair braces
                  if (e.key === "{") {
                    const start = e.target.selectionStart;
                    const end = e.target.selectionEnd;
                    setAnswer(
                      answer.slice(0, start) + "{}" + answer.slice(end)
                    );
                    setTimeout(() => {
                      const textarea = document.getElementById("code-editor");
                      if (textarea)
                        textarea.selectionStart = textarea.selectionEnd =
                          start + 1;
                    }, 0);
                    e.preventDefault();
                  }
                }}
              />
            </div>
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
            coreInvariant={coreInvariant}
            setCoreInvariant={setCoreInvariant}
            baseCases={baseCases}
            setBaseCases={setBaseCases}
            commonMistake={commonMistake}
            setCommonMistake={setCommonMistake}
          />
          {/* Theory textarea */}
          <div className={styles.flexRow} style={{ marginTop: 16 }}>
            <div className={styles.label}>Theory:</div>
            <div className={styles.value} style={{ width: "100%" }}>
              <textarea
                value={theory}
                onChange={(e) => setTheory(e.target.value)}
                rows={3}
                placeholder="Add theory, intuition, or explanation for this algorithm..."
                className={styles.theoryTextarea}
              />
            </div>
          </div>
        </form>
      </div>

      <ProgressHistory progressHistory={progressHistory} />
      <CheatSheetModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={modalTitle}
      >
        {modalContent}
      </CheatSheetModal>
      {error && <div className={styles.error}>{error}</div>}
    </div>
  );
};

export default TakeAlgorithmPage;
