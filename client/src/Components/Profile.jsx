import italy from "./Images/italy.jpg";
import styles from "./Profile.module.css";
function Profile() {
  return (
    <div className={styles.profileCard}>
      <div className={styles.profile}>
        <img src={italy} alt="User Profile" />
        <h1>CAPSTON</h1>
      </div>
    </div>
  );
}

export default Profile;
