
import { Link } from "react-router-dom";
import styles from "./HomePageStyle.module.css";
import { TeacherHomeDto } from "../api/Home";
import Avatar from "../Components/Avatar";
import StatCard from "../Components/StatCard";
import CourseCard from "./CourseCard";

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
            <Link key={c.courseID} to={`/Course/${c.courseID}`} className={styles.courseCardLink}>
              <CourseCard 
                course={{
                  courseID: c.courseID,
                  courseTitle: c.title ?? "Untitled",
                  courseDescription: `${c.totalContents ?? 0} lessons | ${c.permission ?? "unknown"}`,
                  imageUrl: c.image ?? null,
                  courseFeePerMonth: c.feesPerMonth ?? 0,
                  levelRequiredID: 0
                }}
                studentCount={c.totalStudents}
              />
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
