import React, { useState, useEffect, useRef } from "react";

const Clientlogos = () => {
  const [clientlogos, setClientlogos] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    fetchClientlogos();
  }, []);

  const fetchClientlogos = async () => {
    setLoading(true);
    try {
      const response = await fetch("https://trial-backend-dama.vercel.app/clientlogos");
      const data = await response.json();
      setClientlogos(data);
    } catch (error) {
      console.error("Error fetching clientlogos:", error);
      setMessage("Failed to load clientlogos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (containerRef.current && clientlogos.length > 0) {
      const container = containerRef.current;
      const scrollAmount = 1; // Kecepatan scroll
      let scrollPosition = 0;

      const animateScroll = () => {
        scrollPosition += scrollAmount;
        if (scrollPosition >= container.scrollWidth / 2) {
          scrollPosition = 0;
        }
        container.scrollLeft = scrollPosition;
        requestAnimationFrame(animateScroll);
      };

      animateScroll();
    }
  }, [clientlogos]);

  const styles = {
    section: {
      padding: "2px 20px",
      textAlign: "center",
      color: "var(--color-4)",
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
      overflowX: "hidden", // Sembunyikan scrollbar
      whiteSpace: "nowrap",
      padding: "20px 0",
    },
    clientlogoItem: {
      margin: "0 30px",
      cursor: "pointer",
      display: "inline-block",
    },
    image: {
      height: "80px",
      objectFit: "contain",
      maxWidth: "150px",
    },
  };

  const duplicatedLogos = [...clientlogos, ...clientlogos]; // Duplikasi logo

  return (
    <section style={styles.section}>
      {message && <p style={styles.message}>{message}</p>}
      {loading && <p style={styles.loading}>Loading...</p>}

      <div style={styles.container} ref={containerRef}>
        {duplicatedLogos.map((clientlogo) => (
          <a
            key={`${clientlogo.id}-${Math.random()}`} // Tambahkan key unik
            href={clientlogo.clientlogo_link}
            target="_blank"
            rel="noopener noreferrer"
            style={styles.clientlogoItem}
          >
            <img
              src={clientlogo.clientlogo_image}
              alt={clientlogo.clientlogo_name}
              style={styles.image}
            />
          </a>
        ))}
      </div>
    </section>
  );
};

export default Clientlogos;