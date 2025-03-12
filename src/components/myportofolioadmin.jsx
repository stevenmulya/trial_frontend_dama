import React, { useState, useEffect } from "react";

const MyPortfolioAdmin = () => {
  const [portfolios, setPortfolios] = useState([]);
  const [newPortfolio, setNewPortfolio] = useState({
    myportofolio_name: "",
    myportofolio_image: null,
    myportofolio_description: "",
    myportofolio_date: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [selectedPortfolio, setSelectedPortfolio] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    fetchPortfolios();
  }, []);

  const fetchPortfolios = async () => {
    try {
      const response = await fetch("https://trial-backend-dama.vercel.app/myportofolios");
      const data = await response.json();
      setPortfolios(data);
    } catch (error) {
      console.error("Error fetching portfolios:", error);
      setMessage("Failed to load portfolios.");
    }
  };

  const addPortfolio = async () => {
    if (!newPortfolio.myportofolio_name || !newPortfolio.myportofolio_image) {
      setMessage("Portfolio name and image are required.");
      return;
    }

    if (newPortfolio.myportofolio_image.size > 5 * 1024 * 1024) {
      setMessage("Image size must be less than 5MB.");
      return;
    }

    if (!newPortfolio.myportofolio_image.type.startsWith("image/")) {
      setMessage("File type must be an image.");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("myportofolio_name", newPortfolio.myportofolio_name);
      formData.append("myportofolio_image", newPortfolio.myportofolio_image);
      formData.append("myportofolio_description", newPortfolio.myportofolio_description);
      formData.append("myportofolio_date", newPortfolio.myportofolio_date);

      const response = await fetch("https://trial-backend-dama.vercel.app/myportofolios", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        setMessage("Portfolio added successfully!");
        fetchPortfolios();
        setNewPortfolio({
          myportofolio_name: "",
          myportofolio_image: null,
          myportofolio_description: "",
          myportofolio_date: "",
        });
        setImagePreview(null);
      } else {
        const errorData = await response.json();
        setMessage(`Failed to add portfolio: ${errorData.error}`);
      }
    } catch (error) {
      console.error("Error adding portfolio:", error);
      setMessage(`Failed to add portfolio: ${error.message}`);
    }
    setLoading(false);
  };

  const updatePortfolio = async () => {
    if (!newPortfolio.myportofolio_name) {
      setMessage("Portfolio name is required.");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("myportofolio_name", newPortfolio.myportofolio_name);
      formData.append("myportofolio_image", newPortfolio.myportofolio_image);
      formData.append("myportofolio_description", newPortfolio.myportofolio_description);
      formData.append("myportofolio_date", newPortfolio.myportofolio_date);

      const response = await fetch(`https://trial-backend-dama.vercel.app/myportofolios/${selectedPortfolio.id}`, {
        method: "PUT",
        body: formData,
      });

      if (response.ok) {
        setMessage("Portfolio updated successfully!");
        fetchPortfolios();
        setNewPortfolio({
          myportofolio_name: "",
          myportofolio_image: null,
          myportofolio_description: "",
          myportofolio_date: "",
        });
        setSelectedPortfolio(null);
        setImagePreview(null);
      } else {
        const errorData = await response.json();
        setMessage(`Failed to update portfolio: ${errorData.error}`);
      }
    } catch (error) {
      console.error("Error updating portfolio:", error);
      setMessage(`Failed to update portfolio: ${error.message}`);
    }
    setLoading(false);
  };

  const deletePortfolio = async (id) => {
    setLoading(true);
    try {
      const response = await fetch(`https://trial-backend-dama.vercel.app/myportofolios/${id}`, { method: "DELETE" });
      if (response.ok) {
        setMessage("Portfolio deleted successfully!");
        fetchPortfolios();
      } else {
        const errorData = await response.json();
        setMessage(`Failed to delete portfolio: ${errorData.error}`);
      }
    } catch (error) {
      console.error("Error deleting portfolio:", error);
      setMessage("Failed to delete portfolio.");
    }
    setLoading(false);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setNewPortfolio({ ...newPortfolio, myportofolio_image: file });
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const handleEdit = (portfolio) => {
    setSelectedPortfolio(portfolio);
    setNewPortfolio({
      myportofolio_name: portfolio.myportofolio_name,
      myportofolio_description: portfolio.myportofolio_description,
      myportofolio_date: portfolio.myportofolio_date,
      myportofolio_image: null,
    });
    setImagePreview(portfolio.myportofolio_image);
  };

  return (
    <div>
      {message && <p>{message}</p>}

      <div>
        <input type="text" placeholder="Portfolio Name" value={newPortfolio.myportofolio_name} onChange={(e) => setNewPortfolio({ ...newPortfolio, myportofolio_name: e.target.value })} />
        <input type="text" placeholder="Description" value={newPortfolio.myportofolio_description} onChange={(e) => setNewPortfolio({ ...newPortfolio, myportofolio_description: e.target.value })} />
        <input type="date" placeholder="Date" value={newPortfolio.myportofolio_date} onChange={(e) => setNewPortfolio({ ...newPortfolio, myportofolio_date: e.target.value })} />
        <input type="file" accept="image/*" onChange={handleImageChange} />
        {imagePreview && <img src={imagePreview} alt="Preview" style={{ maxWidth: "100px" }} />}
        <button onClick={selectedPortfolio ? updatePortfolio : addPortfolio} disabled={loading}>{loading ? (selectedPortfolio ? "Updating..." : "Adding...") : selectedPortfolio ? "Update Portfolio" : "Add Portfolio"}</button>
      </div>

      <div>
        {portfolios.map((portfolio) => (
          <div key={portfolio.id}>
            <img src={portfolio.myportofolio_image} alt={portfolio.myportofolio_name} style={{ maxWidth: "100px" }} />
            <h2>{portfolio.myportofolio_name}</h2>
            <p>{portfolio.myportofolio_description}</p>
            <p>Date: {portfolio.myportofolio_date}</p>
            <button onClick={() => handleEdit(portfolio)}>Edit</button>
            <button onClick={() => deletePortfolio(portfolio.id)} disabled={loading}>{loading ? "Deleting..." : "Delete"}</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyPortfolioAdmin;