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
      padding: "50px 20px",
      textAlign: "center",
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
      flexWrap: "wrap",
      justifyContent: "center",
      gap: "20px",
    },
    toserviceItem: {
      display: "flex",
      alignItems: "center",
      padding: "20px",
      width: "80%",
      maxWidth: "1000px",
      margin: "20px auto",
    },
    textContainer: {
      flex: 1,
      textAlign: "left",
      paddingRight: "20px",
    },
    imageContainer: {
      flex: 1,
      textAlign: "right",
    },
    image: {
      maxWidth: "100%",
      maxHeight: "300px",
      objectFit: "cover",
      borderRadius: "8px",
    },
    title: {
      fontSize: "24px",
      marginBottom: "10px",
      color: "#6d625d",
    },
    button: {
      background: "#6d625d",
      color: "white",
      padding: "10px 20px",
      border: "none",
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