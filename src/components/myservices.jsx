import React, { useState, useEffect } from "react";

const Myservices = () => {
  const [myservices, setMyservices] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [filterType, setFilterType] = useState("individual"); // Default filter: individual

  useEffect(() => {
    fetchMyservices();
  }, []);

  const fetchMyservices = async () => {
    setLoading(true);
    try {
      const response = await fetch("https://trial-backend-dama.vercel.app/myservices");
      const data = await response.json();
      setMyservices(data);
    } catch (error) {
      console.error("Error fetching myservices:", error);
      setMessage("Failed to load myservices.");
    } finally {
      setLoading(false);
    }
  };

  const filteredServices = myservices.filter(
    (service) => service.myservice_type === filterType
  );

  const handleFilterChange = (type) => {
    setFilterType(type);
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
        div.servicesContainer {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 30px;
          max-width: 1200px;
          margin: 0 auto 40px;
        }
        div.serviceItem {
          background-color: white;
          border-radius: 8px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          padding: 20px;
          text-align: left;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        div.serviceItem:hover {
          transform: translateY(-5px);
          box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
        }
        div.serviceItem img {
          width: 100%;
          height: 200px;
          object-fit: cover;
          border-radius: 8px;
          margin-bottom: 15px;
        }
        div.serviceItem h3 {
          font-size: 24px;
          margin-bottom: 10px;
          color: #333;
        }
        div.serviceItem p {
          font-size: 16px;
          color: #555;
          line-height: 1.6;
        }
      `}</style>

      <h2>Our Services</h2>

      <div className="filterButtons">
        <button
          className={`filterButton ${filterType === "individual" ? "active" : ""}`}
          onClick={() => handleFilterChange("individual")}
        >
          Individual
        </button>
        <button
          className={`filterButton ${filterType === "special" ? "active" : ""}`}
          onClick={() => handleFilterChange("special")}
        >
          Special
        </button>
      </div>

      {message && <p>{message}</p>}
      {loading && <p>Loading...</p>}

      <div className="servicesContainer">
        {filteredServices.map((myservice) => (
          <div key={myservice.id} className="serviceItem">
            <img
              src={myservice.myservice_image}
              alt={myservice.myservice_title}
            />
            <h3>{myservice.myservice_title}</h3>
            <p>{myservice.myservice_description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Myservices;