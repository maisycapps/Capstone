import CreatePost from '../CreatePost';
import { useState, useEffect } from 'react';
import axios from 'axios';
import styles from "../../styles/AccountSubs.module.css";


const MyPosts = ({ user }) => {

  //CONDITIONAL RENDERING DATA
  const [newPostForm, setNewPostForm] = useState(false);
  const [seeComments, setSeeComments] = useState(false);

  //AUTH USER DATA
  const [userId, setUserId] = useState(null);
  const [posts, setPosts] = useState([]);

  //RE-RENDER DEPENDENCY
  const [updatePosts, setUpdatePosts] = useState(false)

  //SET USER ID
  useEffect(() => {
    if (user && user.id) {
       setUserId(user.id);
    }
  }, [user]); 

  //GET ALL POSTS
  useEffect(() => {

    const token = localStorage.getItem("token");

    const fetchUserPosts = async() => {
      try {
        const response = await axios.get("http://localhost:3000/api/auth/account/posts",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        setPosts(response.data);
        setUpdatePosts(false);

      } catch (error) {
        console.error("Error fetching posts: ", error);
      }
    };
    fetchUserPosts();

  }, [updatePosts]);
 
  
  //HANDLE LIKES
  const handleLikes = async (postId) => {

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `http://localhost:3000/api/auth/account/posts/${postId}/likes`,
        {}, {
           headers: {
              Authorization: `Bearer ${token}`,
            },
        }
      );
      const action = response.data.action;
      setUpdatePosts(true)
  
      if (!action) {
          console.error("action is undefined in the response");
      } 

    } catch (error) {
        console.error("Error liking post: ", error);
    }
  };
  

  //HANDLE COMMENTS
  const handleComment = async (postId, commentText) => {

    const token = localStorage.getItem("token");
  
    try {
       const response = await axios.post(
         `http://localhost:3000/api/auth/account/posts/${postId}/comments`,
         {
            text: commentText,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setUpdatePosts(true)
      } catch (error) {
        console.error("error adding comment: ", error);
      }
  };
 
  return (  
    <>

      <h3>Posts</h3>

      <div className={styles.buttonContainer}>
          <button onClick={() => setNewPostForm(true)}>Add New Post</button>
      </div>

      {/* CONDITIONALLY RENDER CREATE POST FORM */}
      {newPostForm === true ? <CreatePost setNewPostForm={setNewPostForm}/> : null}
      
      <div className={styles.list}>
        {posts.length > 0 ? (
        posts.map((post) => {
            const hasLiked = post.likes.some((like) => like.userId === userId);

          return (

            <div key={post.id} className={styles.listItemCard}>
                <div className={styles.listItemCardHeader}>
                  <img src={user.profileImg}/>
                  <div className={styles.listItemCardHeaderText}>
                    <p><b>{user.userName}</b></p>
                    <p>               
                      {post.destination
                      ? post.destination.destinationName
                      : "No destination"} 
                    </p>
                  </div>
                </div>

                <img
                  src={post.postImg}
                  alt="Post Img"
                  style={{ width: "300px", height: "300px" }}
                />

                <p>
                  {post.text} {"  "}
                  {new Date(post.createdAt).toLocaleDateString()}</p>
                  { post.updatedAt !== post.createdAt ? <p>edited: {new Date(post.updatedAt).toLocaleDateString()}</p> : null}  

                {/* DYNAMIC LIKE BUTTON */}
                <div className={styles.postButtonContainer}> 
                  <button onClick={() => handleLikes(post.id)}>
                    {hasLiked ? "Unlike" : "Like"}{"  "}
                    {post.likes ? post.likes.length : 0}
                  </button>
                 
                  {/* VIEW COMMENTS BUTTON */}
                  <button onClick={() => setSeeComments(true)}> Comments {post.comments.length}</button>
                </div>

                  {seeComments === true && post.comments.length > 0
                  ? post.comments.map((comment) => {
                    return (
                    <div key={comment.id}>
                      <p>
                        <b> { comment.user 
                            ? "@" + comment.user.userName : "...loading" }
                        </b>{" "}
                            {comment.text}{"  "}
                            {new Date(comment.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    );
                    })
                  : null}  
                
              <div>

                <input
                  type="text"
                  placeholder="Add a comment"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleComment(post.id, e.target.value);
                        e.target.value = ""; //clear input after submission
                    }
                  }}
                /> 
    
              </div>
                    
            </div>
            ) 
          })
          ) : ( 
          <>
            <p className={styles.defaultContent}>No Posts Yet</p>
            <button onClick={() => setNewPostForm(true)}>Create your first post</button>

            {/* CONDITIONALLY RENDER CREATE POST FORM */}
            {newPostForm === true ? <CreatePost setNewPostForm={setNewPostForm}/> : null}
          </>
        )}
      </div>
    </>
  )
}
 
export default MyPosts;