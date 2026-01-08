"use client";
import Link from "next/link";
import styles from "./navbar.module.css";
import PrimaryButton from "../buttons/primaryButton.component";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const auth = useAuth() || {};
  const user = auth.user;
  const loading = auth.loading;
  const setUser = auth.setUser;
  async function handleLogout() {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/logout`, {
        method: "POST",
        credentials: "include",
      });
      setUser && setUser(null);
      router.push("/");
    } catch (err) {
      setUser && setUser(null);
      router.push("/");
    }
  }
  return (
    <nav className={styles.navbar}>
      <div style={{ display: "flex", alignItems: "center", gap: "1.2rem" }}>
        <span
          style={{
            fontFamily: "var(--font-main)",
            fontSize: "2rem",
            fontWeight: 900,
            color: "var(--purple-700)",
            letterSpacing: "0.01em",
            textShadow: "0 1px 4px var(--indigo-50)",
            lineHeight: 1.1,
            marginRight: "0.2rem",
            userSelect: "none",
          }}
        >
          AlgoAtlas
        </span>
      </div>
      <ul className={styles.navList}>
        <li>
          <Link href="/" className={pathname === "/" ? styles.active : ""}>
            Home
          </Link>
        </li>
        {!loading && user && (
          <>
            <li>
              <Link
                href="/user"
                className={pathname.startsWith("/user") ? styles.active : ""}
              >
                User
              </Link>
            </li>
            <li>
              <Link
                href="/data-structures"
                className={
                  pathname.startsWith("/data-structures") ? styles.active : ""
                }
              >
                Data Structures
              </Link>
            </li>
            <li>
              <Link
                href="/edit-algorithm"
                className={
                  pathname.startsWith("/edit-algorithm") ? styles.active : ""
                }
              >
                Edit Algorithms
              </Link>
            </li>
            <li>
              <button
                onClick={handleLogout}
                style={{
                  background: "none",
                  border: "none",
                  color: "var(--purple-700)",
                  fontWeight: 700,
                  fontSize: "1.08rem",
                  cursor: "pointer",
                  padding: "0.5rem 1.1rem",
                  borderRadius: "1.1rem",
                  transition: "background 0.15s, color 0.15s",
                }}
              >
                Logout
              </button>
            </li>
          </>
        )}
        {!user && (
          <li>
            <Link href="/login">
              <PrimaryButton>Login</PrimaryButton>
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
}
