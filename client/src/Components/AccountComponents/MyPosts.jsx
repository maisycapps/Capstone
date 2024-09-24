import CreatePost from '../CreatePost';
import { useState, useEffect } from 'react';
import axios from 'axios';

const MyPosts = ({ user, setUpdatedUser }) => {

  const [destinationNames, setDestinationNames] = useState({});
  const [newPostForm, setNewPostForm] = useState(false);

  useEffect(() => {

    const getDestinationName = async(destinationId) => {

      try {
        if(!destinationNames[destinationId]) {

          const response = await axios.get(`http://localhost:3000/api/destinations/${destinationId}`);
          const result = await response.data;
            setDestinationNames((prevNames) => ({
            ...prevNames, [destinationId]: result.destinationName,
            }));
        }
      } catch (error) {
        console.error(error)
      }
   };
   
   user.posts.forEach((post) => {
    getDestinationName(post.destinationId);
   })

  }, []);

  return (  
    <>

      <h3>Posts</h3>
      <div>
        {user.posts.length > 0 ? (
            user.posts.map((post) => (

            <div key={post.id}>
              <img src={user.profileImg}/>
              <p>{user.userName}</p>

              <p>
              {post.destinationId ? (
               <>
                <p><b>Destination: </b> {destinationNames[post.destinationId]} </p>
               </>
              ) : ( "No destination" )}
              </p>

              <img
              src={post.postImg}
              alt="Post Img"
              style={{ width: "300px", height: "300px" }}
              />

              <p><b>{user.userName}</b> {post.text}</p>
              <p>{new Date(post.createdAt).toLocaleDateString()}</p>
              <p>likes: {post.likes ? post.likes.length : ""}</p>
              <p>comments: {post.comments ? post.comments.length : ""}</p>
           
              {/* <button onClick={() => handleLikes(post.id)}>
                  {hasLiked ? "Unlike" : "Like"}
              </button> */}

             
              <div>
                {/* <input
                  type="text"
                  placeholder="Add a comment"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        handleComment(post.id, e.target.value);
                        e.target.value = ""; //clear input after submission
                    }
                  }}
                /> */}

              
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
                 
            </div>
            ))) : ( 
            <>
              <p>No Posts Yet</p>
              <button onClick={() => setNewPostForm(true)}>Create your first post</button>
              {newPostForm === true ? <CreatePost setNewPostForm={setNewPostForm} setUpdatedUser={setUpdatedUser}/> : null}
            </>
            )
          }
      </div>
    </>
  )
}
 
export default MyPosts;