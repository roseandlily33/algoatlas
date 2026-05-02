import styles2 from "../modal/cheatSheetModal.module.css";
import styles from './techniqueButtons.module.css';
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
<div className={styles.metaBar}>
  <div className={styles.metaGroup}>
    <span className={styles.metaLabel}>Type</span>

    <button
      type="button"
      className={styles.metaPillPrimary}
      onClick={async () => {
        setModalTitle(algorithm.type);
        const fileKey = algorithm.type.toLowerCase().replace(/ /g, "-");
        const data = cheatSheetData[fileKey];

        setModalContent(
          <div className={styles2.modalCheatSheetContent}>
            {data?.description && (
              <div className={styles2.modalCheatSheetDescription}>
                {data.description}
              </div>
            )}

            {data?.keyPoints && (
              <ul className={styles2.modalCheatSheetKeyPoints}>
                {data.keyPoints.map((pt, i) => (
                  <li key={i} className={styles2.modalCheatSheetKeyPointItem}>
                    {pt}
                  </li>
                ))}
              </ul>
            )}

            {data?.codeSnippet && (
              <pre className={styles2.modalCheatSheetCodeSnippet}>
                <code>{data.codeSnippet.code}</code>
              </pre>
            )}

            {data?.usedFor && (
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

  <div className={styles.metaGroup}>
    <span className={styles.metaLabel}>Techniques</span>

    <div className={styles.metaPillWrap}>
      {algorithm?.techniques?.length > 0 ? (
        algorithm.techniques.map((tech) => (
          <button
            key={tech}
            type="button"
            className={styles.metaPill}
            onClick={() => {
              setModalTitle(tech);
              setModalOpen(true);

              const fileKey = algorithm.type.toLowerCase().replace(/ /g, "-");
              const data = cheatSheetData[fileKey];

              const found =
                data?.techniques?.find(
                  (t) => t.title.toLowerCase() === tech.toLowerCase()
                );

              if (found) {
                setModalContent(
                  <div className={styles.techniqueModal}>
                    <div className={styles.techTitle}>{found.title}</div>
                    <div className={styles.techDesc}>{found.description}</div>

                    {found.codeSnippet && (
                      <pre className={styles.techCode}>
                        <code>{found.codeSnippet}</code>
                      </pre>
                    )}

                    {found.useCases && (
                      <div className={styles.techUse}>
                        <b>Use cases:</b> {found.useCases.join(", ")}
                      </div>
                    )}
                  </div>
                );
              } else {
                setModalContent(
                  <div className={styles.techError}>
                    No info available.
                  </div>
                );
              }
            }}
          >
            {tech}
          </button>
        ))
      ) : (
        <span className={styles.metaEmpty}>None</span>
      )}
    </div>
  </div>
</div>
  );
};

export default TechniqueButtons;
