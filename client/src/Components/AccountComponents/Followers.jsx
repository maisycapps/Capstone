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

        setFollowers(result)
        console.log("fetched follower data", result)
      }
       catch (error) {
        console.error(error);
      }  
      setUpdateFollowers(false)
    };
    fetchFollowers();

  }, [updateFollowers]);

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

      console.log(`UnFollowed user with ID: ${unfollowId}`);
      setFollowers((prev) => prev.filter((id) => id !== unfollowId)); //remove unfollowId from following
    } catch (error) {
      console.error("Error unfollowing user: ", error);
    }
    setUpdateUser(true)
    setUpdateFollowers(true)
  };

  //FOLLOW
  const handleFollow = async (userId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `http://localhost:3000/api/auth/account/users/${userId}/follows`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log(`Followed user with ID: ${userId}`);
      setFollowers((prev) => [...prev, userId]); //remove userId from following
    } catch (error) {
      console.error("Error following user: ", error);
    }
    setUpdateUser(true)
    setUpdateFollowers(true)
  };



  return (
    <>
      <h3>Followers</h3>
        
      <ul>
        { followers.length > 0 
        ? (
          <>
          <div className={styles.followList}>
            {/* maps through instances in which auth user's ID = followedBy id, and returns the ids and data of who they follow. */}
            {followers.map((user) => {
              return (
                <div key={user.followedBy.id}>
                  <div className={styles.followListCard}>

                      <Link to={`/profile/${user.followedById}`} className={styles.userLinks}>
                        <div className={styles.followListCardImg}>
                        {user.followedBy.profileImg 
                        ? <img src={user.followedBy.profileImg} alt="profileImg" />
                        : <img src={italy} alt="defaultImg" /> }
                        </div>
                      </Link>

                      <Link to={`/profile/${user.followedById}`} className={styles.userLinks}> <div className={styles.followListCardText}>
                          <li><b>{user.followedBy.userName}</b></li>
                          <li>{user.followedBy.firstName} {user.followedBy.lastName}</li>
                        </div>
                      </Link>

                      {user.followedById === userId ? (
                              <button onClick={() => {
                                handleUnfollow(user.followingId)}}>
                                    Unfollow
                              </button>
                            ) : (
                             <button onClick={() => {
                               handleFollow(user.followingId)}}>
                                      Follow
                             </button>
                      )}
                  </div>
                </div>         
              )
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

