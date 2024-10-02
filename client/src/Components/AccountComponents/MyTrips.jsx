import { useEffect, useState } from "react";
import axios from "axios";
import CreateTrip from '../CreateTrip';
import EditTrip from "./EditTrip";
import styles from "../../styles/AccountSubs.module.css";
import PopUp from "../ProfileComponents/PopUp"

const MyTrips = ({ user, setUpdateUser }) => {

/* -------------------------------- CONDITIONAL RENDERING --------------------------------*/
  //CREATE NEW POST
  const [newTripForm, setNewTripForm] = useState(false);

  //EDIT TRIP
  const [seeEditForm, setSeeEditForm] = useState(false); //view EditPost route
  const [viewEditFormId, setViewEditFormId] = useState("") //render edit form only on that post

/* -------------------------------- RE-RENDER DEPENDENCY --------------------------------*/
  const [updateTrips, setUpdateTrips] = useState(false)

/* -------------------------------- USER DATA --------------------------------*/
  const [userId, setUserId] = useState(null);
  const [trips, setTrips] = useState([])

  //SET USER ID
  useEffect(() => {
    if (user && user.id) {
       setUserId(user.id);
    }
  }, [user]); 

/* -------------------------------- TRIPS CRUD --------------------------------*/

  //GET ALL TRIPS
  useEffect(() => {

    const token = localStorage.getItem("token");
  
    const fetchUserTrips = async() => {

      try {
        const response = await axios.get("http://localhost:3000/api/auth/account/trips",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )

        setTrips(response.data);
  
      } catch (error) {
        console.error("Error fetching trips: ", error);
      }
        setUpdateTrips(false);
      };

      fetchUserTrips();
  
  }, [updateTrips]);

  //DELETE TRIP BY ID
  const deleteTrip = async(tripId) => {
 
    const token = localStorage.getItem("token");
  
    try {
      await axios.delete(
        `http://localhost:3000/api/auth/account/trips/${tripId}`,
          {
            headers: {
               Authorization: `Bearer ${token}`,
             },
          }
        );  
    } catch (error) {
        console.error("error deleting post: ", error);
    }
      setUpdateUser(true)
      setUpdateTrips(true)
  }
   
  return ( 
  <>
    {/* CONDITIONALLY RENDER TRIPS OR "NO TRIPS YET"*/}

    { trips.length > 0 
    ? ( <>
         
        {/* CREATE NEW TRIP BUTTON & CONDITIONALLY RENDERED FORM */}

        <div className={styles.addNewSection}>
          {newTripForm === false && trips.length > 0 ?
           <div className={styles.buttonContainer}>
           <button onClick={() => setNewTripForm(true)}>Add New Trip</button>
           </div>
            : null
            }

            {/* CONDITIONALLY RENDER CREATE POST FORM */}
            {newTripForm === true && trips.length > 0 ?
            <>
            <PopUp trigger={newTripForm} setTrigger={setNewTripForm}>

            <div className={styles.addNewSection}>
            <CreateTrip setNewTripForm={setNewTripForm} setUpdateTrips={setUpdateTrips} setUpdateUser={setUpdateUser}/> 
            </div>
            </PopUp>
            </> 
            : null}
        </div>
          
       <div className={styles.list}>

          {trips.map((trip) => {
            return (
              <div key={trip.id} >

                  <div className={styles.listItemCard}>

                    {/* CONDITIONALLY RENDERED EDIT TRIP OR CANCEL BUTTON */}
                    <div className={styles.postModsButtonContainer}>
                      { seeEditForm === true && trip.id === viewEditFormId 
                      ?<button onClick={() => setSeeEditForm(false)}>Cancel</button>
                      :
                      <>
                      {/* EDIT BUTTON --- Change text to gear icon */}
                      <button onClick={() => {
                        setSeeEditForm(true),
                        setViewEditFormId(trip.id)
                        }}>Edit
                      </button>
                      </>
                      }

                      {/* DELETE BUTTON --- Change text to trashcan icon */}
                      <button onClick={() => deleteTrip(trip.id)}>Delete</button>
                    </div>
                 

                {/* CONDITIONALLY RENDER TRIP OR EDIT FORM */}
                { seeEditForm === true && trip.id === viewEditFormId 
                  ? (<> 

                      <div className={styles.listItemCardHeader}>
                        <img src={user.profileImg}/>
                        <p><b>{user.userName}</b></p>
                      </div>

                      <EditTrip viewEditFormId={viewEditFormId} setViewEditFormId={setViewEditFormId} setSeeEditForm={setSeeEditForm} setUpdateTrips={setUpdateTrips}/>
                  
                      </> 
                  ) : (
                    <>
                    
                      <h4 style={{textAlign: "center"}} >"{trip.tripName}"</h4>

                      <div className={styles.postImg}>
                        <img src={trip.destination.destinationImg} alt="destinationImg" />
                      </div>

                      <p><b>Destination: </b> { trip.destination.destinationName || "Loading..."}</p>
                      <p><b>When: </b>{new Date(trip.startDate).toLocaleDateString("en-US", {year: "numeric", month: "long", day: "numeric"})} - {new Date(trip.endDate).toLocaleDateString("en-US", {year: "numeric", month: "long", day: "numeric"})}</p>

                      <p><b>Who's Going: </b> You </p>
                      {/* for T3 other trip users --- filter userId out and return { , trip.user.userName || , "Loading..." } to view other users associated w the trip */}
                      { /* T3 have button to search mutual followers and add to trip */}
                      { /* T3 have button to delete trip guests */}

                      </>
                    
                   
                    )}
                  </div>

              </div>
          )}) 
        }</div>
          </>
        ) : ( 

              <>
              <div className={styles.list}>
                <div className={styles.addNewSection}>
                {newTripForm === false ? 
                  <>
                  <p className={styles.defaultContent}>No Trips Yet</p>
                  <button onClick={() => setNewTripForm(true)}>Create your first Trip</button>
                  </>
                : null}
                {newTripForm === true ? 
                <>
                <button onClick={() => setNewTripForm(false)} >{" "}exit{" "}</button>
                <CreateTrip setNewTripForm={setNewTripForm} setUpdateTrips={setUpdateTrips} setUpdateUser={setUpdateUser}/>
                </>
                : null}
                </div>
                </div>
              </>
        )
    }
  </>
  )
};
 
export default MyTrips;