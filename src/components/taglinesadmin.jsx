import React, { useState, useEffect } from "react";


const TaglinesAdmin = () => {
  const [taglines, setTaglines] = useState([]);
  const [newTagline, setNewTagline] = useState({
    tagline_title: "",
    tagline_subtitle: "",
    tagline_image: null,
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [selectedTagline, setSelectedTagline] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    fetchTaglines();
  }, []);

  const fetchTaglines = async () => {
    try {
      const response = await fetch("https://trial-backend-dama.vercel.app/taglines");
      const data = await response.json();
      setTaglines(data);
    } catch (error) {
      console.error("Error fetching taglines:", error);
      setMessage("Failed to load taglines.");
    }
  };

  const addTagline = async () => {
    if (!newTagline.tagline_title || !newTagline.tagline_image) {
      setMessage("Tagline title and image are required.");
      return;
    }

    if (newTagline.tagline_image.size > 5 * 1024 * 1024) {
      setMessage("Image size must be less than 5MB.");
      return;
    }

    if (!newTagline.tagline_image.type.startsWith("image/")) {
      setMessage("File type must be an image.");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("tagline_title", newTagline.tagline_title);
      formData.append("tagline_subtitle", newTagline.tagline_subtitle);
      formData.append("tagline_image", newTagline.tagline_image);

      const response = await fetch("https://trial-backend-dama.vercel.app/taglines", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        setMessage("Tagline added successfully!");
        fetchTaglines();
        setNewTagline({
          tagline_title: "",
          tagline_subtitle: "",
          tagline_image: null,
        });
        setImagePreview(null);
      } else {
        const errorData = await response.json();
        setMessage(`Failed to add tagline: ${errorData.error}`);
      }
    } catch (error) {
      console.error("Error adding tagline:", error);
      setMessage(`Failed to add tagline: ${error.message}`);
    }
    setLoading(false);
  };

  const updateTagline = async () => {
    if (!newTagline.tagline_title) {
      setMessage("Tagline title is required.");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("tagline_title", newTagline.tagline_title);
      formData.append("tagline_subtitle", newTagline.tagline_subtitle);
      formData.append("tagline_image", newTagline.tagline_image);

      const response = await fetch(`https://trial-backend-dama.vercel.app/taglines/${selectedTagline.id}`, {
        method: "PUT",
        body: formData,
      });

      if (response.ok) {
        setMessage("Tagline updated successfully!");
        fetchTaglines();
        setNewTagline({
          tagline_title: "",
          tagline_subtitle: "",
          tagline_image: null,
        });
        setSelectedTagline(null);
        setImagePreview(null);
      } else {
        const errorData = await response.json();
        setMessage(`Failed to update tagline: ${errorData.error}`);
      }
    } catch (error) {
      console.error("Error updating tagline:", error);
      setMessage(`Failed to update tagline: ${error.message}`);
    }
    setLoading(false);
  };

  const deleteTagline = async (id) => {
    setLoading(true);
    try {
      const response = await fetch(`https://trial-backend-dama.vercel.app/taglines/${id}`, { method: "DELETE" });
      if (response.ok) {
        setMessage("Tagline deleted successfully!");
        fetchTaglines();
      } else {
        const errorData = await response.json();
        setMessage(`Failed to delete tagline: ${errorData.error}`);
      }
    } catch (error) {
      console.error("Error deleting tagline:", error);
      setMessage("Failed to delete tagline.");
    }
    setLoading(false);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setNewTagline({ ...newTagline, tagline_image: file });
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const handleEdit = (tagline) => {
    setSelectedTagline(tagline);
    setNewTagline({
      tagline_title: tagline.tagline_title,
      tagline_subtitle: tagline.tagline_subtitle,
      tagline_image: null,
    });
    setImagePreview(tagline.tagline_image);
  };

  return (
    <section className="taglines-admin">
		<h2>Taglines</h2>
      {message && <p className="message">{message}</p>}

      <div className="tagline-form">
        <input
          type="text"
          placeholder="Tagline Title"
          value={newTagline.tagline_title}
          onChange={(e) => setNewTagline({ ...newTagline, tagline_title: e.target.value })}
        />
        <input
          type="text"
          placeholder="Tagline Subtitle"
          value={newTagline.tagline_subtitle}
          onChange={(e) => setNewTagline({ ...newTagline, tagline_subtitle: e.target.value })}
        />
        <input type="file" accept="image/*" onChange={handleImageChange} />
        {imagePreview && <img src={imagePreview} alt="Preview" className="image-preview" style={{ maxWidth: "100px" }}/>}
        <button onClick={selectedTagline ? updateTagline : addTagline} disabled={loading}>
          {loading ? (selectedTagline ? "Updating..." : "Adding...") : selectedTagline ? "Update Tagline" : "Add Tagline"}
        </button>
      </div>

      <div className="tagline-list">
        {taglines.map((tagline) => (
          <div key={tagline.id} className="tagline-item">
            <img src={tagline.tagline_image} alt={tagline.tagline_title} className="tagline-image" style={{ maxWidth: "100px" }}/>
            <h2>{tagline.tagline_title}</h2>
            <p>{tagline.tagline_subtitle}</p>
            <button onClick={() => handleEdit(tagline)}>Edit</button>
            <button onClick={() => deleteTagline(tagline.id)} disabled={loading}>
              {loading ? "Deleting..." : "Delete"}
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TaglinesAdmin;