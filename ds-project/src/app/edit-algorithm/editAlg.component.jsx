import React from "react";
import styles from "./page.module.css";

const EditAlg = ({ loading, error, form, handleChange, handleSubmit }) => {
  const techniqueOptions = [
    "DFS",
    "BFS",
    "2 Pointer",
    "Map",
    "Set",
    "Greedy",
    "Tortoise and Hare",
    "Dummy Node",
    "Queue",
    "Stack", 
    "Priority Queue",
    "Visited Queue",
    "Divide and Conquer",
    "Sliding Window",
    "Binary Search",
    "Backtracking",
    "Dynamic Programming",
    "Bit Manipulation",
    "Union Find",
    "Trie",
    "Recursion",
    "Math",
    "Other",
    "Adjacency List",
    "Adjacency Matrix",
    "In-Degree",
    "Out-Degree",
    "Weighted Graph",
    "Unweighted Graph",
    "Directed Graph",
    "Undirected Graph",
    "Edge List",
    "Incidence Matrix",
    "Topological Sort",
    // "Union Find",
    "Dijkstras Algorithm",
    "Bellman-Ford",
    "Floyd-Warshall",
    "Prims Algorithm",
    "Kruskals Algorithm",
    "Tarjans Algorithm",
    "Kosarajus Algorithm",
    "Shortest Path",
    "Minimum Spanning Tree",
    "Cycle Detection",
    "Strongly Connected Components",
    "Bridges & Articulation Points",
    "Level Order Traversal",
    "Preorder Traversal",
    "Inorder Traversal",
    "Postorder Traversal",
    "Morris Traversal",
    "Tree Serialization",
    "Tree Deserialization",
    "Binary Search Tree",
    "AVL Tree",
    "Segment Tree",
    "Fenwick Tree",
    "Red-Black Tree",
    "N-ary Tree",
    "K-ary Tree",
    "Heap",
    "Trie Tree",
    "Suffix Tree",
    "Cartesian Tree",
    "Threaded Binary Tree",
  ];

  const handleTechniquesChange = (e) => {
    const selected = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );
    handleChange({ target: { name: "techniques", value: selected } });
  };
  if (loading) return <div>Loading...</div>;
  if (error) return <div className={styles.error}>{error}</div>;

  // Helper for examples
  const handleExampleChange = (idx, field, value) => {
    const newExamples = form.examples.map((ex, i) =>
      i === idx ? { ...ex, [field]: value } : ex
    );
    handleChange({ target: { name: "examples", value: newExamples } });
  };
  const handleAddExample = () => {
    const newExamples = [...(form.examples || []), { input: "", output: "" }];
    handleChange({ target: { name: "examples", value: newExamples } });
  };
  const handleRemoveExample = (idx) => {
    const newExamples = form.examples.filter((_, i) => i !== idx);
    handleChange({ target: { name: "examples", value: newExamples } });
  };
  console.log("Edit Alg Form", form);

  return (
    <form className={styles.editAlgForm} onSubmit={handleSubmit}>
      <h2>Edit Algorithm</h2>
      <label>
        LeetCode Number
        <input
          name="leetcodeNumber"
          type="number"
          min="1"
          value={form.leetcodeNumber || ""}
          onChange={handleChange}
          required
        />
      </label>
      <label>
        Title
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          required
        />
      </label>
      <label>
        Description
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          required
        />
      </label>
      <label>
        Solution
        <textarea
          name="solution"
          value={form.solution}
          onChange={handleChange}
          required
        />
      </label>
      <label>
        Type
        <select name="type" value={form.type} onChange={handleChange} required>
          <option value="">Select type...</option>
          <option value="String">String</option>
          <option value="Array">Array</option>
          <option value="Map">Map</option>
          <option value="Stack & Queue">Stack & Queue</option>
          <option value="Interval">Interval</option>
          <option value="Dynamic Programming">Dynamic Programming</option>
          <option value="Trees">Trees</option>
          <option value="Heaps">Heaps</option>
          <option value="Graphs">Graphs</option>
          <option value="Linked List">Linked List</option>
          <option value="Recursion">Recursion</option>
          <option value="Math">Math</option>
          <option value="Bit Manipulation">Bit Manipulation</option>
          <option value="Other">Other</option>
        </select>
      </label>

      <label>
        Techniques
        <select
          name="techniques"
          multiple
          value={form.techniques || []}
          onChange={handleTechniquesChange}
          style={{ minHeight: "3.5rem" }}
          required
        >
          {techniqueOptions.map((tech) => (
            <option key={tech} value={tech}>
              {tech}
            </option>
          ))}
        </select>
        <span style={{ fontSize: "0.95rem", color: "var(--gray-500)" }}>
          Hold Ctrl (Windows) or Cmd (Mac) to select multiple
        </span>
        {Array.isArray(form.techniques) && form.techniques.length > 0 && (
          <div
            style={{
              marginTop: "0.7rem",
              display: "flex",
              flexWrap: "wrap",
              gap: "0.5rem",
            }}
          >
            {form.techniques.map((tech) => (
              <span
                key={tech}
                style={{
                  display: "inline-block",
                  background: "var(--purple-100)",
                  color: "var(--indigo-700)",
                  borderRadius: "1.2rem",
                  padding: "0.2rem 1.1rem",
                  fontSize: "0.98rem",
                  fontWeight: 600,
                  border: "1.5px solid var(--purple-200)",
                  boxShadow: "0 1px 2px 0 var(--purple-50)",
                }}
              >
                {tech}
              </span>
            ))}
          </div>
        )}
      </label>
      <div>
        <div
          style={{
            fontWeight: 700,
            color: "var(--indigo-600)",
            marginBottom: "0.5rem",
          }}
        >
          Examples
        </div>
        {(form.examples || []).map((ex, idx) => (
          <div
            key={idx}
            style={{ display: "flex", gap: "0.7rem", marginBottom: "0.5rem" }}
          >
            <input
              type="text"
              placeholder="Input"
              value={ex.input}
              onChange={(e) =>
                handleExampleChange(idx, "input", e.target.value)
              }
              style={{ flex: 1 }}
            />
            <input
              type="text"
              placeholder="Output"
              value={ex.output}
              onChange={(e) =>
                handleExampleChange(idx, "output", e.target.value)
              }
              style={{ flex: 1 }}
            />
            <button
              type="button"
              onClick={() => handleRemoveExample(idx)}
              style={{
                background: "var(--error)",
                color: "#fff",
                border: "none",
                borderRadius: "0.5rem",
                padding: "0.3rem 0.7rem",
                cursor: "pointer",
              }}
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={handleAddExample}
          style={{
            background: "var(--purple-400)",
            color: "#fff",
            border: "none",
            borderRadius: "0.5rem",
            padding: "0.4rem 1.2rem",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Add Example
        </button>
      </div>
      <h3>Your Progress</h3>
      <label>
        Rank
        <input
          name="rank"
          type="number"
          min="0"
          max="10"
          value={form.rank}
          onChange={handleChange}
        />
      </label>
      <label>
        Notes
        <textarea name="notes" value={form.notes} onChange={handleChange} />
      </label>
      <label>
        Status
        <select name="status" value={form.status} onChange={handleChange}>
          <option value="Mastered">Mastered</option>
          <option value="Reviewing">Reviewing</option>
          <option value="Deep Practice">Deep Practice</option>
        </select>
      </label>
      <button type="submit">Save Changes</button>
    </form>
  );
};

export default EditAlg;
