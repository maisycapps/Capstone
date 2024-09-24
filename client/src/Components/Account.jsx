import italy from "./Images/italy.jpg";
import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "../styles/Account.module.css";

import { Routes, Route } from "react-router-dom";

//ACCOUNT SUBCOMPONENTS (for routes)
import AccountNav from "./AccountComponents/AccountNav";
import Followers from "./AccountComponents/Followers";
import Following from "./AccountComponents/Following";
import MyPosts from "./AccountComponents/MyPosts";
import MyTrips from "./AccountComponents/MyTrips";
import Settings from "./AccountComponents/Settings";

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

  }, []); 



  return (
    <>
      <div className={styles.accountCard}>
        
        {user ? ( 
          <div className={styles.account}>

            {user.profileImg ? (
            <img src={user.profileImg} alt="Profile Image" /> ) : (<img src={italy} alt="Default Profile Image" />  )}

            <h2>{user.firstName} {user.lastName}</h2>  

            {user.bio ? <><p>Bio:</p> <p>{user.bio}</p></> : null}

            <p>Posts</p>
            <p>{user.posts.length}</p>

            {/* who the user follows*/}  
            <p>Following</p>
            <p>{user.followedBy.length}</p>


            {/* who the user is followed by*/}
            <p>Followers</p>
            <p>{user.following.length}</p>

            {/* ACCOUNT NAV BAR */}
            <AccountNav />
            
            {/* CURRENT URL LOCATION /ACCOUNT */}
            <Routes>
              <Route path="followers" element={<Followers user={user}/>}/>
              <Route path="following" element={<Following user={user}/>}/>
              <Route path="myposts" element={<MyPosts user={user}/>}/>
              <Route path="mytrips" element={<MyTrips user={user}/>}/>
              <Route path="settings" element={<Settings user={user}/>}/>
            </Routes>
            

          </div>
          ) : (
          <p>Loading account details...</p>
        )}
      </div>
    </>
  )
}

export default Account;
