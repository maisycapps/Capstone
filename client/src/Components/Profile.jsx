import italy from "./Images/italy.jpg";
import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "../styles/Account.module.css";
import { useParams } from "react-router-dom";
import { Routes, Route, useLocation } from "react-router-dom";

//ACCOUNT SUBCOMPONENTS (for routes)
import ProfileNav from "./ProfileComponents/ProfileNav";
import Followers from "./AccountComponents/Followers";
import Following from "./AccountComponents/Following";
import ProfilePosts from "./ProfileComponents/ProfilePosts";

const Profile = () => {
  const location = useLocation();
  const [user, setUser] = useState(null);
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
        const accountData = await response.data;
        console.log(response.data);

        setUser(accountData);
      } catch (error) {
        console.error("Error fetching user account data", error);
      }
    };
    fetchUser();
  }, [id]);

  if (!user) {
    return <div>User not found...</div>;
  }

  return (
    <>
      <div className={styles.account}>
        {user ? (
          //IF THERE IS A USER
          <>
            <div className={styles.accountCard}>
              <div className={styles.header}>
                <div className={styles.stat}>
                  {user.profileImg ? (
                    <img src={user.profileImg} alt="Profile Image" />
                  ) : (
                    <img src={italy} alt="Default Profile Image" />
                  )}

                  <h2>
                    {user.firstName} {user.lastName}
                  </h2>

                  {user.bio ? (
                    <>
                      <p>{user.bio}</p>
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
                    <p>{user.followedBy.length}</p>
                  </div>

                  <div className={styles.stat}>
                    {/* WHO THE USER IS FOLLOWED BY*/}
                    <p>
                      <b>Followers</b>
                    </p>
                    <p>{user.following.length}</p>
                  </div>

                  <div className={styles.stat}>
                    <p>
                      <b>Posts</b>
                    </p>
                    <p>{user.posts.length}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.accountNav}>
              <ProfileNav />
            </div>

            {location.pathname === "/profile/:id" ? (
              <ProfilePosts user={user} />
            ) : null}

            {/* CURRENT URL LOCATION /ACCOUNT */}
            <Routes>
              <Route path="followers" element={<Followers user={user} />} />
              <Route path="following" element={<Following user={user} />} />
              <Route
                path="profilePosts"
                element={<ProfilePosts user={user} />}
              />
            </Routes>
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
