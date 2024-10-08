import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "../styles/Register.module.css";

const Register = ({ loggedIn, setLoggedIn }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate(); //nav to account page on registration

  const handleSubmit = async (e) => {
    e.preventDefault();

    //register user
    try {
      await axios.post("http://localhost:3000/api/auth/register", {
        firstName,
        lastName,
        userName,
        email,
        password,
      });

      //Log user in
      const loginResponse = await axios.post(
        "http://localhost:3000/api/auth/login",
        {
          userName,
          password,
        }
      );

      //store token in local storage
      const { token } = loginResponse.data;
      localStorage.setItem("token", token);
      if (token) {
        setLoggedIn(true);
      }

      navigate("/account");
    } catch (error) {
      console.log(error);
      setError("Registration failed. Please try again.");
    }
  };

  return (
    <>
      <div className={styles.registerForm}>
        <form onSubmit={handleSubmit}>
          <h2>Register</h2>
          {/* <div> */}
          <label>First Name:</label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />

          <label>Last Name:</label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />

          <label>Username:</label>
          <input
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            required
          />

          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && <p style={{ color: "red" }}>{error}</p>}
          <button type="submit">Register</button>
        </form>
      </div>
    </>
  );
};

export default Register;
