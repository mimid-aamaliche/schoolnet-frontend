//get the api url and form the course endpoint
import { ApiURL } from "../api/ApiConf";
import { CourseHandlerDTO } from "./User";
const coursesEndpoint = `${ApiURL}Course`;

// Course image action enum - matches backend CourseImageAction
export enum CourseImageAction {
    Unchanged = 0,
    Added = 1,
    Changed = 2,
    Deleted = 3,
}

// Create only ever allows these two - matches backend's explicit
// BadRequest rejection of Changed/Deleted in AddNewCourse.
export type CreateImageAction = CourseImageAction.Unchanged | CourseImageAction.Added;

// Response DTO for presigned MinIO upload URL
export interface CourseImageUploadDTO {
    uploadUrl: string;
    objectKey: string;
    httpMethod: string; // "PUT"
    requiredHeaders: Record<string, string>; // must be sent verbatim on the PUT to MinIO
    expiresAtUtc: string;
}

// Response shape for Add/Update course - imageUpload is present only
// when imageAction was Added or Changed; absent/null for Unchanged/Deleted.
export interface CourseSaveResponse {
    course: Course;
    imageUpload?: CourseImageUploadDTO | null;
}

//the Course  interface
export interface Course {
    courseID: number;
    courseTitle: string;
    imageUrl: string | null; // Presigned GET URL from backend, not raw object key
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






// Form data for creating a course - no imagePath/imageKey field, client cannot set image key directly
export interface AddCourseFormData {
    courseTitle: string;
    courseDescription: string;
    courseFeePerMonth: number;
    levelRequiredID: number;
}

// Form data for updating a course - no imagePath/imageKey field, client cannot set image key directly
export interface UpdateCourseFormData {
    courseTitle: string;
    courseDescription: string;
    courseFeePerMonth: number;
    levelRequiredID: number;
}

// Legacy interface kept for backward compatibility - DO NOT USE for new code
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

// Generic Result type for API responses
export interface Result<T> {
    success: boolean;
    data?: T;
    error?: string;
}




export async function AddCourseLegacy(NewCourse: AddNewCourseDTO): Promise<AddCourseResponse> {

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

// New AddCourse with MinIO image support - sends course fields + imageAction
// imageAction is restricted to CreateImageAction (Unchanged | Added) at the
// type level - do not widen this to accept Changed/Deleted, the backend
// rejects those with a 400 on this endpoint by design.
export async function AddCourse(
    payload: AddCourseFormData,
    imageAction: CreateImageAction,
    imageContentType?: string
): Promise<Result<CourseSaveResponse>> {
    try {
        const body: any = {
            ...payload,
            imageAction,
        };
        if (imageContentType !== undefined) {
            body.imageContentType = imageContentType;
        }

        const res = await fetch(`${coursesEndpoint}/Add`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: 'include',
            body: JSON.stringify(body),
        });

        if (!res.ok) {
            const errorData = await res.json();
            return { success: false, error: errorData.message || "Something went wrong while adding the new course" };
        }

        const data = await res.json();
        return { success: true, data };
    } catch (err: any) {
        return { success: false, error: err.message || "Network error" };
    }
}

export async function UpdateCourseLegacy(id: number, updatedCourse: AddNewCourseDTO): Promise<AddCourseResponse> {
    try {
        const res = await fetch(`${coursesEndpoint}/Update/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            credentials: 'include',
            body: JSON.stringify(updatedCourse),
        });

        if (!res.ok) {
            const errorData = await res.json();
            return { success: false, message: errorData.message || "Something went wrong while updating the course, please try again later" };
        }

        const data = await res.json();
        return {
            success: true,
            course: data,
        };
    } catch (err: any) {
        return {
            success: false,
            message: err.message || "Network error"
        };
    }
}

// New UpdateCourse with MinIO image support - PUT /api/Course/{id}
// All four CourseImageAction values are valid here (Unchanged/Added/Changed/Deleted).
export async function UpdateCourse(
    courseId: number,
    payload: UpdateCourseFormData,
    imageAction: CourseImageAction,
    imageContentType?: string
): Promise<Result<CourseSaveResponse>> {
    try {
        const body: any = {
            ...payload,
            id: courseId,
            imageAction,
        };
        if (imageContentType !== undefined) {
            body.imageContentType = imageContentType;
        }

        const res = await fetch(`${coursesEndpoint}/${courseId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            credentials: 'include',
            body: JSON.stringify(body),
        });

        if (!res.ok) {
            const errorData = await res.json();
            return { success: false, error: errorData.message || "Something went wrong while updating the course" };
        }

        const data = await res.json();
        return { success: true, data };
    } catch (err: any) {
        return { success: false, error: err.message || "Network error" };
    }
}

// Performs the actual direct-to-MinIO upload. Kept separate from AddCourse/UpdateCourse
// so the modal can show independent loading/error state for "saving the course" vs
// "uploading the image".
export async function UploadCourseImageToMinio(
    imageUpload: CourseImageUploadDTO,
    file: File
): Promise<Result<void>> {
    try {
        const response = await fetch(imageUpload.uploadUrl, {
            method: imageUpload.httpMethod, // "PUT"
            headers: imageUpload.requiredHeaders, // sent EXACTLY as received
            body: file, // raw file blob, NOT FormData
        });
        if (!response.ok) {
            return { success: false, error: `Image upload failed (${response.status})` };
        }
        return { success: true, data: undefined };
    } catch (err) {
        return { success: false, error: "Network error uploading image" };
    }
}
