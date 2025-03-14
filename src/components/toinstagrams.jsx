import React, { useState, useEffect } from "react";

const Toinstagrams = () => {
    const [toinstagrams, setToinstagrams] = useState([]);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchToinstagrams();
    }, []);

    const fetchToinstagrams = async () => {
        setLoading(true);
        try {
            const response = await fetch("https://trial-backend-dama.vercel.app/toinstagrams");
            const data = await response.json();
            setToinstagrams(data);
        } catch (error) {
            console.error("Error fetching toinstagrams:", error);
            setMessage("Failed to load toinstagrams.");
        } finally {
            setLoading(false);
        }
    };

    const styles = {
        section: {
            height: "100vh",
            padding: "50px 20px",
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "var(--color-4)", // Latar belakang
        },
        message: {
            color: "red",
            marginBottom: "20px",
        },
        loading: {
            marginBottom: "20px",
        },
        container: {
            display: "flex",
            justifyContent: "center",
            overflowX: "auto",
            whiteSpace: "nowrap",
            padding: "40px 0", // Meningkatkan padding
            gap: "30px", // Meningkatkan gap
            maxWidth: "1200px", // Menambahkan maxWidth
        },
        toinstagramItem: {
            margin: "0", // Menghapus margin
            cursor: "pointer",
            display: "inline-block",
            transition: "transform 0.3s ease-in-out", // Efek hover
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", // Efek bayangan
            borderRadius: "8px", // Efek sudut bulat
            overflow: "hidden", // Mengatasi masalah bayangan di sudu
        },
        image: {
            height: "250px", // Meningkatkan tinggi gambar
            width: "250px", // Set width to match height
            objectFit: "cover", // Menggunakan cover
            borderRadius: "8px", // Efek sudut bulat
        },
        igDama: {
            marginTop: "30px",
            fontSize: "1.2rem",
            color: "var(--color-2)",
            fontFamily: "var(--font-2)",
        },
    };

    return (
        <section style={styles.section}>
            {message && <p style={styles.message}>{message}</p>}
            {loading && <p style={styles.loading}>Loading...</p>}

            <div style={styles.container}>
                {toinstagrams.map((toinstagram) => (
                    <a
                        key={toinstagram.id}
                        href={toinstagram.toinstagram_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={styles.toinstagramItem}
                    >
                        <img
                            src={toinstagram.toinstagram_image}
                            alt={toinstagram.toinstagram_name}
                            style={styles.image}
                        />
                    </a>
                ))}
            </div>
            <div style={styles.igDama}>Connect with us @damastudio</div>
        </section>
    );
};

export default Toinstagrams;