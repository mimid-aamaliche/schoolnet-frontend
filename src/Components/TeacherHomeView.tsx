
import styles from "./HomePageStyle.module.css";
import { TeacherHomeDto } from "../api/Home";
import Avatar from "../Components/Avatar"
import StatCard from "../Components/StatCard"

export default function TeacherHome({ data }: { data: TeacherHomeDto }) {
  const profile = data.profile ?? {
    fullName: "Unknown",
    userName: "",
    image: undefined
  };

  const stats = data.stats ?? {
    totalCourses: 0,
    totalStudents: 0,
    totalContent: 0
  };

  const courses = data.courses ?? [];

  return (
    <>
      <div className={styles.hero}>
        <Avatar name={profile.fullName} image={profile.image} />
        <div>
          <p className={styles.heroName}>{profile.fullName}</p>
          <p className={styles.heroSub}>
            {profile.userName} · Teacher
          </p>
        </div>
      </div>

      <div className={styles.statsGrid}>
        <StatCard label="My courses" value={stats.totalCourses ?? 0} />
        <StatCard label="Total students" value={stats.totalStudents ?? 0} accent="green" />
        <StatCard label="Content pieces" value={stats.totalContent ?? 0} accent="blue" />
      </div>

      <p className={styles.sectionTitle}>Managed courses</p>

      {courses.length === 0 ? (
        <p className={styles.state}>No courses available</p>
      ) : (
        <div className={styles.coursesGrid}>
          {courses.map(c => (
            <div key={c.courseID} className={styles.courseCard}>
              <div className={styles.courseImgWrap}>
                {c.image ? (
                  <img src={c.image} alt={c.title ?? "course"} className={styles.courseImg} />
                ) : (
                  <div className={`${styles.courseImgPlaceholder} ${styles.teacherPlaceholder}`}>
                    🎓
                  </div>
                )}
              </div>

              <div className={styles.courseBody}>
                <p className={styles.courseTitle}>{c.title ?? "Untitled"}</p>

                <div className={styles.courseMeta}>
                  <span className={styles.courseFee}>
                    ${c.feesPerMonth ?? 0}/mo
                  </span>

                  <span
                    className={`${styles.badge} ${
                      c.permission === "admin"
                        ? styles.badgeGreen
                        : styles.badgeGray
                    }`}
                  >
                    {c.permission ?? "unknown"}
                  </span>
                </div>

                <div className={styles.courseStatsRow}>
                  <span className={styles.cstat}>
                    <strong>{c.totalContents ?? 0}</strong> lessons
                  </span>
                  <span className={styles.cstat}>
                    <strong>{c.totalStudents ?? 0}</strong> students
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
