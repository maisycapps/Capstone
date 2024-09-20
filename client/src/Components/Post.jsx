import React, { useState, useEffect } from "react";
import styles from "../styles/Post.module.css";
import axios from "axios";
import italy from "./Images/italy.jpg";
import { MdMoreVert } from "react-icons/md";
import { FaRegComments } from "react-icons/fa";
import { AiOutlineLike } from "react-icons/ai";

const Posts = () => {
  const [posts, setPosts] = useState([]);

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

  // function handleCountLikes() {
  //   setCountLikes(() => countLikes + 1);
  // }
  // function handleCountComments() {
  //   setCountComments(() => countComments + 1);
  // }
  return (
    <>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.name}>
            <img src={italy} alt="" className={styles.profile} />
            <ul>
              <li>mathew</li>
              <li>Online</li>
            </ul>
            <div className={styles.status}></div>
            <MdMoreVert className={styles.moreIcon} />
          </div>
        </div>
        <img src={italy} alt="" className={styles.picture} />
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatibus
          fugit aut architecto reiciendis temporibus, veritatis omnis cum
          doloribus voluptas a quasi vero deserunt molestiae eveniet commodi
          sapiente placeat quae dignissimos.
        </p>
        {/* <div className={styles.btn}>
          <button onClick={handleCountLikes}>
            <AiOutlineLike />
            Like<span>{countLikes}</span>
          </button>

          <button onClick={handleCountComments}>
            <FaRegComments />
            Comment<span>{countComments}</span>
          </button> */}
        {/* <button>Repost</button> */}
        {/* </div>
        <div className={styles.commentSection}>
          <img src={italy} alt="" className={styles.profileComment} />
          <input type="text" placeholder="Write You Comment here" />
          <button className={styles.commentPost}>Post</button>
        </div>
        <p className={styles.timestamp}>9:42 pm Sep 17, 2024</p>
      </div> */}
        );
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
      </div>
    </>
  );
};

export default Posts;
