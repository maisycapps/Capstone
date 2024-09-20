import { Routes, Route } from "react-router-dom";

import NavBar from "./Components/NavBar";
// import Home from "./Pages/Home";
// import Home from "./Pages/Home";
import About from "./Pages/About";
import Gallery from "./Pages/Gallery";
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

  //checks if user is logged in on intial render
  useEffect(() => {
    setLoggedIn(isAuthenticated());
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isAuthenticated()) {
        setLoggedIn(false); //logs user out if token is expired
        localStorage.removeItem("token"); //clears token from local storage
        window.location.href = "/login"; //redirects to login page
      }
    }, 600000); //checks every 60 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <NavBar loggedIn={loggedIn} setLoggedIn={setLoggedIn} />

      <Routes>
        <Route path="/" element={<Overview />} />

        <Route path="/about" element={<About />} />

        <Route path="/gallery" element={<Gallery />} />
        <Route path="/user" element={<Post />} />
        <Route path="/login" element={<Login setLoggedIn={setLoggedIn} />} />
        <Route
          path="/register"
          element={<Register loggedIn={loggedIn} setLoggedIn={setLoggedIn} />}
        />
        <Route
          path="/account"
          element={loggedIn ? <Account /> : <Navigate to="/login" />}
        />
      </Routes>
    </div>
  );
}

export default App;
