import React, { useState, useEffect } from "react";

const TestimonialsAdmin = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [newTestimonial, setNewTestimonial] = useState({
    testimonial_text: "",
    testimonial_name: "",
    testimonial_image: null,
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [selectedTestimonial, setSelectedTestimonial] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const response = await fetch("https://trial-backend-dama.vercel.app/testimonials");
      const data = await response.json();
      setTestimonials(data);
    } catch (error) {
      console.error("Error fetching testimonials:", error);
      setMessage("Failed to load testimonials.");
    }
  };

  const addTestimonial = async () => {
    if (!newTestimonial.testimonial_text || !newTestimonial.testimonial_image) {
      setMessage("Testimonial text and image are required.");
      return;
    }

    if (newTestimonial.testimonial_image.size > 5 * 1024 * 1024) {
      setMessage("Image size must be less than 5MB.");
      return;
    }

    if (!newTestimonial.testimonial_image.type.startsWith("image/")) {
      setMessage("File type must be an image.");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("testimonial_text", newTestimonial.testimonial_text);
      formData.append("testimonial_name", newTestimonial.testimonial_name);
      formData.append("testimonial_image", newTestimonial.testimonial_image);

      const response = await fetch("https://trial-backend-dama.vercel.app/testimonials", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        setMessage("Testimonial added successfully!");
        fetchTestimonials();
        setNewTestimonial({
          testimonial_text: "",
          testimonial_name: "",
          testimonial_image: null,
        });
        setImagePreview(null);
      } else {
        const errorData = await response.json();
        setMessage(`Failed to add testimonial: ${errorData.error}`);
      }
    } catch (error) {
      console.error("Error adding testimonial:", error);
      setMessage(`Failed to add testimonial: ${error.message}`);
    }
    setLoading(false);
  };

  const updateTestimonial = async () => {
    if (!newTestimonial.testimonial_text) {
      setMessage("Testimonial text is required.");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("testimonial_text", newTestimonial.testimonial_text);
      formData.append("testimonial_name", newTestimonial.testimonial_name);
      formData.append("testimonial_image", newTestimonial.testimonial_image);

      const response = await fetch(`https://trial-backend-dama.vercel.app/testimonials/${selectedTestimonial.id}`, {
        method: "PUT",
        body: formData,
      });

      if (response.ok) {
        setMessage("Testimonial updated successfully!");
        fetchTestimonials();
        setNewTestimonial({
          testimonial_text: "",
          testimonial_name: "",
          testimonial_image: null,
        });
        setSelectedTestimonial(null);
        setImagePreview(null);
      } else {
        const errorData = await response.json();
        setMessage(`Failed to update testimonial: ${errorData.error}`);
      }
    } catch (error) {
      console.error("Error updating testimonial:", error);
      setMessage(`Failed to update testimonial: ${error.message}`);
    }
    setLoading(false);
  };

  const deleteTestimonial = async (id) => {
    setLoading(true);
    try {
      const response = await fetch(`https://trial-backend-dama.vercel.app/testimonials/${id}`, { method: "DELETE" });
      if (response.ok) {
        setMessage("Testimonial deleted successfully!");
        fetchTestimonials();
      } else {
        const errorData = await response.json();
        setMessage(`Failed to delete testimonial: ${errorData.error}`);
      }
    } catch (error) {
      console.error("Error deleting testimonial:", error);
      setMessage("Failed to delete testimonial.");
    }
    setLoading(false);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setNewTestimonial({ ...newTestimonial, testimonial_image: file });
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const handleEdit = (testimonial) => {
    setSelectedTestimonial(testimonial);
    setNewTestimonial({
      testimonial_text: testimonial.testimonial_text,
      testimonial_name: testimonial.testimonial_name,
      testimonial_image: null,
    });
    setImagePreview(testimonial.testimonial_image);
  };

  return (
    <section>
        <h2>Testimonials</h2>
      {message && <p>{message}</p>}

      <div>
        <textarea
          placeholder="Testimonial Text"
          value={newTestimonial.testimonial_text}
          onChange={(e) => setNewTestimonial({ ...newTestimonial, testimonial_text: e.target.value })}
        />
        <input
          type="text"
          placeholder="Testimonial Name"
          value={newTestimonial.testimonial_name}
          onChange={(e) => setNewTestimonial({ ...newTestimonial, testimonial_name: e.target.value })}
        />
        <input type="file" accept="image/*" onChange={handleImageChange} />
        {imagePreview && <img src={imagePreview} alt="Preview" style={{ maxWidth: "100px" }} />}
        <button onClick={selectedTestimonial ? updateTestimonial : addTestimonial} disabled={loading}>
          {loading ? (selectedTestimonial ? "Updating..." : "Adding...") : selectedTestimonial ? "Update Testimonial" : "Add Testimonial"}
        </button>
      </div>

      <div>
        {testimonials.map((testimonial) => (
          <div key={testimonial.id}>
            <img src={testimonial.testimonial_image} alt={testimonial.testimonial_name} style={{ maxWidth: "100px" }} />
            <h2>{testimonial.testimonial_name}</h2>
            <p>{testimonial.testimonial_text}</p>
            <button onClick={() => handleEdit(testimonial)}>Edit</button>
            <button onClick={() => deleteTestimonial(testimonial.id)} disabled={loading}>
              {loading ? "Deleting..." : "Delete"}
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TestimonialsAdmin;