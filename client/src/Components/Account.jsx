import italy from "./Images/italy.jpg";
import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "../styles/Account.module.css";

const Account = () => {
  const [user, setUser] = useState(null); 

  useEffect(() => {
    const fetchData = async () => {
      try {

        const token = localStorage.getItem("token");

        // Fetch user's data
        const response = await axios.get("http://localhost:3000/api/auth/account/users", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
      });
        const accountData = await response.data[0];
        setUser(accountData);

      } catch (error) {
        console.error("Error fetching user account data", error);

      }
  };

    fetchData();
    console.log("user", user)
  }, []); 

  return (
    <>
    <div className={styles.accountCard}>
      
      {user ? ( 
        <div className={styles.account}>

          {user.profileImg ? (
          <img src={user.profileImg} alt="Profile Image" /> ) : (<img src={italy} alt="Default Profile Image" />  )}

          <h3>Welcome to your account, {user.firstName} {user.lastName}</h3>
          <h5>{user.userName}</h5>
          {user.bio ? <p>{user.bio}</p> : null}
        </div>
        ) : (
          <p>Loading account details...</p>
      )};
   
    </div>
    </>
  );
};

export default Account;
