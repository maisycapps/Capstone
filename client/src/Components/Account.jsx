import italy from "./Images/italy.jpg";
import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "../styles/Account.module.css";
import CreatePost from "./CreatePost";

const Account = () => {
  const [user, setUser] = useState(null); 
  const [seePosts, setSeePosts] = useState(false);
  const [seeFollowers, setSeeFollowers] = useState(false);
  const [seeFollowing, setSeeFollowing] = useState(false);
  const [seeSettings, setSeeSettings] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {

        const token = localStorage.getItem("token");

        // Fetch user's data
        const response = await axios.get("http://localhost:3000/api/auth/account/users", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
      });
        const accountData = await response.data[0];
        console.log(accountData)
        setUser(accountData);
        setSeePosts(true)

      } catch (error) {
        console.error("Error fetching user account data", error);

      }
  };

    fetchData();
  }, []); 

  return (
    <>
    <div className={styles.accountCard}>
      
      {user ? ( 
        <div className={styles.account}>

          {user.profileImg ? (
          <img src={user.profileImg} alt="Profile Image" /> ) : (<img src={italy} alt="Default Profile Image" />  )}

          <h2>{user.firstName} {user.lastName}</h2>  

          {user.bio ? <><p>Bio:</p> <p>{user.bio}</p></> : null}

          <p>Posts</p>
          <p>{user.posts.length}</p>

          {/* who the user follows*/}  
          <p>Following</p>
          <p>{user.followedBy.length}</p>


          {/* who the user is followed by*/}
          <p>Followers</p>
          <p>{user.following.length}</p>

        </div>
        ) : (
        <p>Loading account details...</p>
      )}

      {/* ACCOUNT NAV BAR*/}
      <p onClick={(e) => { 
        setSeePosts(true),
        setSeeFollowers(false),
        setSeeFollowing(false),
        setSeeSettings(false)}}>Posts</p>

      <p onClick={(e) => { 
        setSeePosts(false),
        setSeeFollowers(true),
        setSeeFollowing(false),
        setSeeSettings(false)}}>Followers</p>

      <p onClick={(e) => { 
        setSeePosts(false),
        setSeeFollowers(false),
        setSeeFollowing(true),
        setSeeSettings(false)}}>Following</p>

      <p onClick={(e) => { 
        setSeePosts(false),
        setSeeFollowers(false),
        setSeeFollowing(false),
        setSeeSettings(true)}}>Settings</p>

      {/* CONDITIONALLY RENDERED - USER'S POSTS (default) */}
      { seePosts ? (        
        <>
          <div>
            {user.posts.length > 0 ? (
            user.posts.map((post) => (
            <div key={post.id}>
              {/* destination name */}
              <h3>
              {post.destination
                ? post.destination.destinationName
                : "No destination"}
              </h3>

              {/* dispay destination img */}
              <img
              src={post.postImg}
              alt="Post Img"
              style={{ width: "300px", height: "300px" }}
              />

              {/* post text */}
              <p>{post.text}</p>
              <p>likes: {post.likes ? post.likes.length : ""}</p>
              <p>Comments: {post.comments ? post.comments.length : ""}</p>

            </div>
            ))
            ) : (
            <>
              <p>No Posts Yet</p>
            </>
            )}
          </div>
        </> 
        ):( null )}  

      {/* CONDITIONALLY RENDERED - WHO USER IS FOLLOWED BY */}
      { seeFollowers ? (        
        <>
          <div>
            {user.following.length > 0 ? (
            user.following.map((follower) => (
            <div key={follower.id}>
              
              {/* follower's username */}
              <p>{follower.userName}</p>

              {/* follower's name */}
              <p>{follower.firstName} {follower.lastName}</p>
            </div>
            ))
            ) : (
            <>
              <p>No Followers Yet</p>
            </>
            )}
          </div>
        </> 
        ):( null )}

      {/* CONDITIONALLY RENDERED - WHO USER IS FOLLOWING */}
      { seeFollowing ? <p>Following</p> : null}

      {/* CONDITIONALLY RENDERED - ACCOUNT SETTINGS */}
      { seeSettings ? <p>Settings</p> : null}
   
    </div>
    </>
  )
}

export default Account;
