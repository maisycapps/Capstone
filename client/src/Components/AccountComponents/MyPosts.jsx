import CreatePost from "../CreatePost";
import { useState, useEffect } from "react";
import axios from "axios";
import styles from "../../styles/AccountSubs.module.css";

const MyPosts = ({ user, setUpdatedUser }) => {
  const [destinationNames, setDestinationNames] = useState({});
  const [newPostForm, setNewPostForm] = useState(false);
  const [posts, setPosts] = useState({});
  const [like, setLike] = useState(false);

  useEffect(() => {
    const getDestinationName = async (destinationId) => {
      try {
        if (!destinationNames[destinationId]) {
          const response = await axios.get(
            `http://localhost:3000/api/destinations/${destinationId}`
          );
          const result = await response.data;
          setDestinationNames((prevNames) => ({
            ...prevNames,
            [destinationId]: result.destinationName,
          }));
        }
      } catch (error) {
        console.error(error);
      }
    };

    user.posts.forEach((post) => {
      getDestinationName(post.destinationId);
    });

    setPosts(user.posts);
    setLike(false);
  }, [posts, like]);

  //funtion to handle likes
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
      setLike(true);

      if (!action) {
        console.error("action is undefined in the response");
      }

      //update UI after liking post
      // setPosts((prevPosts) =>
      //   prevPosts.map((post) =>

      //     post.id === postId
      //       ? {
      //           ...post,
      //           likes:
      //             action === "like"
      //               ? [...post.likes, { id: user.id }] //add like if action is 'like"
      //               : post.likes.filter((like) => like.userId !== user.id)
      //                //Remove like if logged in user has liked the post
      //         }
      //       : post
      //   )
      // );
    } catch (error) {
      console.error("Error liking post: ", error);
    }
  };

  return (
    <>
      <h3>Posts</h3>
      <div className={styles.buttonContainer}>
        <button onClick={() => setNewPostForm(true)}>Add New Post</button>
      </div>
      {newPostForm === true ? (
        <CreatePost
          setNewPostForm={setNewPostForm}
          setUpdatedUser={setUpdatedUser}
        />
      ) : null}

      <div className={styles.list}>
        {user.posts.length > 0 ? (
          user.posts.map((post) => {
            const hasLiked = post.likes
              ? post.likes.some((like) => like.userId === user.id)
              : null;

            return (
              <div key={post.id} className={styles.listItemCard}>
                <div className={styles.listItemCardHeader}>
                  <img src={user.profileImg} />
                  <p>
                    <b>{user.userName}</b>
                  </p>
                </div>

                <span>
                  {post.destinationId ? (
                    <>
                      <p>
                        <b>Destination: </b>{" "}
                        {destinationNames[post.destinationId]}{" "}
                      </p>
                    </>
                  ) : (
                    "No destination"
                  )}
                </span>

                <img
                  src={post.postImg}
                  alt="Post Img"
                  style={{ width: "300px", height: "300px" }}
                />
                <p>likes: {post.likes ? post.likes.length : ""}</p>
                <p>comments: {post.comments ? post.comments.length : ""}</p>

                <p>
                  <b>{user.userName}</b> {post.text}
                </p>
                <p>
                  created on {new Date(post.createdAt).toLocaleDateString()}
                </p>
                {post.updatedAt !== post.createdAt ? (
                  <p>
                    updated on {new Date(post.updatedAt).toLocaleDateString()}
                  </p>
                ) : null}

                <button onClick={() => handleLikes(post.id)}>
                  {hasLiked ? "Unlike" : "Like"}
                </button>

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

                  {post.comments
                    ? post.comments.map((comment) => {
                        return (
                          <div key={comment.id}>
                            <p>
                              {comment.user ? comment.user.userName : userName}:{" "}
                              {comment.text}
                            </p>
                          </div>
                        );
                      })
                    : null}
                </div>
              </div>
            );
          })
        ) : (
          <>
            <p className={styles.defaultContent}>No Posts Yet</p>
            <button onClick={() => setNewPostForm(true)}>
              Create your first post
            </button>
            {newPostForm === true ? (
              <CreatePost
                setNewPostForm={setNewPostForm}
                setUpdatedUser={setUpdatedUser}
              />
            ) : null}
          </>
        )}
      </div>
    </>
  );
};

export default MyPosts;
