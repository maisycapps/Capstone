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
  const [thisUser, setThisUser] = useState(null);
  const { id } = useParams();

  //Re-Rendering Dependency
  // const [updatedUser, setUpdatedUser] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        // Fetch user's data
        const response = await axios.get(
          `http://localhost:3000/api/users/${id}`
        );
        const accountData = await response.data

        setThisUser(accountData);
      } catch (error) {
        console.error("Error fetching user account data", error);
      }
    };
    fetchUser();
  }, [id]);

  if (!thisUser) {
    return <div>User not found...</div>;
  }

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
            </div>

            <div className={styles.accountNav}>
              <ProfileNav />
            </div>

            {/* CURRENT URL LOCATION /ACCOUNT */}
            <Routes>
              <Route path="ProfileFollowers" element={<ProfileFollowers thisUser={thisUser} />} />
              <Route path="ProfileFollowing" element={<ProfileFollowing thisUser={thisUser} />} />
              <Route
                path="ProfilePosts"
                element={<ProfilePosts thisUser={thisUser} />}
              />
            </Routes>

            {location.pathname === "/profile/:id" ? (
              <ProfilePosts thisUser={thisUser} />
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
