import italy from "./Images/italy.jpg";
import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "../styles/Account.module.css";
import { useParams } from "react-router-dom";
import { Routes, Route, useLocation } from "react-router-dom";

//ACCOUNT SUBCOMPONENTS (for routes)
import ProfileNav from "./ProfileComponents/ProfileNav";
import ProfileFollowers from "./ProfileComponents/ProfileFollowers";
import ProfileFollowing from "./ProfileComponents/ProfileFollowing";
import ProfilePosts from "./ProfileComponents/ProfilePosts";

const Profile = () => {
  const location = useLocation();

  /* ---------------- AUTH USER DATA FOR FOLLOW, UNFOLLOW, LIKE & COMMENT FUNCTIONALITIES ------------------ */
  const [updateUser, setUpdateUser] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        // Fetch user's data
        const response = await axios.get(
          "http://localhost:3000/api/auth/account/users",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const accountData = await response.data[0];

        setUser(accountData);
        setUpdateUser(false)

      } catch (error) {
        console.error("Error fetching user account data", error);
      }
    };
    fetchData();
  }, [updateUser]);


  const [following, setFollowing] = useState([]);
  const [updateFollowing, setUpdateFollowing] = useState(false);

  useEffect(() => {

    const token = localStorage.getItem("token");

    const fetchFollowing = async () => {
      try {
          const response = await axios.get(
            `http://localhost:3000/api/auth/account/following`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
        const result = await response.data;
        setFollowing(result)
      }
       catch (error) {
        console.error(error);
      }  
      setUpdateFollowing(false)
    };
    fetchFollowing();

  }, [updateFollowing]);

  const [followers, setFollowers] = useState([]);
  const [updateFollowers, setUpdateFollowers] = useState(false);

  useEffect(() => {

    const token = localStorage.getItem("token");

    const fetchFollowers = async () => {
      try {
          const response = await axios.get(
            `http://localhost:3000/api/auth/account/followedBy`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
        const result = await response.data;

        setFollowers(result)
      }
       catch (error) {
        console.error(error);
      }  
      setUpdateFollowers(false)
    };
    fetchFollowers();

  }, [updateFollowers]);

  /*---------------- GET PROFILE BY USER ID ---------------- */

  const [updateThisUser, setUpdateThisUser] = useState(false)
  const [thisUser, setThisUser] = useState(null);
  const { id } = useParams();

  const [profileFollowers, setProfileFollowers] = useState([]);
  const [profileFollowing, setProfileFollowing] = useState([]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        // Fetch user's data
        const response = await axios.get(
          `http://localhost:3000/api/users/${id}`
        );
        const accountData = await response.data

        setThisUser(accountData)

        setProfileFollowers(accountData.following)
        setProfileFollowing(accountData.followedBy)

        setUpdateThisUser(false)

      } catch (error) {
        console.error("Error fetching user account data", error);
      }
    };
    fetchUser();
  }, [id, updateThisUser]);

  if (!thisUser) {
    return <div>User not found...</div>;
  }

    //handle for 'follow' user button
  const handleFollow = async (userId) => {
    try {
      const token = localStorage.getItem("token");

      //perform follow request
      await axios.post(
        `http://localhost:3000/api/auth/account/users/${userId}/follows`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log(`Followed user with ID: ${userId}`);

      setUpdateThisUser(true)
      setUpdateUser(true)
      setUpdateFollowing(true)

    } catch (error) {
      console.error("Error following user: ", error);
    }
  };

  //UNFOLLOW - WORKS
  const handleUnfollow = async (userId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `http://localhost:3000/api/auth/account/users/${userId}/follows`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log(`UnFollowed user with ID: ${userId}`);

    } catch (error) {
      console.error("Error unfollowing user: ", error);
    }
  
    setUpdateThisUser(true)
    setUpdateUser(true)
    setUpdateFollowing(true)
  };

  return (
    <>
      <div className={styles.account}>
        {thisUser ? (
          //IF THERE IS A USER
          <>
            <div className={styles.accountCard}>
              <div className={styles.header}>
                <div className={styles.stat}>
                  {thisUser.profileImg ? (
                    <img src={thisUser.profileImg} alt="Profile Image" />
                  ) : (
                    <img src={italy} alt="Default Profile Image" />
                  )}

                  <h2>
                    {thisUser.firstName} {thisUser.lastName}
                  </h2>

                  {thisUser.bio ? (
                    <>
                      <p>{thisUser.bio}</p>
                    </>
                  ) : null}
                </div>
              </div>

              <div className={styles.header}>
                <div className={styles.stats}>
                  <div className={styles.stat}>
                    {/* WHO THE USER FOLLOWS*/}
                    <p>
                      <b>Following</b>
                    </p>
                    <p>{thisUser.followedBy.length}</p>
                  </div>

                  <div className={styles.stat}>
                    {/* WHO THE USER IS FOLLOWED BY*/}
                    <p>
                      <b>Followers</b>
                    </p>
                    <p>{thisUser.following.length}</p>
                  </div>
                  
                  <div className={styles.stat}>
                    <p>
                      <b>Posts</b>
                    </p>
                    <p>{thisUser.posts.length}</p>
                  </div> 

                </div>
                
                
               
              </div>
                 
            { user ? 
            
              <div className={styles.header}>

                  { following.some((instance) => instance.followingId === thisUser.id)

                  ? ( 
                    <button onClick={() => handleUnfollow(thisUser.id)}>
                      Unfollow
                    </button>                 
                  ) : ( 
                    <button onClick={() => handleFollow(thisUser.id)}>
                      Follow
                    </button>
                  )}
              </div>
              : null
            }
            </div>

            <div className={styles.accountNav}>
              <ProfileNav />
            </div>

            {/* CURRENT URL LOCATION /ACCOUNT */}
            <Routes>
              <Route path="ProfileFollowers" element={<ProfileFollowers thisUser={thisUser} setUpdateThisUser={setUpdateThisUser} />} />

              <Route path="ProfileFollowing" element={<ProfileFollowing thisUser={thisUser} setUpdateThisUser={setUpdateThisUser} />} />

              <Route
                path="ProfilePosts"
                element={<ProfilePosts thisUser={thisUser} user={user} />}
              />
            </Routes>

            {location.pathname === `/profile/${thisUser.id}` ? (
              <ProfilePosts thisUser={thisUser} user={user} />
            ) : null}

          </>
        ) : (
          //IF USER IS LOADING
          <div className={styles.loading}>
            <p>Loading account details...</p>
          </div>
        )}
      </div>
    </>
  );
};

export default Profile;
