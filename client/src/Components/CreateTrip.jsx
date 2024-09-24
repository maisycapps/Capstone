import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CreateTrip = () => {
  const [destinations, setDestinations] = useState([]);
  const [tripName, setTripName] = useState("");
  const [destinationId, setDestinationId] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  //fetch destinations from backend for dropdown menu
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

  //handle for form
  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    //if no token it will navigate to login
    if (!token) {
      nagivate("/login");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:3000/api/auth/account/trips",
        {
          tripName,
          destinationId: parseInt(destinationId),
          startDate,
          endDate,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Trip created successfully", response.data);

      //navigates to trips page for for the logged in user
      navigate("/account/mytrips");
    } catch (error) {
      setError("Failed to create Trip, Please try again.");
    }
  };

  return (
    <>
      <div>
        <h2>Create a Trip</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="tripName">Trip Name:</label>
            <input
              type="text"
              id="tripName"
              value={tripName}
              onChange={(e) => setTripName(e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="destination">Destination:</label>
            <select
              id="destination"
              value={destinationId}
              onChange={(e) => setDestinationId(e.target.value)}
              required
            >
              <option value="">Select a Destination</option>
              {destinations.map((destination) => (
                <option key={destination.id} value={destination.id}>
                  {destination.destinationName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="startDate">Start Date:</label>
            <input
              type="date"
              id="startDate"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="endDate">End Date:</label>
            <input
              type="date"
              id="endDate"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
            />
          </div>
          {error && <p style={{ color: "red" }}>{error}</p>}
          <button type="submit">Create Trip</button>
        </form>
      </div>
    </>
  );
};

export default CreateTrip;
