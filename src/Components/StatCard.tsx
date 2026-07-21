import styles from "./HomePageStyle.module.css";

export default function StatCard({
  label,
  value,
  accent
}: {
  label: string;
  value: number;
  accent?: "green" | "blue";
}) {
  const accentClass = accent === "green"
    ? styles["statValue--green"]
    : accent === "blue"
    ? styles["statValue--blue"]
    : "";

  return (
    <div className={styles.statCard}>
      <p className={`${styles.statValue} ${accentClass}`}>{value}</p>
      <p className={styles.statLabel}>{label}</p>
    </div>
  );
}
