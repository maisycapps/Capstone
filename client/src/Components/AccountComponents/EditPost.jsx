import { useEffect, useState } from "react";
import axios, { formToJSON } from "axios";
import styles from "../../styles/AccountSubs.module.css";

const EditPost = ({ postId, setUpdatePosts, setSeeEditForm, setViewEditFormId, posts, setPosts }) => {

//EDIT POST DATA
const [destinations, setDestinations] = useState([]);
const [destinationId, setDestinationId] = useState("");
const [postImg, setPostImg] = useState("");
const [text, setText] = useState("");
const [error, setError] = useState(null);


//GET DESTINATIONS FOR DROPDOWN MENU
useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/destinations"
        );
        setDestinations(response.data);

      } catch (error) {
        console.error("Error fetching destinations", error);
      }
    };

    fetchDestinations();
}, []);

  //EDIT POST BY ID
  const editPost = async(e) => {

    e.preventDefault();

    const token = localStorage.getItem("token");

    try {

      const response = await axios.patch(`http://localhost:3000/api/auth/account/posts/${postId}`,
        { text, postImg, destinationId: parseInt(destinationId) },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

    } catch (error) {
          setError("please modify at least one field", error)
    }
    setViewEditFormId("")
    setSeeEditForm(false)
    setUpdatePosts(true)

  }

    return ( 
        <>
        <h4>Edit Post</h4>

        <form onSubmit={editPost} className={styles.editForm}>

            <label htmlFor="destination">
                <select
                    id="destination"
                    value={destinationId}
                    onChange={(e) => setDestinationId(e.target.value)} 
                    >
                    <option value="">Change Destination</option>
                    {destinations.map((destination) => (
                        <option key={destination.id} value={destination.id}>
                            {destination.destinationName}
                        </option>
                    ))}
                </select>
            </label>

            <label htmlFor="postImg">Change Image
                <input type="url" id="postImg" placeholder="  add a different image url" 
                value={postImg}
                onChange={(e) => setPostImg(e.target.value)}/>
            </label>

            <label htmlFor="text">Change Text
                <input type="text" id="text" placeholder="  add different text" 
                value={text}
                onChange={(e) => setText(e.target.value)}/>
            </label>

            {error && <p style={{ color: "red" }}>{error}</p>}
            <button value="submit">Submit</button>

        </form>
        </>
    );
}
 
export default EditPost;