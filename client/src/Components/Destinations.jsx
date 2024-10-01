import styles from "../styles/Destinations.module.css";
import { useState, useEffect } from "react";
import axios from "axios";

const Destinations = () => {
  const [destinations, setDestinations] = useState([]);

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/destinations"
        );

        setDestinations(response.data);
      } catch (error) {
        console.error("Error fetching destinations: ", error);
      }
    };

    fetchDestinations();
  }, []);
  /**/
  return (
    <>
      <h1>Explore our Destinations</h1>

      {destinations.length > 0 ? (
        <div className={styles.desContainer}>
          {destinations.map((destination) => (
            <div key={destination.id} className={styles.desCard}>
              <img
                src={destination.destinationImg}
                alt={destination.destinationName}
                className={styles.desImage}
              />
              <div className={styles.desDetail}>
                <h2>{destination.destinationName}</h2>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No destinations found.</p>
      )}
    </>
  );
};

export default Destinations;
