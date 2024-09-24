import { useEffect, useState } from "react";
import axios from "axios";
import styles from "../../styles/Account.module.css"

const Followers = ({user}) => {

  const [followerNames, setFollowerNames] = useState({});

  useEffect(() => {
    
    const fetchFollowers = async (followedById) => {
      
      try {

        if(!followerNames[followedById]){

          //fetch users by ID
          const response = await axios.get(`http://localhost:3000/api/users/${followedById}`);
          const firstName = await response.data.firstName;
          const lastName = await response.data.lastName;
            setFollowerNames((prevNames) => ({
              ...prevNames, [followedById]: `${firstName} ${lastName}`
            }));
        }
      } catch (error) {
        console.error(error);
      }
    };

    user.following.forEach((follower) => {
      fetchFollowers(follower.followingId)
    })

  }, [user.following, followerNames]);

  return (
    <>
      <h3>Followers</h3>

      <ul>
        {user.following.length > 0 ? (
              user.following.map((follower, index) => (
                <div key={index}>
                
                    <li>{followerNames[follower.followingId] || "Loading..."}</li>
                 
                </div>
              ))
          ) : (
              <>
                <p>No Followers Yet</p>
              </>
          )}
      </ul>
    </> 
  );
}
 
export default Followers;