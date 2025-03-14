import React, { useState, useEffect } from "react";

const Toservices = () => {
  const [toservices, setToservices] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchToservices();
  }, []);

  const fetchToservices = async () => {
    setLoading(true);
    try {
      const response = await fetch("https://trial-backend-dama.vercel.app/toservices");
      const data = await response.json();
      setToservices(data);
    } catch (error) {
      console.error("Error fetching toservices:", error);
      setMessage("Failed to load toservices.");
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    section: {
      height: "100vh",
      padding: "5px 30px",
      textAlign: "center",
      background: "var(--color-4)",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
    },
    message: {
      color: "red",
      marginBottom: "2px",
    },
    loading: {
      marginBottom: "2px",
    },
    container: {
      display: "flex",
      flexWrap: "wrap",
      justifyContent: "center",
      gap: "2px",
      width: "100%",
      maxWidth: "1200px",
    },
    toserviceItem: {
      display: "flex",
      alignItems: "center",
      padding: "20px",
      width: "100%",
      maxWidth: "1200px",
      margin: "2px auto",
    },
    textContainer: {
      flex: 1,
      textAlign: "left",
      paddingRight: "20px",
    },
    imageContainer: {
      flex: 1,
      textAlign: "right",
      marginBottom: "0",
    },
    image: {
      width: "100%",
      height: "auto",
      objectFit: "cover",
      borderRadius: "8px",
    },
    title: {
      fontSize: "24px",
      marginBottom: "10px",
      color: "var(--color-1)",
      fontFamily: "var(--font-2)",
      fontWeight: "regular",
    },
    button: {
      background: "var(--color-4)",
      fontFamily: "var(--font-2)",
      color: "var(--color-1)",
      padding: "10px 20px",
      border: "1px solid var(--color-1)",
      borderRadius: "5px",
      cursor: "pointer",
      marginTop: "15px",
    },
  };

  return (
    <section style={styles.section}>
      {message && <p style={styles.message}>{message}</p>}
      {loading && <p style={styles.loading}>Loading...</p>}

      <div style={styles.container}>
        {toservices.map((toservice) => (
          <div key={toservice.id} style={styles.toserviceItem}>
            <div style={styles.textContainer}>
              <h2 style={styles.title}>{toservice.toservice_subtitle}</h2>
              <a href="/services">
                <button style={styles.button}>Services</button>
              </a>
            </div>
            <div style={styles.imageContainer}>
              <img
                src={toservice.toservice_image}
                alt={toservice.toservice_subtitle}
                style={styles.image}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Toservices;