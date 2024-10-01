import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import styles from "../../styles/AccountSubs.module.css";
import italy from "../Images/italy.jpg";

const ProfileFollowing = ({ thisUser, setUpdateThisUser }) => {

  /* -------------------------------- PROFILE FOLLOWING DATA --------------------------------*/
  const [following, setFollowing] = useState([]);
  const [updateFollowing, setUpdateFollowing] = useState(false);

  useEffect(() => {

    const fetchFollowing = async () => {
      try {
          const response = await axios.get(
            `http://localhost:3000/api/users/${thisUser.id}/following`,

          );
        const result = await response.data;

        //people this user follows
        setFollowing(result)

      }
       catch (error) {
        console.error(error);
      }  
      setUpdateFollowing(false)
    };
    fetchFollowing();

  }, [updateFollowing]);

  return (
    <>
      <h3>Following</h3>
        
      <ul>
        { following.length > 0 
        ? (
          <>
          <div className={styles.followList}>
            {/* maps through instances in which profile user's ID = followedBy id, and returns the ids and data of who they follow. */}
            {following.map((user) => {
              return (
                <div key={user.following.id}>

                  <div className={styles.followListCard}>
                  
                    <Link to={`/profile/${user.followingId}`} className={styles.userLinks}>
                        <div className={styles.followListCardImg}>
                        {user.following.profileImg 
                        ? <img src={user.following.profileImg} alt="profileImg" />
                        : <img src={italy} alt="defaultImg" />}
                        </div>
                    </Link>
                    <Link to={`/profile/${user.followingId}`} className={styles.userLinks}>
                        <div className={styles.followListCardText}>
                          <li><b>{user.following.userName}</b></li>
                          <li>{user.following.firstName} {user.following.lastName}</li>
                        </div>
                    </Link>

                  </div>
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