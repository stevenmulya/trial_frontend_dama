import React, { useState, useEffect } from "react";

const ClientlogosAdmin = () => {
  const [clientlogos, setClientlogos] = useState([]);
  const [newClientlogo, setNewClientlogo] = useState({
    clientlogo_name: "",
    clientlogo_link: "",
    clientlogo_image: null,
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [selectedClientlogo, setSelectedClientlogo] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    fetchClientlogos();
  }, []);

  const fetchClientlogos = async () => {
    try {
      const response = await fetch("https://trial-backend-dama.vercel.app/clientlogos");
      const data = await response.json();
      setClientlogos(data);
    } catch (error) {
      console.error("Error fetching clientlogos:", error);
      setMessage("Failed to load clientlogos.");
    }
  };

  const addClientlogo = async () => {
    if (!newClientlogo.clientlogo_name || !newClientlogo.clientlogo_image) {
      setMessage("Clientlogo name and image are required.");
      return;
    }

    if (newClientlogo.clientlogo_image.size > 5 * 1024 * 1024) {
      setMessage("Image size must be less than 5MB.");
      return;
    }

    if (!newClientlogo.clientlogo_image.type.startsWith("image/")) {
      setMessage("File type must be an image.");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("clientlogo_name", newClientlogo.clientlogo_name);
      formData.append("clientlogo_link", newClientlogo.clientlogo_link);
      formData.append("clientlogo_image", newClientlogo.clientlogo_image);

      const response = await fetch("https://trial-backend-dama.vercel.app/clientlogos", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        setMessage("Clientlogo added successfully!");
        fetchClientlogos();
        setNewClientlogo({
          clientlogo_name: "",
          clientlogo_link: "",
          clientlogo_image: null,
        });
        setImagePreview(null);
      } else {
        const errorData = await response.json();
        setMessage(`Failed to add clientlogo: ${errorData.error}`);
      }
    } catch (error) {
      console.error("Error adding clientlogo:", error);
      setMessage(`Failed to add clientlogo: ${error.message}`);
    }
    setLoading(false);
  };

  const updateClientlogo = async () => {
    if (!newClientlogo.clientlogo_name) {
      setMessage("Clientlogo name is required.");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("clientlogo_name", newClientlogo.clientlogo_name);
      formData.append("clientlogo_link", newClientlogo.clientlogo_link);
      formData.append("clientlogo_image", newClientlogo.clientlogo_image);

      const response = await fetch(`https://trial-backend-dama.vercel.app/clientlogos/${selectedClientlogo.id}`, {
        method: "PUT",
        body: formData,
      });

      if (response.ok) {
        setMessage("Clientlogo updated successfully!");
        fetchClientlogos();
        setNewClientlogo({
          clientlogo_name: "",
          clientlogo_link: "",
          clientlogo_image: null,
        });
        setSelectedClientlogo(null);
        setImagePreview(null);
      } else {
        const errorData = await response.json();
        setMessage(`Failed to update clientlogo: ${errorData.error}`);
      }
    } catch (error) {
      console.error("Error updating clientlogo:", error);
      setMessage(`Failed to update clientlogo: ${error.message}`);
    }
    setLoading(false);
  };

  const deleteClientlogo = async (id) => {
    setLoading(true);
    try {
      const response = await fetch(`https://trial-backend-dama.vercel.app/clientlogos/${id}`, { method: "DELETE" });
      if (response.ok) {
        setMessage("Clientlogo deleted successfully!");
        fetchClientlogos();
      } else {
        const errorData = await response.json();
        setMessage(`Failed to delete clientlogo: ${errorData.error}`);
      }
    } catch (error) {
      console.error("Error deleting clientlogo:", error);
      setMessage("Failed to delete clientlogo.");
    }
    setLoading(false);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setNewClientlogo({ ...newClientlogo, clientlogo_image: file });
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const handleEdit = (clientlogo) => {
    setSelectedClientlogo(clientlogo);
    setNewClientlogo({
      clientlogo_name: clientlogo.clientlogo_name,
      clientlogo_link: clientlogo.clientlogo_link,
      clientlogo_image: null,
    });
    setImagePreview(clientlogo.clientlogo_image);
  };

  return (
    <section>
      {message && <p>{message}</p>}
      <h2>ClientLogos</h2>
      <div>
        <input
          type="text"
          placeholder="Clientlogo Name"
          value={newClientlogo.clientlogo_name}
          onChange={(e) => setNewClientlogo({ ...newClientlogo, clientlogo_name: e.target.value })}
        />
        <input
          type="text"
          placeholder="Clientlogo Link"
          value={newClientlogo.clientlogo_link}
          onChange={(e) => setNewClientlogo({ ...newClientlogo, clientlogo_link: e.target.value })}
        />
        <input type="file" accept="image/*" onChange={handleImageChange} />
        {imagePreview && <img src={imagePreview} alt="Preview" style={{ maxWidth: "100px" }} />}
        <button onClick={selectedClientlogo ? updateClientlogo : addClientlogo} disabled={loading}>
          {loading ? (selectedClientlogo ? "Updating..." : "Adding...") : selectedClientlogo ? "Update Clientlogo" : "Add Clientlogo"}
        </button>
      </div>

      <div>
        {clientlogos.map((clientlogo) => (
          <div key={clientlogo.id}>
            <img src={clientlogo.clientlogo_image} alt={clientlogo.clientlogo_name} style={{ maxWidth: "100px" }} />
            <h2>{clientlogo.clientlogo_name}</h2>
            <p>{clientlogo.clientlogo_link}</p>
            <button onClick={() => handleEdit(clientlogo)}>Edit</button>
            <button onClick={() => deleteClientlogo(clientlogo.id)} disabled={loading}>
              {loading ? "Deleting..." : "Delete"}
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ClientlogosAdmin;