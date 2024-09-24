import styles from "../styles/MainContent.module.css";

import Post from "./Post";

function MainContent() {
  return (
    <div className={styles.mainContent}>
      <Post />
    </div>
  );
}

export default MainContent;
