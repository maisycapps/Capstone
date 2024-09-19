import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "../styles/Login-Register.module.css";

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
      <div>
        <h2>Login</h2>
        <form className={styles.form} onSubmit={handleSubmit}>
          <div>
            <label>Username:</label>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Password:</label>
            <input
              type="text"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit">Login</button>
        </form>
      </div>
    </>
  );
};

export default Login;
