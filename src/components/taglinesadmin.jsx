import React, { useState, useEffect } from "react";
import styles from "./taglinesadmin.module.css";

const TaglinesAdmin = () => {
    const [taglines, setTaglines] = useState([]);
    const [newTagline, setNewTagline] = useState({
        tagline_title: "",
        tagline_subtitle: "",
        tagline_image: null,
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [selectedTagline, setSelectedTagline] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [editIndex, setEditIndex] = useState(null);

    useEffect(() => {
        fetchTaglines();
    }, []);

    const fetchTaglines = async () => {
        try {
            const response = await fetch("https://trial-backend-dama.vercel.app/taglines");
            const data = await response.json();
            setTaglines(data);
        } catch (error) {
            console.error("Error fetching taglines:", error);
            setMessage("Failed to load taglines.");
        }
    };

    const addTagline = async () => {
        if (!newTagline.tagline_title || !newTagline.tagline_image) {
            setMessage("Tagline title and image are required.");
            return;
        }

        if (newTagline.tagline_image.size > 5 * 1024 * 1024) {
            setMessage("Image size must be less than 5MB.");
            return;
        }

        if (!newTagline.tagline_image.type.startsWith("image/")) {
            setMessage("File type must be an image.");
            return;
        }

        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("tagline_title", newTagline.tagline_title);
            formData.append("tagline_subtitle", newTagline.tagline_subtitle);
            formData.append("tagline_image", newTagline.tagline_image);

            const response = await fetch("https://trial-backend-dama.vercel.app/taglines", {
                method: "POST",
                body: formData,
            });

            if (response.ok) {
                setMessage("Tagline added successfully!");
                fetchTaglines();
                setNewTagline({
                    tagline_title: "",
                    tagline_subtitle: "",
                    tagline_image: null,
                });
                setImagePreview(null);
                setShowForm(false);
                setEditIndex(null);
            } else {
                const errorData = await response.json();
                setMessage(`Failed to add tagline: ${errorData.error}`);
            }
        } catch (error) {
            console.error("Error adding tagline:", error);
            setMessage(`Failed to add tagline: ${error.message}`);
        }
        setLoading(false);
    };

    const updateTagline = async () => {
        if (!newTagline.tagline_title) {
            setMessage("Tagline title is required.");
            return;
        }

        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("tagline_title", newTagline.tagline_title);
            formData.append("tagline_subtitle", newTagline.tagline_subtitle);
            formData.append("tagline_image", newTagline.tagline_image);

            const response = await fetch(`https://trial-backend-dama.vercel.app/taglines/${selectedTagline.id}`, {
                method: "PUT",
                body: formData,
            });

            if (response.ok) {
                setMessage("Tagline updated successfully!");
                fetchTaglines();
                setNewTagline({
                    tagline_title: "",
                    tagline_subtitle: "",
                    tagline_image: null,
                });
                setSelectedTagline(null);
                setImagePreview(null);
                setShowForm(false);
                setEditIndex(null);
            } else {
                const errorData = await response.json();
                setMessage(`Failed to update tagline: ${errorData.error}`);
            }
        } catch (error) {
            console.error("Error updating tagline:", error);
            setMessage(`Failed to update tagline: ${error.message}`);
        }
        setLoading(false);
    };

    const deleteTagline = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this tagline?");
        if (!confirmDelete) return;

        setLoading(true);
        try {
            const response = await fetch(`https://trial-backend-dama.vercel.app/taglines/${id}`, { method: "DELETE" });
            if (response.ok) {
                setMessage("Tagline deleted successfully!");
                fetchTaglines();
            } else {
                const errorData = await response.json();
                setMessage(`Failed to delete tagline: ${errorData.error}`);
            }
        } catch (error) {
            console.error("Error deleting tagline:", error);
            setMessage("Failed to delete tagline.");
        }
        setLoading(false);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setNewTagline({ ...newTagline, tagline_image: file });
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result);
            reader.readAsDataURL(file);
        } else {
            setImagePreview(null);
        }
    };

    const handleUpload = () => {
        setNewTagline({ tagline_title: "", tagline_subtitle: "", tagline_image: null });
        setSelectedTagline(null);
        setImagePreview(null);
        setShowForm(true);
        setEditIndex(null);
    };

    const handleEdit = (tagline, index) => {
        setSelectedTagline(tagline);
        setNewTagline({
            tagline_title: tagline.tagline_title,
            tagline_subtitle: tagline.tagline_subtitle,
            tagline_image: null,
        });
        setImagePreview(tagline.tagline_image);
        setEditIndex(index);
        setShowForm(true);
    };

    return (
        <section className={styles.taglinesAdminContainer}>
            <h2>Taglines Admin</h2>
            {message && (
                <p className={`${styles.message} ${message.startsWith("Failed") ? styles.error : styles.success}`}>
                    {message}
                </p>
            )}

            <button onClick={handleUpload} className={styles.uploadButton}>Upload Tagline</button>

            {showForm && editIndex === null && (
                <form className={styles.taglineForm}>
                    <input
                        type="text"
                        placeholder="Tagline Title"
                        value={newTagline.tagline_title}
                        onChange={(e) => setNewTagline({ ...newTagline, tagline_title: e.target.value })}
                        className={styles.inputField}
                    />
                    <input
                        type="text"
                        placeholder="Tagline Subtitle"
                        value={newTagline.tagline_subtitle}
                        onChange={(e) => setNewTagline({ ...newTagline, tagline_subtitle: e.target.value })}
                        className={styles.inputField}
                    />
                    <div className={styles.imageUploadContainer}>
                        <div className={styles.imageUploadBox}>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                id="imageUpload"
                                style={{ display: "none" }}
                            />
                            <label htmlFor="imageUpload">Upload Image</label>
                        </div>
                        {imagePreview && <img src={imagePreview} alt="Preview" className={styles.imagePreview} />}
                    </div>

                    <button onClick={selectedTagline ? updateTagline : addTagline} disabled={loading} className={styles.actionButton}>
                        {loading
                            ? selectedTagline
                                ? "Updating..."
                                : "Adding..."
                            : selectedTagline
                                ? "Update Tagline"
                                : "Add Tagline"}
                    </button>
                    <button onClick={() => { setShowForm(false); setEditIndex(null); }} className={styles.cancelButton}>Cancel</button>
                </form>
            )}

            <div className={styles.taglineList}>
                {taglines.map((tagline, index) => (
                    <div key={tagline.id} className={styles.taglineItem}>
                        <div className={styles.taglineContent}>
                            <img src={tagline.tagline_image} alt={tagline.tagline_title} className={styles.taglineImage} />
                            <div>
                                <span>{tagline.tagline_title}</span>
                                <p>{tagline.tagline_subtitle}</p>
                            </div>
                        </div>
                        <div className={styles.taglineActions}>
                            <button onClick={() => handleEdit(tagline, index)} className={styles.actionButton}>Edit</button>
                            <button onClick={() => deleteTagline(tagline.id)} disabled={loading} className={styles.deleteButton}>Delete</button>
                        </div>
                        {showForm && editIndex === index && (
                            <form className={`${styles.taglineForm} ${styles.editForm}`}>
                                <input
                                    type="text"
                                    placeholder="Tagline Title"
                                    value={newTagline.tagline_title}
                                    onChange={(e) => setNewTagline({ ...newTagline, tagline_title: e.target.value })}
                                    className={styles.inputField}
                                />
                                <input
                                    type="text"
                                    placeholder="Tagline Subtitle"
                                    value={newTagline.tagline_subtitle}
                                    onChange={(e) => setNewTagline({ ...newTagline, tagline_subtitle: e.target.value })}
                                    className={styles.inputField}
                                />
                                <div className={styles.imageUploadContainer}>
                                    <div className={styles.imageUploadBox}>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            id="imageUpload"
                                            style={{ display: "none" }}
                                        />
                                        <label htmlFor="imageUpload">Upload Image</label>
                                    </div>
                                    {imagePreview && <img src={imagePreview} alt="Preview" className={styles.imagePreview} />}
                                </div>

                                <button onClick={updateTagline} disabled={loading} className={styles.actionButton}>
                                    {loading ? "Updating..." : "Update Tagline"}
                                </button>
                                <button onClick={() => { setShowForm(false); setEditIndex(null); }} className={styles.cancelButton}>Cancel</button>
                            </form>
                        )}
                    </div>
                ))}
            </div>
        </section>
    );
};

export default TaglinesAdmin;