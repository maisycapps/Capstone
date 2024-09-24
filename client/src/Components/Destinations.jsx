import { IoLocationOutline, IoPersonCircleOutline } from "react-icons/io5";
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
        console.log(response.data);

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
      {/*------- v wont display because of styling v */}
      <div /*className={styles.desContainer}*/>
        <h1>Explore our Destinations</h1>
        {destinations.length > 0 ? (
          <>
            {destinations.map((destination) => {
              <div key={destination.id} /* className={styles.desCard}*/>
                <img
                  src={destination.destinationImg}
                  alt={
                    destination.destinationName
                  } /* className={styles.desImage}*/
                />

                <div /*className={styles.desDetail}*/>
                  <h3>
                    {/* <IoLocationOutline />*/} {destination.destinationName}
                  </h3>
                  <p>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Itaque adipisci quidem quasi saepe voluptatum temporibus
                    recusandae, laboriosam modi autem praesentium soluta
                    consequatur, dignissimos suscipit esse. Enim,
                    exercitationem. Quidem, fugiat reprehenderit!
                  </p>
                </div>
              </div>;
            })}
          </>
        ) : (
          <p>No destinations found</p>
        )}
      </div>
      {/*------- ^ wont display because of styling ^ */}

      {/*------- v only here so I could see the mapping, can delete when styling fixed v */}
      <div>
        {destinations.length > 0 ? ( // Ensure there's data before rendering
          <div>
            {destinations.map((destination) => (
              <div key={destination.id}>
                <img
                  src={destination.destinationImg}
                  alt={destination.destinationName}
                />
                <h2>{destination.destinationName}</h2>
              </div>
            ))}
          </div>
        ) : (
          <p>No destinations found.</p>
        )}
      </div>
      {/*------- ^ only here so I could see the mapping, can delete when styling fixed ^ */}
    </>
  );
};

export default Destinations;
