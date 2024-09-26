import { Routes, Route } from "react-router-dom";

import NavBar from "./Components/NavBar";
// import Home from "./Pages/Home";
// import Home from "./Pages/Home";
import About from "./Pages/About";
import Destinations from "./Components/Destinations";
import "./App.css";
import Post from "./Components/Post";
import Overview from "./Components/Overview";
import Login from "./Components/Login";
import Register from "./Components/Register";
import Account from "./Components/Account";
import { isAuthenticated } from "./UtilityFiles/auth";
import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  //checks if user is logged in on intial render
  useEffect(() => {
    const loggedInStatus = isAuthenticated();
    setLoggedIn(loggedInStatus);
    setLoading(false); //sets loading to false after check is done
  }, []);

  useEffect(() => {
    if (isAuthenticated()) {
      const interval = setInterval(() => {
        if (!isAuthenticated()) {
          setLoggedIn(false); // Log user out if token is expired
          localStorage.removeItem("token"); // Clear token from local storage
          window.location.href = "/login"; // Redirect to login page
        }
      }, 60000); // Check every 60 seconds

      return () => clearInterval(interval);
    }
  }, []);

  if (loading) {
    //show loading spinner or message while authentication is checked
    return <div>Loading...</div>;
  }

  return (
    <div>
      <NavBar loggedIn={loggedIn} setLoggedIn={setLoggedIn} />

      <Routes>
        <Route path="*" element={<Overview loggedIn={loggedIn} />} />

        <Route path="/about" element={<About />} />

        <Route path="/destinations" element={<Destinations />} />
        <Route path="/user" element={<Post />} />
        <Route path="/login" element={<Login setLoggedIn={setLoggedIn} />} />
        <Route
          path="/register"
          element={<Register loggedIn={loggedIn} setLoggedIn={setLoggedIn} />}
        />
        <Route
          path="/account/*"
          element={
            loggedIn ? (
              <Account setLoggedIn={setLoggedIn} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>
    </div>
  );
}

export default App;
