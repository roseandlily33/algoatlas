import styles2 from "../modal/cheatSheetModal.module.css";
import arrayData from "../../../../data/dataStructures/array.json";
import queueData from "../../../../data/dataStructures/queue.json";
import segmentTreeData from "../../../../data/dataStructures/segment-tree.json";
import linkedListData from "../../../../data/dataStructures/linked-list.json";
import mapData from "../../../../data/dataStructures/map.json";
import stackData from "../../../../data/dataStructures/stack.json";
import treeData from "../../../../data/dataStructures/tree.json";
import graphData from "../../../../data/dataStructures/graph.json";
import heapData from "../../../../data/dataStructures/heap-priority-queue.json";
// import trieData from "../../../../data/dataStructures/trie.json";
import disjointSetData from "../../../../data/dataStructures/disjoint-set.json";
import doublyLinkedListData from "../../../../data/dataStructures/doubly-linked-list.json";
import fenwickTreeData from "../../../../data/dataStructures/fenwick-tree.json";
import setData from "../../../../data/dataStructures/set.json";
import stringData from "../../../../data/dataStructures/string.json";

const cheatSheetData = {
  array: arrayData,
  queue: queueData,
  "segment-tree": segmentTreeData,
  "linked-list": linkedListData,
  map: mapData,
  stack: stackData,
  tree: treeData,
  graphs: graphData,
  "heap-priority-queue": heapData,
  // trie: trieData,
  "disjoint-set": disjointSetData,
  "doubly-linked-list": doublyLinkedListData,
  "fenwick-tree": fenwickTreeData,
  set: setData,
  string: stringData,
};

const TechniqueButtons = ({
  algorithm,
  setModalTitle,
  setModalContent,
  setModalOpen,
}) => {
  return (
    <div
      style={{
        margin: "1.1rem 0.5rem 0.7rem 1.1rem",
        display: "flex",
        gap: "1.7rem",
        alignItems: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.7rem",
        }}
      >
        <span
          style={{
            fontWeight: 600,
            color: "var(--purple-600)",
            fontSize: "1.04rem",
          }}
        >
          Type:
        </span>
        <button
          type="button"
          className={styles2.pill}
          onClick={async () => {
            setModalTitle(algorithm.type);
            const fileKey = algorithm.type.toLowerCase().replace(/ /g, "-");
            const data = cheatSheetData[fileKey];
            setModalContent(
              <div className={styles2.modalCheatSheetContent}>
                {/* Description */}
                {data && data.description && (
                  <div className={styles2.modalCheatSheetDescription}>
                    {data.description}
                  </div>
                )}
                {/* Key Points */}
                {data && data.keyPoints && (
                  <ul className={styles2.modalCheatSheetKeyPoints}>
                    {data.keyPoints.map((pt, i) => (
                      <li
                        key={i}
                        className={styles2.modalCheatSheetKeyPointItem}
                      >
                        {pt}
                      </li>
                    ))}
                  </ul>
                )}
                {/* Code Snippet */}
                {data && data.codeSnippet && (
                  <pre className={styles2.modalCheatSheetCodeSnippet}>
                    <code>{data.codeSnippet.code}</code>
                  </pre>
                )}
                {/* Used For */}
                {data && data.usedFor && (
                  <div className={styles2.modalCheatSheetUsedFor}>
                    <b>Used for:</b> {data.usedFor.join(", ")}
                  </div>
                )}
              </div>
            );
            setModalOpen(true);
          }}
        >
          {algorithm.type}
        </button>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.7rem",
        }}
      >
        <span
          style={{
            fontWeight: 600,
            color: "var(--purple-600)",
            fontSize: "1.04rem",
          }}
        >
          Techniques:
        </span>
        {algorithm?.techniques && algorithm.techniques.length > 0 ? (
          algorithm?.techniques.map((tech, i) => (
            <button
              key={tech}
              type="button"
              className={styles2.pill}
              onClick={() => {
                setModalTitle(tech);
                setModalContent(
                  <div style={{ color: "var(--gray-500)" }}>Loading...</div>
                );
                setModalOpen(true);
                const fileKey = algorithm.type.toLowerCase().replace(/ /g, "-");
                const data = cheatSheetData[fileKey];
                const found =
                  data &&
                  data.techniques &&
                  data.techniques.find(
                    (t) => t.title.toLowerCase() === tech.toLowerCase()
                  );
                if (found) {
                  setModalContent(
                    <div>
                      <div style={{ fontWeight: 600, marginBottom: "0.7rem" }}>
                        {found.title}
                      </div>
                      <div style={{ marginBottom: "0.7rem" }}>
                        {found.description}
                      </div>
                      {found.codeSnippet && (
                        <pre
                          style={{
                            background: "var(--gray-50)",
                            borderRadius: "0.7rem",
                            padding: "0.7rem",
                            marginBottom: "0.7rem",
                            fontSize: "0.98rem",
                            overflowX: "auto",
                          }}
                        >
                          <code>{found.codeSnippet}</code>
                        </pre>
                      )}
                      {found.useCases && (
                        <div style={{ marginBottom: "0.7rem" }}>
                          <b>Use cases:</b> {found.useCases.join(", ")}
                        </div>
                      )}
                    </div>
                  );
                } else {
                  setModalContent(
                    <div style={{ color: "var(--red-500)" }}>
                      No info available for this technique.
                    </div>
                  );
                }
              }}
            >
              {tech}
            </button>
          ))
        ) : (
          <span style={{ color: "var(--gray-400)", fontSize: "0.98rem" }}>
            None
          </span>
        )}
      </div>
    </div>
  );
};

export default TechniqueButtons;
