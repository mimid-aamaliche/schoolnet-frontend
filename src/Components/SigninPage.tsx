
import styles from "./SigninPageStyle.module.css"
import { AddPersonInterface, UserRole, StudentSignUp, TeacherSignUp } from "../api/Authentication";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

enum FormSteps {
    PersonalInfoStep = 1,
    RoleChoiceStep = 2,
    StudentInfoStep = 3,
    TeacherInfoStep = 4,
    AuthenticationIndo = 5
}

function SigninPage() {

    const [PersonalInfo, setPersonalInfo] = useState<AddPersonInterface>({
        nationalNumber: "",
        firstName: "",
        secondName: "",
        thirdName: "",
        forthName: "",
        image: "",
        dateOfBirth: "",
        email: "",
        phoneNumber: "",
        address: "",
    });
    const [UserName, setUserName] = useState<string>("");
    const [Password, setPassword] = useState<string>("");
    const [studentSpecificInfo, setstudentSpecificInfo] = useState({
        studentLevelID: 0,
    });

    const navigate = useNavigate();

    const [TeacherSpecificInfo, setTeacherSpecificInfo] = useState({
        teacherCV: "",
        notes: ""
    });
    const [role, setrole] = useState<UserRole>(UserRole.student);
    const [CurrentStep, setCurrentStep] = useState<FormSteps>(FormSteps.PersonalInfoStep);

    const HandleTextFieldChange = (e: any) => {
        const { name, value } = e.target;
        setPersonalInfo((prev) => ({ ...prev, [name]: value }));
    }

    const HandleTeacherInfoChange = (e: any) => {
        const { name, value } = e.target;
        setTeacherSpecificInfo((prev) => ({ ...prev, [name]: value }));
    }

    const setRoleSelection = (selectedRole: UserRole) => {
        setrole(selectedRole);
    }
    // ...
    // ...


    const HandlePrev_btnClick = () => {
        if (CurrentStep === FormSteps.AuthenticationIndo) {
            if (role === UserRole.student) setCurrentStep(prev => prev -= 2);
            else setCurrentStep(prev => prev -= 1);
        } else {
            if (CurrentStep === FormSteps.TeacherInfoStep) setCurrentStep(prev => prev -= 2);
            else setCurrentStep(prev => prev -= 1);
        }
    }

    const HandleNext_btnClick = () => {
        if (CurrentStep === FormSteps.RoleChoiceStep) {
            if (role === UserRole.student) setCurrentStep(prev => prev += 1);
            else setCurrentStep(prev => prev += 2);
        } else {
            if (CurrentStep === FormSteps.StudentInfoStep) setCurrentStep(prev => prev += 2);
            else setCurrentStep(prev => prev += 1);
        }
    }

    const SignUpProcess = async () => {
        if (role === UserRole.student) {
            const payload = { person: PersonalInfo, ...studentSpecificInfo, userName: UserName, password: Password }
            const res = await StudentSignUp(payload);
            if (res.success) {
                navigate("/Login");
            } else {
                alert(res.message);
            }
        } else {
            const payload = { person: PersonalInfo, ...TeacherSpecificInfo, userName: UserName, password: Password }
            const res = await TeacherSignUp(payload);
            if (res.success) {
                navigate("/Login");
            } else {
                alert(res.message);
            }
        }
    }

    // Helper to calculate active step for stepper UI
    const getActiveStepIndex = () => {
        if (CurrentStep === 1) return 1;
        if (CurrentStep === 2) return 2;
        // Step 3 (Student) and 4 (Teacher) are logically the "3rd" visualization step usually
        if (CurrentStep === 3 || CurrentStep === 4) return 3;
        if (CurrentStep === 5) return 4;
        return 1;
    };

    return (
        <section className={styles.section}>
            {/* Left Side: Premium Panel */}
            <div className={styles.side_image_container}>
                <div className={styles.brand}>SchoolNet</div>

                <div className={styles.testimonial_container}>
                    <p className={styles.quote}>
                        "Usage of SchoolNet has transformed how I manage my classroom. It's truly a game-changer for modern education."
                    </p>
                    <p className={styles.author}>- Sarah J., High School Teacher</p>
                </div>
            </div>

            {/* Right Side: Form */}
            <div className={styles.signup__container}>

                {/* Stepper */}
                <div className={styles.stepper_container}>
                    {[1, 2, 3, 4].map((step) => (
                        <div
                            key={step}
                            className={`${styles.step_indicator} ${getActiveStepIndex() >= step ? styles.step_completed : ''} ${getActiveStepIndex() === step ? styles.step_active : ''}`}
                        >
                            {step}
                        </div>
                    ))}
                </div>

                <form className={styles.form__tag} onSubmit={(e) => e.preventDefault()}>

                    {/* Step 1: Personal Info */}
                    {CurrentStep === FormSteps.PersonalInfoStep && (
                        <div className={styles.step_content}>
                            <h2 className={styles.form__step_title}>Let's get to know you</h2>

                            <div className={styles.form__field}>
                                <div className={styles.Horizantal_NameBoxes}>
                                    <input className={styles.input_field} type="text" name="firstName" value={PersonalInfo.firstName} onChange={HandleTextFieldChange} required placeholder="First Name" />
                                    <input className={styles.input_field} type="text" name="secondName" value={PersonalInfo.secondName} onChange={HandleTextFieldChange} required placeholder="Second Name" />
                                </div>
                                <div className={styles.Horizantal_NameBoxes} style={{ marginTop: '1rem' }}>
                                    <input className={styles.input_field} type="text" name="thirdName" value={PersonalInfo.thirdName} onChange={HandleTextFieldChange} placeholder="Third Name" />
                                    <input className={styles.input_field} type="text" name="forthName" value={PersonalInfo.forthName} onChange={HandleTextFieldChange} placeholder="Fourth Name" />
                                </div>
                            </div>

                            <div className={styles.form__field}>
                                <label className={styles.label_text}>Identity</label>
                                <input className={styles.input_field} type="text" name="nationalNumber" value={PersonalInfo.nationalNumber} onChange={HandleTextFieldChange} placeholder="National ID Number" />
                            </div>

                            <div className={styles.form__field}>
                                <label className={styles.label_text}>Contact Info</label>
                                <input className={styles.input_field} type="email" name="email" value={PersonalInfo.email} onChange={HandleTextFieldChange} required placeholder="Email Address" />
                                <input className={styles.input_field} type="text" name="phoneNumber" value={PersonalInfo.phoneNumber} onChange={HandleTextFieldChange} placeholder="Phone Number" style={{ marginTop: '0.5rem' }} />
                            </div>

                            <div className={styles.form__field}>
                                <label className={styles.label_text}>Date of Birth</label>
                                <input className={styles.input_field} type="date" name="dateOfBirth" value={PersonalInfo.dateOfBirth} onChange={HandleTextFieldChange} required />
                            </div>

                            <div className={styles.form__field}>
                                <label className={styles.label_text}>Address</label>
                                <input className={styles.input_field} type="text" name="address" value={PersonalInfo.address} onChange={HandleTextFieldChange} placeholder="City, Street, Building..." />
                            </div>
                        </div>
                    )}

                    {/* Step 2: Role Choice */}
                    {CurrentStep === FormSteps.RoleChoiceStep && (
                        <div className={styles.step_content}>
                            <h2 className={styles.form__step_title}>I am joining as a...</h2>

                            <div className={styles.role_selection_container}>
                                <div
                                    className={`${styles.role_card} ${role === UserRole.student ? styles.role_card_active : ''}`}
                                    onClick={() => setRoleSelection(UserRole.student)}
                                >
                                    <span className={styles.role_icon}>👨‍🎓</span>
                                    <div className={styles.role_title}>Student</div>
                                    <div className={styles.role_desc}>I want to learn and track my progress</div>
                                </div>

                                <div
                                    className={`${styles.role_card} ${role === UserRole.teacher ? styles.role_card_active : ''}`}
                                    onClick={() => setRoleSelection(UserRole.teacher)}
                                >
                                    <span className={styles.role_icon}>🧙‍♂️</span>
                                    <div className={styles.role_title}>Teacher</div>
                                    <div className={styles.role_desc}>I want to share knowledge and inspire</div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Student Info */}
                    {CurrentStep === FormSteps.StudentInfoStep && (
                        <div className={styles.step_content}>
                            <h2 className={styles.form__step_title}>Academic Details</h2>
                            <div className={styles.form__field}>
                                <label className={styles.label_text}>Current Educational Level</label>
                                <select className={styles.input_field} name="Levels" id="Levels">
                                    <option value="0">Not Specified</option>
                                    <option value="1">High School</option>
                                    <option value="2">College / University</option>
                                </select>
                            </div>
                        </div>
                    )}

                    {/* Step 4: Teacher Info */}
                    {CurrentStep === FormSteps.TeacherInfoStep && (
                        <div className={styles.step_content}>
                            <h2 className={styles.form__step_title}>Professional Details</h2>

                            <div className={styles.form__field}>
                                <label className={styles.label_text}>CV / Resume Link</label>
                                <input
                                    className={styles.input_field}
                                    type="text"
                                    name="teacherCV"
                                    value={TeacherSpecificInfo.teacherCV}
                                    onChange={HandleTeacherInfoChange}
                                    placeholder="Link to your CV (Drive, LinkedIn, etc.)"
                                />
                            </div>

                            <div className={styles.form__field}>
                                <label className={styles.label_text}>Professional Notes</label>
                                <textarea
                                    className={styles.input_field}
                                    name="notes"
                                    value={TeacherSpecificInfo.notes}
                                    onChange={HandleTeacherInfoChange}
                                    placeholder="Tell us about your specialization and experience..."
                                    style={{ minHeight: '100px', resize: 'vertical' }}
                                />
                            </div>
                        </div>
                    )}

                    {/* Step 5: Authentication */}
                    {CurrentStep === FormSteps.AuthenticationIndo && (
                        <div className={styles.step_content}>
                            <h2 className={styles.form__step_title}>Secure Your Account</h2>

                            <div className={styles.form__field}>
                                <label className={styles.label_text}>Username</label>
                                <input className={styles.input_field} type="text" value={UserName} required placeholder="Choose a username" onChange={(e) => setUserName(e.target.value)} />
                            </div>

                            <div className={styles.form__field}>
                                <label className={styles.label_text}>Password</label>
                                <input className={styles.input_field} type="password" value={Password} required placeholder="Choose a strong password" onChange={(e) => setPassword(e.target.value)} />
                            </div>

                            <div className={styles.form__field}>
                                <label className={styles.label_text}>Confirm Password</label>
                                <input className={styles.input_field} type="password" required placeholder="Confirm your password" />
                            </div>

                            <button type="button" className={`${styles.btn_next}`} style={{ width: '100%', marginTop: '2rem' }} onClick={SignUpProcess}>Compelete Registration</button>
                        </div>
                    )}

                    {/* Navigation Buttons (Hide on Auth step since it has its own submit) */}
                    {true && (
                        <div className={styles.nav_buttons}>
                            {CurrentStep > FormSteps.PersonalInfoStep ? (
                                <button type="button" className={styles.btn_prev} onClick={HandlePrev_btnClick}>Back</button>
                            ) : (
                                <div></div> /* Spacer */
                            )}

                            {CurrentStep !== FormSteps.AuthenticationIndo && (
                                <button type="button" className={styles.btn_next} onClick={HandleNext_btnClick}>Next Step</button>
                            )}
                        </div>
                    )}

                    <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
                        <Link to="/Login" style={{ color: 'var(--color-accent)', textDecoration: 'none', fontSize: '0.9rem' }}>
                            Already have an account? Log in
                        </Link>
                    </div>

                </form>
            </div>
        </section>
    );
}

export default SigninPage;