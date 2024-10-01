import { useState, useEffect } from "react";
import axios, { formToJSON } from "axios";
import styles from "../../styles/AccountSubs.module.css";
import PopUp from "./PopUp";
import { Link } from "react-router-dom"

const ProfilePosts = ({ user, thisUser }) => {

  /* -------------------------------- POPUP RENDERING --------------------------------*/
  const [popSignIn, setPopSignIn] = useState(false);

  /* -------------------------------- CONDITIONAL RENDERING --------------------------------*/
  //VIEW COMMENTS ASSOCIATED WITH A SPECIFIC POST
  const [seeComments, setSeeComments] = useState(false); //view comments
  const [viewCommentsId, setViewCommentsId] = useState("") //render comments on only that post

  //EDIT COMMENT
  const [editComment, setEditComment] = useState(false) //view edit form
  const [commentPostId, setCommentPostId] = useState("") //render edit form on only that post
  const [commentId, setCommentId] = useState("") //render edit form on only that comment
  const [text, setText] = useState("") //body for patch request

/* -------------------------------- USER DATA --------------------------------*/
const [userId, setUserId] = useState(null);

//SET USER ID
useEffect(() => {
  if (user && user.id) {
     setUserId(user.id);
  }
}, [user]); 

  /* -------------------------------- RE-RENDER DEPENDENCY --------------------------------*/
  const [updatePosts, setUpdatePosts] = useState(false)


  /* -------------------------------- POSTS CRUD --------------------------------*/

  const [posts, setPosts] = useState([]);

  //GET ALL POSTS
  useEffect(() => {

    const fetchPosts = async() => {

      try {
        const response = await axios.get(`http://localhost:3000/api/users/${thisUser.id}/posts`,
        )
        setPosts(response.data)

      } catch (error) {
        console.error("Error fetching posts: ", error);
      }
      setUpdatePosts(false)
    };

    fetchPosts();

  }, [updatePosts]);

  /* -------------------------------- LIKES CRUD --------------------------------*/

//LIKE & UNLIKE
const handleLikes = async (postId) => {

  try {
    const token = localStorage.getItem("token");

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

    setUpdatePosts(true)

    if (!action) {
        console.error("action is undefined in the response");
    } 

  } catch (error) {
      console.error("Error liking post: ", error);
  }
}


/* -------------------------------- COMMENTS CRUD --------------------------------*/

  //CREATE A NEW COMMENT
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
        
      } catch (error) {
        console.error("error adding comment: ", error);
      }
      setUpdatePosts(true)
      setSeeComments(true)
  };

  //EDIT COMMENT BY ID
  const editMyComment = async(postId, commentId, text) => {

    const token = localStorage.getItem("token");

    try {

      const response = await axios.patch(
        `http://localhost:3000/api/auth/account/posts/${postId}/comments/${commentId}`,
        { text },
         {
           headers: {
             Authorization: `Bearer ${token}`,
           },
         }
       );

      setCommentPostId("")
      setCommentId("")
      setText("")

    } catch (error) {
      console.error("error editing comment: ", error);
    }

    setSeeComments(true)
    setUpdatePosts(true)
  }
 
  //DELETE COMMENT BY ID
  const deleteComment = async(postId, commentId) => {

    const token = localStorage.getItem("token");

    try {
      await axios.delete(
        `http://localhost:3000/api/auth/account/posts/${postId}/comments/${commentId}`,
         {
           headers: {
             Authorization: `Bearer ${token}`,
           },
         }
       );
      
    } catch (error) {
      console.error("error deleting comment: ", error);
    }
    setCommentId("")
    setUpdatePosts(true)
  }


  return ( 
    <>
      <div className={styles.list}>
      {posts.length > 0 

      ? (
            posts.map((post) => { 

              const hasLiked = post.likes.some((like) => like.userId === userId);

              return ( 
                <>   
                <div key={post.id} className={styles.listItemCard}>
                <div className={styles.listItemCardHeader}>
                  <img src={thisUser.profileImg}/>
                  <div className={styles.listItemCardHeaderText}>
                    <p><b>{thisUser.userName}</b></p>
                    <p>               
                      {post.destination
                      ? post.destination.destinationName
                      : "No destination"} 
                    </p>
                  </div>
                </div>

                <div className={styles.postImg}>
                  <img
                    src={post.postImg}
                    alt="Post Img"
                  />
                </div>

                    { post.updatedAt !== post.createdAt 
                      ? <p>{new Date(post.updatedAt).toLocaleDateString()}{"  "}
                      "{post.text}" 
                      </p> 
                      : <p>{new Date(post.createdAt).toLocaleDateString()}{"  "}
                      "{post.text}" </p>  
                    }
                  
                  {/* CONDITIONALLY RENDER AUTH USER FEATURES*/}
                  { user 
                  ? (
                      <div className={styles.postButtonContainer}> 
                        <button onClick={() => handleLikes(post.id)}>
                        {hasLiked
                        ? `Unlike: ${post.likes ? post.likes.length : ""}`
                        : `Like: ${post.likes ? post.likes.length : ""}`}
                        </button>
                      
                    
                        <button onClick={() => {
                          seeComments ? setSeeComments(false) :
                          setSeeComments(true),
                          setViewCommentsId(post.id)}}> 
                          {seeComments && post.id === viewCommentsId && post.comments.length > 0
                          ? `Hide Comments`
                          : `Comments: ${post.comments? post.comments.length : 0}`}
     
                        </button>
                      </div>
                      
                    ) : ( 
                      <>
                      <div className={styles.postButtonContainer}> 
                        <button onClick={() => setPopSignIn(true)}>
                          Likes { post.likes ? post.likes.length : 0 }
                        </button>

                        <button onClick={() => setPopSignIn(true)}> 
                          Comments {post.comments ? post.comments.length : 0 }
                        </button>
                      </div>

                      <PopUp trigger={popSignIn} setTrigger={setPopSignIn}>
                        <h3>Please <Link to={'/register'}>
                        Register</Link> or <Link to={'/login'}>Login</Link> to join the conversation</h3>
                      </PopUp>
                    </>

                  )
                  }

                  {/* CONDITIONALLY RENDER COMMENTS ON A PARTICULAR POST*/}
                  {seeComments && post.id === viewCommentsId && post.comments.length > 0
                    ? post.comments.map((comment) => {
                      return (
                      <div key={comment.id}>
                              <div className={styles.comments}>
                                <p>
                                  <b> { comment.user 
                                      ? "@" + comment.user.userName : "...loading" }
                                  </b>{" "}
                                      {comment.text}{"  "}
                                      {new Date(comment.createdAt).toLocaleDateString()}
                                </p>
                            

                            {/* CONDITIONALLY RENDER EDITING BUTTONS ON USER'S COMMENTS */}
                            { comment.userId === user.id
                              && editComment === false
                              ? <> 
                                <div className={styles.editCommentButtons}>
                                  
                                    <button onClick ={()=> {
                                      setEditComment(true),
                                      setCommentPostId(comment.postId),
                                      setCommentId(comment.id)
                                      }}>Edit</button> 
                                  
                                    <button onClick={() => deleteComment(comment.postId, comment.id)}>Delete</button>
                                
                                </div>
                              </>
                            : null }
                            </div>

                            {/* CONDITIONALLY RENDER EDIT FORM ON USER'S COMMENT BY ID */}
                            { comment.userId === user.id
                              && editComment === true 
                              && commentPostId === comment.postId
                              && commentId === comment.id
                                  ? 
                                    <>
                                      <div className={styles.editCommentForm}>
                                        <form onSubmit={() => {

                                          { if (text.length > 0) { editMyComment(comment.postId, comment.id, text)
                                            setEditComment(false)}
                                            else {
                                              alert("must enter text before submitting")
                                            }
                                          }

                                         }}>
                                          <input type="text" id="text" 
                                            value={text}
                                            onChange={(e) => setText(e.target.value)}/>
                                      
                                        <div className={styles.editCommentSubmitButtons}>
                                          <button onClick={() => setEditComment(false)}>Cancel</button>
                                        </div>
                                        <div className={styles.editCommentSubmitButtons}>
                                          <button value="submit">Submit</button>
                                        </div>
                                        </form>
                                      </div>
                                    </>
                                  : null }   
                        </div>
                          )})
                      : (null) }  

                    { user ?
                    <div>
                      <input
                        type="text"
                        placeholder="  Add a comment"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            handleComment(post.id, e.target.value);
                              e.target.value = ""; //clear input after submission
                          }
                        }}
                      /> 
                    </div>
                    : null
                    }
              
                  </div>       
              </> 
            )}
          )
      ) : (
        <p className={styles.defaultContent}>No Posts</p>
        )
      }
      </div>
    </>
  )
      
}
 
export default ProfilePosts