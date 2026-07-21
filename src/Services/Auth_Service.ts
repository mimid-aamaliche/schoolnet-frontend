
import {user} from '../api/Authentication'








export function getCurrentUser():user|null{

    if (typeof window === "undefined" || typeof localStorage === "undefined") return null;

    const current_user_data_raw=localStorage.getItem("current_user");
    if(current_user_data_raw===null){
        //this means the user is not loged in
        return null;
    }else{
        return JSON.parse(current_user_data_raw).currentuser as user;
    }


}

export function CurrentTokenIsValide():boolean{
    const auth_token_expireAt=GetTokenExpireAtDate();
    if(auth_token_expireAt===null){

        //this means the user is not loged in
        return false;
    }else{
        //if false : the user token is expired
        return new Date(auth_token_expireAt) > (new Date());
    }

}

export function getToken():string|null{

    if (typeof window === "undefined" || typeof localStorage === "undefined") return null;

    return localStorage.getItem("auth_token");

}

export function GetTokenExpireAtDate():string|null{

    if (typeof window === "undefined" || typeof localStorage === "undefined") return null;

    return localStorage.getItem("auth_token_expireAt");

}
