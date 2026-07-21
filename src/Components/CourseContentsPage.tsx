
import { useEffect, useState } from "react";
import styles from "./CourseContentsPageStyle.module.css"
import { Link, useNavigate, useParams } from "react-router-dom";
import { FetchCourseById, CourseDetailedDTO } from "../api/Courses"
import { GetCourseXContents, Content, UserRoleType } from "../api/Content"
import CourseOptionsMenu from './CourseOptionsMenu'
import Add_EditContentModal from './Add_EditContentModal'
import Add_EditCourseModal, { EntryMode } from './Add_EditCourseModal'
import {handleSubscribe} from "../api/Subscription"


enum ModalSteps {
    OptionStep = 1,
    AddContentStep = 2,
    EditCourseStep = 3
}

function CourseContentsPage() {

    const navigate = useNavigate();

    //get the course id from the url parametres
    const { CourseID } = useParams();
    const [Course, setCourse] = useState<CourseDetailedDTO>();
    const [ContentList, setContentList] = useState<Content[]>([]);
    const [UserRole, setUserRole] = useState<UserRoleType>();
    
    const courseid = Number(CourseID);

    //ui logic 
    const [ModalIsOpen, setModalIsOpen] = useState<boolean>(false);
    const [ModalCurrentStep, SetModalCurrentStep] = useState<ModalSteps>(ModalSteps.OptionStep)




    //fetching Course info flags
    const [CourseInfoLoadingstate, setCourseInfoLoadingstate] = useState<boolean>(true);
    //fetching Course Content flags
    const [CourseContentLoadingstate, setCourseContentLoadingstate] = useState<boolean>(true);

    const [Error, setError] = useState<string | null>(null);





    //WE ALSO NEED TO CHECK IF THE USER IS LOGED IN AND IF THE USER IS A TEACHER OR A STUDENT
    //IF STUDENT / HIDE THE EDIT BUTTON
    //           / HIDE SUBSCRIPTION BUTTON IF HE ALREADY HAS ACCESS

    //IF TEACHER / HIDE THE SUBSCRIPTION BUTTON
    //           / HIDE THE EDIT BUTTON IF THIS TEACHER DOES NOT HAVE PERMISSION ON THIS COURSE











    //fetch the course info and content 
    useEffect(() => {


        const fetchCourseData = async () => {

            //get course info
            let data = await FetchCourseById(courseid);

            if (data.success) {
                setCourse(data.CourseDetailed);
                console.log(data.CourseDetailed);
            } else {
                //somthing went wrong
                console.log("PROBLEM AT FETCHING COURSE with the id  :" + courseid + data.message);

                setError("PROBLEM AT FETCHING COURSE with the id  :" + courseid + data.message);
            }

            setCourseInfoLoadingstate(false);

        }
        const fetchCourseContents = async () => {


            //get course info
            let data = await GetCourseXContents(courseid);

            if (data.success) {
                setContentList(data.ContentList);
                setUserRole(data.UserRole);
                console.log(data)
                console.log(data.ContentList)
                console.log(ContentList)

            } else {
                //somthing went wrong
                console.log("PROBLEM AT FETCHING COURSE Contents list with the id  :" + courseid + data.message);

                setError("PROBLEM AT FETCHING COURSE Contents list with the id  :" + courseid + data.message);
            }


            setCourseContentLoadingstate(false);
        }



        fetchCourseData();
        fetchCourseContents();





    }, [CourseID])



    const SubscribeToCoursebtnClickEventHandler = async () => {
        await  handleSubscribe(courseid);
     }



    const HandleNavigatingToContentXPage = (e: any) => {
        //befor navigating to the content x page we need to 
        //             1) check if the user has permission
        //                       *if not navigate to Subscription page 
        //                       * if yes store content list in session storage then navigate to the content page

        let hasPermission: Boolean = UserRole?.role != "subscribed_student";
        if (hasPermission) {

            sessionStorage.setItem("ContentList", JSON.stringify(ContentList))



        } else {
            e.preventdefault();
            //Navigate to the subscription page of the course x
            //navigate("/Subscription/:CourseID")
        }


    }

    const HandleBackGroundClick = () => {

        //here we hide the modal 
        setModalIsOpen(false);

    }

    // Render error state
    if (Error) return <p>Error: {Error}</p>;






    const CourseInfoSection = CourseInfoLoadingstate ? (<h3>Course info is loading</h3>) :
        (
            <section className={styles.course_info_section}>

                <div className={styles.course_image_container}>
                    <img className={styles.course_image} src="/images/brainstorm-meeting.jpg" alt="course image" />
                </div>
                <div className={styles.course_info_container}>
                    <h2 className={`${styles.courseTitle} ${styles.course_field}`}>{Course!.courseinfo.courseTitle}</h2>
                    <p><span className={styles.course_field}>Teachers :</span>{Course?.teachers.map(x => x.teacherName).join(" and ")}</p>
                    <p><span className={styles.course_field}>Level Required :</span> {Course!.courseinfo.levelRequiredID ?? "not specified"}</p>
                    <p><span className={styles.course_field}>Fee per month :</span> {Course!.courseinfo.courseFeePerMonth}</p>
                    <p className={styles.course_description}>
                        {Course!.courseinfo.courseDescription}
                    </p>
                </div>

            </section>

        )


    const CourseContentPart = CourseContentLoadingstate ? (<h3>Course Content is loading</h3>) :
        (


            <section className={styles.course_contents_section} >
                <h3>Course Content          :</h3>
                <div className={styles.course_contents_container}>
                    <ul className={styles.content_list}>

                        {ContentList?.map(item => (
                            <li key={item.courseContentID}>
                                <Link to={`/Content/${item.courseContentID}`} onClick={HandleNavigatingToContentXPage}>

                                    {item.contentTitle}

                                </Link>
                            </li>
                        ))}


                    </ul>
                </div>
            </section >

        )






    const OptionSelectionStep = (

        <CourseOptionsMenu options={[
            { value: ModalSteps.EditCourseStep, label: "Edit Course Info" },
            { value: ModalSteps.AddContentStep, label: "Add New Content" },

        ]}
            onSelect={(op) => {

                SetModalCurrentStep(op)
            }}
        />

    );


    const EditCourseModalstep = (

        <>
            <Add_EditCourseModal mode={EntryMode.Edit} course={Course!} />
        </>

    );

    const AddContentModalstep = (

        <>
            <Add_EditContentModal courseId={Number(CourseID)} />

        </>

    );



    return (
        <div className={styles.main}>
            {/*<!-- Course Info -->*/}

            {CourseInfoSection}

            {/*<!-- Course Edit Section (for course teachers) -->*/}
            {
                UserRole?.role == "teacher" && (

                    <section className={styles.course_edit_section}>
                        <button className={styles.edit_btn}
                            onClick={() => {
                                SetModalCurrentStep(ModalSteps.OptionStep);
                                setModalIsOpen(true);

                            }}
                        > Edit</button>
                    </section>

                )
            }





            {/*<!-- Course Contents -->*/
                CourseContentPart
            }



            {/*<!-- Subscribe Section -->*/}
            {
                UserRole?.role == "new_student" && (
                    <section className={styles.subscribe_section} >
                        <button className={styles.subscribe_btn} onClick={SubscribeToCoursebtnClickEventHandler} >
                            Subscribe Now
                        </button>
                    </section>
                )
            }




            {
                ModalIsOpen && (
                    <div className={styles.ModalContainer}>
                        <div className={styles.overlay} onClick={HandleBackGroundClick}></div>
                        <div className={styles.ModalContent}>


                            {
                                (ModalCurrentStep === ModalSteps.OptionStep) && OptionSelectionStep
                            }

                            {
                                /*second step can be the Edit course info*/
                                (ModalCurrentStep === ModalSteps.EditCourseStep) && EditCourseModalstep
                            }

                            {   /*second step can be the Add content*/
                                (ModalCurrentStep === ModalSteps.AddContentStep) && AddContentModalstep
                            }



                        </div>


                    </div>
                )


            }





        </div>);








}

export default CourseContentsPage;