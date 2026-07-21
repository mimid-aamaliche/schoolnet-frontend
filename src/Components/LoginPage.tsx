
import { useEffect, useState } from "react";
import { LogIn } from '../api/Authentication'

import styles from "./LoginPageStyle.module.css"
import { useNavigate } from "react-router-dom";


function LoginPage() {

    const [UserName, setUserName] = useState<string>("");
    const [Password, setPassword] = useState<string>("");
    const [Rememberme, setRememberme] = useState<boolean>(false);
    const [role, setrole] = useState<number>(1);
    const navigate = useNavigate();

    const handleToggle = () => {
        setrole((prev) => (prev === 1 ? 2 : 1));
    };

    const HandleLogInProcess = async () => {



        const result = await LogIn(UserName, Password, role);
        if (result.success) {

            //store user info in local storage
            localStorage.setItem("auth_token_expireAt", result.authenticationResponce.expireAt);
            localStorage.setItem("current_user", JSON.stringify({ currentuser: result.authenticationResponce.user }));

            //Go to the home page
            navigate("/Home");

        } else {
            //show an elert that the login failed
            alert(result.message);

            //TODO :
            //1)
            //add label to the login form with display non property
            //when we are here set that label to diplay block
            //and the text= message 
            //2)
            //still need to add tow radio buttons so the user can chose either a student or a teacher

        }






    }

    const GoToSignUpPage = () => {


        navigate("/Signin");

    }

    const handleSubmit = (e: any) => {
        e.preventDefault();
    }

    return (
        <section className={styles.login_section}>
            <div className={styles.login__container}>

                <form onSubmit={handleSubmit} className={styles.form__tag}>



                    <h3 className={styles.form__field}> Hello there Scholar  </h3>



                    <div className={styles.form__field}>
                        <label > Username{"     "}

                            <input type="text"
                                value={UserName}
                                placeholder="Enter Username"
                                onChange={(e) => setUserName(e.target.value)}
                            />

                        </label>
                    </div>



                    <div className={styles.form__field}>
                        <label > Password {"   "}

                            <input type="text"
                                value={Password}
                                placeholder="Enter password"
                                onChange={(e) => setPassword(e.target.value)}
                            />

                        </label>
                    </div>


                    <div className={`${styles.remember_me_fields} ${styles.form__field}`}>
                        <label>
                            <input type="checkbox"
                                checked={Rememberme}
                                onChange={(e) => setRememberme(e.target.checked)}
                            />
                            Remember me

                        </label>
                    </div>


                    <div className={`${styles.toggle_field} ${styles.form__field}`}>
                        <label className={styles.toggleLabel}>
                            <span>{role === 1 ? " Seeker" : " Mentor"}</span>
                            <button
                                type="button"
                                onClick={handleToggle}
                                className={styles.toggleBtn}
                            >
                                Switch to {role === 1 ? "Mentor" : "Seeker"}
                            </button>
                        </label>
                    </div>


                    <div className={`${styles.buttons} ${styles.form__field}`}>

                        <button type="submit" className={styles.button} id="Log_In_Btn" onClick={HandleLogInProcess}>Log in</button>
                        <button type="submit" className={styles.button} id="Sign_In_Btn" onClick={GoToSignUpPage}>SignIn</button>

                    </div>




                </form>





            </div>




        </section>



    )




}

export default LoginPage;