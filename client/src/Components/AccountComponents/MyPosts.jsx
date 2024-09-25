import CreatePost from '../CreatePost';
import { useState, useEffect } from 'react';
import axios from 'axios';
import styles from "../../styles/AccountSubs.module.css";


const MyPosts = ({ user }) => {

  //dependency factor for Account.jsx.
  const [newPostForm, setNewPostForm] = useState(false);

  const [seeComments, setSeeComments] = useState(false);

  //user's fetched posts
  const [posts, setPosts] = useState([]);

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

      } catch (error) {
        console.error("Error fetching posts: ", error);
      }
    };
    fetchUserPosts();

  }, []);

  //HANDLE LIKES
  const handleLikes = async (postId) => {
  
      const token = localStorage.getItem("token");

      try {
        const response = await axios.post(
          `http://localhost:3000/api/auth/account/posts/${postId}/likes`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
  
        const action = response.data.action;
  
        if (!action) {
          console.error("action is undefined in the response");
        }
  
        // update UI after liking post
        setPosts((prevPosts) =>   
          prevPosts.map((post) =>        
            post.id === postId
              ? { 
                  ...post,
                  likes:
                    action === "like"
                      ? [...post.likes, { id: user.id }] //add like if action is 'like"
                      : post.likes.filter((like) => like.userId !== user.id) //Remove like if logged in user has liked the post
                }
              : post
          )
        );

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
      console.log("Response data: ", response.data);

      //update UI after adding comment
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId
            ? { ...post, comments: [...post.comments, response.data] }
            : post
        )
      );
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
        {newPostForm === true ? <CreatePost setNewPostForm={setNewPostForm} setUpdatedUser={setUpdatedUser}/> : null}
      
      <div className={styles.list}>
        {posts.length > 0 ? (

            posts.map((post) => {
  
              const hasLiked = post.likes.some((like) => like.userId === user.id);
              
              return (

                <div key={post.id} className={styles.listItemCard}>
                  <div className={styles.listItemCardHeader}>
                    <img src={user.profileImg}/>
                    <p><b>{user.userName}</b></p>
                  </div>

                  <p><b>Destination: </b>                 
                    {post.destination
                    ? post.destination.destinationName
                    : "No destination"} 
                  </p>

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
                  <button onClick={() => handleLikes(post.id)}>
                    {hasLiked 
                      ? `Unlike ${post.likes ? post.likes.length : ""}` 
                      : `Like ${post.likes ? post.likes.length : ""}` 
                    }
                  </button>
                  
                  {/* VIEW COMMENTS BUTTON */}
                  <button onClick={() => setSeeComments(true)}> Comments {post.comments.length}</button>

                  {seeComments === true && post.comments.length > 0
                      ? post.comments.map((comment) => {
                        return (
                          <div key={comment.id}>
                              <p>
                                <b> { comment.user ? comment.user.userName : "...loading" }</b>{" "}
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
              {newPostForm === true ? <CreatePost setNewPostForm={setNewPostForm} setUpdatedUser={setUpdatedUser}/> : null}
            </>
            )
          }
      </div>
    </>
  )
}
 
export default MyPosts;