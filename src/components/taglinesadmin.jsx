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
  const [showForm, setShowForm] = useState(false);
  const [editIndex, setEditIndex] = useState(null);

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
        setShowForm(false);
        setEditIndex(null);
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
        setShowForm(false);
        setEditIndex(null);
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
    const confirmDelete = window.confirm("Are you sure you want to delete this tagline?");
    if (!confirmDelete) return;

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

  const handleUpload = () => {
    setNewTagline({ tagline_title: "", tagline_subtitle: "", tagline_image: null });
    setSelectedTagline(null);
    setImagePreview(null);
    setShowForm(true);
    setEditIndex(null);
  };

  const handleEdit = (tagline, index) => {
    setSelectedTagline(tagline);
    setNewTagline({
      tagline_title: tagline.tagline_title,
      tagline_subtitle: tagline.tagline_subtitle,
      tagline_image: null,
    });
    setImagePreview(tagline.tagline_image);
    setEditIndex(index);
    setShowForm(true);
  };

  return (
    <section className="taglines-admin-container">
      <style jsx>{`
        .taglines-admin-container {
          max-width: 600px;
          margin: 20px auto;
          padding: 20px;
          border: 1px solid #ddd;
          border-radius: 8px;
          font-family: sans-serif;
        }

        .message {
          padding: 10px;
          margin-bottom: 15px;
          border-radius: 4px;
        }

        .message.success {
          background-color: #d4edda;
          color: #155724;
          border: 1px solid #c3e6cb;
        }

        .message.error {
          background-color: #f8d7da;
          color: #721c24;
          border: 1px solid #f5c6cb;
        }

        .tagline-form, .edit-form {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-bottom: 20px;
          width: 90%;
          max-width: 500px;
          padding: 20px;
          box-sizing: border-box;
        }

        .tagline-form input[type="text"],
        .tagline-form input[type="file"],
        .tagline-form button,
        .edit-form input[type="text"],
        .edit-form input[type="file"],
        .edit-form button {
          padding: 12px;
          font-size: 16px;
        }

        .image-upload-box {
          border: 2px dashed #ccc;
          padding: 10px;
          border-radius: 4px;
          text-align: center;
          cursor: pointer;
        }

        .image-preview {
          max-width: 80px;
          margin-left: 10px;
          border-radius: 4px;
        }

        .tagline-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        
        .tagline-item {
          border: 1px solid #eee;
          padding: 10px;
          border-radius: 4px;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }

        .tagline-item img.tagline-image {
          max-width: 60px;
          border-radius: 4px;
          margin-right: 10px;
        }

        .tagline-actions {
          margin-left: auto;
          display: flex;
          gap: 5px;
        }

        .tagline-form button, button {
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 4px;
          margin-right: 5px;
        }
      `}</style>
      <h2>Taglines Admin</h2>
      {message && (
        <p className={`message ${message.startsWith("Failed") ? "error" : "success"}`}>
          {message}
        </p>
      )}

      <button onClick={handleUpload}>Upload Tagline</button>

      {showForm && editIndex === null && (
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
          <div style={{ display: "flex", alignItems: "center" }}>
            <div className="image-upload-box">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                id="imageUpload"
                style={{ display: "none" }}
              />
              <label htmlFor="imageUpload">Upload Image</label>
            </div>
            {imagePreview && <img src={imagePreview} alt="Preview" className="image-preview" />}
          </div>

          <button onClick={selectedTagline ? updateTagline : addTagline} disabled={loading}>
            {loading
              ? selectedTagline
                ? "Updating..."
                : "Adding..."
              : selectedTagline
              ? "Update Tagline"
              : "Add Tagline"}
          </button>
          <button onClick={() => { setShowForm(false); setEditIndex(null); }}>Cancel</button>
        </div>
      )}

      <div className="tagline-list">
        {taglines.map((tagline, index) => (
          <div key={tagline.id} className="tagline-item">
            <div style={{ display: "flex", alignItems: "center" }}>
              <img src={tagline.tagline_image} alt={tagline.tagline_title} className="tagline-image" />
              <div>
                <span>{tagline.tagline_title}</span>
                <p>{tagline.tagline_subtitle}</p>
              </div>
            </div>
            <div className="tagline-actions">
              <button onClick={() => handleEdit(tagline, index)}>Edit</button>
              <button onClick={() => deleteTagline(tagline.id)} disabled={loading}>
                Delete
              </button>
            </div>
            {showForm && editIndex === index && (
              <div className="tagline-form edit-form">
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
                <div style={{ display: "flex", alignItems: "center" }}>
                  <div className="image-upload-box">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      id="imageUpload"
                      style={{ display: "none" }}
                    />
                    <label htmlFor="imageUpload">Upload Image</label>
                  </div>
                  {imagePreview && <img src={imagePreview} alt="Preview" className="image-preview" />}
                </div>

                <button onClick={updateTagline} disabled={loading}>
                  {loading ? "Updating..." : "Update Tagline"}
                </button>
                <button onClick={() => { setShowForm(false); setEditIndex(null); }}>Cancel</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default TaglinesAdmin;