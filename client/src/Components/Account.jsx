import italy from "./Images/italy.jpg";
import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "../styles/Account.module.css";

const Account = () => {
  const [user, setUser] = useState(null); 

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetching user authentication data
        const response = await axios.get(`http://localhost:3000/api/auth/account/users`);
        const accountData = response.data;
        setUser(accountData);

      } catch (error) {
        console.error("Error fetching user account data", error);
      }
    };

    fetchData();
  }, []); 

  return (
    <div className={styles.accountCard}>
      {user? ( 
        <div className={styles.account}>
          <img src={italy} alt="User Account" />
          <h3>Welcome to your account, {user.firstName} {user.lastName}</h3>
          
        </div>
      ) : (
        <p>Loading account details...</p>
      )}
    </div>
  );
};

export default Account;
