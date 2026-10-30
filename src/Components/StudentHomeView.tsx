
import { Link } from "react-router-dom";
import styles from "./HomePageStyle.module.css";
import { StudentHomeDto } from "../api/Home";
import Avatar from "../Components/Avatar";
import StatCard from "../Components/StatCard";
import CourseCard from "./CourseCard";


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
              <CourseCard 
                course={{
                  courseID: c.courseID,
                  courseTitle: c.title ?? "Untitled",
                  courseDescription: `${c.totalContents ?? 0} lessons | ${!c.isPaid ? "Unpaid" : isActive(c.endDate) ? "Active" : "Expired"}`,
                  imageUrl: c.image ?? null,
                  courseFeePerMonth: c.feesPerMonth ?? 0,
                  levelRequiredID: 0
                }}
              />
            </Link>
          ))}
        </div>
      )}
    </>
  );
}