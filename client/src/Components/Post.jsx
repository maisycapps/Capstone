import axios from "axios";
import styles from "../styles/Post.module.css";
import italy from "./Images/italy.jpg";
import { FaRegComments } from "react-icons/fa";
import { AiOutlineLike } from "react-icons/ai";
import { useState, useEffect } from "react";

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [destinationId, setDestinationId] = useState("");

  useEffect(() => {
    //fetch posts from backend
    const fetchPosts = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/posts", {
          destinationId,
        });
        setPosts(response.data);
      } catch (error) {
        console.error("Error fetching posts: ", error);
      }
    };

    fetchPosts();
  }, []);

  //funtion to handle likes
  const handleLikes = async (postId) => {
    const token = localStorage.getItem("token");

    try {
      await axios.post(
        `http://localhost:3000/api/auth/account/posts/${postId}/likes`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      //update UI after liking post
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId
            ? { ...post, likes: [...post.likes, { id: postId }] }
            : post
        )
      );
    } catch (error) {
      console.error("Error liking post: ", error);
    }
  };

  //function to handle adding comment
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
      {/* ------ v subjected to change v ------ */}
      <div className={styles.container}>
        <h2 className={styles.postHeader}>Posts</h2>
        {posts.length > 0 ? (
          posts.map((post) => (
            <div key={post.id} className={styles.header}>
              <div className={styles.name}>
                <img src={italy} alt="" className={styles.profile} />
                <ul>
                  <li>mathew</li>
                </ul>
              </div>
              <h3>
                {post.destination
                  ? post.destination.destinationName
                  : "No destination"}
              </h3>
              <img
                src={post.postImg}
                className={styles.picture}
                alt="Post Img"
                style={{ width: "400px", height: "400px" }}
              />
              {/* post created by user */}
              <p>{post.user.userName}</p>
              {/* post bio */}
              <p>{post.text}</p>
              {/* <p>likes: {post.likes ? post.likes.length : ""}</p> */}
              <button>
                <FaRegComments />
                Comments: {post.comments ? post.comments.length : ""}
              </button>

              <button onClick={() => handleLikes(post.id)}>
                <AiOutlineLike />
                Like: {post.likes ? post.likes.length : ""}
              </button>
              <div className={styles.commentSection}>
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
                <button className={styles.commentPost}>Post</button>
              </div>
            </div>
          ))
        ) : (
          <p>No Posts available</p>
        )}
        {/* </div> */}
      </div>
    </>
  );
};

export default Posts;
