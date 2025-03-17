import React, { useState, useEffect } from "react";
import styles from "./testimonialsadmin.module.css";

const TestimonialsAdmin = () => {
    const [testimonials, setTestimonials] = useState([]);
    const [newTestimonial, setNewTestimonial] = useState({
        testimonial_text: "",
        testimonial_name: "",
        testimonial_image: null,
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [selectedTestimonial, setSelectedTestimonial] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [editIndex, setEditIndex] = useState(null);

    useEffect(() => {
        fetchTestimonials();
    }, []);

    const fetchTestimonials = async () => {
        try {
            const response = await fetch("https://trial-backend-dama.vercel.app/testimonials");
            const data = await response.json();
            setTestimonials(data);
        } catch (error) {
            console.error("Error fetching testimonials:", error);
            setMessage("Failed to load testimonials.");
        }
    };

    const addTestimonial = async () => {
        if (!newTestimonial.testimonial_text || !newTestimonial.testimonial_image) {
            setMessage("Testimonial text and image are required.");
            return;
        }

        if (newTestimonial.testimonial_image.size > 5 * 1024 * 1024) {
            setMessage("Image size must be less than 5MB.");
            return;
        }

        if (!newTestimonial.testimonial_image.type.startsWith("image/")) {
            setMessage("File type must be an image.");
            return;
        }

        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("testimonial_text", newTestimonial.testimonial_text);
            formData.append("testimonial_name", newTestimonial.testimonial_name);
            formData.append("testimonial_image", newTestimonial.testimonial_image);

            const response = await fetch("https://trial-backend-dama.vercel.app/testimonials", {
                method: "POST",
                body: formData,
            });

            if (response.ok) {
                setMessage("Testimonial added successfully!");
                fetchTestimonials();
                setNewTestimonial({
                    testimonial_text: "",
                    testimonial_name: "",
                    testimonial_image: null,
                });
                setImagePreview(null);
                setShowForm(false);
                setEditIndex(null);
            } else {
                const errorData = await response.json();
                setMessage(`Failed to add testimonial: ${errorData.error}`);
            }
        } catch (error) {
            console.error("Error adding testimonial:", error);
            setMessage(`Failed to add testimonial: ${error.message}`);
        }
        setLoading(false);
    };

    const updateTestimonial = async () => {
        if (!newTestimonial.testimonial_text) {
            setMessage("Testimonial text is required.");
            return;
        }

        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("testimonial_text", newTestimonial.testimonial_text);
            formData.append("testimonial_name", newTestimonial.testimonial_name);
            formData.append("testimonial_image", newTestimonial.testimonial_image);

            const response = await fetch(`https://trial-backend-dama.vercel.app/testimonials/${selectedTestimonial.id}`, {
                method: "PUT",
                body: formData,
            });

            if (response.ok) {
                setMessage("Testimonial updated successfully!");
                fetchTestimonials();
                setNewTestimonial({
                    testimonial_text: "",
                    testimonial_name: "",
                    testimonial_image: null,
                });
                setSelectedTestimonial(null);
                setImagePreview(null);
                setShowForm(false);
                setEditIndex(null);
            } else {
                const errorData = await response.json();
                setMessage(`Failed to update testimonial: ${errorData.error}`);
            }
        } catch (error) {
            console.error("Error updating testimonial:", error);
            setMessage(`Failed to update testimonial: ${error.message}`);
        }
        setLoading(false);
    };

    const deleteTestimonial = async (id) => {
        setLoading(true);
        try {
            const response = await fetch(`https://trial-backend-dama.vercel.app/testimonials/${id}`, { method: "DELETE" });
            if (response.ok) {
                setMessage("Testimonial deleted successfully!");
                fetchTestimonials();
            } else {
                const errorData = await response.json();
                setMessage(`Failed to delete testimonial: ${errorData.error}`);
            }
        } catch (error) {
            console.error("Error deleting testimonial:", error);
            setMessage("Failed to delete testimonial.");
        }
        setLoading(false);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setNewTestimonial({ ...newTestimonial, testimonial_image: file });
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result);
            reader.readAsDataURL(file);
        } else {
            setImagePreview(null);
        }
    };

    const handleUpload = () => {
        setNewTestimonial({ testimonial_text: "", testimonial_name: "", testimonial_image: null });
        setSelectedTestimonial(null);
        setImagePreview(null);
        setShowForm(true);
        setEditIndex(null);
    };

    const handleEdit = (testimonial, index) => {
        setSelectedTestimonial(testimonial);
        setNewTestimonial({
            testimonial_text: testimonial.testimonial_text,
            testimonial_name: testimonial.testimonial_name,
            testimonial_image: null,
        });
        setImagePreview(testimonial.testimonial_image);
        setEditIndex(index);
        setShowForm(true);
    };

    const handleCancelEdit = () => {
        setEditIndex(null);
        setShowForm(false);
    };

    return (
        <section className={styles.testimonialsAdminContainer}>
            {message && <p className={`${styles.message} ${message.startsWith("Failed") ? styles.error : styles.success}`}>{message}</p>}
            <h2>Testimonials</h2>

            <button onClick={handleUpload} className={styles.uploadButton}>Upload Testimonial</button>

            {showForm && editIndex === null && (
                <form className={styles.testimonialForm}>
                    <label htmlFor="testimonialText">Testimonial Text:</label>
                    <textarea
                        id="testimonialText"
                        placeholder="Testimonial Text"
                        value={newTestimonial.testimonial_text}
                        onChange={(e) => setNewTestimonial({ ...newTestimonial, testimonial_text: e.target.value })}
                        className={styles.inputField}
                    />
                    <label htmlFor="testimonialName">Testimonial Name:</label>
                    <input
                        type="text"
                        id="testimonialName"
                        placeholder="Testimonial Name"
                        value={newTestimonial.testimonial_name}
                        onChange={(e) => setNewTestimonial({ ...newTestimonial, testimonial_name: e.target.value })}
                        className={styles.inputField}
                    />
                    <div className={styles.imageUploadContainer}>
                        <div className={styles.imageUploadBox}>
                            <input type="file" accept="image/*" onChange={handleImageChange} id="imageUpload" style={{ display: "none" }} />
                            <label htmlFor="imageUpload">Upload Image</label>
                        </div>
                        {imagePreview && <img src={imagePreview} alt="Preview" className={styles.imagePreview} />}
                    </div>
                    <button onClick={selectedTestimonial ? updateTestimonial : addTestimonial} disabled={loading} className={styles.actionButton}>
                        {loading ? (selectedTestimonial ? "Updating..." : "Adding...") : selectedTestimonial ? "Update Testimonial" : "Add Testimonial"}
                    </button>
                    <button onClick={() => { setShowForm(false); setEditIndex(null); }} className={styles.cancelButton}>Cancel</button>
                </form>
            )}

            <div className={styles.testimonialList}>
                {testimonials.map((testimonial, index) => (
                    <div key={testimonial.id} className={styles.testimonialItem}>
                        {editIndex === index ? (
                            <form className={`${styles.testimonialForm} ${styles.editForm}`}>
                                <label htmlFor="editTestimonialText">Testimonial Text:</label>
                                <textarea
                                    id="editTestimonialText"
                                    placeholder="Testimonial Text"
                                    value={newTestimonial.testimonial_text}
                                    onChange={(e) => setNewTestimonial({ ...newTestimonial, testimonial_text: e.target.value })}
                                    className={styles.inputField}
                                />
                                <label htmlFor="editTestimonialName">Testimonial Name:</label>
                                <input
                                    type="text"
                                    id="editTestimonialName"
                                    placeholder="Testimonial Name"
                                    value={newTestimonial.testimonial_name}
                                    onChange={(e) => setNewTestimonial({ ...newTestimonial, testimonial_name: e.target.value })}
                                    className={styles.inputField}
                                />
                                <div className={styles.imageUploadContainer}>
                                    <div className={styles.imageUploadBox}>
                                        <input type="file" accept="image/*" onChange={handleImageChange} id="editImageUpload" style={{ display: "none" }} />
                                        <label htmlFor="editImageUpload">Upload Image</label>
                                    </div>
                                    {imagePreview && <img src={imagePreview} alt="Preview" className={styles.imagePreview} />}
                                </div>
                                <button onClick={updateTestimonial} disabled={loading} className={styles.actionButton}>
                                    {loading ? "Updating..." : "Update Testimonial"}
                                </button>
                                <button onClick={handleCancelEdit} className={styles.cancelButton}>Cancel</button>
                            </form>
                        ) : (
                            <div className={styles.testimonialContent}>
                                <img src={testimonial.testimonial_image} alt={testimonial.testimonial_name} className={styles.testimonialImage} />
                                <div>
                                    <h2>{testimonial.testimonial_name}</h2>
                                    <p>{testimonial.testimonial_text}</p>
                                </div>
                                <div className={styles.testimonialActions}>
                                    <button onClick={() => handleEdit(testimonial, index)} className={styles.editButton}>Edit</button>
                                    <button onClick={() => deleteTestimonial(testimonial.id)} disabled={loading} className={styles.deleteButton}>
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

export default TestimonialsAdmin;