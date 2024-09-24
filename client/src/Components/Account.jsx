import italy from "./Images/italy.jpg";
import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "../styles/Account.module.css";
import CreatePost from "./CreatePost";

const Account = () => {
  const [user, setUser] = useState(null); 
  const [posts, setPosts] = useState([]);

  //conditionally rendered views based on mini nav clicks
  const [seePosts, setSeePosts] = useState(false);
  const [seeFollowers, setSeeFollowers] = useState(false);
  const [seeFollowing, setSeeFollowing] = useState(false);
  const [seeSettings, setSeeSettings] = useState(false);
  const [seeTrips, setSeeTrips] = useState(false);

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
        setUser(accountData);
        setPosts(accountData.posts);
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
          <p>{posts.length}</p>

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
        setSeeSettings(false),
        setSeeTrips(false)}}>Posts</p>

      <p onClick={(e) => { 
        setSeePosts(false),
        setSeeFollowers(true),
        setSeeFollowing(false),
        setSeeSettings(false),
        setSeeTrips(false)}}>Followers</p>

      <p onClick={(e) => { 
        setSeePosts(false),
        setSeeFollowers(false),
        setSeeFollowing(true),
        setSeeSettings(false),
        setSeeTrips(false)}}>Following</p>

      <p onClick={(e) => { 
        setSeePosts(false),
        setSeeFollowers(false),
        setSeeFollowing(false),
        setSeeSettings(false),
        setSeeTrips(true)}}>Trips</p>

      <p onClick={(e) => { 
        setSeePosts(false),
        setSeeFollowers(false),
        setSeeFollowing(false),
        setSeeSettings(true),
        setSeeTrips(false)}}>Edit Account</p>

      {/* CONDITIONALLY RENDERED - USER'S POSTS (default) */}
      { seePosts ? (        
        <>
          <div>
            {posts.length > 0 ? (
            posts.map((post) => (
            <div key={post.id}>
              {/* destination name */}
              <h3>
              {post.destination
                ? post.destination.destinationName
                : "No destination"}
              </h3>

              {/* destination img */}
              <img
              src={post.postImg}
              alt="Post Img"
              style={{ width: "300px", height: "300px" }}
              />

              {/* post auther */}
              <p>{user.userName}</p>

              {/* post text */}
              <p>{post.text}</p>
              <p>likes: {post.likes ? post.likes.length : ""}</p>
              <p>comments: {post.comments ? post.comments.length : ""}</p>

              {/* like button */}
              {/* <button onClick={() => handleLikes(post.id)}>
                  {hasLiked ? "Unlike" : "Like"}
              </button> */}

              {/* comment button */}
              {/* <div>
                <input
                  type="text"
                  placeholder="Add a comment"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        handleComment(post.id, e.target.value);
                        e.target.value = ""; //clear input after submission
                    }
                  }}
                /> */}

                {/* render comments for each post */}
                {post.comments ? (
                  post.comments.map((comment) => {
                  return (
                    <div key={comment.id}>
                        <p>
                          {comment.user ? comment.user.userName : userName}:{" "}
                          {comment.text}
                        </p>
                    </div>
                  );
                })) : (null)}
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
               //need to generate unique keys
            <div >
              
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
      { seeFollowing ? (        
        <>
          <div>
            {user.followedBy.length > 0 ? (
            user.followedBy.map((following) => (
              //need to generate unique keys
            <div >
              
              {/* follower's username */}
              <p>{following.userName}</p>

              {/* follower's name */}
              <p>{following.firstName} {following.lastName}</p>
            </div>
            ))
            ) : (
            <>
              <p>Not Following Anyone Yet</p>
            </>
            )}
          </div>
        </> 
        ):( null )}

      {/* CONDITIONALLY RENDERED - ACCOUNT SETTINGS */}
      { seeSettings ? (
        <>
        <p>Account Settings</p>
        </> 
       ) : ( null )}

      {/* CONDITIONALLY RENDERED - USER'S TRIPS */}
      { seeTrips ? (        
        <>
          <div>
            {user.trips.length > 0 ? (
            user.trips.map((trip) => (
            <div key={trip.id}>
              
              {/* trip name */}
              <p>{trip.tripName}</p>

              {/* destination */}
              <p>Where: {trip.destinationId}</p>

              {/* dates */}
              <p>Start Date: {trip.startDate}</p>
              <p>End Date: {trip.endDate}</p>

            </div>
            ))
            ) : (
            <>
              <p>No Trips Yet</p>
            </>
            )}
          </div>
        </> 
        ):( null )}
   
    </div>
    </>
  )
}

export default Account;
