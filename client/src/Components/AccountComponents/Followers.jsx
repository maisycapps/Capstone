import { useEffect, useState } from "react";
import axios from "axios";
import styles from "../../styles/AccountSubs.module.css";
import italy from "../Images/italy.jpg";

const Followers = ({ user }) => {

  const [followers, setFollowers] = useState([]);
  const [updateFollowers, setUpdateFollowers] = useState(false);

  const [seeUsers, setSeeUsers] = useState(false);

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
        console.log(response.data)
        setFollowers(result)
      }
       catch (error) {
        console.error(error);
      }  
      setUpdateFollowers(false)
    };
    fetchFollowers();

  }, [updateFollowers]);

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
      setFollowers((prev) => prev.filter((id) => id !== userId)); //remove userId from following
    } catch (error) {
      console.error("Error unfollowing user: ", error);
    }
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
                    <div className={styles.followListCard} onClick={() => console.log("You clicked: ", user.followedBy.userName)}>
                      <div className={styles.followListCardImg}>
                      {user.followedBy.profileImg 
                      ? <img src={user.followedBy.profileImg} alt="profileImg" />
                      : <img src={italy} alt="defaultImg" />}
                      </div>
                      <div className={styles.followListCardText}>
                        <li><b>{user.followedBy.userName}</b></li>
                        <li>{user.followedBy.firstName} {user.followedBy.lastName}</li>
                      </div>
                      <div>
                        <button onClick={() => {
                          handleUnfollow(user.followedBy.id)}}>
                              Unfollow
                        </button>
                    
                      </div>
                    </div>
                </div>
              )
            })}
            </div>
          </>
          

        ) : (

          <>
          
            <p className={styles.defaultContent}>Not Followers</p>
      
          </>
        )}
      </ul>
    </>
  );
};

export default Followers;

