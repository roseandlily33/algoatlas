import Image from "next/image";
import PrimaryButton from "../components/buttons/primaryButton.component";
import styles from "./page.module.css";
import Link from "next/link";

export default function Home() {
  return (
    <main className={styles.heroMain}>
      <div className={styles.heroImgWrap}>
        <Image
          src="/white-wave.jpg"
          alt="Background"
          fill
          className={styles.heroImg}
          priority
        />
        <div className={styles.heroOverlay} />
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>AlgoAtlas</h1>
          <p className={styles.heroSubtitle}>
            Practice, master, and track your progress on data structures and
            algorithms.
            <br />
            Personalized dashboard, weekly focus, and detailed attempt history.
          </p>
           <Link href="/login">
            <PrimaryButton>Get Started</PrimaryButton>
          </Link>
        </div>
      </div>
      <section className={styles.infoSection}>
        <h2>Why AlgoAtlas?</h2>
        <ul className={styles.infoList}>
          <li>
            🧠 Track your learning journey and see your improvement over time.
          </li>
          <li>
            🎯 Focus on your weak spots with a weekly focus list and random
            practice.
          </li>
          <li>
            📈 Visualize your mastery, review history, and avoid common
            mistakes.
          </li>
          <li>🌈 Modern, fun, and motivating interface to keep you engaged.</li>
        </ul>
      </section>
    </main>
  );
}
