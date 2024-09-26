import CreatePost from "../CreatePost";
import EditPost from "./EditPost";
import { useState, useEffect } from "react";
import axios, { formToJSON } from "axios";
import styles from "../../styles/AccountSubs.module.css";

const MyPosts = ({ user }) => {

  /* -------------------------------- CONDITIONAL RENDERING --------------------------------*/

  //CREATE NEW POST
  const [newPostForm, setNewPostForm] = useState(false); //view CreatePost route onClick
  
  //EDIT POST
  const [seeEditForm, setSeeEditForm] = useState(false); //view EditPost route
  const [viewEditFormId, setViewEditFormId] = useState("") //render edit form only on that post
  
  //VIEW COMMENTS ASSOCIATED WITH A SPECIFIC POST
  const [seeComments, setSeeComments] = useState(false); //view comments
  const [viewCommentsId, setViewCommentsId] = useState("") //render comments on only that post

  //EDIT COMMENT
  const [editComment, setEditComment] = useState(false) //view edit form
  const [commentPostId, setCommentPostId] = useState("") //render edit form on only that post
  const [commentId, setCommentId] = useState("") //render edit form on only that comment
  const [text, setText] = useState("") //body for patch request

/* -------------------------------- RE-RENDER DEPENDENCY --------------------------------*/
  const [updatePosts, setUpdatePosts] = useState(false)

/* -------------------------------- USER DATA --------------------------------*/
  const [userId, setUserId] = useState(null);
  const [posts, setPosts] = useState([]);


  //SET USER ID
  useEffect(() => {
    if (user && user.id) {
       setUserId(user.id);
    }
  }, [user]); 

/* -------------------------------- POSTS CRUD --------------------------------*/

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
        setViewEditFormId("")

      } catch (error) {
        console.error("Error fetching posts: ", error);
      }
    };
    fetchUserPosts();

  }, [updatePosts]);

  //DELETE POST BY ID
  const deletePost = async(postId) => {

    const token = localStorage.getItem("token");
  
    try {
      await axios.delete(
        `http://localhost:3000/api/auth/account/posts/${postId}`,
          {
            headers: {
               Authorization: `Bearer ${token}`,
             },
          }
        );  
    } catch (error) {
        console.error("error deleting post: ", error);
    }
      setUpdatePosts(true)
      console.log("successfully deleted post")
  }
 
  
/* -------------------------------- LIKES CRUD --------------------------------*/

//LIKE & UNLIKE
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
        setUpdatePosts(true)
      } catch (error) {
        console.error("error adding comment: ", error);
      }
  };

  //EDIT COMMENT BY ID
  const editMyComment = async(postId, commentId, text) => {

    console.log("editComment function", "postId", postId, "commentId", commentId)

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
      
      console.log("patch request response", response.data)

    } catch (error) {
      console.error("error editing comment: ", error);
    }
    setEditComment(false);
    setCommentPostId("")
    setCommentId("")
    setText("")
    setUpdatePosts(true)
    console.log("successfully edited comment")
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
    console.log("successfully deleted comment")
  }

  return (  
    <>
      <div className={styles.buttonContainer}>
          <button onClick={() => setNewPostForm(true)}>Add New Post</button>
      </div>

      {/* CONDITIONALLY RENDER CREATE POST FORM */}
      {newPostForm === true && posts.length > 0 ? <CreatePost setNewPostForm={setNewPostForm} setUpdatePosts={setUpdatePosts}/> : null}

      
      <div className={styles.list}>
        {posts.length > 0 ? (
        posts.map((post) => {
            const hasLiked = post.likes.some((like) => like.userId === userId);

          return (

            <div key={post.id} className={styles.listItemCard}>

              <div className={styles.postModsButtonContainer}>

                {/* EDIT BUTTON --- Change text to gear icon */}
                <button onClick={() => {
                  setSeeEditForm(true),
                  setViewEditFormId(post.id)
                  }}>Edit Post
                </button>
                
                {/* DELETE BUTTON --- Change text to trashcan icon */}
                <button onClick={() => deletePost(post.id)}>Delete Post</button>
              </div>

                {/* CONDITIONALLY RENDER POST OR EDIT FORM */}
                { seeEditForm && post.id === viewEditFormId ? 
                (<> 
                  <div className={styles.listItemCardHeader}>
                    <img src={user.profileImg}/>
                    <div className={styles.listItemCardHeaderText}>
                      <p><b>{user.userName}</b></p>
                    </div>
                  </div>

                    <EditPost 
                        postId={post.id} 
                        setUpdatePosts={setUpdatePosts} 
                        setSeeEditForm={setSeeEditForm} 
                        posts={posts} setPosts={setPosts} 
                        setViewEditFormId={setViewEditFormId}
                      />
                  </> 
                  ) : (
                <>   
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

                <div className={styles.postImg}>
                  <img
                    src={post.postImg}
                    alt="Post Img"
                  />
                </div>

                   <p>
                  {post.text} {"  "}
                  {new Date(post.createdAt).toLocaleDateString()}
                  </p>
                  { post.updatedAt !== post.createdAt 
                    ? <p>edited: {new Date(post.updatedAt).toLocaleDateString()}</p> 
                    : null}  

                {/* DYNAMIC LIKE BUTTON */}
                <div className={styles.postButtonContainer}> 
                  <button onClick={() => handleLikes(post.id)}>
                    {hasLiked ? "Unlike" : "Like"}{"  "}
                    {post.likes ? post.likes.length : 0}
                  </button>
                 
                  {/* VIEW COMMENTS BUTTON */}
                  <button onClick={() => {
                    setSeeComments(true),
                    setViewCommentsId(post.id)}}> Comments {post.comments.length}
                  </button>

                </div>
                
                {/* CONDITIONALLY RENDER COMMENTS ON A PARTICULAR POST*/}
                {seeComments && post.id === viewCommentsId && post.comments.length > 0
                  ? post.comments.map((comment) => {
                    return (
                      <div key={comment.id} className={styles.comments}>
                        <p>
                          <b> { comment.user 
                              ? "@" + comment.user.userName : "...loading" }
                          </b>{" "}
                              {comment.text}{"  "}
                              {new Date(comment.createdAt).toLocaleDateString()}
                        </p>
                          <div>

                            {/* CONDITIONALLY RENDER EDITING BUTTONS ON USER'S COMMENTS */}
                            { comment.userId === userId 
                              && editComment === false
                            ? <> 
                                <div className={styles.editCommentButtons}>
                                  <div className={styles.editCommentButton}>
                                    <button onClick ={()=> {
                                      setEditComment(true),
                                      setCommentPostId(comment.postId),
                                      setCommentId(comment.id)
                                      }}>Edit</button> 
                                  </div>

                                  <div className={styles.editCommentButton}>
                                    <button onClick={() => deleteComment(comment.postId, comment.id)}>Delete</button>
                                  </div>
                                </div>
                              </>
                            : null }

                            {/* CONDITIONALLY RENDER EDIT FORM ON USER'S COMMENT BY ID */}
                            { comment.userId === userId 
                              && editComment === true 
                              && commentPostId === comment.postId
                              && commentId === comment.id
                                  ? 
                                    <>
                                      {/* {setPrevText(comment.text)} */}
                                      <div className={styles.editCommentForm}>
                                        <form onSubmit={() => editMyComment(comment.postId, comment.id, text)}>
                                          <input type="text" id="text" 
                                          // placeholder={prevText} 
                                            value={text}
                                            onChange={(e) => setText(e.target.value)}/>
                                        <button value="submit">Submit</button>
                                        </form>
                                      </div>
                                    </>
                                  : null }

                          </div>
                      </div>
                    );
                    })
                : null }  
                
                
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
              </> )}
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
  );
};

export default MyPosts;
