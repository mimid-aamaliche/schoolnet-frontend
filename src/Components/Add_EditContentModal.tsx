import React, { useState } from "react";
import styles from "./Add_EditContentModalStyle.module.css";
import { AddContent } from "../api/Content";
import * as UpChunk from '@mux/upchunk';


interface Add_EditContentModalProps {
    courseId: number;
    onSuccess?: () => void;
    onClose?: () => void;
}



function Add_EditContentModal({ courseId, onSuccess, onClose }: Add_EditContentModalProps) {
    const [contentTitle, setContentTitle] = useState("");
    const [description, setDescription] = useState("");
    const [notes, setNotes] = useState("");

    const [videoFile, setVideoFile] = useState<File | null>(null);
    const [loading, setLoading] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            if (!file.type.startsWith("video/")) {
                setError("Please select a valid video file.");
                return;
            }
            if (file.size > 200 * 1024 * 1024) {
                setError("File size must be under 200MB.");
                return;
            }
            setVideoFile(file);
            setError(null);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!contentTitle.trim()) {
            setError("Content title is required.");
            return;
        }
        if (!videoFile) {
            setError("Please select a video file.");
            return;
        }

        setLoading("Loading is at 0%");
        setError(null);

        const UploadFileToMuxServers = async (url: string) => {
            try {
                const upload = UpChunk.createUpload({
                    endpoint: url,
                    file: videoFile,
                    chunkSize: 5120,
                });

                upload.on('error', error => {
                    console.error("Upload failed:", error);
                    setLoading(null);
                    setSuccess(false);
                    setError("Upload failed: " + error);
                });

                upload.on('progress', (progress) => {
                    setLoading(`Loading is at ${Math.floor(progress.detail)}%`);
                    console.log(progress);
                });

                upload.on('success', () => {
                    console.log("Upload finished!");
                    setLoading(null);
                    setError(null);
                    setSuccess(true);

                    setContentTitle("");
                    setDescription("");
                    setNotes("");
                    setVideoFile(null);
                });
            } catch (error) {
                setLoading(null);
                setSuccess(false);
                setError("Upload failed: " + error);
            }
        };

        const CreateContentRecord = async () => {
            const response = await AddContent({
                contentType: "Video",
                courseID: courseId,
                contentTitle: contentTitle,
                description: description,
                notes: notes
            });

            if (response.success) {
                await UploadFileToMuxServers(response.Url);
            } else {
                setLoading(null);
                setSuccess(false);
                setError(response.message);
            }
        };

        await CreateContentRecord();

        if (onSuccess) onSuccess();
    };

    return (
        <div className={styles.modal}>
            {/* Header */}
            <div className={styles.modal__header}>
                <span className={styles.modal__title}>Add Content</span>
                {onClose && (
                    <button
                        type="button"
                        className={styles.modal__close}
                        onClick={onClose}
                        aria-label="Close"
                    >
                        ×
                    </button>
                )}
            </div>

            {/* Body */}
            <form className={styles.modal__body} onSubmit={handleSubmit}>

                {/* Content Type */}
                <div className={styles.field}>
                    <label className={styles.field__label}>Content Type</label>
                    <input
                        type="text"
                        value="Video"
                        readOnly
                        className={styles.field__input}
                    />
                </div>

                {/* Content Title */}
                <div className={styles.field}>
                    <label className={styles.field__label}>Content Title *</label>
                    <input
                        type="text"
                        value={contentTitle}
                        onChange={(e) => setContentTitle(e.target.value)}
                        required
                        className={styles.field__input}
                        placeholder="Enter content title"
                    />
                </div>

                {/* Description */}
                <div className={styles.field}>
                    <label className={styles.field__label}>Description</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className={styles.field__textarea}
                        placeholder="Enter a description (optional)"
                    />
                </div>

                {/* Notes */}
                <div className={styles.field}>
                    <label className={styles.field__label}>Notes</label>
                    <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className={styles.field__textarea}
                        placeholder="Enter notes (optional)"
                    />
                </div>

                {/* Video uploader */}
                <div className={styles.field}>
                    <label className={styles.field__label}>Video File *</label>
                    <input
                        type="file"
                        accept="video/*"
                        onChange={handleFileChange}
                        id="videoUpload"
                        hidden
                    />
                    <label
                        htmlFor="videoUpload"
                        className={styles.field__input}
                        style={{ cursor: "pointer", display: "flex", alignItems: "center", color: videoFile ? "inherit" : "var(--color-gray)" }}
                    >
                        {videoFile ? videoFile.name : "Click to select a video file"}
                    </label>
                </div>

                {/* Error message */}
                {error && (
                    <p style={{ color: "var(--color-red, #ff3b30)", fontSize: "13px", margin: 0 }}>
                        {error}
                    </p>
                )}

                {/* Success message */}
                {success && (
                    <p style={{ color: "var(--color-green, #34c759)", fontSize: "13px", margin: 0 }}>
                        Content created and video uploaded successfully!
                    </p>
                )}

                {/* Upload progress */}
                {loading && (
                    <p style={{ color: "var(--color-accent)", fontSize: "13px", margin: 0 }}>
                        {loading}
                    </p>
                )}

                {/* Footer buttons */}
                <div className={styles.modal__footer}>
                    {onClose && (
                        <button
                            type="button"
                            className={styles.btn__cancel}
                            onClick={onClose}
                            disabled={loading !== null}
                        >
                            Cancel
                        </button>
                    )}
                    <button
                        type="submit"
                        disabled={loading !== null}
                        className={styles.btn__submit}
                    >
                        {loading ? "Uploading..." : "Submit"}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default Add_EditContentModal;