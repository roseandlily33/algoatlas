import styles from "./footer.module.css";

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={styles.left}>
                <span className={styles.projectName}>AlgoAtlas</span>
                <span className={styles.rights}>© {new Date().getFullYear()} All rights reserved.</span>
            </div>
            <div className={styles.icons}>
                <a
                    href="https://github.com/roseandlily33"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.iconLink}
                    aria-label="GitHub"
                >
                    {/* GitHub SVG */}
                    <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.477 2 2 6.484 2 12.021c0 4.428 2.865 8.184 6.839 9.504.5.092.682-.217.682-.483 0-.237-.009-.868-.014-1.703-2.782.605-3.369-1.342-3.369-1.342-.454-1.154-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.004.07 1.532 1.032 1.532 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.339-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.987 1.029-2.686-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.025A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.295 2.748-1.025 2.748-1.025.546 1.378.203 2.397.1 2.65.64.699 1.028 1.593 1.028 2.686 0 3.847-2.338 4.695-4.566 4.944.36.31.68.921.68 1.857 0 1.34-.012 2.421-.012 2.751 0 .268.18.579.688.481C19.138 20.2 22 16.448 22 12.021 22 6.484 17.523 2 12 2z" />
                    </svg>
                </a>
                <a
                    href="https://your-portfolio-link.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.iconLink}
                    aria-label="Portfolio"
                >
                    {/* Portfolio SVG (briefcase) */}
                    <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M10.5 2A2.5 2.5 0 0 0 8 4.5V6H5A3 3 0 0 0 2 9v9a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3V9a3 3 0 0 0-3-3h-3V4.5A2.5 2.5 0 0 0 13.5 2h-3zm1 2h1a.5.5 0 0 1 .5.5V6h-2V4.5A.5.5 0 0 1 11.5 4zm-6.5 5h14a1 1 0 0 1 1 1v2H4V10a1 1 0 0 1 1-1zm-1 5v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3H4z" />
                    </svg>
                </a>
            </div>
        </footer>
    );
}
