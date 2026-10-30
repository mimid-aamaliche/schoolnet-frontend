import { useState, useEffect } from "react";
import { AddCourse, UpdateCourse, CourseDetailedDTO, CourseImageAction, CreateImageAction, UploadCourseImageToMinio, AddCourseFormData, UpdateCourseFormData } from "../api/Courses";
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

// Image UI state machine
type ImageUiState =
    | { kind: "unchanged" }
    | { kind: "existing"; url: string }
    | { kind: "newFile"; file: File; previewUrl: string }
    | { kind: "markedForDeletion" };

function Add_EditCourseModal(props: AddCourseModalProps | EditCourseModalProps) {
    const isEditMode = props.mode === EntryMode.Edit;
    const courseId = isEditMode ? props.course.courseinfo.courseID : 0;

    const [courseTitle, setcourseTitle] = useState<string>(isEditMode ? props.course.courseinfo.courseTitle : "");
    const [courseDescription, setcourseDescription] = useState<string>(isEditMode ? props.course.courseinfo.courseDescription : "");
    const [courseFeePerMonth, setcourseFeePerMonth] = useState<number>(isEditMode ? props.course.courseinfo.courseFeePerMonth : 0);
    const [levelRequiredID, setlevelRequiredID] = useState<number>(isEditMode ? props.course.courseinfo.levelRequiredID : 0);
    
    // Image state - initialized differently for add vs edit mode
    const [imageState, setImageState] = useState<ImageUiState>(() => {
        if (isEditMode && props.course.courseinfo.imageUrl) {
            return { kind: "existing", url: props.course.courseinfo.imageUrl };
        }
        return { kind: "unchanged" };
    });

    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    // Cleanup object URLs on unmount to avoid memory leaks
    useEffect(() => {
        return () => {
            if (imageState.kind === "newFile") {
                URL.revokeObjectURL(imageState.previewUrl);
            }
        };
    }, [imageState]);

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
            
            // Revoke previous preview URL if exists
            if (imageState.kind === "newFile") {
                URL.revokeObjectURL(imageState.previewUrl);
            }
            
            const previewUrl = URL.createObjectURL(file);
            setImageState({ kind: "newFile", file, previewUrl });
            setError(null);
        }
    };

    const handleRemoveImage = () => {
        if (imageState.kind === "newFile") {
            URL.revokeObjectURL(imageState.previewUrl);
        }
        setImageState({ kind: "markedForDeletion" });
    };

    const handleUndoRemoveImage = () => {
        if (isEditMode && props.course.courseinfo.imageUrl) {
            setImageState({ kind: "existing", url: props.course.courseinfo.imageUrl });
        } else {
            setImageState({ kind: "unchanged" });
        }
    };

    const HandleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!courseTitle.trim()) {
            setError("Course title is required.");
            return;
        }

        setSaving(true);
        setError(null);

        const formData: AddCourseFormData | UpdateCourseFormData = {
            courseTitle,
            courseDescription,
            courseFeePerMonth,
            levelRequiredID,
        };

        const contentType = imageState.kind === "newFile" ? imageState.file.type : undefined;

        let saveResult: Awaited<ReturnType<typeof AddCourse | typeof UpdateCourse>>;

        if (isEditMode) {
            // All four actions are valid on update.
            const imageAction: CourseImageAction =
                imageState.kind === "newFile" ? CourseImageAction.Changed
                : imageState.kind === "markedForDeletion" ? CourseImageAction.Deleted
                : CourseImageAction.Unchanged;

            saveResult = await UpdateCourse(courseId, formData as UpdateCourseFormData, imageAction, contentType);
        } else {
            // Only Unchanged/Added are reachable here because Add mode's UI never
            // produces an "existing" or "markedForDeletion" state.
            const imageAction: CreateImageAction =
                imageState.kind === "newFile" ? CourseImageAction.Added : CourseImageAction.Unchanged;

            saveResult = await AddCourse(formData as AddCourseFormData, imageAction, contentType);
        }

        if (!saveResult.success) {
            setSaving(false);
            setError(saveResult.error || "Failed to save course");
            return;
        }

        // Course fields are now saved. If an image was added/changed,
        // do the second step: upload the actual bytes directly to MinIO.
        if (imageState.kind === "newFile" && saveResult.data?.imageUpload) {
            const uploadResult = await UploadCourseImageToMinio(
                saveResult.data.imageUpload,
                imageState.file
            );
            if (!uploadResult.success) {
                // Course was already saved successfully — don't roll that back. Just surface
                // that the image specifically failed, and let the user retry the image only.
                setSaving(false);
                setError("Course saved, but the image upload failed. Please try again.");
                return;
            }
        }

        setSaving(false);
        setSuccess(true);
        
        // Cleanup preview URL on success
        if (imageState.kind === "newFile") {
            URL.revokeObjectURL(imageState.previewUrl);
        }

        if (props.onSuccess) props.onSuccess();
    };

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

                {/* Image Upload */}
                <div className={styles.field}>
                    <label className={styles.field__label}>Course Cover Image</label>
                    
                    {/* Show existing image in edit mode */}
                    {isEditMode && imageState.kind === "existing" && (
                        <div style={{ marginBottom: '10px' }}>
                            <img 
                                src={imageState.url} 
                                alt="Current course image" 
                                style={{ maxWidth: '200px', maxHeight: '150px', objectFit: 'cover' }}
                            />
                            <button
                                type="button"
                                onClick={handleRemoveImage}
                                style={{ marginLeft: '10px', padding: '5px 10px', cursor: 'pointer' }}
                            >
                                Remove Image
                            </button>
                        </div>
                    )}

                    {/* Show new file preview */}
                    {imageState.kind === "newFile" && (
                        <div style={{ marginBottom: '10px' }}>
                            <img 
                                src={imageState.previewUrl} 
                                alt="New course image preview" 
                                style={{ maxWidth: '200px', maxHeight: '150px', objectFit: 'cover' }}
                            />
                            <button
                                type="button"
                                onClick={() => {
                                    URL.revokeObjectURL(imageState.previewUrl);
                                    if (isEditMode && props.course.courseinfo.imageUrl) {
                                        setImageState({ kind: "existing", url: props.course.courseinfo.imageUrl });
                                    } else {
                                        setImageState({ kind: "unchanged" });
                                    }
                                }}
                                style={{ marginLeft: '10px', padding: '5px 10px', cursor: 'pointer' }}
                            >
                                Clear
                            </button>
                        </div>
                    )}

                    {/* Show marked for deletion state */}
                    {isEditMode && imageState.kind === "markedForDeletion" && (
                        <div style={{ marginBottom: '10px' }}>
                            <span style={{ color: 'var(--color-error)' }}>Image will be removed</span>
                            <button
                                type="button"
                                onClick={handleUndoRemoveImage}
                                style={{ marginLeft: '10px', padding: '5px 10px', cursor: 'pointer' }}
                            >
                                Undo
                            </button>
                        </div>
                    )}

                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        id="courseImage"
                        className={styles.field__input} 
                        style={{ paddingTop: '8px' }}
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
                        disabled={saving}
                        className={styles.btn__submit}
                    >
                        {saving ? "Saving..." : (isEditMode ? "Save Changes" : "Create Course")}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default Add_EditCourseModal;