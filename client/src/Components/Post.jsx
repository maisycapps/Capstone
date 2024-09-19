import { useState } from "react";
import styles from "../styles/Post.module.css";
import italy from "./Images/italy.jpg";
import { MdMoreVert } from "react-icons/md";
import { FaRegComments } from "react-icons/fa";
import { AiOutlineLike } from "react-icons/ai";
import React, { useState, useEffect } from "react";
import axios from "axios";

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [countLikes, setCountLikes] = useState(0);
  const [countComments, setCountComments] = useState(0);

  useEffect(() => {
    //fetch posts from backend
    const fetchPosts = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/posts");
        setPosts(response.data);
      } catch (error) {
        console.error("Error fetching posts: ", error);
      }
    };

    fetchPosts();
  }, []);

  function handleCountLikes() {
    setCountLikes(() => countLikes + 1);
  }
  function handleCountComments() {
    setCountComments(() => countComments + 1);
  }
  return (
    <>
      <div className={styles.postContainer}>
        <div className={styles.postCard}>
          <div className={styles.top}>
            <img src={italy} alt="" />
            <FiMoreVertical />
          </div>
          <img src={italy} alt="" />
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Minus,
            voluptates cum. Perferendis aliquam dolores tenetur non aperiam,
            totam illo quae vel aliquid, sed repellat. Illo non veniam culpa
            esse possimus.
            <div className={styles.btn}>
              <button>lIKE</button>
              <button>COMMENT</button>
              <button>SHARE</button>
            </div>
          </p>
        </div>
      </div>

      {/* ------ v subjected to change v ------ */}
      <div>
        <h2>Posts</h2>
        {posts.length > 0 ? (
          posts.map((post) => (
            <div key={post.id}>
              <h3>{post.destinations.destinationName}</h3>
              <img src={post.postImg} alt="user img" />
              <p>{post.user.userName}</p>
              <p>{post.text}</p>
            </div>
          ))
        ) : (
          <p>No Posts available</p>
        )}
      </div>
    </>
  );
};

export default Posts;
