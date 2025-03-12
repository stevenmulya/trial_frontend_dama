import React, { useState, useEffect } from "react";

const ToinstagramsAdmin = () => {
  const [toinstagrams, setToinstagrams] = useState([]);
  const [newToinstagram, setNewToinstagram] = useState({
    toinstagram_name: "",
    toinstagram_link: "",
    toinstagram_image: null,
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [selectedToinstagram, setSelectedToinstagram] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    fetchToinstagrams();
  }, []);

  const fetchToinstagrams = async () => {
    try {
      const response = await fetch("https://trial-backend-dama.vercel.app/toinstagrams");
      const data = await response.json();
      setToinstagrams(data);
    } catch (error) {
      console.error("Error fetching toinstagrams:", error);
      setMessage("Failed to load toinstagrams.");
    }
  };

  const addToinstagram = async () => {
    if (!newToinstagram.toinstagram_name || !newToinstagram.toinstagram_image) {
      setMessage("Toinstagram name and image are required.");
      return;
    }

    if (newToinstagram.toinstagram_image.size > 5 * 1024 * 1024) {
      setMessage("Image size must be less than 5MB.");
      return;
    }

    if (!newToinstagram.toinstagram_image.type.startsWith("image/")) {
      setMessage("File type must be an image.");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("toinstagram_name", newToinstagram.toinstagram_name);
      formData.append("toinstagram_link", newToinstagram.toinstagram_link);
      formData.append("toinstagram_image", newToinstagram.toinstagram_image);

      const response = await fetch("https://trial-backend-dama.vercel.app/toinstagrams", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        setMessage("Toinstagram added successfully!");
        fetchToinstagrams();
        setNewToinstagram({
          toinstagram_name: "",
          toinstagram_link: "",
          toinstagram_image: null,
        });
        setImagePreview(null);
      } else {
        const errorData = await response.json();
        setMessage(`Failed to add toinstagram: ${errorData.error}`);
      }
    } catch (error) {
      console.error("Error adding toinstagram:", error);
      setMessage(`Failed to add toinstagram: ${error.message}`);
    }
    setLoading(false);
  };

  const updateToinstagram = async () => {
    if (!newToinstagram.toinstagram_name) {
      setMessage("Toinstagram name is required.");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("toinstagram_name", newToinstagram.toinstagram_name);
      formData.append("toinstagram_link", newToinstagram.toinstagram_link);
      formData.append("toinstagram_image", newToinstagram.toinstagram_image);

      const response = await fetch(`https://trial-backend-dama.vercel.app/toinstagrams/${selectedToinstagram.id}`, {
        method: "PUT",
        body: formData,
      });

      if (response.ok) {
        setMessage("Toinstagram updated successfully!");
        fetchToinstagrams();
        setNewToinstagram({
          toinstagram_name: "",
          toinstagram_link: "",
          toinstagram_image: null,
        });
        setSelectedToinstagram(null);
        setImagePreview(null);
      } else {
        const errorData = await response.json();
        setMessage(`Failed to update toinstagram: ${errorData.error}`);
      }
    } catch (error) {
      console.error("Error updating toinstagram:", error);
      setMessage(`Failed to update toinstagram: ${error.message}`);
    }
    setLoading(false);
  };

  const deleteToinstagram = async (id) => {
    setLoading(true);
    try {
      const response = await fetch(`https://trial-backend-dama.vercel.app/toinstagrams/${id}`, { method: "DELETE" });
      if (response.ok) {
        setMessage("Toinstagram deleted successfully!");
        fetchToinstagrams();
      } else {
        const errorData = await response.json();
        setMessage(`Failed to delete toinstagram: ${errorData.error}`);
      }
    } catch (error) {
      console.error("Error deleting toinstagram:", error);
      setMessage("Failed to delete toinstagram.");
    }
    setLoading(false);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setNewToinstagram({ ...newToinstagram, toinstagram_image: file });
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const handleEdit = (toinstagram) => {
    setSelectedToinstagram(toinstagram);
    setNewToinstagram({
      toinstagram_name: toinstagram.toinstagram_name,
      toinstagram_link: toinstagram.toinstagram_link,
      toinstagram_image: null,
    });
    setImagePreview(toinstagram.toinstagram_image);
  };

  return (
    <section>
        <h2>Instagrammm</h2>
      {message && <p>{message}</p>}

      <div>
        <input
          type="text"
          placeholder="Toinstagram Name"
          value={newToinstagram.toinstagram_name}
          onChange={(e) => setNewToinstagram({ ...newToinstagram, toinstagram_name: e.target.value })}
        />
        <input
          type="text"
          placeholder="Toinstagram Link"
          value={newToinstagram.toinstagram_link}
          onChange={(e) => setNewToinstagram({ ...newToinstagram, toinstagram_link: e.target.value })}
        />
        <input type="file" accept="image/*" onChange={handleImageChange} />
        {imagePreview && <img src={imagePreview} alt="Preview" style={{ maxWidth: "100px" }} />}
        <button onClick={selectedToinstagram ? updateToinstagram : addToinstagram} disabled={loading}>
          {loading ? (selectedToinstagram ? "Updating..." : "Adding...") : selectedToinstagram ? "Update Toinstagram" : "Add Toinstagram"}
        </button>
      </div>

      <div>
        {toinstagrams.map((toinstagram) => (
          <div key={toinstagram.id}>
            <img src={toinstagram.toinstagram_image} alt={toinstagram.toinstagram_name} style={{ maxWidth: "100px" }} />
            <h2>{toinstagram.toinstagram_name}</h2>
            <p>{toinstagram.toinstagram_link}</p>
            <button onClick={() => handleEdit(toinstagram)}>Edit</button>
            <button onClick={() => deleteToinstagram(toinstagram.id)} disabled={loading}>
              {loading ? "Deleting..." : "Delete"}
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ToinstagramsAdmin;