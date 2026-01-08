"use client";
import React, { useState, useEffect } from "react";
import styles from "./page.module.css";
import AllAlgorithms from "./allAlgorithms.component";
import EditAlg from "./editAlg.component";
import AddNewAlgorithm from "./addNewAlgorithm.component";

const EditAlgorithmPage = () => {
  // const [algorithm, setAlgorithm] = useState(null);
  const [progress, setProgress] = useState(null);
  const [selected, setSelected] = useState(null);
  const [algorithms, setAlgorithms] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({
    title: "",
    description: "",
    solution: "",
    type: "",
    rank: 0,
    notes: "",
    status: "Reviewing",
  });

  // Fetch all algorithms (can be called after add)
  const fetchAllAlgs = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/algorithms`,
        { credentials: "include" }
      );
      if (!res.ok) throw new Error("Failed to fetch algorithms");
      const algosArr = await res.json();
      // Group by type
      const grouped = {};
      for (const algo of algosArr) {
        const group = algo.type || "Other";
        if (!grouped[group]) grouped[group] = [];
        grouped[group].push(algo);
      }
      setAlgorithms(grouped);
      // Optionally select the first algorithm
      if (!selected && algosArr.length > 0) setSelected(algosArr[0]._id);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchAllAlgs();
    // eslint-disable-next-line
  }, []);

  // Fetch selected algorithm and progress
  useEffect(() => {
    async function fetchData() {
      if (!selected) return;
      setLoading(true);
      setError(null);
      try {
        // Fetch algorithm details
        const algoRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/algorithms/${selected}`,
          { credentials: "include" }
        );
        if (!algoRes.ok) throw new Error("Failed to fetch algorithm");
        const algoData = await algoRes.json();
        // setAlgorithm(algoData);
        // Fetch user progress for this algorithm
        const progRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/progress/${selected}`,
          { credentials: "include" }
        );
        if (!progRes.ok) setProgress(null);
        const progData = await progRes.json();
        setProgress(progData);
        setForm({
          leetcodeNumber: algoData.leetcodeNumber,
          title: algoData.title,
          description: algoData.description,
          solution: algoData.solution,
          type: algoData.type,
          techniques: algoData.techniques || [],
          examples: algoData.examples || [],
          rank: progData.rank ?? 0,
          notes: progData.notes ?? "",
          status: progData.status ?? "Reviewing",
        });
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    }
    fetchData();
  }, [selected]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    try {
      // Update algorithm (admin only)
      await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/algorithms/${selected}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            title: form.title,
            description: form.description,
            solution: form.solution,
            type: form.type,
            leetcodeNumber: form.leetcodeNumber,
            techniques: form.techniques,
            examples: form.examples,
          }),
        }
      );
      // Update user progress
      await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/progress/${selected}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            rank: form.rank,
            notes: form.notes,
            status: form.status,
          }),
        }
      );
      alert("Saved!");
    } catch (err) {
      setError("Failed to save changes");
    }
  }
  // Tab state: 'add' or 'edit'
  const [activeTab, setActiveTab] = useState("add");

  return (
    <div className={styles.dashboardLayout}>
      <AllAlgorithms
        algorithms={algorithms}
        setSelected={setSelected}
        selected={selected}
      />
      <div className={styles.mainContent}>
        <div className={styles.tabBar}>
          <button
            className={activeTab === "add" ? styles.activeTab : styles.tabBtn}
            onClick={() => setActiveTab("add")}
            type="button"
          >
            Add New Algorithm
          </button>
          <button
            className={activeTab === "edit" ? styles.activeTab : styles.tabBtn}
            onClick={() => setActiveTab("edit")}
            type="button"
          >
            Edit Existing Algorithm
          </button>
        </div>
        <div className={styles.tabContent}>
          {activeTab === "add" && <AddNewAlgorithm onSuccess={fetchAllAlgs} />}
          {activeTab === "edit" && (
            <EditAlg
              loading={loading}
              error={error}
              form={form}
              handleChange={handleChange}
              handleSubmit={handleSubmit}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default EditAlgorithmPage;
