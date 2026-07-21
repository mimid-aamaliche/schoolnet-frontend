
import styles from "./CourseCardStyle.module.css";
import { Course } from "../api/Courses"

interface courseCardProps {
    course: Course;
    progress?: number;
    lastAccessed?: string;
    rating?: number;
    studentCount?: number;
}

function CourseCard({ course, progress, lastAccessed, rating, studentCount }: courseCardProps) {

    return (
        <div className={styles.courses__course}>
            <img
                src={"https://img.freepik.com/free-photo/young-woman-attend-courses-girl-student-studying-holding-notebooks-showing-thumb-up-approval-recommending-company-standing-blue-background_1258-70145.jpg"}
                alt={course.courseTitle}
                className={styles.course__image}
            />
            <div className={styles.course__text__wraper}>
                <div className={styles.course__info}>
                    <p className={styles.courses__course__Title}>{course.courseTitle}</p>
                    <p className={styles.courses__course__description}> {course.courseDescription}</p>
                </div>

                <div className={styles.course__footer}>
                    {/* Scenario 1: Student Progress View */}
                    {progress !== undefined ? (
                        <div className={styles.course__progress__container}>
                            <div className={styles.progress__bar}>
                                <div
                                    className={styles.progress__fill}
                                    style={{ width: `${progress}%` }}
                                ></div>
                            </div>
                            <div className={styles.progress__text}>
                                <span>{progress}% Complete</span>
                                {lastAccessed && <span className={styles.last__accessed}>{lastAccessed}</span>}
                            </div>
                        </div>
                    ) : rating !== undefined ? (
                        /* Scenario 2: Teacher Stats View */
                        <div className={styles.course__stats__container}>
                            <div className={styles.rating}>
                                <span className={styles.star}>★</span>
                                <span>{rating}</span>
                            </div>
                            {studentCount !== undefined && (
                                <span className={styles.student__count}>{studentCount} Students</span>
                            )}
                        </div>
                    ) : (
                        /* Scenario 3: Default (Price + Shared Stats) View */
                        <div className={styles.course__default__footer}>
                            <p className={styles.courses__course__price}>
                                {course.courseFeePerMonth}
                            </p>
                            {studentCount !== undefined && (
                                <span className={styles.student__count__small}>
                                    {studentCount} Students
                                </span>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

}

export default CourseCard;