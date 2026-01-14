"use client";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import styles from "./page.module.css";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");
  const router = useRouter();
  const { setUser } = useAuth() || {};

  async function handleLogin(e) {
    e.preventDefault();
    setStatus("Logging in...");
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus("Login successful! Redirecting...");
        if (setUser && data.user) setUser(data.user);
        router.push("/user");
      } else {
        setStatus(data.error || "Login failed");
      }
    } catch (err) {
      setStatus("Server error");
    }
  }
  console.log("End", process.env.NEXT_PUBLIC_API_URL);

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleLogin}>
        <h2>Login</h2>
        <p>URL: {process.env.NEXT_PUBLIC_API_URL}</p>
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
        <button type="submit">Login</button>
        <div className={styles.status}>{status}</div>
        <div className={styles.switch}>
          Don&apos;t have an account? <a href="/create-account">Create one</a>
        </div>
      </form>
    </div>
  );
}
// removed extra closing brace
