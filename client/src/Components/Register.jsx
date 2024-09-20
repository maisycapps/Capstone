import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Register = () => {
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

      navigate("/account");
    } catch (error) {
      setError("Registration failed. Please try again.");
    }
  };

  return (
    <>
      <div className={styles.registerForm}>
        <h2>Register</h2>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div>
            <label>First Name:</label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Last Name:</label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>
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
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p style={{ color: "red" }}>{error}</p>}
          <button type="submit">Register</button>
        </form>
      </div>
    </>
  );
};

export default Register;
