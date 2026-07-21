import { useState } from "react";
import { AddCourse, CourseDetailedDTO } from "../api/Courses";
import styles from "./Add_EditCourseModalStyle.module.css";

export enum EntryMode {
    AddNew = 1,
    Edit = 2
}

interface AddCourseModalProps {
    mode: EntryMode.AddNew
    onSuccess?: () => void;
    onClose?: () => void; // Added to support the close button in CSS
}

interface EditCourseModalProps {
    mode: EntryMode.Edit;
    course: CourseDetailedDTO;
    onSuccess?: () => void;
    onClose?: () => void;
}

function Add_EditCourseModal(props: AddCourseModalProps | EditCourseModalProps) {
    const [courseTitle, setcourseTitle] = useState<string>(props.mode === EntryMode.Edit ? props.course.courseinfo.courseTitle : "");
    const [courseDescription, setcourseDescription] = useState<string>(props.mode === EntryMode.Edit ? props.course.courseinfo.courseDescription : "");
    const [courseFeePerMonth, setcourseFeePerMonth] = useState<number>(props.mode === EntryMode.Edit ? props.course.courseinfo.courseFeePerMonth : 0);
    const [levelRequiredID, setlevelRequiredID] = useState<number>(props.mode === EntryMode.Edit ? props.course.courseinfo.levelRequiredID : 0);
    const [CourseImageFile, setCourseImageFile] = useState<File | null>(null);

    const [loading, setLoading] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            if (!file.type.startsWith("image/")) {
                setError("Please select a valid image file.");
                return;
            }
            if (file.size > 20 * 1024 * 1024) {
                setError("File size must be under 20MB.");
                return;
            }
            setCourseImageFile(file);
            setError(null);
        }
    };

    const HandleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!courseTitle.trim()) {
            setError("course title is required.");
            return;
        }

        const create_course_record = async () => {
            const responce = await AddCourse({
                courseTitle: courseTitle,
                courseDescription: courseDescription,
                courseFeePerMonth: courseFeePerMonth,
                levelRequiredID: levelRequiredID,
                imagePath: ""
            });

            if (responce.success) {
                setLoading(null);
                setSuccess(true);
                setError(null);
            } else {
                setLoading(null);
                setSuccess(false);
                setError(responce.message);
            }
        }

        const update_course_record = async (id: number) => {
            // Not implemented yet
        }

        if (props.mode === EntryMode.AddNew) {
            await create_course_record();
        } else {
            await update_course_record(props.course.courseinfo.courseID);
        }

        if (props.onSuccess) props.onSuccess();
    }

    return (
        <div className={styles.modal}>
            {/* Header */}
            <div className={styles.modal__header}>
                <h2 className={styles.modal__title}>
                    {props.mode === EntryMode.Edit ? "Edit Course" : "Add New Course"}
                </h2>
                <button type="button" className={styles.modal__close} onClick={props.onClose}>
                    &times;
                </button>
            </div>

            <form onSubmit={HandleSubmit} className={styles.modal__body}>
                {/* Title */}
                <div className={styles.field}>
                    <label className={styles.field__label}>Course Title *</label>
                    <input
                        type="text"
                        value={courseTitle}
                        onChange={(e) => setcourseTitle(e.target.value)}
                        required
                        className={styles.field__input}
                        placeholder="e.g. Advanced Mathematics"
                    />
                </div>

                {/* Fees */}
                <div className={styles.field}>
                    <label className={styles.field__label}>Fees per month ($) *</label>
                    <input
                        type="number"
                        value={courseFeePerMonth}
                        onChange={(e) => setcourseFeePerMonth(Number(e.target.value))}
                        required
                        className={styles.field__input}
                    />
                </div>

                {/* Description */}
                <div className={styles.field}>
                    <label className={styles.field__label}>Description</label>
                    <textarea
                        value={courseDescription ?? ""}
                        onChange={(e) => setcourseDescription(e.target.value)}
                        className={styles.field__textarea}
                        placeholder="Describe the course content..."
                    />
                </div>

                {/* Image Upload - Using field logic as dropzone was not in the new CSS provided */}
                <div className={styles.field}>
                    <label className={styles.field__label}>Course Cover Image</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        id="courseImage"
                        className={styles.field__input} 
                        style={{ paddingTop: '8px' }} // Minor tweak for file input alignment
                    />
                </div>

                {error && <p style={{ color: 'var(--color-error)', fontSize: '14px' }}>{error}</p>}
                {success && (
                    <p style={{ color: 'var(--color-success)', fontSize: '14px' }}>
                        Course updated successfully!
                    </p>
                )}

                {/* Footer buttons */}
                <div className={styles.modal__footer}>
                    <button type="button" className={styles.btn__cancel} onClick={props.onClose}>
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading !== null}
                        className={styles.btn__submit}
                    >
                        {loading ? "Saving..." : (props.mode === EntryMode.Edit ? "Save Changes" : "Create Course")}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default Add_EditCourseModal;