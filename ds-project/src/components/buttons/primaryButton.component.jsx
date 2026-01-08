
import styles from "./primaryButton.module.css";

export default function PrimaryButton({ children, ...props }) {
    return (
        <button className={styles.primaryButton} {...props}>
            {children}
        </button>
    );
}
