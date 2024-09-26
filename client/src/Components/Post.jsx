import axios from "axios";
import styles from "../styles/Post.module.css";
import italy from "./Images/italy.jpg";
import { FaRegComments } from "react-icons/fa";
import { AiOutlineLike } from "react-icons/ai";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Posts = ({ post }) => {
  const [posts, setPosts] = useState([]);
  const [userId, setUserId] = useState(null);
  const [userName, setUserName] = useState(null);
  const navigate = useNavigate();
  const [showComments, setShowComments] = useState(false);

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

  const handleOnClick = () => {
    setShowComments((prevShowComments) => !prevShowComments);
  };

  return (
    <>
      {/* ------ v subjected to change v ------ */}

      <div className={styles.container}>
        {posts.length > 0 ? (
          posts.map((post) => {
            const hasLiked = post.likes.some((like) => like.userId === userId);
            return (
              <div key={post.id} className={styles.header}>
                <div className={styles.name}>
                  <img src={italy} alt="" className={styles.profile} />
                  <ul>
                    <li>mathew</li>
                  </ul>
                </div>
                {/* display destination name */}
                <h3>
                  {post.destination
                    ? post.destination.destinationName
                    : "No destination"}
                </h3>
                {/* dispay destination img */}
                <img
                  src={post.postImg}
                  className={styles.picture}
                  alt="Post Img"
                  style={{ width: "300px", height: "300px" }}
                />
                {/* post created by user */}
                <p>{post.user.userName}</p>
                {/* post bio */}
                <p>{post.text}</p>

                {/* like button */}

                <button
                  onClick={() => handleLikes(post.id)}
                  className={styles.commentPost}
                >
                  {hasLiked
                    ? `Unlike: ${post.likes ? post.likes.length : ""}`
                    : `Like: ${post.likes ? post.likes.length : ""}`}
                </button>

                {/* comment button */}
                <button onClick={handleOnClick}>
                  {showComments
                    ? `Hide Comments: ${
                        post.comments ? post.comments.length : ""
                      }`
                    : `Comments: ${post.comments ? post.comments.length : ""}`}
                </button>

                {/* conditionally render comments */}
                {showComments && (
                  <div>
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
                )}
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
                  <button className={styles.commentPost}>POST</button>
                </div>
              </div>
              // </div>
            );
          })
        ) : (
          <p>No Posts available</p>
        )}
        {/* </div> */}
      </div>
    </>
  );
};

export default Posts;
