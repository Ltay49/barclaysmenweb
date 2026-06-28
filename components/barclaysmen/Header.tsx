import styles from "./Header.module.css";

export default function Header({ title }: { title: string }) {
  return (
    <div className={styles.headerContainer}>
      <h1 className={styles.header}>{title}</h1>
    </div>
  );
}
