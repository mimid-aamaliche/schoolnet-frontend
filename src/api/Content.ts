//get the api url and form the course content endpoint
import { ApiURL } from "../api/ApiConf";
const ContentsEndPoint = `${ApiURL}Content`;


//the Course  interface
export interface Content {
    courseContentID: number;
    contentTitle: string;
    contentType: string;
    description: string;
    dateOfRealease: string;
}



//we gonna need these to capture user permission and role in the front end 
export interface GuestPermissionOnCourse{
    role:"guest";
}

export interface NewStudentPermissionOnCourse {
  role: 'new_student';
}

export interface SubscribedStudentPermissionOnCourse {
  role: 'subscribed_student';
}

export interface TeacherPermissionsOnCourse{
    role: 'teacher';
}
//============================================================================





export interface Content_Detailed {
    courseContentID: number;
    contentTitle: string;
    contentType: string;
    description: string;
    dateOfRealease: string;
    notes: string,
    playBackID: string,
    assetID: string,
    assetStatus: string,
    courseID:number
}

interface FetchErrored {
    success: false;
    message: string;
}







export type UserRoleType=NewStudentPermissionOnCourse|SubscribedStudentPermissionOnCourse|TeacherPermissionsOnCourse|GuestPermissionOnCourse;


//****************** Content list related  stuff */
interface FetchContentByCourseIDSuccess {
    success: true;
    ContentList: Content[];
    UserRole:UserRoleType;
}

type FetchContentByCourseIDResponse = FetchContentByCourseIDSuccess | FetchErrored;

export async function GetCourseXContents(course_id: number): Promise<FetchContentByCourseIDResponse> {

    try {
        //get the response
        const res = await fetch(`${ContentsEndPoint}/${course_id}` ,{
            credentials: 'include'
        });


        if (!res.ok) {

            const errorData = await res.json();
            return { success: false, message: errorData.message || "No content was found" };

        }

        const data = await res.json();
        return {
            success: true,
            ContentList: data.contentList,
            UserRole:data.userRole
        };


    } catch (err: any) {
        return {
            success: false,
            message: err.message || "Network error"
        };

    }

}















//****************** Content x related  stuff */
interface FetchContentByIDSuccess {
    success: true;
    Content: Content_Detailed;
    signedurl: string;
}

type FetchContentByIDResponse = FetchContentByIDSuccess | FetchErrored;

export async function GetContentByID(Content_ID: number): Promise<FetchContentByIDResponse> {

    try {
        //get the response
        const res = await fetch(`${ContentsEndPoint}/ContentID/${Content_ID}`,{
            credentials: 'include'
        });

        console.log(res);
        if (!res.ok) {

            const errorData = await res.json();
            return { success: false, message: errorData.message || "No content was found" };

        }

        const data = await res.json();
        return {
            success: true,
            Content: data.content,
            signedurl: data.url
        };


    } catch (err: any) {
        return {
            success: false,
            message: err.message || "Network error"
        };

    }

}














export interface AddNewContentDTO {
    contentType: string,
    courseID: number,
    contentTitle: string,
    description: string,
    notes: string,
}

interface AddContentSuccess {
    success: true;
    Content: Content;
}

type AddContentResponse = AddContentSuccess | FetchErrored;

export async function AddContent(NewContent: AddNewContentDTO): Promise<AddContentResponse> {
    try {
        const res = await fetch(`${ContentsEndPoint}/Add`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: 'include',
            body: JSON.stringify(NewContent),
        });

        if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            return { success: false, message: errorData.message || "Failed to create content record" };
        }

        const data = await res.json();
        return {
            success: true,
            Content: data
        };
    } catch (err: any) {
        return {
            success: false,
            message: err.message || "Network error"
        };
    }
}


interface DirectUploadSuccess {
    success: true;
    Url: string;
    Content: Content;
}

type DirectUploadResponse = DirectUploadSuccess | FetchErrored;

export async function GetDirectUploadUrl(contentID: number): Promise<DirectUploadResponse> {
    try {
        const res = await fetch(`${ContentsEndPoint}/DirectUpload/${contentID}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: 'include',
        });

        if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            return { success: false, message: errorData.message || "Failed to generate upload URL" };
        }

        const data = await res.json();
        return {
            success: true,
            Url: data.url,
            Content: data.content_DTO
        };
    } catch (err: any) {
        return {
            success: false,
            message: err.message || "Network error"
        };
    }
}
















interface UploadVideoSuccess {
    success: true;

}

type UploadVideoResponse = UploadVideoSuccess | FetchErrored;

export async function UploadVideo(url: string, file: File): Promise<UploadVideoResponse> {

    try {




        //get the response
        const res = await fetch(`${url}`, {
            method: "put",
            headers: { "Content-Type": file.type },
            body: file,
        });

        if (!res.ok) {

            const errorData = await res.json();
            return { success: false, message: errorData.message || "No content was found" };

        }

        const data = await res.json();
        return {
            success: true
        };


    } catch (err: any) {
        return {
            success: false,
            message: err.message || "Network error"
        };

    }

}





export async function UploadVideo2(url: string
    , file: File
    , CallBack: (event: ProgressEvent<EventTarget>) => void
    , OnUploaded: (StatusCode: number) => void)

    : Promise<UploadVideoResponse> {

    return new Promise((resolve) => {


        const xhr = new XMLHttpRequest();
        xhr.open("put", url);

        //Configure the callback 
        xhr.upload.onprogress = CallBack;


        xhr.onload = () => {
            OnUploaded(xhr.status);

            if (xhr.status >= 200 && xhr.status < 300) {
                resolve({
                    success: true
                })

            } else {
                resolve({
                    success: false
                    , message: `HTTP ${xhr.status} : ${xhr.responseText||"network error"}`  
                })

            }



        }


        xhr.onerror=()=>{

            resolve({
                    success: false
                    ,message: (xhr.status + xhr.responseText)||"Network error"
                })

        }



        xhr.send(file);

    });



}









