import React, { useState, useEffect } from "react";

const MyServicesAdmin = () => {
  const [services, setServices] = useState([]);
  const [newService, setNewService] = useState({
    myservice_name: "",
    myservice_image: null,
    myservice_description: "",
    myservice_type: "individual", // Default value
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [selectedService, setSelectedService] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await fetch("https://trial-backend-dama.vercel.app/myservices");
      const data = await response.json();
      setServices(data);
    } catch (error) {
      console.error("Error fetching services:", error);
      setMessage("Failed to load services.");
    }
  };

  const addService = async () => {
    if (!newService.myservice_name || !newService.myservice_image) {
      setMessage("Service name and image are required.");
      return;
    }

    if (newService.myservice_image.size > 5 * 1024 * 1024) {
      setMessage("Image size must be less than 5MB.");
      return;
    }

    if (!newService.myservice_image.type.startsWith("image/")) {
      setMessage("File type must be an image.");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("myservice_name", newService.myservice_name);
      formData.append("myservice_image", newService.myservice_image);
      formData.append("myservice_description", newService.myservice_description);
      formData.append("myservice_type", newService.myservice_type);

      const response = await fetch("https://trial-backend-dama.vercel.app/myservices", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        setMessage("Service added successfully!");
        fetchServices();
        setNewService({
          myservice_name: "",
          myservice_image: null,
          myservice_description: "",
          myservice_type: "individual",
        });
        setImagePreview(null);
      } else {
        const errorData = await response.json();
        setMessage(`Failed to add service: ${errorData.error}`);
      }
    } catch (error) {
      console.error("Error adding service:", error);
      setMessage(`Failed to add service: ${error.message}`);
    }
    setLoading(false);
  };

  const updateService = async () => {
    if (!newService.myservice_name) {
      setMessage("Service name is required.");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("myservice_name", newService.myservice_name);
      formData.append("myservice_image", newService.myservice_image);
      formData.append("myservice_description", newService.myservice_description);
      formData.append("myservice_type", newService.myservice_type);

      const response = await fetch(`https://trial-backend-dama.vercel.app/myservices/${selectedService.id}`, {
        method: "PUT",
        body: formData,
      });

      if (response.ok) {
        setMessage("Service updated successfully!");
        fetchServices();
        setNewService({
          myservice_name: "",
          myservice_image: null,
          myservice_description: "",
          myservice_type: "individual",
        });
        setSelectedService(null);
        setImagePreview(null);
      } else {
        const errorData = await response.json();
        setMessage(`Failed to update service: ${errorData.error}`);
      }
    } catch (error) {
      console.error("Error updating service:", error);
      setMessage(`Failed to update service: ${error.message}`);
    }
    setLoading(false);
  };

  const deleteService = async (id) => {
    setLoading(true);
    try {
      const response = await fetch(`https://trial-backend-dama.vercel.app/myservices/${id}`, { method: "DELETE" });
      if (response.ok) {
        setMessage("Service deleted successfully!");
        fetchServices();
      } else {
        const errorData = await response.json();
        setMessage(`Failed to delete service: ${errorData.error}`);
      }
    } catch (error) {
      console.error("Error deleting service:", error);
      setMessage("Failed to delete service.");
    }
    setLoading(false);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setNewService({ ...newService, myservice_image: file });
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const handleEdit = (service) => {
    setSelectedService(service);
    setNewService({
      myservice_name: service.myservice_name,
      myservice_description: service.myservice_description,
      myservice_type: service.myservice_type,
      myservice_image: null,
    });
    setImagePreview(service.myservice_image);
  };

  return (
    <div>
      {message && <p>{message}</p>}

      <div>
        <input type="text" placeholder="Service Name" value={newService.myservice_name} onChange={(e) => setNewService({ ...newService, myservice_name: e.target.value })} />
        <input type="text" placeholder="Description" value={newService.myservice_description} onChange={(e) => setNewService({ ...newService, myservice_description: e.target.value })} />
        <select value={newService.myservice_type} onChange={(e) => setNewService({ ...newService, myservice_type: e.target.value })}>
          <option value="individual">Individual</option>
          <option value="special">Special</option>
        </select>
        <input type="file" accept="image/*" onChange={handleImageChange} />
        {imagePreview && <img src={imagePreview} alt="Preview" style={{ maxWidth: "100px" }} />}
        <button onClick={selectedService ? updateService : addService} disabled={loading}>
          {loading ? (selectedService ? "Updating..." : "Adding...") : selectedService ? "Update Service" : "Add Service"}
        </button>
      </div>

      <div>
        {services.map((service) => (
          <div key={service.id}>
            <img src={service.myservice_image} alt={service.myservice_name} style={{ maxWidth: "100px" }} />
            <h2>{service.myservice_name}</h2>
            <p>{service.myservice_description}</p>
            <p>Type: {service.myservice_type}</p>
            <button onClick={() => handleEdit(service)}>Edit</button>
            <button onClick={() => deleteService(service.id)} disabled={loading}>
              {loading ? "Deleting..." : "Delete"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyServicesAdmin;