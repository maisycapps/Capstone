import italy from "./Images/italy.jpg";
import styles from "./Friends.module.css";
function Friends() {
  return (
    <div className={styles.friendsContainer}>
      <div className={styles.friendCard}>
        <img src={italy} alt="" />
        <h2>time stamp</h2>

        <h1 className={styles.names}>friend name</h1>
      </div>
      <div className={styles.friendCard}>
        <img src={italy} alt="" />
        <h2>time stamp</h2>

        <h1 className={styles.names}>friend name</h1>
      </div>
      <div className={styles.friendCard}>
        <img src={italy} alt="" />
        <h2>time stamp</h2>

        <h1 className={styles.names}>friend name</h1>
      </div>
      <div className={styles.friendCard}>
        <img src={italy} alt="" />
        <h2>time stamp</h2>
        <h1 className={styles.names}>friend name</h1>
      </div>
      <div className={styles.friendCard}>
        <img src={italy} alt="" />
        <h2>time stamp</h2>

        <h1 className={styles.names}>friend name</h1>
      </div>
      <div className={styles.friendCard}>
        <img src={italy} alt="" />
        <h2>time stamp</h2>

        <h1 className={styles.names}>friend name</h1>
      </div>
      <div className={styles.friendCard}>
        <img src={italy} alt="" />
        <h2>time stamp</h2>

        <h1 className={styles.names}>friend name</h1>
      </div>
    </div>
  );
}

export default Friends;
