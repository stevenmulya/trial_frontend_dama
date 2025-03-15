import React, { useState } from 'react';
import TaglinesAdmin from '../components/taglinesadmin.jsx';
import ToservicesAdmin from '../components/toservicesadmin.jsx';
import ClientlogosAdmin from '../components/clientlogosadmin.jsx';
import TestimonialsAdmin from '../components/testimonialsadmin.jsx';
import ToinstagramsAdmin from '../components/toinstagramsadmin.jsx';

const MyHomeAdmin = () => {
  const [activeComponent, setActiveComponent] = useState(null);

  const handleNavigation = (component) => {
    setActiveComponent(component);
  };

  return (
    <div>
      <nav>
        <button onClick={() => handleNavigation(<TaglinesAdmin />)}>Taglines Admin</button>
        <button onClick={() => handleNavigation(<ToservicesAdmin />)}>Services Admin</button>
        <button onClick={() => handleNavigation(<ClientlogosAdmin />)}>Client Logos Admin</button>
        <button onClick={() => handleNavigation(<TestimonialsAdmin />)}>Testimonials Admin</button>
        <button onClick={() => handleNavigation(<ToinstagramsAdmin />)}>Instagrams Admin</button>
      </nav>
      <main>
        {activeComponent}
      </main>
      <style jsx>{`
        nav {
          display: flex;
          justify-content: center;
          margin-bottom: 20px;
        }

        nav button {
          padding: 10px 15px;
          margin: 0 5px;
          border: 1px solid #ddd;
          border-radius: 4px;
          background-color: #f0f0f0;
          cursor: pointer;
        }

        nav button:hover {
          background-color: #e0e0e0;
        }

        main {
          padding: 20px;
        }
      `}</style>
    </div>
  );
};

export default MyHomeAdmin;