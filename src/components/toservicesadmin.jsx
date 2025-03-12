import React, { useState, useEffect } from "react";

const ToservicesAdmin = () => {
  const [toservices, setToservices] = useState([]);
  const [newToservice, setNewToservice] = useState({
    toservice_subtitle: "",
    toservice_image: null,
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [selectedToservice, setSelectedToservice] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    fetchToservices();
  }, []);

  const fetchToservices = async () => {
    try {
      const response = await fetch("https://trial-backend-dama.vercel.app/toservices");
      const data = await response.json();
      setToservices(data);
    } catch (error) {
      console.error("Error fetching toservices:", error);
      setMessage("Failed to load toservices.");
    }
  };

  const addToservice = async () => {
    if (!newToservice.toservice_subtitle || !newToservice.toservice_image) {
      setMessage("Subtitle and image are required.");
      return;
    }

    if (newToservice.toservice_image.size > 5 * 1024 * 1024) {
      setMessage("Image size must be less than 5MB.");
      return;
    }

    if (!newToservice.toservice_image.type.startsWith("image/")) {
      setMessage("File type must be an image.");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("toservice_subtitle", newToservice.toservice_subtitle);
      formData.append("toservice_image", newToservice.toservice_image);

      const response = await fetch("https://trial-backend-dama.vercel.app/toservices", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        setMessage("Toservice added successfully!");
        fetchToservices();
        setNewToservice({
          toservice_subtitle: "",
          toservice_image: null,
        });
        setImagePreview(null);
      } else {
        const errorData = await response.json();
        setMessage(`Failed to add toservice: ${errorData.error}`);
      }
    } catch (error) {
      console.error("Error adding toservice:", error);
      setMessage(`Failed to add toservice: ${error.message}`);
    }
    setLoading(false);
  };

  const updateToservice = async () => {
    if (!newToservice.toservice_subtitle) {
      setMessage("Subtitle is required.");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("toservice_subtitle", newToservice.toservice_subtitle);
      formData.append("toservice_image", newToservice.toservice_image);

      const response = await fetch(`https://trial-backend-dama.vercel.app/toservices/${selectedToservice.id}`, {
        method: "PUT",
        body: formData,
      });

      if (response.ok) {
        setMessage("Toservice updated successfully!");
        fetchToservices();
        setNewToservice({
          toservice_subtitle: "",
          toservice_image: null,
        });
        setSelectedToservice(null);
        setImagePreview(null);
      } else {
        const errorData = await response.json();
        setMessage(`Failed to update toservice: ${errorData.error}`);
      }
    } catch (error) {
      console.error("Error updating toservice:", error);
      setMessage(`Failed to update toservice: ${error.message}`);
    }
    setLoading(false);
  };

  const deleteToservice = async (id) => {
    setLoading(true);
    try {
      const response = await fetch(`https://trial-backend-dama.vercel.app/toservices/${id}`, { method: "DELETE" });
      if (response.ok) {
        setMessage("Toservice deleted successfully!");
        fetchToservices();
      } else {
        const errorData = await response.json();
        setMessage(`Failed to delete toservice: ${errorData.error}`);
      }
    } catch (error) {
      console.error("Error deleting toservice:", error);
      setMessage("Failed to delete toservice.");
    }
    setLoading(false);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setNewToservice({ ...newToservice, toservice_image: file });
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const handleEdit = (toservice) => {
    setSelectedToservice(toservice);
    setNewToservice({
      toservice_subtitle: toservice.toservice_subtitle,
      toservice_image: null,
    });
    setImagePreview(toservice.toservice_image);
  };

  return (
    <section className="toservices-admin">
      <h2>Toservices</h2>
      {message && <p className="message">{message}</p>}

      <div className="toservice-form">
        <input
          type="text"
          placeholder="Toservice Subtitle"
          value={newToservice.toservice_subtitle}
          onChange={(e) => setNewToservice({ ...newToservice, toservice_subtitle: e.target.value })}
        />
        <input type="file" accept="image/*" onChange={handleImageChange} />
        {imagePreview && <img src={imagePreview} alt="Preview" className="image-preview" style={{ maxWidth: "100px" }} />}
        <button onClick={selectedToservice ? updateToservice : addToservice} disabled={loading}>
          {loading ? (selectedToservice ? "Updating..." : "Adding...") : selectedToservice ? "Update Toservice" : "Add Toservice"}
        </button>
      </div>

      <div className="toservice-list">
        {toservices.map((toservice) => (
          <div key={toservice.id} className="toservice-item">
            <img src={toservice.toservice_image} alt={toservice.toservice_subtitle} className="toservice-image" style={{ maxWidth: "100px" }} />
            <h2>{toservice.toservice_subtitle}</h2>
            <button onClick={() => handleEdit(toservice)}>Edit</button>
            <button onClick={() => deleteToservice(toservice.id)} disabled={loading}>
              {loading ? "Deleting..." : "Delete"}
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ToservicesAdmin;