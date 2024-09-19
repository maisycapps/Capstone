import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const createPost = () => {
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      //send post to the database
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:3000/api/posts",
        { text },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      navigate("/posts"); // redirects to posts page -- not sure on this redirect for our routes
    } catch (error) {
      setError("Failed to create post, Please try again.");
    }
  };

  return (
    <>
      {/* not finished needs required params */}
      <div>
        <h2>Create a Post</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Post Text:</label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              required
            />
          </div>
          {error && <p style={{ color: "red" }}>{error}</p>}
          <button type="submit">Submit Post</button>
        </form>
      </div>
    </>
  );
};
