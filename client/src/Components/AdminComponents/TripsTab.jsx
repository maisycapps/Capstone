import React, { useState, useEffect } from "react";
import axios from "axios";

const Trips = () => {
  const [trips, setTrips] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch trips on component mount
  useEffect(() => {
    fetchTrips();
  }, []);

  //get all users trips
  const fetchTrips = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(
        "http://localhost:3000/api/admin/trips",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setTrips(response.data);
    } catch (error) {
      console.error("Error fetching trips:", error);
    }
  };

  //delete a users trip
  const handleDeleteTrip = async (tripId) => {
    const token = localStorage.getItem("token");
    if (window.confirm("Are you sure you want to delete this trip?")) {
      try {
        await axios.delete(`http://localhost:3000/api/admin/trips/${tripId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setTrips((prevTrips) => prevTrips.filter((trip) => trip.id !== tripId));
      } catch (error) {
        console.error("Error deleting trip:", error);
      }
    }
  };

  //handle search
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Filter trips by userName
  const filteredTrips = trips.filter((trip) =>
    trip.user.userName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h3>Manage Trips</h3>

      {/* Search input */}
      <input
        type="text"
        placeholder="Search trips by username..."
        value={searchTerm}
        onChange={handleSearchChange}
      />
      {/* filter through trips */}
      <ul>
        {filteredTrips.map((trip) => (
          <li key={trip.id}>
            <h4>{trip.tripName}</h4>
            <p>By: {trip.user.userName}</p>
            <p>Destination: {trip.destination.destinationName}</p>
            <img src={trip.destination.destinationImg} alt="destinationImg" />
            <p>Start Date: {new Date(trip.startDate).toLocaleDateString()}</p>
            <p>End Date: {new Date(trip.endDate).toLocaleDateString()}</p>
            <button onClick={() => handleDeleteTrip(trip.id)}>
              Delete Trip
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Trips;
