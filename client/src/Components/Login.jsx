import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "../styles/Login.module.css";

const Login = ({ setLoggedIn }) => {
  //useStates
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate(); //nav for successful login

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:3000/api/auth/login",
        {
          userName,
          password,
        }
      );

      //token
      const { token } = response.data;

      //save token to local storage
      localStorage.setItem("token", token);

      //authinticate state
      setLoggedIn(true);

      //nav to account
      navigate("/account");
    } catch (error) {
      setError("Invalid Username or Password");
    }
  };

  return (
    <>
      <div className={styles.formContainer}>
        <form onSubmit={handleSubmit}>
          <h2>Login</h2>

          <label>Username:</label>
          <input
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            required
          />

          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit">Login</button>
        </form>
      </div>
    </>
  );
};

export default Login;
