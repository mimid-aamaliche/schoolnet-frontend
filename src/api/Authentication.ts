//get the api url and form the auth endpoint
import { ApiURL } from './ApiConf';

const AuthEndpoint = `${ApiURL}Auth`;

export enum UserRole {
    student = 1,
    teacher = 2
}


//Log in function
//it takes the username password mode
//return the AuthResponse(token,userid,fullname,mode)


export interface user {


    mode: number;
    userid: number;
    fullName: string;



}

export interface authentication_dto {

    expireAt: string;
    user: user;



}




interface LogInSuccess {
    success: true;
    authenticationResponce: authentication_dto;
}



interface LogInErrored {
    success: false;
    message: string;
}


type LogInResponse = LogInSuccess | LogInErrored;








export async function LogIn(Inputusername: string, Inputpassword: string, Entrymode: number): Promise<LogInResponse> {

    try {
        //get the response
        const res = await fetch(`${AuthEndpoint}/login`, {
            method: "POST",
            credentials: 'include',
            headers: {
                "Content-Type": "application/json"
            }, body: JSON.stringify({
                mode: Entrymode,
                username: `${Inputusername}`,
                password: `${Inputpassword}`
            })
        });

        if (!res.ok) {

            const errorData = await res.json();
            return {
                success: false
                , message: errorData.message || "Login failed"
            };

        }

        const data = await res.json();
        return { success: true, authenticationResponce: data };


    } catch (err: any) {
        return { success: false, message: err.message || "Network error" };

    }







}




export interface AddPersonInterface {

    nationalNumber: string,
    firstName: string,
    secondName: string,
    thirdName: string,
    forthName: string,
    image: string,
    dateOfBirth: string,
    email: string,
    phoneNumber: string,
    address: string,



}

export interface AddStudentInterface {



    userName: string,
    password: string,
    studentLevelID: number,
    person: AddPersonInterface;

}


interface StudentSignUpSuccess {
    success: true;
    user: user;
}

//we gonne get the stripe connected account url to finalise the sign up
interface TeacherSignUpSuccess {
    success: true;
    user: user;
}


interface SignUpErrored {
    success: false;
    message: string;
}


type StudentSignUpResponse = StudentSignUpSuccess | SignUpErrored;

type TeacherSignUpResponse = TeacherSignUpSuccess | SignUpErrored;





export async function StudentSignUp(AddStudentDTO: AddStudentInterface): Promise<StudentSignUpResponse> {

    try {
        //get the response
        const res = await fetch(`${AuthEndpoint}/StudentSignUp`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            }, body: JSON.stringify(AddStudentDTO)
        });

        if (!res.ok) {

            const errorData = await res.json();
            return { success: false, message: errorData.message || "sign up failed" };

        }

        const data = await res.json();
        return { success: true, user: data };


    } catch (err: any) {
        return { success: false, message: err.message || "Network error" };

    }







}




export interface AddTeacherInterface {



    userName: string,
    password: string,
    teacherCV: string,
    notes: string,


    person: AddPersonInterface;

}





export async function TeacherSignUp(AddTeacherDTO: AddTeacherInterface): Promise<TeacherSignUpResponse> {

    try {
        //get the response
        const res = await fetch(`${AuthEndpoint}/TeacherSignUp`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            }, body: JSON.stringify(AddTeacherDTO)
        });

        if (!res.ok) {

            const errorData = await res.json();
            return { success: false, message: errorData.message || "sign up failed" };

        }

        const data = await res.json();
        return { success: true, user: data };


    } catch (err: any) {
        return { success: false, message: err.message || "Network error" };

    }







}




//sign in function
//takes the user dto filled with the information needed
//returns the userdto and a endpoint to get the detailed info of the user


