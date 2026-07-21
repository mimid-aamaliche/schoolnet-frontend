import { useEffect, useState } from "react";
import { fetchHome, StudentHomeDto, TeacherHomeDto, HomeDto } from "../api/Home";
import styles from "./HomePageStyle.module.css";
import TeacherHome from "../Components/TeacherHomeView"
import StudentHome from "../Components/StudentHomeView"

// ── types ──────────────────────────────────────────────────────


// ── MAIN PAGE ───────────────────────────────────────────────────
export default function HomePage() {
  const [homeData, setHomeData] = useState<HomeDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchHome();
        setHomeData(data);
      } catch (e: any) {
        setError(e?.message ?? "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  if (loading) return <div className={styles.state}>Loading...</div>;
  if (error) return <div className={styles.stateError}>{error}</div>;
  if (!homeData) return null;

  console.log(homeData);
  if (homeData.role === 1) {
  return (
    <div className={styles.root}>
      <StudentHome data={homeData.data} />
    </div>
  );
}

return (
  <div className={styles.root}>
    <TeacherHome data={homeData.data} />
  </div>
);
}