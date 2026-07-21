
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";


import styles from "./MyCoursesPageStyle.module.css";
import { FetchCoursesOfUserX, Course } from "../api/Courses"
import CourseCard from './CourseCard';
import { getCurrentUser, CurrentTokenIsValide } from "../Services/Auth_Service"
import { useNavigate } from "react-router-dom";

import { user } from '../api/Authentication'
import { EntryMode } from "./Add_EditCourseModal";

import Add_EditCourseModal from './Add_EditCourseModal'


interface AllCoursesPageProps {

}





//FLOW OF THIS COMPONENT 
//      -FETCH COURSES BY ID AND MODE(TEACHER OR STUDENT )
//      - RESPONCE CONTAINS COURSES + IN CASE OF A TEACHER



//WHAT S LEFT 
//      -ADD "ADD COURSE " BTN FOR TEACHERS
//      -FILTERS 
//      -PAGINATION !!!!!!!!!!!!!!!!!!! MOST IMPORTANT ONE 


function MyCoursesPage({  }: AllCoursesPageProps) {




    const [CoursesList, setCoursesList] = useState<Course[]>([]);
    const [Loadingstate, setLoadingstate] = useState<boolean>(true);
    const [Error, setError] = useState<string | null>(null);
    //ui logic 
    const [ModalIsOpen, setModalIsOpen] = useState<boolean>(false);



    const navigate = useNavigate();
    const Current_user = getCurrentUser();

    
    if (Current_user === null || Current_user === undefined) {

        //no user is loged in
        //redirect to the login page
        navigate("/Login");
    }




    const HandleBackGroundClick = () => {

        //here we hide the modal 
        setModalIsOpen(false);

    }





    //Logic here:
    //          fetch courses 

    useEffect(() => {


        const fetchData = async () => {


            const data = await FetchCoursesOfUserX();


            if (data.success) {
                setCoursesList(data.Courses);
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
                <h1 className={styles.current_context__page_title} id="PageMainTitleID"> My courses</h1>
            </section>

            <hr className={styles.line_seperator}></hr>

            {
                Current_user?.mode === 2 && (
                    <section className={styles.AddBtnContainer}>
                        <button className={styles.AddNewCourseBTN} type="button" onClick={() => setModalIsOpen(prev => !prev)}> Add New Course </button>
                    </section>
                )

            }





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


            {
                ModalIsOpen && (
                    <div className={styles.ModalContainer}>
                        <div className={styles.overlay} onClick={HandleBackGroundClick}></div>
                        <div className={styles.ModalContent}>

                            <Add_EditCourseModal mode={EntryMode.AddNew} />

                        </div>


                    </div>
                )


            }


        </div>




    );






}


export default MyCoursesPage;