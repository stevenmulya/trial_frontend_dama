import React, { useState, useEffect } from "react";

const MyportofolioHome = () => {
    const [myportofolios, setMyportofolios] = useState([]);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchMyportofolios();
    }, []);

    const fetchMyportofolios = async () => {
        setLoading(true);
        try {
            const response = await fetch("https://trial-backend-dama.vercel.app/myportofolios");
            const data = await response.json();
            setMyportofolios(data);
        } catch (error) {
            console.error("Error fetching myportofolios:", error);
            setMessage("Failed to load myportofolios.");
        } finally {
            setLoading(false);
        }
    };

    const styles = {
        section: {
            height: "80vh",
            padding: "10vh 20px",
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
        },
        message: {
            color: "red",
            marginBottom: "20px",
        },
        loading: {
            marginBottom: "20px",
        },
        title: {
            fontSize: "28px",
            marginBottom: "10px", // Mengurangi margin bawah
        },
        subtitle: {
            marginTop: "5px", // Mengurangi margin atas
        },
        container: {
            display: "flex",
            justifyContent: "center",
            flexWrap: "wrap",
            gap: "40px",
            marginBottom: "30px",
            maxWidth: "1200px",
            width: "100%",
        },
        portofolioItem: {
            width: "300px",
            border: "1px solid #ddd",
            borderRadius: "8px",
            overflow: "hidden",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
            cursor: "pointer",
            transition: "transform 0.3s ease",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            "&:hover": {
                transform: "scale(1.05)",
            },
        },
        image: {
            width: "100%",
            height: "300px",
            objectFit: "cover",
            transition: "transform 0.3s ease-in-out",
        },
        portofolioTitle: {
            padding: "10px",
            fontSize: "16px",
            color: "#e7e4de",
            textAlign: "center",
        },
        button: {
            background: "#e7e4de",
            color: "#6d625d",
            padding: "10px 20px",
            border: "none",
            cursor: "pointer",
            fontSize: "16px",
            marginTop: "20px",
            padding: "15px 30px", // Menambahkan padding
        },
    };

    const handlePortfolioClick = (name) => {
        const sanitizedName = name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
        window.location.href = `/portofolio/${sanitizedName}`;
    };

    return (
        <section style={styles.section}>
            {message && <p style={styles.message}>{message}</p>}
            {loading && <p style={styles.loading}>Loading...</p>}

            <h2 style={styles.title}>View Our Portfolio</h2>
            <p style={styles.subtitle}>Take a glimpse at our past & current works.</p>

            <div style={styles.container}>
                {myportofolios.slice(-3).map((myportofolio) => (
                    <div
                        key={myportofolio.id}
                        onClick={() => handlePortfolioClick(myportofolio.myportofolio_name)}
                        style={{ textDecoration: "none", cursor: 'pointer' }}
                        className="portofolio-item"
                    >
                        <div style={styles.portofolioItem}>
                            <img
                                src={myportofolio.myportofolio_image}
                                alt={myportofolio.myportofolio_name}
                                style={styles.image}
                            />
                            <h3 style={styles.portofolioTitle}>{myportofolio.myportofolio_name}</h3>
                        </div>
                    </div>
                ))}
            </div>

            <a href="/portofolio">
                <button style={styles.button}>View Portfolio</button>
            </a>
        </section>
    );
};

export default MyportofolioHome;