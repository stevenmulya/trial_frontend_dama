import React, { useState, useEffect, useRef } from "react";

const Taglines = () => {
    const [taglines, setTaglines] = useState([]);
    const [currentTaglineIndex, setCurrentTaglineIndex] = useState(0);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const intervalRef = useRef(null);

    useEffect(() => {
        fetchTaglines();
        intervalRef.current = setInterval(() => {
            setCurrentTaglineIndex((prevIndex) => (prevIndex + 1) % taglines.length);
        }, 5000);

        return () => clearInterval(intervalRef.current);
    }, [taglines.length]);

    const fetchTaglines = async () => {
        setLoading(true);
        try {
            const response = await fetch("https://trial-backend-dama.vercel.app/taglines");
            const data = await response.json();
            setTaglines(data);
        } catch (error) {
            console.error("Error fetching taglines:", error);
            setMessage("Failed to load taglines.");
        } finally {
            setLoading(false);
        }
    };

    const handleExploreServicesClick = () => {
        window.location.href = "/services";
    };

    const styles = {
        section: {
            position: "relative",
            width: "100%",
            height: "100vh",
            overflow: "hidden",
            cursor: "pointer",
            backgroundColor: "var(--color-1)",
        },
        backgroundImage: {
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transition: "0.5s ease-in-out",
            opacity: 0.7, // Set your desired opacity here
        },
        textOverlay: {
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            textAlign: "center",
        },
        title: {
            fontSize: "36px",
            marginBottom: "10px",
            fontFamily: "var(--font-1)",
            color: "var(--color-4)",
        },
        subtitle: {
            fontSize: "20px",
            marginBottom: "20px",
            color: "var(--color-4)",
        },
        loading: {
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            color: "white",
        },
        message: {
            position: "absolute",
            top: "20px",
            left: "20px",
            color: "red",
        },
        exploreButton: {
            padding: "10px 20px",
            fontSize: "16px",
            backgroundColor: "var(--color-2)",
            color: "var(--color-4)",
            border: "none",
            cursor: "pointer",
            fontFamily: "var(--font-1)",
            opacity: 0.7,
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

    if (taglines.length === 0) {
        return (
            <section style={styles.section}>
                <p style={styles.loading}>No taglines available.</p>
            </section>
        );
    }

    const currentTagline = taglines[currentTaglineIndex];

    return (
        <section style={styles.section}>
            <img
                src={currentTagline.tagline_image}
                alt={currentTagline.tagline_title}
                style={styles.backgroundImage}
            />
            <div style={styles.textOverlay}>
                <h2 style={styles.title}>{currentTagline.tagline_title}</h2>
                <p style={styles.subtitle}>{currentTagline.tagline_subtitle}</p>
                <button style={styles.exploreButton} onClick={handleExploreServicesClick}>
                    Discover our services
                </button>
            </div>
        </section>
    );
};

export default Taglines;