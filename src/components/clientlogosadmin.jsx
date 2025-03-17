import React, { useState, useEffect } from "react";
import styles from "./clientlogosadmin.module.css";

const ClientlogosAdmin = () => {
    const [clientlogos, setClientlogos] = useState([]);
    const [newClientlogo, setNewClientlogo] = useState({
        clientlogo_name: "",
        clientlogo_link: "",
        clientlogo_image: null,
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [selectedClientlogo, setSelectedClientlogo] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [editIndex, setEditIndex] = useState(null);

    useEffect(() => {
        fetchClientlogos();
    }, []);

    const fetchClientlogos = async () => {
        try {
            const response = await fetch("https://trial-backend-dama.vercel.app/clientlogos");
            const data = await response.json();
            setClientlogos(data);
        } catch (error) {
            console.error("Error fetching clientlogos:", error);
            setMessage("Failed to load clientlogos.");
        }
    };

    const addClientlogo = async () => {
        if (!newClientlogo.clientlogo_name || !newClientlogo.clientlogo_image) {
            setMessage("Clientlogo name and image are required.");
            return;
        }

        if (newClientlogo.clientlogo_image.size > 5 * 1024 * 1024) {
            setMessage("Image size must be less than 5MB.");
            return;
        }

        if (!newClientlogo.clientlogo_image.type.startsWith("image/")) {
            setMessage("File type must be an image.");
            return;
        }

        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("clientlogo_name", newClientlogo.clientlogo_name);
            formData.append("clientlogo_link", newClientlogo.clientlogo_link);
            formData.append("clientlogo_image", newClientlogo.clientlogo_image);

            const response = await fetch("https://trial-backend-dama.vercel.app/clientlogos", {
                method: "POST",
                body: formData,
            });

            if (response.ok) {
                setMessage("Clientlogo added successfully!");
                fetchClientlogos();
                setNewClientlogo({
                    clientlogo_name: "",
                    clientlogo_link: "",
                    clientlogo_image: null,
                });
                setImagePreview(null);
                setShowForm(false);
                setEditIndex(null);
            } else {
                const errorData = await response.json();
                setMessage(`Failed to add clientlogo: ${errorData.error}`);
            }
        } catch (error) {
            console.error("Error adding clientlogo:", error);
            setMessage(`Failed to add clientlogo: ${error.message}`);
        }
        setLoading(false);
    };

    const updateClientlogo = async () => {
        if (!newClientlogo.clientlogo_name) {
            setMessage("Clientlogo name is required.");
            return;
        }

        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("clientlogo_name", newClientlogo.clientlogo_name);
            formData.append("clientlogo_link", newClientlogo.clientlogo_link);
            formData.append("clientlogo_image", newClientlogo.clientlogo_image);

            const response = await fetch(`https://trial-backend-dama.vercel.app/clientlogos/${selectedClientlogo.id}`, {
                method: "PUT",
                body: formData,
            });

            if (response.ok) {
                setMessage("Clientlogo updated successfully!");
                fetchClientlogos();
                setNewClientlogo({
                    clientlogo_name: "",
                    clientlogo_link: "",
                    clientlogo_image: null,
                });
                setSelectedClientlogo(null);
                setImagePreview(null);
                setShowForm(false);
                setEditIndex(null);
            } else {
                const errorData = await response.json();
                setMessage(`Failed to update clientlogo: ${errorData.error}`);
            }
        } catch (error) {
            console.error("Error updating clientlogo:", error);
            setMessage(`Failed to update clientlogo: ${error.message}`);
        }
        setLoading(false);
    };

    const deleteClientlogo = async (id) => {
        setLoading(true);
        try {
            const response = await fetch(`https://trial-backend-dama.vercel.app/clientlogos/${id}`, { method: "DELETE" });
            if (response.ok) {
                setMessage("Clientlogo deleted successfully!");
                fetchClientlogos();
            } else {
                const errorData = await response.json();
                setMessage(`Failed to delete clientlogo: ${errorData.error}`);
            }
        } catch (error) {
            console.error("Error deleting clientlogo:", error);
            setMessage("Failed to delete clientlogo.");
        }
        setLoading(false);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setNewClientlogo({ ...newClientlogo, clientlogo_image: file });
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result);
            reader.readAsDataURL(file);
        } else {
            setImagePreview(null);
        }
    };

    const handleUpload = () => {
        setNewClientlogo({ clientlogo_name: "", clientlogo_link: "", clientlogo_image: null });
        setSelectedClientlogo(null);
        setImagePreview(null);
        setShowForm(true);
        setEditIndex(null);
    };

    const handleEdit = (clientlogo, index) => {
        setSelectedClientlogo(clientlogo);
        setNewClientlogo({
            clientlogo_name: clientlogo.clientlogo_name,
            clientlogo_link: clientlogo.clientlogo_link,
            clientlogo_image: null,
        });
        setImagePreview(clientlogo.clientlogo_image);
        setEditIndex(index);
        setShowForm(true);
    };

    const handleCancelEdit = () => {
        setEditIndex(null);
        setShowForm(false);
    };

    return (
        <section className={styles.clientlogosAdminContainer}>
            {message && <p className={`${styles.message} ${message.startsWith("Failed") ? styles.error : styles.success}`}>{message}</p>}
            <h2>ClientLogos</h2>

            <button onClick={handleUpload} className={styles.uploadButton}>Upload Clientlogo</button>

            {showForm && editIndex === null && (
                <form className={styles.clientlogoForm}>
                    <label htmlFor="clientlogoName">Clientlogo Name:</label>
                    <input
                        type="text"
                        id="clientlogoName"
                        placeholder="Clientlogo Name"
                        value={newClientlogo.clientlogo_name}
                        onChange={(e) => setNewClientlogo({ ...newClientlogo, clientlogo_name: e.target.value })}
                        className={styles.inputField}
                    />
                    <label htmlFor="clientlogoLink">Clientlogo Link:</label>
                    <input
                        type="text"
                        id="clientlogoLink"
                        placeholder="Clientlogo Link"
                        value={newClientlogo.clientlogo_link}
                        onChange={(e) => setNewClientlogo({ ...newClientlogo, clientlogo_link: e.target.value })}
                        className={styles.inputField}
                    />
                    <div className={styles.imageUploadContainer}>
                        <div className={styles.imageUploadBox}>
                            <input type="file" accept="image/*" onChange={handleImageChange} id="imageUpload" style={{ display: "none" }} />
                            <label htmlFor="imageUpload">Upload Image</label>
                        </div>
                        {imagePreview && <img src={imagePreview} alt="Preview" className={styles.imagePreview} />}
                    </div>
                    <button onClick={selectedClientlogo ? updateClientlogo : addClientlogo} disabled={loading} className={styles.actionButton}>
                        {loading ? (selectedClientlogo ? "Updating..." : "Adding...") : selectedClientlogo ? "Update Clientlogo" : "Add Clientlogo"}
                    </button>
                    <button onClick={() => { setShowForm(false); setEdit(null); }} className={styles.cancelButton}>Cancel</button>
                </form>
            )}

            <div className={styles.clientlogoList}>
                {clientlogos.map((clientlogo, index) => (
                    <div key={clientlogo.id} className={styles.clientlogoItem}>
                        {editIndex === index ? (
                            <form className={`${styles.clientlogoForm} ${styles.editForm}`}>
                                <label htmlFor="editClientlogoName">Clientlogo Name:</label>
                                <input
                                    type="text"
                                    id="editClientlogoName"
                                    placeholder="Clientlogo Name"
                                    value={newClientlogo.clientlogo_name}
                                    onChange={(e) => setNewClientlogo({ ...newClientlogo, clientlogo_name: e.target.value })}
                                    className={styles.inputField}
                                />
                                <label htmlFor="editClientlogoLink">Clientlogo Link:</label>
                                <input
                                    type="text"
                                    id="editClientlogoLink"
                                    placeholder="Clientlogo Link"
                                    value={newClientlogo.clientlogo_link}
                                    onChange={(e) => setNewClientlogo({ ...newClientlogo, clientlogo_link: e.target.value })}
                                    className={styles.inputField}
                                />
                                <div className={styles.imageUploadContainer}>
                                    <div className={styles.imageUploadBox}>
                                        <input type="file" accept="image/*" onChange={handleImageChange} id="editImageUpload" style={{ display: "none" }} />
                                        <label htmlFor="editImageUpload">Upload Image</label>
                                    </div>
                                    {imagePreview && <img src={imagePreview} alt="Preview" className={styles.imagePreview} />}
                                </div>
                                <button onClick={updateClientlogo} disabled={loading} className={styles.actionButton}>
                                    {loading ? "Updating..." : "Update Clientlogo"}
                                </button>
                                <button onClick={handleCancelEdit} className={styles.cancelButton}>Cancel</button>
                            </form>
                        ) : (
                            <div className={styles.clientlogoContent}>
                                <img src={clientlogo.clientlogo_image} alt={clientlogo.clientlogo_name} className={styles.clientlogoImage} />
                                <div>
                                    <h2>{clientlogo.clientlogo_name}</h2>
                                    <p>{clientlogo.clientlogo_link}</p>
                                </div>
                                <div className={styles.clientlogoActions}>
                                    <button onClick={() => handleEdit(clientlogo, index)} className={styles.editButton}>Edit</button>
                                    <button onClick={() => deleteClientlogo(clientlogo.id)} disabled={loading} className={styles.deleteButton}>
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

export default ClientlogosAdmin;