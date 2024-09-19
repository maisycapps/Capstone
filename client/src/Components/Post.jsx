import { useState } from "react";
import styles from "../styles/Post.module.css";
import italy from "./Images/italy.jpg";
import { MdMoreVert } from "react-icons/md";
import { FaRegComments } from "react-icons/fa";
import { AiOutlineLike } from "react-icons/ai";

function Post() {
  const [countLikes, setCountLikes] = useState(0);
  const [countComments, setCountComments] = useState(0);
  function handleCountLikes() {
    setCountLikes(() => countLikes + 1);
  }
  function handleCountComments() {
    setCountComments(() => countComments + 1);
  }
  return (
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
      <div className={styles.btn}>
        <button onClick={handleCountLikes}>
          <AiOutlineLike />
          Like<span>{countLikes}</span>
        </button>

        <button onClick={handleCountComments}>
          <FaRegComments />
          Comment<span>{countComments}</span>
        </button>
        {/* <button>Repost</button> */}
      </div>
      <div className={styles.commentSection}>
        <img src={italy} alt="" className={styles.profileComment} />
        <input type="text" placeholder="Write You Comment here" />
        <button className={styles.commentPost}>Post</button>
      </div>
      <p className={styles.timestamp}>9:42 pm Sep 17, 2024</p>
    </div>
  );
}

export default Post;
