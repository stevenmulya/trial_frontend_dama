import React, { useState, useEffect } from "react";

const Testimonials = () => {
    const [testimonials, setTestimonials] = useState([]);
    const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState(0);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchTestimonials();
    }, []);

    const fetchTestimonials = async () => {
        setLoading(true);
        try {
            const response = await fetch("https://trial-backend-dama.vercel.app/testimonials");
            const data = await response.json();
            setTestimonials(data);
        } catch (error) {
            console.error("Error fetching testimonials:", error);
            setMessage("Failed to load testimonials.");
        } finally {
            setLoading(false);
        }
    };

    const nextTestimonial = () => {
        setCurrentTestimonialIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    };

    const imageOpacity = 0.7;

    const styles = {
        section: {
            position: "relative",
            width: "100%",
            height: "100vh",
            overflow: "hidden",
            cursor: "pointer",
            backgroundColor: "var(--color-1)",
            color: "var(--color-4)",
        },
        backgroundImage: {
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transition: "opacity 0.5s ease-in-out",
            opacity: imageOpacity,
        },
        textOverlay: {
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            textAlign: "center",
        },
        name: {
            marginBottom: "10px",
            color: "var(--color-4)",
        },
        text: {
            padding: "0 20px",
        },
        loading: {
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
        },
        message: {
            position: "absolute",
            top: "20px",
            left: "20px",
            color: "red",
        },
        indexContainer: {
            position: "absolute",
            bottom: "20px",
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
        },
        indexCircle: {
            width: "10px",
            height: "10px",
            borderRadius: "50%",
            margin: "0 5px",
            backgroundColor: "rgba(255, 255, 255, 0.5)",
            cursor: "pointer",
        },
        activeCircle: {
            backgroundColor: "white",
        },
    };

    if (loading) {
        return (
            <section style={styles.section}>
                <p style={styles.loading}>Loading...</p>
            </section>
        );
    }

    if (message) {
        return (
            <section style={styles.section}>
                <p style={styles.message}>{message}</p>
            </section>
        );
    }

    if (testimonials.length === 0) {
        return (
            <section style={styles.section}>
                <p style={styles.loading}>No testimonials available.</p>
            </section>
        );
    }

    const currentTestimonial = testimonials[currentTestimonialIndex];

    return (
        <section style={styles.section} onClick={nextTestimonial}>
            <img
                src={currentTestimonial.testimonial_image}
                alt={currentTestimonial.testimonial_name}
                style={{
                    ...styles.backgroundImage,
                    opacity: loading ? 0 : imageOpacity,
                }}
            />
            <div style={styles.textOverlay}>
                <h2 style={styles.name}>{currentTestimonial.testimonial_name}</h2>
                <p style={styles.text}>{currentTestimonial.testimonial_text}</p>
            </div>
            <div style={styles.indexContainer}>
                {testimonials.map((_, index) => (
                    <div
                        key={index}
                        style={{
                            ...styles.indexCircle,
                            ...(index === currentTestimonialIndex ? styles.activeCircle : {}),
                        }}
                        onClick={() => setCurrentTestimonialIndex(index)}
                    ></div>
                ))}
            </div>
        </section>
    );
};

export default Testimonials;