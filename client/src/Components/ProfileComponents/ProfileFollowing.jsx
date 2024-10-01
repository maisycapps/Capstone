import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import styles from "../../styles/AccountSubs.module.css";
import italy from "../Images/italy.jpg";

const ProfileFollowing = ({ thisUser }) => {

  const [following, setFollowing] = useState([]);
  const [updateFollowing, setUpdateFollowing] = useState(false);

  const [seeUsers, setSeeUsers] = useState(false);

  useEffect(() => {

    const fetchFollowing = async () => {
      try {
          const response = await axios.get(
            `http://localhost:3000/api/users/${thisUser.id}/following`,

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

  //UNFOLLOW
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
      setFollowing((prev) => prev.filter((id) => id !== userId)); //remove userId from following
    } catch (error) {
      console.error("Error unfollowing user: ", error);
    }
    setUpdateFollowing(true)
  };


  return (
    <>
      <h3>Following</h3>
        
      <ul>
        { following.length > 0 
        ? (
          <>
          <div className={styles.followList}>
            {/* maps through instances in which auth user's ID = followedBy id, and returns the ids and data of who they follow. */}
            {following.map((user) => {
              return (
                <div key={user.following.id}>
                  <Link to={`/profile/${user.following.id}`} className={styles.userLinks}>
                    <div className={styles.followListCard}>
                      <div className={styles.followListCardImg}>
                      {user.following.profileImg 
                      ? <img src={user.following.profileImg} alt="profileImg" />
                      : <img src={italy} alt="defaultImg" />}
                      </div>
                      <div className={styles.followListCardText}>
                        <li><b>{user.following.userName}</b></li>
                        <li>{user.following.firstName} {user.following.lastName}</li>
                      </div>
                      <div>
                        <button onClick={() => {
                          handleUnfollow(user.following.id)}}>
                              Unfollow
                        </button>
                    
                      </div>
                    </div>
                  </Link>
                </div>
              )
            })}
            </div>
          </>
          

        ) : (

          <>
            <p className={styles.defaultContent}>{thisUser.firstName} doesn't follow anyone yet</p>
          </>
        )}
      </ul>
    </>
  );
};

export default ProfileFollowing;