import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "../../styles/PostTab.module.css";

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch posts on component mount
  useEffect(() => {
    fetchPosts();
  }, []);

  //fetch all posts
  const fetchPosts = async () => {
    const token = localStorage.getItem("token");

    try {
      const response = await axios.get(
        "http://localhost:3000/api/admin/posts",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setPosts(response.data);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  //delete users post
  const handleDeletePost = async (postId) => {
    const token = localStorage.getItem("token");

    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        await axios.delete(`http://localhost:3000/api/admin/posts/${postId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
      } catch (error) {
        console.error("Error deleting post:", error);
      }
    }
  };

  //delete comment on a post
  const handleDeleteComment = async (commentId, postId) => {
    const token = localStorage.getItem("token");

    if (window.confirm("Are you sure you want to delete this comment?")) {
      try {
        await axios.delete(
          `http://localhost:3000/api/admin/comments/${commentId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        // Update the state to remove the comment
        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post.id === postId
              ? {
                  ...post,
                  comments: post.comments.filter(
                    (comment) => comment.id !== commentId
                  ),
                }
              : post
          )
        );
      } catch (error) {
        console.error("Error deleting comment:", error);
      }
    }
  };

  //search function
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  //filters posts by userName for search
  const filteredPosts = posts.filter((post) =>
    post.user.userName.toLowerCase().includes(searchTerm.toLocaleLowerCase())
  );

  return (
    <>
      <div className={styles.adminContainer}>
        <h3>Manage Posts</h3>
        <input
          type="text"
          placeholder="Search for posts by username..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
        {filteredPosts.map((post) => (
          <div className={styles.eachPost} key={post.id}>
            {/* user pfp */}
            <img
              src={post.user.profileImg}
              alt="Profile Image"
              style={{ width: "50px", height: "50px" }}
            />
            <div className={styles.userDetail}>
              {/* username */}
              <h2>USER: {post.user.userName}</h2>
              {/* destination */}
              <h2>
                {post.destination
                  ? post.destination.destinationName
                  : "No destination"}
              </h2>
              {/* post img */}
              <img
                src={post.postImg}
                alt="Post Img"
                style={{ width: "300px", height: "300px" }}
              />
              {/* post text */}
              <h4>{post.text}</h4>
              {/* delete button */}
              <button onClick={() => handleDeletePost(post.id)}>
                Delete Post
              </button>
            </div>

            {/* Render comments */}
            {post.comments && post.comments.length > 0 && (
              <div>
                {post.comments.map((comment) => (
                  <div key={comment.id}>
                    <h3 className={styles.comment}>
                      {comment.user.userName}: {comment.text}
                    </h3>
                    <button
                      className={styles.btn}
                      onClick={() => handleDeleteComment(comment.id, post.id)}
                    >
                      Delete Comment
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
      {/* </ul> */}
      {/* </div> */}
    </>
  );
};

export default Posts;
