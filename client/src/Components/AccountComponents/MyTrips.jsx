import { useEffect, useState } from "react";
import axios from "axios";
import CreateTrip from '../CreateTrip';
import styles from "../../styles/AccountSubs.module.css";

const MyTrips = ({ user, setUpdatedUser }) => {

  const [destinationNames, setDestinationNames] = useState({});
  const [newTripForm, setNewTripForm] = useState(false);

  useEffect(() => {

    const getDestinationName = async(destinationId) => {

      try {
        if(!destinationNames[destinationId]) {

          const response = await axios.get(`http://localhost:3000/api/destinations/${destinationId}`);
          const result = await response.data;
            setDestinationNames((prevNames) => ({
            ...prevNames, [destinationId]: result.destinationName,
            }));
        }
      } catch (error) {
        console.error(error)
      }
   };
   
      user.trips.forEach((trip) => {
        getDestinationName(trip.destinationId);
   })

  }, []);
   
  return ( 
    <> 
      <h3>Trips</h3>
        <div className={styles.buttonContainer}>
          <button onClick={() => setNewTripForm(true)}>Add New Trip</button>
        </div>
      {newTripForm === true ? <CreateTrip setNewTripForm={setNewTripForm} setUpdatedUser={setUpdatedUser}/> : null}
        
        <div className={styles.list}>
          {user.trips.length > 0 ? (
              user.trips.map((trip) => (
                <div key={trip.id} className={styles.listItemCard}>

                  <div className={styles.listItemCardHeader}>
                    <img src={user.profileImg}/>
                    <p><b>{user.userName}</b></p>
                  </div>

                  <h4>"{trip.tripName}"</h4>
              
                  <p><b>Destination: </b> {destinationNames[trip.destinationId] || "Loading..."}</p>

                  <p><b>Start Date:</b> {new Date(trip.startDate).toLocaleDateString()}</p>
                  <p><b>End Date:</b> {new Date(trip.endDate).toLocaleDateString()}</p>

                </div>
              ))
            ) : (
              <>
                <p className={styles.defaultContent}>No Trips Yet</p>
                <button onClick={() => setNewTripForm(true)}>Create your first Trip</button>
                {newTripForm === true ? <CreateTrip setNewTripForm={setNewTripForm} setUpdatedUser={setUpdatedUser}/> : null}
              </>
            )
          }
        </div>
    </> 
  );
}
 
export default MyTrips;