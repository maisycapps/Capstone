import { useEffect, useState } from "react";
import axios from "axios";
import styles from "../../styles/AccountSubs.module.css";

const Following = ({user}) => {

  const [followingNames, setFollowingNames] = useState({});
  const [seeUsers, setSeeUsers] = useState(false)

  useEffect(() => {
    
    const fetchFollowing = async (followingId) => {
      
      try {

        if(!followingNames[followingId]){

          //fetch users by ID
          const response = await axios.get(`http://localhost:3000/api/users/${followingId}`);
          const firstName = await response.data.firstName;
          const lastName = await response.data.lastName;
            setFollowingNames((prevNames) => ({
              ...prevNames, [followingId]: `${firstName} ${lastName}`
            }));
        }
      } catch (error) {
        console.error(error);
      }
    };

    user.followedBy.forEach((following) => {
      fetchFollowing(following.followingId)
    })

  }, [user.followedBy, followingNames]);

  return (
    <>
      <h3>Following</h3>

      <ul>
        {user.followedBy.length > 0 ? (
              user.followedBy.map((following, index) => (
                <div key={index}>
                
                    <li>{followingNames[following.followingId] || "Loading..."}</li>
                 
                </div>
              ))
          ) : (
              <>
                <p className={styles.defaultContent}>Not Following Anyone Yet</p>
                  <div className={styles.buttonContainer}>
                    <button onClick={() => setSeeUsers(true)} >Browse users to follow</button>
                  </div>
                {seeUsers === true ? /* view all users component*/ console.log("seeUsers component tbd") : null}

              </>
          )}
      </ul>
    </> 
  );
}
 
export default Following;