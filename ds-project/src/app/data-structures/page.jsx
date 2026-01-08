"use client";
"use client";
import React, { useState, useEffect } from "react";
import styles from "./page.module.css";

const dataStructures = [
  { key: "array", label: "Array" },
  { key: "string", label: "String" },
  { key: "stack", label: "Stack" },
  { key: "queue", label: "Queue" },
  { key: "linked-list", label: "Linked List" },
  { key: "doubly-linked-list", label: "Doubly Linked List" },
  { key: "map", label: "Map" },
  { key: "set", label: "Set" },
  { key: "heap-priority-queue", label: "Heap & Priority Queue" },
  { key: "disjoint-set", label: "Disjoint Set" },
  { key: "tree", label: "Tree" },
  { key: "graph", label: "Graph" },
  { key: "segment-tree", label: "Segment Tree" },
  { key: "fenwick-tree", label: "Fenwick Tree" },
];

async function getDSData(key) {
  return import(`../../data/dataStructures/${key}.json`).then(
    (mod) => mod.default
  );
}

const DataStructuresPage = () => {
  const [selected, setSelected] = useState(dataStructures[0].key);
  const [dsData, setDSData] = useState(null);

  useEffect(() => {
    getDSData(selected).then(setDSData);
  }, [selected]);

  return (
    <div className={styles.container}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarTitle}>Data Structures</div>
        <ul className={styles.sidebarList}>
          {dataStructures.map((ds) => (
            <li
              key={ds.key}
              className={
                styles.sidebarItem +
                (selected === ds.key ? " " + styles.active : "")
              }
              onClick={() => setSelected(ds.key)}
            >
              {ds.label}
            </li>
          ))}
        </ul>
      </aside>
      <section className={styles.content}>
        {dsData ? (
          <div className={styles["main-card"]}>
            <h2>{dsData.title || dsData.type}</h2>
            {dsData.description && (
              <p style={{ margin: "1rem 0", color: "var(--gray-700)", fontFamily: "var(--font-main)" }}>
                {dsData.description}
              </p>
            )}
            {Object.entries(dsData).map(([key, value]) => {
              if (["title", "description", "type"].includes(key)) return null;
              // Render arrays
              if (Array.isArray(value)) {
                // Array of objects
                if (
                  value.length > 0 &&
                  typeof value[0] === "object" &&
                  value[0] !== null
                ) {
                  return (
                    <div key={key} style={{ marginTop: 32 }}>
                      <h3>{key
                        .replace(/([A-Z])/g, " $1")
                        .replace(/^./, (str) => str.toUpperCase())}
                      </h3>
                      {value.map((obj, i) => (
                        <React.Fragment key={i}>
                          <div
                            className={`ds-block${i % 2 === 1 ? " ds-alt" : ""
                              }`}
                          >
                            {Object.entries(obj).map(([k, v]) => {
                              // Render arrays as sublists for common fields
                              if (Array.isArray(v)) {
                                return (
                                  <div key={k} className="ds-field">
                                    <strong>
                                      {k
                                        .replace(/([A-Z])/g, " $1")
                                        .replace(/^./, (str) =>
                                          str.toUpperCase()
                                        )}
                                      :
                                    </strong>
                                    <ul style={{ margin: "6px 0 8px 1.2em" }}>
                                      {v.map((item, idx) => (
                                        <li key={idx}>{item}</li>
                                      ))}
                                    </ul>
                                  </div>
                                );
                              }
                              // Render nested objects (rare)
                              if (typeof v === "object" && v !== null) {
                                return (
                                  <div key={k} className="ds-field">
                                    <strong>
                                      {k
                                        .replace(/([A-Z])/g, " $1")
                                        .replace(/^./, (str) =>
                                          str.toUpperCase()
                                        )}
                                      :
                                    </strong>
                                    <div
                                      className="ds-block"
                                      style={{ marginTop: 4 }}
                                    >
                                      {Object.entries(v).map(([subk, subv]) => (
                                        <div key={subk} className="ds-field">
                                          <strong>
                                            {subk
                                              .replace(/([A-Z])/g, " $1")
                                              .replace(/^./, (str) =>
                                                str.toUpperCase()
                                              )}
                                            :
                                          </strong>{" "}
                                          {Array.isArray(subv)
                                            ? subv.join(", ")
                                            : typeof subv === "object"
                                              ? JSON.stringify(subv)
                                              : subv}
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                );
                              }
                              // Render strings/numbers
                              return (
                                <div key={k} className="ds-field">
                                  <strong>
                                    {k
                                      .replace(/([A-Z])/g, " $1")
                                      .replace(/^./, (str) =>
                                        str.toUpperCase()
                                      )}
                                    :
                                  </strong>{" "}
                                  {v}
                                </div>
                              );
                            })}
                          </div>
                          {i < value.length - 1 && (
                            <hr className="ds-divider" />
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                  );
                } else {
                  // Array of strings
                  return (
                    <div key={key} style={{ marginTop: 28 }}>
                      <h3>{key
                        .replace(/([A-Z])/g, " $1")
                        .replace(/^./, (str) => str.toUpperCase())}
                      </h3>
                      <ul>
                        {value.map((item, i) => (
                          <li key={i} style={{ marginBottom: 6 }}>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                }
              }
              // Render objects
              if (typeof value === "object" && value !== null) {
                return (
                  <div key={key} style={{ marginTop: 28 }}>
                    <h3>{key
                      .replace(/([A-Z])/g, " $1")
                      .replace(/^./, (str) => str.toUpperCase())}
                    </h3>
                    <div className="ds-block">
                      {Object.entries(value).map(([k, v]) => (
                        <div key={k} className="ds-field">
                          <strong>
                            {k
                              .replace(/([A-Z])/g, " $1")
                              .replace(/^./, (str) => str.toUpperCase())}
                            :
                          </strong>{" "}
                          {Array.isArray(v)
                            ? v.join(", ")
                            : typeof v === "object"
                              ? JSON.stringify(v)
                              : v}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              }
              // Render strings/numbers
              return (
                <div key={key} style={{ marginTop: 24 }}>
                  <h3>{key
                    .replace(/([A-Z])/g, " $1")
                    .replace(/^./, (str) => str.toUpperCase())}
                  </h3>
                  <div style={{ lineHeight: 1.7 }}>{value}</div>
                </div>
              );
            })}
          </div>
        ) : (
          <div>Loading...</div>
        )}
      </section>
    </div>
  );
};
export default DataStructuresPage;
