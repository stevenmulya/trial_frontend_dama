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
      padding: "20px 0",
      "::-webkit-scrollbar": {
        display: "none",
      },
      "scrollbar-width": "none",
    },
    toinstagramItem: {
      margin: "0 40px", // Meningkatkan margin untuk jarak yang lebih besar
      cursor: "pointer",
      display: "inline-block",
    },
    image: {
      height: "150px", // Meningkatkan tinggi gambar
      objectFit: "contain",
      maxWidth: "250px", // Meningkatkan lebar maksimum gambar
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
      <div class="ig-dama">Connect with us @damastudio</div>
    </section>
  );
};

export default Toinstagrams;