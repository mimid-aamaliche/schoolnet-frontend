
import { Link } from "react-router-dom";
import styles from "./HomePageStyle.module.css";
import { StudentHomeDto } from "../api/Home";
import Avatar from "../Components/Avatar";
import StatCard from "../Components/StatCard";


const isActive = (endDate?: string) =>
  !endDate || new Date(endDate) >= new Date();



export default function StudentHome({ data }: { data: StudentHomeDto }) {
  console.log(data);
  const profile = data.profile ?? {
    fullName: "Unknown",
    userName: "",
    image: undefined
  };

  const stats = data.stats ?? {
    enrolledCourses: 0,
    activeSubscriptions: 0,
    paidSubscriptions: 0
  };

  const courses = data.courses ?? [];

  return (
    <>
      <div className={styles.hero}>
        <Avatar name={profile.fullName} image={profile.image} />
        <div>
          <p className={styles.heroName}>{profile.fullName}</p>
          <p className={styles.heroSub}>
            {profile.userName} · Student
          </p>
        </div>
      </div>

      <div className={styles.statsGrid}>
        <StatCard label="Enrolled courses" value={stats.enrolledCourses ?? 0} />
        <StatCard label="Active subs" value={stats.activeSubscriptions ?? 0} accent="green" />
        <StatCard label="Paid" value={stats.paidSubscriptions ?? 0} accent="blue" />
      </div>

      <p className={styles.sectionTitle}>My courses</p>

      {courses.length === 0 ? (
        <p className={styles.state}>No courses available</p>
      ) : (
        <div className={styles.coursesGrid}>
          {courses.map(c => (
            <Link key={c.courseID} to={`/Course/${c.courseID}`} className={styles.courseCardLink}>
            <div className={styles.courseCard}>
              <div className={styles.courseImgWrap}>
                {c.image ? (
                  <img src={c.image} alt={c.title ?? "course"} className={styles.courseImg} />
                ) : (
                  <div className={styles.courseImgPlaceholder}>📚</div>
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
                      !c.isPaid
                        ? styles.badgeAmber
                        : isActive(c.endDate)
                        ? styles.badgeGreen
                        : styles.badgeGray
                    }`}
                  >
                    {!c.isPaid
                      ? "Unpaid"
                      : isActive(c.endDate)
                      ? "Active"
                      : "Expired"}
                  </span>
                </div>

                <div className={styles.courseStatsRow}>
                  <span className={styles.cstat}>
                    <strong>{c.totalContents ?? 0}</strong> lessons
                  </span>
                </div>
              </div>
            </div>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}