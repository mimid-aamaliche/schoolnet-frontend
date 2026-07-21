

import React, { useState, useEffect } from "react";
import styles from "./AllCoursesStylePage.module.css";
import { FetchAllCourses, Course } from "../api/Courses"
import CourseCard from './CourseCard';
import { Link } from "react-router-dom";





function AllCoursesPage() {

    const [CoursesList, setCoursesList] = useState<Course[]>([]);
    const [Loadingstate, setLoadingstate] = useState<boolean>(true);
    const [Error, setError] = useState<string | null>(null);

    //Logic here:
    //          fetch courses 

    useEffect(() => {


        const fetchData = async () => {
            const data = await FetchAllCourses();

            if (data.success) {
                setCoursesList(data.Courses);
            } else {
                //somthing went wrong
                console.log("PROBLEM AT FETCHING ALL COURSES :" + data.message);

                setError("PROBLEM AT FETCHING ALL COURSES :" + data.message);
            }

            setLoadingstate(false);


        }


        fetchData();


    }, []);


    // Render loading state
    if (Loadingstate) return <p>Loading courses...</p>;

    // Render error state
    if (Error) return <p>Error: {Error}</p>;



    //now we map those





    return (
        <div>
            <section className={styles.current_context}>
                <h1 className={styles.current_context__page_title} id="PageMainTitleID"> All courses</h1>
            </section>

            <hr className={styles.line_seperator}></hr>

            <section className={styles.courses}>
                <div className={styles.courses__container} id="courses__container">


                    {CoursesList.map((item) => (

                        <Link to={`/Course/${item.courseID}`} key={item.courseID}>

                            <CourseCard
                                course={item}
                                studentCount={item.numberOfStudents}
                            />

                        </Link>


                    ))}


                </div>


            </section>


        </div>




    );






}


export default AllCoursesPage;