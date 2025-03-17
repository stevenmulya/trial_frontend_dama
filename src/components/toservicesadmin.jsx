import React, { useState, useEffect } from "react";
import styles from "./toservicesadmin.module.css";

const ToservicesAdmin = () => {
    const [toservices, setToservices] = useState([]);
    const [editedToservice, setEditedToservice] = useState({
        toservice_subtitle: "",
        toservice_image: null,
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [selectedToservice, setSelectedToservice] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    useEffect(() => {
        fetchToservices();
    }, []);

    const fetchToservices = async () => {
        try {
            const response = await fetch("https://trial-backend-dama.vercel.app/toservices");
            const data = await response.json();
            setToservices(data);
        } catch (error) {
            console.error("Error fetching toservices:", error);
            setMessage("Failed to load toservices.");
        }
    };

    const updateToservice = async () => {
        if (!editedToservice.toservice_subtitle) {
            setMessage("Subtitle is required.");
            return;
        }

        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("toservice_subtitle", editedToservice.toservice_subtitle);
            formData.append("toservice_image", editedToservice.toservice_image);

            const response = await fetch(`https://trial-backend-dama.vercel.app/toservices/${selectedToservice.id}`, {
                method: "PUT",
                body: formData,
            });

            if (response.ok) {
                setMessage("Toservice updated successfully!");
                fetchToservices();
                setSelectedToservice(null);
                setImagePreview(null);
            } else {
                const errorData = await response.json();
                setMessage(`Failed to update toservice: ${errorData.error}`);
            }
        } catch (error) {
            console.error("Error updating toservice:", error);
            setMessage(`Failed to update toservice: ${error.message}`);
        }
        setLoading(false);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setEditedToservice({ ...editedToservice, toservice_image: file });
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result);
            reader.readAsDataURL(file);
        } else {
            setImagePreview(null);
        }
    };

    const handleEdit = (toservice) => {
        setSelectedToservice(toservice);
        setEditedToservice({
            toservice_subtitle: toservice.toservice_subtitle,
            toservice_image: null,
        });
        setImagePreview(toservice.toservice_image);
    };

    return (
        <section className={styles.toservicesAdmin}>
            <h2>Toservices Admin</h2>
            {message && <p className={`${styles.message} ${message.startsWith("Failed") ? styles.error : styles.success}`}>{message}</p>}

            <div className={styles.toserviceList}>
                {toservices.map((toservice) => (
                    <div key={toservice.id} className={styles.toserviceItem}>
                        <img src={toservice.toservice_image} alt={toservice.toservice_subtitle} className={styles.toserviceImage} />
                        <h2>{toservice.toservice_subtitle}</h2>
                        <div className={styles.toserviceActions}>
                            <button onClick={() => handleEdit(toservice)} className={styles.editButton}>Edit</button>
                        </div>
                        {selectedToservice && selectedToservice.id === toservice.id && (
                            <div className={styles.toserviceForm}>
                                <label htmlFor="toserviceSubtitle">Toservice Subtitle:</label>
                                <input
                                    type="text"
                                    id="toserviceSubtitle"
                                    placeholder="Toservice Subtitle"
                                    value={editedToservice.toservice_subtitle}
                                    onChange={(e) => setEditedToservice({ ...editedToservice, toservice_subtitle: e.target.value })}
                                    className={styles.inputField}
                                />
                                <div className={styles.imageUploadContainer}>
                                    <input type="file" accept="image/*" onChange={handleImageChange} id="imageUpload" style={{ display: "none" }} />
                                    <label htmlFor="imageUpload" className={styles.imageUploadLabel}>Upload Image</label>
                                    {imagePreview && <img src={imagePreview} alt="Preview" className={styles.imagePreview} />}
                                </div>
                                <button onClick={updateToservice} disabled={loading} className={styles.actionButton}>
                                    {loading ? "Updating..." : "Update Toservice"}
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </section>
    );
};

export default ToservicesAdmin;