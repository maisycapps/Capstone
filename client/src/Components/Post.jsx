import styles from "../styles/Post.module.css";
import italy from "./Images/italy.jpg";
import { FiMoreVertical } from "react-icons/fi";
function Post() {
  return (
    <div className={styles.postContainer}>
      <div className={styles.postCard}>
        <div className={styles.top}>
          <img src={italy} alt="" />
          <FiMoreVertical />
        </div>
        <img src={italy} alt="" />
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Minus,
          voluptates cum. Perferendis aliquam dolores tenetur non aperiam, totam
          illo quae vel aliquid, sed repellat. Illo non veniam culpa esse
          possimus.
          <div className={styles.btn}>
            <button>lIKE</button>
            <button>COMMENT</button>
            <button>SHARE</button>
          </div>
        </p>
      </div>
    </div>
  );
}

export default Post;
