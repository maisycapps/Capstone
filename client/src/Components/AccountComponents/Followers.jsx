import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import styles from "../../styles/AccountSubs.module.css";
import italy from "../Images/italy.jpg";

const Followers = ({ user, setUpdateUser }) => {
  /* -------------------------------- USER DATA --------------------------------*/
  const [userId, setUserId] = useState(null);

  //SET USER ID
  useEffect(() => {
    if (user && user.id) {
      setUserId(user.id);
    }
  }, [user]);

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

        setFollowers(result);
      } catch (error) {
        console.error(error);
      }
      setUpdateFollowers(false);
    };
    fetchFollowers();
  }, [updateFollowers]);

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
        setFollowing(result);
      } catch (error) {
        console.error(error);
      }
      setUpdateFollowing(false);
    };
    fetchFollowing();
  }, [updateFollowing]);

  //UNFOLLOW
  const handleUnfollow = async (unfollowId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `http://localhost:3000/api/auth/account/users/${unfollowId}/follows`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

    } catch (error) {
      console.error("Error unfollowing user: ", error);
    }
    setUpdateFollowing(true);
    setUpdateUser(true);
    setUpdateFollowers(true);
  };

  //FOLLOW
  const handleFollow = async (followId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `http://localhost:3000/api/auth/account/users/${followId}/follows`,
        { },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

    } catch (error) {
      console.error("Error following user: ", error);
    }
    setUpdateFollowing(true);
    setUpdateUser(true);
    setUpdateFollowers(true);
  };

  return (
    <>
      <h3>Followers</h3>

      <ul>
        {followers.length > 0 ? (
          <>
            <div className={styles.followList}>
              {/* maps through instances in which auth user's ID = followedBy id, and returns the ids and data of who they follow. */}
              {followers.map((user) => {
                return (
                  <div key={user.followedBy.id}>
                    <div className={styles.followListCard}>
                      <Link
                        to={`/profile/${user.followedById}`}
                        className={styles.userLinks}
                      >
                        <div className={styles.followListCardImg}>
                          {user.followedBy.profileImg ? (
                            <img
                              src={user.followedBy.profileImg}
                              alt="profileImg"
                            />
                          ) : (
                            <img src={italy} alt="defaultImg" />
                          )}
                        </div>
                      </Link>

                      <Link
                        to={`/profile/${user.followedById}`}
                        className={styles.userLinks}
                      >
                        {" "}
                        <div className={styles.followListCardText}>
                          <li>
                            <b>{user.followedBy.userName}</b>
                          </li>
                          <li>
                            {user.followedBy.firstName}{" "}
                            {user.followedBy.lastName}
                          </li>
                        </div>
                      </Link>

                      {following.some(
                        (instance) => instance.followingId === user.followedBy.id
                      ) ? (
                        <button onClick={() => handleUnfollow(user.followedBy.id)}>
                          Unfollow
                        </button>
                      ) : (
                        <button onClick={() => handleFollow(user.followedBy.id)}>
                          Follow
                        </button>
                      )}
                  
                

                    </div>
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <>
            <p className={styles.defaultContent}>No Followers Yet</p>
          </>
        )}
      </ul>
    </>
  );
};

export default Followers;
