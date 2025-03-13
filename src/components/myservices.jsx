import React, { useState, useEffect } from "react";

const Myservices = () => {
    const [individualImage, setIndividualImage] = useState(null);
    const [specialImage, setSpecialImage] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchServices();
    }, []);

    const fetchServices = async () => {
        try {
            const response = await fetch("https://trial-backend-dama.vercel.app/myservices");
            const data = await response.json();

            const individualServices = data.filter(
                (service) => service.myservice_type === "individual"
            );
            const specialServices = data.filter(
                (service) => service.myservice_type === "special"
            );

            if (individualServices.length > 0) {
                setIndividualImage(
                    individualServices[individualServices.length - 1].myservice_image
                );
            }
            if (specialServices.length > 0) {
                setSpecialImage(
                    specialServices[specialServices.length - 1].myservice_image
                );
            }
        } catch (error) {
            console.error("Error fetching services:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleIndividualClick = () => {
        window.location.href = "/services/individual";
    };

    const handleSpecialClick = () => {
        window.location.href = "/services/special";
    };

    return (
        <section>
            <style jsx>{`
                section {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    padding: 80px 20px;
                    background: #f4f4f4;
                    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
                }
                .service-container {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    margin: 0 20px;
                    cursor: pointer;
                }
                .service-image {
                    width: 300px;
                    height: 200px;
                    object-fit: cover;
                    border-radius: 8px;
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                    transition: transform 0.3s ease, box-shadow 0.3s ease;
                }
                .service-image:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
                }
                .service-title {
                    margin-top: 10px;
                    font-weight: bold;
                    font-size: 1.2rem;
                }
            `}</style>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <>
                    <div className="service-container" onClick={handleIndividualClick}>
                        {individualImage && (
                            <img
                                src={individualImage}
                                alt="Individual Services"
                                className="service-image"
                            />
                        )}
                        <div className="service-title">INDIVIDUAL SERVICE</div>
                    </div>
                    <div className="service-container" onClick={handleSpecialClick}>
                        {specialImage && (
                            <img
                                src={specialImage}
                                alt="Special Services"
                                className="service-image"
                            />
                        )}
                        <div className="service-title">SPECIAL SERVICE</div>
                    </div>
                </>
            )}
        </section>
    );
};

export default Myservices;