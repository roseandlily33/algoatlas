const mongoose = require("mongoose");

// Example schema for algorithm examples
const ExampleSchema = new mongoose.Schema({
  input: { type: String, required: true },
  output: { type: String, required: true },
});

// Algorithm schema
const AlgorithmSchema = new mongoose.Schema({
  leetcodeNumber: { type: Number, required: true, unique: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  solution: { type: String, required: true },
  type: { type: String, required: true }, // e.g., 'Array', 'Linked List', etc.
  theory: { type: String, default: "" }, // <-- optional theory field
  techniques: [
    {
      type: String,
      enum: [
        "DFS",
        "Map",
        "BFS",
        "2 Pointer",
        "Set",
        "Queue",
        "Visited Queue",
        "Divide and Conquer",
        "Tortoise and Hare",
        "Dummy Node",
        "Sliding Window",
        "Greedy",
        "Binary Search",
        "Backtracking",
        "Dynamic Programming",
        "Greedy",
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
        "Stack",
        "Priority Queue",
        "Incidence Matrix",
        "Topological Sort",
        "Union Find",
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
      ],
    },
  ],
  examples: [ExampleSchema],
});

// User progress per algorithm (history)
const UserProgressSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  algorithm: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Algorithm",
    required: true,
  },
  rank: { type: Number, min: 0, max: 10, default: 0 },
  notes: { type: String, default: "" },
  status: {
    type: String,
    enum: ["Mastered", "Reviewing", "Deep Practice"],
    default: "Reviewing",
  },
  isStarred: { type: Boolean, default: false },
  attemptsToday: { type: Number, min: 0, default: 0 },
  lastPracticed: { type: Date, default: Date.now },
  pattern: { type: String, default: "" },
  dataStructure: { type: String, default: "" },
  traversalOrTechnique: { type: String, default: "" },
  coreInvariant: { type: String, default: "" },
  baseCases: { type: String, default: "" },
  commonMistake: { type: String, default: "" },
});

const Algorithm = mongoose.model("Algorithm", AlgorithmSchema);
const UserProgress = mongoose.model("UserProgress", UserProgressSchema);

module.exports = {
  Algorithm,
  UserProgress,
};
