import styles from "/styles/SideBar.module.css";
import Profile from "./Profile";
function SideBar() {
  return (
    <div className={styles.sideBarContainer}>
      <Profile />
      <ul className={styles.list}>
        <li className={styles.sideList}>HOME</li>
        <li className={styles.sideList}>ABOUT </li>
        <li className={styles.sideList}>GALLERY</li>
        <li className={styles.sideList}>TRIPS</li>
        <li className={styles.sideList}>DESTINATION</li>
      </ul>
    </div>
  );
}

export default SideBar;
