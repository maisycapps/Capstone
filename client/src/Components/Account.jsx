import italy from "./Images/italy.jpg";
import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "../styles/Account.module.css";
import CreatePost from "./CreatePost";

const Account = () => {
  const [user, setUser] = useState(null); 

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

        {user.bio ? <><p>Bio:</p> <p>{user.bio}</p></> : <p>Add a bio:</p>}

        <p>Posts</p>
        <p>{user.posts.length}</p>

        {/* who the user follows*/}  
        <p>Following</p>
        <p>{user.followedBy.length}</p>


        {/* who the user is followed by*/}
        <p>Followers</p>
        <p>{user.following.length}</p>

        {/* user's posts */}
        <>
        <div>
        {user.posts.length > 0 ? (
          user.posts.map((post) => (
          <div key={post.id}>
          {/* display destination name */}
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
          {/* post created by user */}
          <p>{post.user.userName}</p>
          {/* post bio */}
          <p>{post.text}</p>
          <p>likes: {post.likes ? post.likes.length : ""}</p>
          <p>Comments: {post.comments ? post.comments.length : ""}</p>

          {/* like button */}
          <button onClick={() => handleLikes(post.id)}>Like</button>

          {/* comment button */}
          <div>
            <input
              type="text"
              placeholder="Add a comment"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleComment(post.id, e.target.value)
                  e.target.value = "" //clear input after submission
                }
              }}
            />
          </div>
          </div>
          ))
        ) : (
          <>
          <button onClick={() => <CreatePost />}>Create your first post</button>
          </>
        )}
      </div>
          </>


          {/* {user.likes}
          {user.trips}   */}

      </div>
      ) : (
        <p>Loading account details...</p>
    )}
   
    </div>
    </>
  )
}

export default Account;
