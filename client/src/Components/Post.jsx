import styles from "/styles/Post.module.css";
import italy from "./Images/italy.jpg";
// import { FiMoreVertical } from "react-icons/fi";
function Post() {
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
        <button>Like</button>
        <button>Comment</button>
        <button>Repost</button>
      </div>
      <div className={styles.commentSection}>
        <img src={italy} alt="" className={styles.profileComment} />
        <input type="text" placeholder="Write You Comment here" />
      </div>
      <p className={styles.timestamp}>9:42 pm Sep 17, 2024</p>
    </div>
  );
}

export default Post;
