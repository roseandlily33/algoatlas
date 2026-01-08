"use client";
import { useState } from "react";
import styles from "../login/page.module.css";
import { useRouter } from "next/navigation";

export default function CreateAccountPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");
  const router = useRouter();

  async function handleCreate(e) {
    e.preventDefault();
    setStatus("Creating account...");
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/create-account`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ email, password }),
        }
      );
      const data = await res.json();
      if (res.ok) {
        setStatus("Account created! Redirecting...");
        router.push("/user");
      } else {
        setStatus(data.error || "Account creation failed");
      }
    } catch (err) {
      setStatus("Server error");
    }
  }

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleCreate}>
        <h2>Create Account</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Create Account</button>
        <div className={styles.status}>{status}</div>
        <div className={styles.switch}>
          Already have an account? <a href="/login">Login</a>
        </div>
      </form>
    </div>
  );
}
