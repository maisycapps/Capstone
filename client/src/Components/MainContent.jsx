import styles from "/styles/MainContent.module.css";
import Destination from "./Destination";
import Post from "./Post";

function MainContent() {
  return (
    <div className={styles.mainContent}>
      <Destination />
      <Post />
    </div>
  );
}

export default MainContent;
