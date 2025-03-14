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

  const styles = {
    section: {
      position: "relative",
      width: "100%",
      height: "100vh",
      overflow: "hidden",
      cursor: "pointer",
    },
    backgroundImage: {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      objectFit: "cover",
      transition: "opacity 0.5s ease-in-out",
    },
    textOverlay: {
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      textAlign: "center",
      color: "white",
      textShadow: "2px 2px 4px rgba(0, 0, 0, 0.8)",
    },
    name: {
      fontSize: "36px",
      marginBottom: "10px",
    },
    text: {
      fontSize: "20px",
      padding: "0 20px",
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
          opacity: loading ? 0 : 1,
        }}
      />
      <div style={styles.textOverlay}>
        <h2 style={styles.name}>{currentTestimonial.testimonial_name}</h2>
        <p style={styles.text}>{currentTestimonial.testimonial_text}</p>
      </div>
    </section>
  );
};

export default Testimonials;