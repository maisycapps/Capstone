import { useEffect, useState } from "react";
import axios, { formToJSON } from "axios";
import styles from "../../styles/AccountSubs.module.css";

const EditTrip = ({ viewEditFormId, setViewEditFormId, setSeeEditForm, setUpdateTrips }) => {

//EDIT POST DATA
const [destinations, setDestinations] = useState([]);
const [destinationId, setDestinationId] = useState("");
const [tripName, setTripName] = useState("");
const [startDate, setStartDate] = useState("");
const [endDate, setEndDate] = useState("");
const [error, setError] = useState(null);


//GET DESTINATIONS FOR DROPDOWN MENU
useEffect(() => {
  
    const fetchDestinations = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/destinations"
        );
        setDestinations(response.data);

      } catch (error) {
        console.error("Error fetching destinations", error);
      }
    };

    fetchDestinations();
}, []);

  //EDIT TRIP BY ID
  const editTrip = async(e) => {

    e.preventDefault();

    const token = localStorage.getItem("token");

    try {

      await axios.put(`http://localhost:3000/api/auth/account/trips/${viewEditFormId}`,
        { tripName,
          destinationId: parseInt(destinationId),
          startDate,
          endDate, },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      ) 

    } catch (error) {
          setError("please modify at least one field", error)
    }
    setViewEditFormId("")
    setSeeEditForm(false)
    setUpdateTrips(true)
  };

    return ( 
        <>
        <h4>Edit Trip</h4>

        <form onSubmit={editTrip}>

          <div className={styles.editForm}>

        
            <label htmlFor="tripName">Change Trip Name:</label>
            <input
              type="text"
              id="tripName"
              value={tripName}
              onChange={(e) => setTripName(e.target.value)}
            />

            <label htmlFor="destination">
                <select
                    id="destination"
                    value={destinationId}
                    onChange={(e) => setDestinationId(e.target.value)} 
                    >
                    <option value="">Change Destination</option>
                    {destinations.map((destination) => (
                        <option key={destination.id} value={destination.id}>
                            {destination.destinationName}
                        </option>
                    ))}
                </select>
            </label>

            <label htmlFor="startDate">Change Start Date:</label>
            <input
              type="date"
              id="startDate"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />

            <label htmlFor="endDate">Change End Date:</label>
            <input
              type="date"
              id="endDate"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              />

            {error && <p style={{ color: "red" }}>{error}</p>}
          </div>
          <div className={styles.editFormButtons}>
             
              <button value="submit">Submit</button>  
            
          </div>

        </form>
        </>
    );
}
 
export default EditTrip;