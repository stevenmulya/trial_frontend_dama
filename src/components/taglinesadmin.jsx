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
        // ... (kode penambahan tagline sama)
    };

    const updateTagline = async () => {
        // ... (kode pembaruan tagline sama)
    };

    const deleteTagline = async (id) => {
        if (window.confirm("Are you sure you want to delete this tagline?")) {
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
        }
    };

    const handleImageChange = (e) => {
        // ... (kode penanganan perubahan gambar sama)
    };

    const handleEdit = (tagline) => {
        // ... (kode penanganan pengeditan sama)
    };

    return (
        <section className="taglines-admin" style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Manage Taglines</h2>
            {message && <p className="message" style={{ color: message.startsWith("Failed") ? 'red' : 'green', marginBottom: '10px', textAlign: 'center' }}>{message}</p>}

            <div className="tagline-form" style={{ marginBottom: '20px', border: '1px solid #ddd', padding: '20px', borderRadius: '5px' }}>
                <h3 style={{ marginBottom: '10px' }}>{selectedTagline ? "Edit Tagline" : "Add New Tagline"}</h3>
                <div style={{ marginBottom: '10px' }}>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Title:</label>
                    <input type="text" placeholder="Tagline Title" value={newTagline.tagline_title} onChange={(e) => setNewTagline({ ...newTagline, tagline_title: e.target.value })} style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }} />
                </div>
                <div style={{ marginBottom: '10px' }}>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Subtitle:</label>
                    <input type="text" placeholder="Tagline Subtitle" value={newTagline.tagline_subtitle} onChange={(e) => setNewTagline({ ...newTagline, tagline_subtitle: e.target.value })} style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }} />
                </div>
                <div style={{ marginBottom: '10px' }}>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Image:</label>
                    <input type="file" accept="image/*" onChange={handleImageChange} style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }} />
                    {imagePreview && <img src={imagePreview} alt="Preview" className="image-preview" style={{ maxWidth: '100px', marginTop: '10px' }} />}
                </div>
                <button onClick={selectedTagline ? updateTagline : addTagline} disabled={loading} style={{ padding: '10px 15px', background: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                    {loading ? (selectedTagline ? "Updating..." : "Adding...") : selectedTagline ? "Update Tagline" : "Add Tagline"}
                </button>
            </div>

            <div className="tagline-list" style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '5px' }}>
                <h3 style={{ marginBottom: '10px' }}>Current Taglines</h3>
                {taglines.map((tagline) => (
                    <div key={tagline.id} className="tagline-item" style={{ borderBottom: '1px solid #eee', padding: '10px 0', display: 'flex', alignItems: 'center' }}>
                        <img src={tagline.tagline_image} alt={tagline.tagline_title} className="tagline-image" style={{ maxWidth: '80px', marginRight: '10px' }} />
                        <div style={{ flex: 1 }}>
                            <h4 style={{ margin: '0' }}>{tagline.tagline_title}</h4>
                            <p style={{ margin: '0' }}>{tagline.tagline_subtitle}</p>
                        </div>
                        <div>
                            <button onClick={() => handleEdit(tagline)} style={{ padding: '5px 10px', background: '#f0ad4e', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer', marginRight: '5px' }}>Edit</button>
                            <button onClick={() => deleteTagline(tagline.id)} disabled={loading} style={{ padding: '5px 10px', background: '#d9534f', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer' }}>
                                {loading ? "Deleting..." : "Delete"}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default TaglinesAdmin;