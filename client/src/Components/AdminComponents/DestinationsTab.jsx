import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "../../styles/DestinationTab.module.css";

const Destinations = () => {
  const [destinations, setDestinations] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [destinationName, setDestinationName] = useState("");
  const [destinationImg, setDestinationImg] = useState("");

  useEffect(() => {
    fetchDestinations();
  }, []);

  const fetchDestinations = async () => {
    const token = localStorage.getItem("token");

    try {
      const response = await axios.get(
        "http://localhost:3000/api/admin/destinations",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setDestinations(response.data);
    } catch (error) {
      console.error("Error fetching destinations:", error);
    }
  };

  const handleCreateDestination = async (e) => {
    const token = localStorage.getItem("token");

    e.preventDefault();
    try {
      await axios.post(
        "http://localhost:3000/api/admin/destinations",
        {
          destinationName,
          destinationImg,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchDestinations();
      setDestinationName("");
      setDestinationImg("");
    } catch (error) {
      console.error("Error creating destination:", error);
    }
  };

  const handleDeleteDestination = async (destinationId) => {
    const token = localStorage.getItem("token");

    if (window.confirm("Are you sure you want to delete this destination?")) {
      try {
        await axios.delete(
          `http://localhost:3000/api/admin/destinations/${destinationId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setDestinations((prevDestinations) =>
          prevDestinations.filter(
            (destination) => destination.id !== destinationId
          )
        );
      } catch (error) {
        console.error("Error deleting destination:", error);
      }
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredDestinations = destinations.filter((destination) =>
    destination.destinationName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={styles.adContainer}>
      <h3>Manage Destinations</h3>


      {/* Search input */}
      <input
        type="text"
        placeholder="Search destinations by name..."
        value={searchTerm}
        className={styles.search}
        onChange={handleSearchChange}
      />

      {/* Form to create a new destination */}

      <div className={styles.form}>
        <form onSubmit={handleCreateDestination}>
          <input
            type="text"
            placeholder="Create Destination Name"
            value={destinationName}
            onChange={(e) => setDestinationName(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Create Destination Image URL"
            value={destinationImg}
            onChange={(e) => setDestinationImg(e.target.value)}
            required
          />
          <button type="submit">Create Destination</button>
        </form>
      </div>

      {/* Render destinations */}

      <div className={styles.desContainer}>
        <ul>
          {filteredDestinations.map((destination) => (
            <li key={destination.id} className={styles.list}>
              <h4>{destination.destinationName}</h4>
              <img
                src={destination.destinationImg}
                alt={destination.destinationName}
                style={{ width: "100px", height: "100px" }}
              />
              <button onClick={() => handleDeleteDestination(destination.id)}>
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Destinations;
