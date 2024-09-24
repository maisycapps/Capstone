import { useEffect, useState } from "react";
import axios from "axios";
import CreateTrip from '../CreateTrip';

const MyTrips = ({ user }) => {

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
        
        <div>
          {user.trips.length > 0 ? (
              user.trips.map((trip) => (
                <div key={trip.id}>
            
                  <p>{trip.tripName}</p>
              
                  <p>Where: {destinationNames[trip.destinationId] || "Loading..."}</p>

                  <p>Start Date: {new Date(trip.startDate).toLocaleDateString()}</p>
                  <p>End Date: {new Date(trip.endDate).toLocaleDateString()}</p>

                </div>
              ))
            ) : (
              <>
                <p>No Trips Yet</p>
                <button onClick={setNewTripForm(true)}>Create your first Trip</button>
                {newTripForm === true ? <CreateTrip setNewTripForm={setNewTripForm}/> : null}
              </>
          )}
        </div>
    </> 
  );
}
 
export default MyTrips;