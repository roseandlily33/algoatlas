import React, { useState } from "react";
import styles from "./page.module.css";

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

const initialForm = {
  leetcodeNumber: "",
  title: "",
  description: "",
  solution: "",
  type: "",
  techniques: [],
  examples: [{ input: "", output: "" }],
};

export default function AddNewAlgorithm({ onSuccess }) {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleTechniquesChange = (e) => {
    const selected = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );
    setForm((prev) => ({ ...prev, techniques: selected }));
  };

  const handleExampleChange = (idx, field, value) => {
    setForm((prev) => ({
      ...prev,
      examples: prev.examples.map((ex, i) =>
        i === idx ? { ...ex, [field]: value } : ex
      ),
    }));
  };
  const handleAddExample = () => {
    setForm((prev) => ({
      ...prev,
      examples: [...prev.examples, { input: "", output: "" }],
    }));
  };
  const handleRemoveExample = (idx) => {
    setForm((prev) => ({
      ...prev,
      examples: prev.examples.filter((_, i) => i !== idx),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/algorithms`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed to add algorithm");
      setSuccess("Algorithm added successfully!");
      setForm(initialForm);
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.message || "Error adding algorithm");
    }
    setLoading(false);
  };

  return (
    <form className={styles.editAlgForm} onSubmit={handleSubmit}>
      <h2>Add New Algorithm</h2>
      {error && <div className={styles.error}>{error}</div>}
      {success && (
        <div style={{ color: "var(--success)", marginBottom: 12 }}>
          {success}
        </div>
      )}
      <label>
        LeetCode Number
        <input
          name="leetcodeNumber"
          type="number"
          min="1"
          value={form.leetcodeNumber}
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
          value={form.techniques}
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
        {form.techniques.length > 0 && (
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
        {form.examples.map((ex, idx) => (
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
      <button type="submit" disabled={loading}>
        {loading ? "Adding..." : "Add Algorithm"}
      </button>
    </form>
  );
}
