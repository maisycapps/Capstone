import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import styles from "../../styles/AccountSubs.module.css";
import italy from "../Images/italy.jpg";

const ProfileFollowers = ({ thisUser, setUpdateUser }) => {

  /* -------------------------------- PROFILE DATA --------------------------------*/
  const [followers, setFollowers] = useState([]);
  const [updateFollowers, setUpdateFollowers] = useState(false);

  useEffect(() => {

    const fetchFollowers = async () => {
      try {
          const response = await axios.get(
            `http://localhost:3000/api/users/${thisUser.id}/followedBy`,
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

  return (
    <>
      <h3>Followers</h3>
        
      <ul>
        { followers.length > 0 
        ? (
          <>
          <div className={styles.followList}>
            {/* maps through instances in which profile user's ID = following id, and returns the ids and data of who follows them. */}
            {followers.map((user) => {
              return (
                <div key={user.followedById}>
                   <div className={styles.followListCard}>

                    <Link to={`/profile/${user.followedBy.id}`} className={styles.userLinks}>
                      <div className={styles.followListCardImg}>
                      {user.followedBy.profileImg 
                      ? <img src={user.followedBy.profileImg} alt="profileImg" />
                      : <img src={italy} alt="defaultImg" />}
                      </div>
                    </Link>
                    <Link to={`/profile/${user.followedBy.id}`} className={styles.userLinks}>
                      <div className={styles.followListCardText}>
                        <li><b>{user.followedBy.userName}</b></li>
                        <li>{user.followedBy.firstName} {user.followedBy.lastName}</li>
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
          
            <p className={styles.defaultContent}>{thisUser.firstName} doesn't have any followers yet</p>
      
          </>
        )}
      </ul>
    </>
  );
};

export default ProfileFollowers;

