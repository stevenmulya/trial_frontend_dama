import React, { useState, useEffect } from "react";

const Myportofolio = () => {
  const [myportofolios, setMyportofolios] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");

  useEffect(() => {
    fetchMyportofolios();
  }, []);

  const fetchMyportofolios = async () => {
    setLoading(true);
    try {
      const response = await fetch("https://trial-backend-dama.vercel.app/myportofolios");
      const data = await response.json();
      setMyportofolios(data);
    } catch (error) {
      console.error("Error fetching myportofolios:", error);
      setMessage("Failed to load myportofolios.");
    } finally {
      setLoading(false);
    }
  };

  const filteredPortofolios = myportofolios
    .filter((portofolio) =>
      portofolio.myportofolio_name
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    )
    .filter((portofolio) =>
      filterType === "all" ? true : portofolio.myportofolio_type === filterType
    );

  const handleFilterChange = (type) => {
    setFilterType(type);
  };

  const handlePortfolioClick = (name) => {
    const sanitizedName = name.replace(/\s+/g, '-');
    window.location.href = `/portofolio/${sanitizedName}`;
  };

  return (
    <section>
      <style jsx>{`
        section {
          padding: 10px 20px;
          text-align: center;
        }
        p {
          color: red;
          margin-bottom: 20px;
        }
        p:last-of-type {
          color: black;
        }
        h2 {
          font-size: 36px;
          font-weight: 600;
          margin-bottom: 20px;
          color: #333;
        }
        input {
          padding: 10px;
          margin-bottom: 20px;
          width: 100%;
          max-width: 400px;
          border: 1px solid #ccc;
          border-radius: 4px;
        }
        div.filterButtons {
          margin-bottom: 20px;
        }
        button.filterButton {
          padding: 10px 15px;
          margin: 5px;
          border: 1px solid #ccc;
          border-radius: 4px;
          background-color: white;
          cursor: pointer;
        }
        button.filterButton.active {
          background-color: #007bff;
          color: white;
        }
        div.container {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 30px;
          max-width: 1200px;
          margin: 0 auto 40px;
        }
        div.portofolioItem {
          position: relative;
          border: 1px solid #e0e0e0;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          cursor: pointer;
        }
        div.portofolioItem:hover {
          transform: translateY(-5px);
          box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
        }
        div.portofolioItem img {
          width: 100%;
          height: 250px;
          object-fit: cover;
          transition: opacity 0.3s ease;
        }
        div.portofolioItem:hover img {
          opacity: 0.8;
        }
        div.portofolioItem h3 {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          background: rgba(0, 0, 0, 0.7);
          color: white;
          padding: 20px;
          font-size: 22px;
          font-weight: 500;
          text-align: left;
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        div.portofolioItem:hover h3 {
          opacity: 1;
        }
      `}</style>

      <h2>View our portfolio</h2>

      <input
        type="text"
        placeholder="Search portfolio..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <div className="filterButtons">
        <button
          className={`filterButton ${filterType === "all" ? "active" : ""}`}
          onClick={() => handleFilterChange("all")}
        >
          All
        </button>
        <button
          className={`filterButton ${filterType === "type a" ? "active" : ""}`}
          onClick={() => handleFilterChange("type a")}
        >
          Type A
        </button>
        <button
          className={`filterButton ${filterType === "type b" ? "active" : ""}`}
          onClick={() => handleFilterChange("type b")}
        >
          Type B
        </button>
        <button
          className={`filterButton ${filterType === "type c" ? "active" : ""}`}
          onClick={() => handleFilterChange("type c")}
        >
          Type C
        </button>
        <button
          className={`filterButton ${filterType === "type d" ? "active" : ""}`}
          onClick={() => handleFilterChange("type d")}
        >
          Type D
        </button>
      </div>

      {message && <p>{message}</p>}
      {loading && <p>Loading...</p>}

      <div className="container">
        {filteredPortofolios.map((myportofolio) => (
          <div
            key={myportofolio.id}
            onClick={() => handlePortfolioClick(myportofolio.myportofolio_name)}
            className="portofolioItem"
          >
            <img
              src={myportofolio.myportofolio_image}
              alt={myportofolio.myportofolio_name}
            />
            <h3>{myportofolio.myportofolio_name}</h3>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Myportofolio;