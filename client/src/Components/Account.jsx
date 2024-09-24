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

const Account = ({ setLoggedIn }) => {

  const [user, setUser] = useState(null); 

  //Re-Rendering Dependency
  const [updatedUser, setUpdatedUser] = useState(false);


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

  }, [updatedUser]); 



  return (
    <>
      <div className={styles.accountCard}>
        
        {user ? 
          ( //IF THERE IS A USER
          <>  
          <div className={styles.account}>

            {user.profileImg ? (
            <img src={user.profileImg} alt="Profile Image" /> ) : (<img src={italy} alt="Default Profile Image" />  )}

            <h2>{user.firstName} {user.lastName}</h2>  

            {user.bio ? <><p>{user.bio}</p></> : null}

            {/* WHO THE USER FOLLOWS*/}  
            <p><b>Following</b></p>
            <p>{user.followedBy.length}</p>


            {/* WHO THE USER IS FOLLOWED BY*/}
            <p><b>Followers</b></p>
            <p>{user.following.length}</p>

            <p><b>Posts</b></p>
            <p>{user.posts.length}</p>

            <p><b>Trips</b></p>
            <p>{user.trips.length}</p>
            
          </div>
          
          <div className={styles.accountNav}>
            <AccountNav />
          </div>
          

            {/* CURRENT URL LOCATION /ACCOUNT */}
            <Routes>
              <Route path="followers" element={<Followers user={user}/>}/>
              <Route path="following" element={<Following user={user}/>}/>
              <Route path="myposts" element={<MyPosts user={user} setUpdatedUser={setUpdatedUser}/>}/>
              <Route path="mytrips" element={<MyTrips user={user} setUpdatedUser={setUpdatedUser}/>}/>
              <Route path="settings" element={<Settings user={user} setUpdatedUser={setUpdatedUser} setLoggedIn={setLoggedIn}/>}/>
            </Routes>
          </>
          ) : (
          //IF USER IS LOADING
          <div className={styles.loading}>
              <p>Loading account details...</p>
          </div>      
          )
        }
      </div>  
    </>
  )
}

export default Account;
