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
            padding: "50px 20px",
            textAlign: "center",
            background: "#6d625d",
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
            marginBottom: "30px",
            color: "#e7e4de",
        },
        container: {
            display: "flex",
            justifyContent: "center",
            flexWrap: "wrap",
            gap: "20px",
            marginBottom: "30px",
        },
        portofolioItem: {
            width: "300px",
            border: "1px solid #ddd",
            borderRadius: "8px",
            overflow: "hidden",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
            cursor: "pointer",
            transition: "transform 0.3s ease",
        },
        image: {
            width: "100%",
            height: "200px",
            objectFit: "cover",
            transition: "transform 0.3s ease-in-out",
        },
        portofolioTitle: {
            padding: "15px",
            fontSize: "20px",
            color: "#e7e4de",
            textAlign: "center",
        },
        button: {
            background: "#e7e4de",
            color: "#6d625d",
            padding: "10px 20px",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            fontSize: "16px",
        },
    };

    const handlePortfolioClick = (name) => {
        let sanitizedName = name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
        window.location.href = `/portofolio/${sanitizedName}`;
    };

    return (
        <section style={styles.section}>
            {message && <p style={styles.message}>{message}</p>}
            {loading && <p style={styles.loading}>Loading...</p>}

            <h2 style={styles.title}>View our portfolio</h2>

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