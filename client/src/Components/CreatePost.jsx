import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const createPost = () => {
  const [text, setText] = useState("");
  const [destinations, setDestinations] = useState([]);
  const [destinationId, setDestinationId] = useState("");
  const [postImg, setPostImg] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/destinations"
        );
        setDestinations(response.data);
        console.log("Destinations", response.data);
      } catch (error) {
        console.error("Error fetching destinations", error);
      }
    };

    fetchDestinations();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      //send post to the database
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:3000/api/posts",
        { text, postImg, destinationId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      navigate("/account/posts"); // redirects to posts page -- not sure on this redirect for our routes
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
          {/* list of destinations */}
          <div>
            <label>Destination:</label>
            <select
              value={destinationId}
              onChange={(e) => setDestinationId(e.target.value)}
              required
            >
              <option value="">Select a Destination</option>
              {destinations.map((destination) => (
                <option key={destination.id} value={destination.id}>
                  {destination.name}
                </option>
              ))}
            </select>
          </div>
          {/* image input URL */}
          <div>
            <label>Image URL:</label>
            <input
              type="text"
              value={postImg}
              onChange={(e) => setPostImg(e.target.value)}
              required
            />
          </div>
          {/* post text */}
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

export default createPost;
