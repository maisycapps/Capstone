import { useEffect, useState } from "react";
import axios from "axios";

const MyTrips = ({user}) => {

  const [destinationNames, setDestinationNames] = useState({})

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

  }, [user.trips, destinationNames]);
   
  return ( 
    <> 
      <p>MyTrips</p>
        
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
              </>
          )}
        </div>
    </> 
  );
}
 
export default MyTrips;