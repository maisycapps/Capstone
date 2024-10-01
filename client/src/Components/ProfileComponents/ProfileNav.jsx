import { NavLink } from "react-router-dom";
import styles from "../../styles/Account.module.css";

const ProfileNav = () => {
  return (
    <>
      <NavLink className={styles.navElements} to="ProfileFollowers">
        Followers
      </NavLink>
      <NavLink className={styles.navElements} to="ProfileFollowing">
        Following
      </NavLink>
      <NavLink className={styles.navElements} to="ProfilePosts">
        Posts
      </NavLink>
    </>
  );
};

export default ProfileNav;
