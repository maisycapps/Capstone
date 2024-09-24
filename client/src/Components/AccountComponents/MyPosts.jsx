const MyPosts = ({user}) => {
  return (  
    <>
      <div>
        {user.posts.length > 0 ? (
            user.posts.map((post) => (

            <div key={post.id}>
          
              <h3>
              {post.destination
                ? post.destination.destinationName
                : "No destination"}
              </h3>

              <img
              src={post.postImg}
              alt="Post Img"
              style={{ width: "300px", height: "300px" }}
              />

              <p>{user.userName}</p>

              <p>{post.text}</p>
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
            ))) : (<p>No Posts Yet</p>)
          };
      </div>
    </>
  )
}
 
export default MyPosts;