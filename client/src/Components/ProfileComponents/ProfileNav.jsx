import { NavLink } from "react-router-dom";
import styles from "../../styles/Account.module.css";

const ProfileNav = () => {
  return (
    <>
      <NavLink className={styles.navElements} to="followers">
        Followers
      </NavLink>
      <NavLink className={styles.navElements} to="following">
        Following
      </NavLink>
      <NavLink className={styles.navElements} to="profilePosts">
        Posts
      </NavLink>
    </>
  );
};

export default ProfileNav;
