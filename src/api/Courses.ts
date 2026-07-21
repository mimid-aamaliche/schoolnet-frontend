//get the api url and form the course endpoint
import { ApiURL } from "../api/ApiConf";
import { CourseHandlerDTO } from "./User";
const coursesEndpoint = `${ApiURL}Course`;

//the Course  interface
export interface Course {
    courseID: number;
    courseTitle: string;
    imagePath: string;
    courseFeePerMonth: number;
    courseDescription: string;
    levelRequiredID: number;
    numberOfStudents?: number; // Added optional field
}

export interface CourseDetailedDTO {

    courseinfo: Course;
    teachers: CourseHandlerDTO[];

}










interface FetchCourseByIDSuccess {
    success: true;
    CourseDetailed: CourseDetailedDTO;
}



interface FetchCourseByIDErrored {
    success: false;
    message: string;
}


type FetchCourseByIDResponse = FetchCourseByIDSuccess | FetchCourseByIDErrored;



//get course info by id
export async function FetchCourseById(id: number): Promise<FetchCourseByIDResponse> {

    try {
        //get the response
        const res = await fetch(`${coursesEndpoint}/${id}`,{credentials: 'include'});


        if (!res.ok) {

            const errorData = await res.json();
            return {
                success: false,
                message: errorData.message || " No Course was found"
            };

        }

        const data = await res.json();
        return {
            success: true,
            CourseDetailed: data
        };


    } catch (err: any) {
        return {
            success: false,
            message: err.message || "Network error"
        };

    }


}














interface FetchCoursesSuccess {
    success: true;
    Courses: Course[];
}



interface FetchCoursesErrored {
    success: false;
    message: string;
}


type FetchCoursesResponse = FetchCoursesSuccess | FetchCoursesErrored;


//get courses of user X modes are student or teacher
export async function FetchCoursesOfUserX(): Promise<FetchCoursesResponse> {

    try {
        //get the response
        const res = await fetch(`${coursesEndpoint}/My`,{credentials: 'include'});


        if (!res.ok) {

            const errorData = await res.json();
            return { success: false, message: errorData.message || "No Courses were found" };

        }

        const data: Course[] = await res.json();

        // Mock student data if missing ( for now lets keep it this way)
        const coursesWithStudents = data.map(course => ({
            ...course,
            numberOfStudents: course.numberOfStudents || Math.floor(Math.random() * (1500 - 50 + 1)) + 50
        }));

        return { success: true, Courses: coursesWithStudents };


    } catch (err: any) {
        return { success: false, message: err.message || "Network error" };

    }




}








//get all courses
export async function FetchAllCourses(): Promise<FetchCoursesResponse> {

    try {
        //get the response
        const res = await fetch(`${coursesEndpoint}/All`,{credentials: 'include'});


        if (!res.ok) {

            const errorData = await res.json();
            return {
                success: false
                , message: errorData.message || "No Courses were found"
            };

        }

        const data: Course[] = await res.json();

        // Mock student data if missing
        const coursesWithStudents = data.map(course => ({
            ...course,
            numberOfStudents: course.numberOfStudents || Math.floor(Math.random() * (2000 - 100 + 1)) + 100
        }));

        return {
            success: true
            , Courses: coursesWithStudents
        };


    } catch (err: any) {
        return {
            success: false
            , message: err.message || "Network error"
        };

    }

}







//ADD A NEW COURSE              :






export interface AddNewCourseDTO {
    courseTitle: string,
    courseDescription: string,
    courseFeePerMonth: number,
    levelRequiredID: number,
    imagePath: string
}



interface AddContentSuccess {
    success: true;
    course: Course;
}

interface AddNewCourseErrored {
    success: false;
    message: string;
}



type AddCourseResponse = AddContentSuccess | AddNewCourseErrored;




export async function AddCourse(NewCourse: AddNewCourseDTO): Promise<AddCourseResponse> {

    try {

        //get the response
        const res = await fetch(`${coursesEndpoint}/Add`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: 'include',
            body: JSON.stringify(NewCourse),
        });

        if (!res.ok) {

            const errorData = await res.json();
            return { success: false, message: errorData.message || "Somthing went wrong while adding the new course , please try again later" };

        }

        const data = await res.json();

        return {
            success: true,
            course: data.content,
        };



    } catch (err: any) {
        return {
            success: false,
            message: err.message || "Network error"
        };

    }

}
