import styles from "../styles/Post.module.css";
import axios from "axios";
import italy from "./Images/italy.jpg";
// import { MdMoreVert } from "react-icons/md";
// import { FaRegComments } from "react-icons/fa";
// import { AiOutlineLike } from "react-icons/ai";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [userId, setUserId] = useState(null);
  const [userName, setUserName] = useState(null);
  const navigate = useNavigate();


  useEffect(() => {
    //fetch posts from backend
    const fetchPosts = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/posts");
        setPosts(response.data);

        //fetch logged in users ID
        const token = localStorage.getItem("token");
        if (token) {
          const userResponse = await axios.get(
            "http://localhost:3000/api/auth/account",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setUserId(userResponse.data.id);
          setUserName(userResponse.data.userName);
        }
      } catch (error) {
        console.error("Error fetching posts: ", error);
      }
    };

    fetchPosts();
  }, []);

  //funtion to handle likes
  const handleLikes = async (postId) => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

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

      console.log(response.data);

      const action = response.data.action;

      if (!action) {
        console.error("action is undefined in the response");
      }

      //update UI after liking post
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId
            ? {
                ...post,
                likes:
                  action === "like"
                    ? [...post.likes, { id: userId }] //add like if action is 'like"
                    : post.likes.filter((like) => like.userId !== userId), //Remove like if logged in user has liked the post
              }
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

    if (!token) {
      navigate("/login");
      return;
    }

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
      {/* 
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
//         {/* <div className={styles.btn}>
//           <button onClick={handleCountLikes}>
//             <AiOutlineLike />
//             Like<span>{countLikes}</span>
//           </button>

          <button onClick={handleCountComments}>
            <FaRegComments />
            Comment<span>{countComments}</span>
          </button>
          {/* <button>Repost</button> */}
      {/* </div>
        <div className={styles.commentSection}>
          <img src={italy} alt="" className={styles.profileComment} />
          <input type="text" placeholder="Write You Comment here" />
          <button className={styles.commentPost}>Post</button>
        </div>
        <p className={styles.timestamp}>9:42 pm Sep 17, 2024</p>
      </div> */}

      {/* ------ v subjected to change v ------ */}
      <div>
        <h2>Posts</h2>
        {posts.length > 0 ? (
          posts.map((post) => {
            const hasLiked = post.likes.some((like) => like.userId === userId);

            return (
              <div key={post.id}>
                {/* display destination name */}
                <h3>
                  {post.destination
                    ? post.destination.destinationName
                    : "No destination"}
                </h3>
                {/* dispay destination img */}
                <img
                  src={post.postImg}
                  alt="Post Img"
                  style={{ width: "300px", height: "300px" }}
                />
                {/* post created by user */}
                <p>{post.user.userName}</p>
                {/* post bio */}
                <p>{post.text}</p>
                <p>likes: {post.likes ? post.likes.length : ""}</p>
                <p>Comments: {post.comments ? post.comments.length : ""}</p>

                {/* like button */}
                <button onClick={() => handleLikes(post.id)}>
                  {hasLiked ? "Unlike" : "Like"}
                </button>

                {/* comment button */}
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
                  {/* render comments for each post */}
                  {post.comments.map((comment) => {
                    return (
                      <div key={comment.id}>
                        <p>
                          {comment.user ? comment.user.userName : userName}:{" "}
                          {comment.text}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })
        ) : (
          <p>No Posts available</p>
        )}
      </div>
    </>
  );
};

export default Posts;
