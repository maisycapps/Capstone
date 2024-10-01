import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import axios from "axios";
import styles from "../../styles/AccountSubs.module.css";
import italy from "../Images/italy.jpg";
import Friends from "../Friends";

const Following = ({ user }) => {

  const navigate = useNavigate();

  const [following, setFollowing] = useState([]);
  const [updateFollowing, setUpdateFollowing] = useState(false);

  const [seeUsers, setSeeUsers] = useState(false);

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
    // {following.length === 0 && navigate("/account/myposts")}
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

                    
                    <div className={styles.followListCard}>
                      <Link to={`/profile/${user.following.id}`} className={styles.userLinks}>
                      <div className={styles.followListCardImg}>
                      {user.following.profileImg 
                      ? <img src={user.following.profileImg} alt="profileImg" />
                      : <img src={italy} alt="defaultImg" />}
                      </div>
                      </Link>
                      <Link to={`/profile/${user.following.id}`} className={styles.userLinks}>
                      <div className={styles.followListCardText}>
                        <li><b>{user.following.userName}</b></li>
                        <li>{user.following.firstName} {user.following.lastName}</li>
                      </div>
                      </Link>
                   
                      <div>
                        <button onClick={() => {
                          handleUnfollow(user.following.id)}}>
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
          
            <p className={styles.defaultContent}>Not Following Anyone Yet</p>

            <button onClick={() => setSeeUsers(true)}>Browse Users to Follow</button>
            {seeUsers && <Friends />}
           
          </>
        )}
      </ul>
    </>
  );
};

export default Following;
