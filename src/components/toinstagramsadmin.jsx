import React, { useState, useEffect } from "react";
import styles from "./ToinstagramsAdmin.module.css";

const ToinstagramsAdmin = () => {
    const [toinstagrams, setToinstagrams] = useState([]);
    const [newToinstagram, setNewToinstagram] = useState({
        toinstagram_name: "",
        toinstagram_link: "",
        toinstagram_image: null,
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [selectedToinstagram, setSelectedToinstagram] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [editIndex, setEditIndex] = useState(null);

    useEffect(() => {
        fetchToinstagrams();
    }, []);

    const fetchToinstagrams = async () => {
        try {
            const response = await fetch("https://trial-backend-dama.vercel.app/toinstagrams");
            const data = await response.json();
            setToinstagrams(data);
        } catch (error) {
            console.error("Error fetching toinstagrams:", error);
            setMessage("Failed to load toinstagrams.");
        }
    };

    const addToinstagram = async () => {
        if (!newToinstagram.toinstagram_name || !newToinstagram.toinstagram_image) {
            setMessage("Toinstagram name and image are required.");
            return;
        }

        if (newToinstagram.toinstagram_image.size > 5 * 1024 * 1024) {
            setMessage("Image size must be less than 5MB.");
            return;
        }

        if (!newToinstagram.toinstagram_image.type.startsWith("image/")) {
            setMessage("File type must be an image.");
            return;
        }

        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("toinstagram_name", newToinstagram.toinstagram_name);
            formData.append("toinstagram_link", newToinstagram.toinstagram_link);
            formData.append("toinstagram_image", newToinstagram.toinstagram_image);

            const response = await fetch("https://trial-backend-dama.vercel.app/toinstagrams", {
                method: "POST",
                body: formData,
            });

            if (response.ok) {
                setMessage("Toinstagram added successfully!");
                fetchToinstagrams();
                setNewToinstagram({
                    toinstagram_name: "",
                    toinstagram_link: "",
                    toinstagram_image: null,
                });
                setImagePreview(null);
                setShowForm(false);
                setEditIndex(null);
            } else {
                const errorData = await response.json();
                setMessage(`Failed to add toinstagram: ${errorData.error}`);
            }
        } catch (error) {
            console.error("Error adding toinstagram:", error);
            setMessage(`Failed to add toinstagram: ${error.message}`);
        }
        setLoading(false);
    };

    const updateToinstagram = async () => {
        if (!newToinstagram.toinstagram_name) {
            setMessage("Toinstagram name is required.");
            return;
        }

        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("toinstagram_name", newToinstagram.toinstagram_name);
            formData.append("toinstagram_link", newToinstagram.toinstagram_link);
            formData.append("toinstagram_image", newToinstagram.toinstagram_image);

            const response = await fetch(`https://trial-backend-dama.vercel.app/toinstagrams/${selectedToinstagram.id}`, {
                method: "PUT",
                body: formData,
            });

            if (response.ok) {
                setMessage("Toinstagram updated successfully!");
                fetchToinstagrams();
                setNewToinstagram({
                    toinstagram_name: "",
                    toinstagram_link: "",
                    toinstagram_image: null,
                });
                setSelectedToinstagram(null);
                setImagePreview(null);
                setShowForm(false);
                setEditIndex(null);
            } else {
                const errorData = await response.json();
                setMessage(`Failed to update toinstagram: ${errorData.error}`);
            }
        } catch (error) {
            console.error("Error updating toinstagram:", error);
            setMessage(`Failed to update toinstagram: ${error.message}`);
        }
        setLoading(false);
    };

    const deleteToinstagram = async (id) => {
        setLoading(true);
        try {
            const response = await fetch(`https://trial-backend-dama.vercel.app/toinstagrams/${id}`, { method: "DELETE" });
            if (response.ok) {
                setMessage("Toinstagram deleted successfully!");
                fetchToinstagrams();
            } else {
                const errorData = await response.json();
                setMessage(`Failed to delete toinstagram: ${errorData.error}`);
            }
        } catch (error) {
            console.error("Error deleting toinstagram:", error);
            setMessage("Failed to delete toinstagram.");
        }
        setLoading(false);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setNewToinstagram({ ...newToinstagram, toinstagram_image: file });
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result);
            reader.readAsDataURL(file);
        } else {
            setImagePreview(null);
        }
    };

    const handleUpload = () => {
        setNewToinstagram({ toinstagram_name: "", toinstagram_link: "", toinstagram_image: null });
        setSelectedToinstagram(null);
        setImagePreview(null);
        setShowForm(true);
        setEditIndex(null);
    };

    const handleEdit = (toinstagram, index) => {
        setSelectedToinstagram(toinstagram);
        setNewToinstagram({
            toinstagram_name: toinstagram.toinstagram_name,
            toinstagram_link: toinstagram.toinstagram_link,
            toinstagram_image: null,
        });
        setImagePreview(toinstagram.toinstagram_image);
        setEditIndex(index);
        setShowForm(true);
    };

    const handleCancelEdit = () => {
        setEditIndex(null);
        setShowForm(false);
    };

    return (
        <section className={styles.toinstagramsAdminContainer}>
            {message && <p className={`${styles.message} ${message.startsWith("Failed") ? styles.error : styles.success}`}>{message}</p>}
            <h2>Instagram</h2>

            <button onClick={handleUpload} className={styles.uploadButton}>Upload Instagram</button>

            {showForm && editIndex === null && (
                <form className={styles.toinstagramForm}>
                    <label htmlFor="toinstagramName">Instagram Name:</label>
                    <input
                        type="text"
                        id="toinstagramName"
                        placeholder="Instagram Name"
                        value={newToinstagram.toinstagram_name}
                        onChange={(e) => setNewToinstagram({ ...newToinstagram, toinstagram_name: e.target.value })}
                        className={styles.inputField}
                    />
                    <label htmlFor="toinstagramLink">Instagram Link:</label>
                    <input
                        type="text"
                        id="toinstagramLink"
                        placeholder="Instagram Link"
                        value={newToinstagram.toinstagram_link}
                        onChange={(e) => setNewToinstagram({ ...newToinstagram, toinstagram_link: e.target.value })}
                        className={styles.inputField}
                    />
                    <div className={styles.imageUploadContainer}>
                        <div className={styles.imageUploadBox}>
                            <input type="file" accept="image/*" onChange={handleImageChange} id="imageUpload" style={{ display: "none" }} />
                            <label htmlFor="imageUpload">Upload Image</label>
                        </div>
                        {imagePreview && <img src={imagePreview} alt="Preview" className={styles.imagePreview} />}
                    </div>
                    <button onClick={selectedToinstagram ? updateToinstagram : addToinstagram} disabled={loading} className={styles.actionButton}>
                        {loading ? (selectedToinstagram ? "Updating..." : "Adding...") : selectedToinstagram ? "Update Instagram" : "Add Instagram"}
                    </button>
                    <button onClick={() =>{ setShowForm(false); setEditIndex(null); }} className={styles.cancelButton}>Cancel</button>
                </form>
            )}

            <div className={styles.toinstagramList}>
                {toinstagrams.map((toinstagram, index) => (
                    <div key={toinstagram.id} className={styles.toinstagramItem}>
                        {editIndex === index ? (
                            <form className={`${styles.toinstagramForm} ${styles.editForm}`}>
                                <label htmlFor="editToinstagramName">Instagram Name:</label>
                                <input
                                    type="text"
                                    id="editToinstagramName"
                                    placeholder="Instagram Name"
                                    value={newToinstagram.toinstagram_name}
                                    onChange={(e) => setNewToinstagram({ ...newToinstagram, toinstagram_name: e.target.value })}
                                    className={styles.inputField}
                                />
                                <label htmlFor="editToinstagramLink">Instagram Link:</label>
                                <input
                                    type="text"
                                    id="editToinstagramLink"
                                    placeholder="Instagram Link"
                                    value={newToinstagram.toinstagram_link}
                                    onChange={(e) => setNewToinstagram({ ...newToinstagram, toinstagram_link: e.target.value })}
                                    className={styles.inputField}
                                />
                                <div className={styles.imageUploadContainer}>
                                    <div className={styles.imageUploadBox}>
                                        <input type="file" accept="image/*" onChange={handleImageChange} id="editImageUpload" style={{ display: "none" }} />
                                        <label htmlFor="editImageUpload">Upload Image</label>
                                    </div>
                                    {imagePreview && <img src={imagePreview} alt="Preview" className={styles.imagePreview} />}
                                </div>
                                <button onClick={updateToinstagram} disabled={loading} className={styles.actionButton}>
                                    {loading ? "Updating..." : "Update Instagram"}
                                </button>
                                <button onClick={handleCancelEdit} className={styles.cancelButton}>Cancel</button>
                            </form>
                        ) : (
                            <div className={styles.toinstagramContent}>
                                <img src={toinstagram.toinstagram_image} alt={toinstagram.toinstagram_name} className={styles.toinstagramImage} />
                                <div>
                                    <h2>{toinstagram.toinstagram_name}</h2>
                                    <p>{toinstagram.toinstagram_link}</p>
                                </div>
                                <div className={styles.toinstagramActions}>
                                    <button onClick={() => handleEdit(toinstagram, index)} className={styles.editButton}>Edit</button>
                                    <button onClick={() => deleteToinstagram(toinstagram.id)} disabled={loading} className={styles.deleteButton}>
                                        {loading ? "Deleting..." : "Delete"}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </section>
    );
};

export default ToinstagramsAdmin;