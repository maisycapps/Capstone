import italy from "./Images/italy.jpg";
import styles from "./Destination.module.css";
function Destination() {
  return (
    <div className={styles.destinationContainer}>
      <div className={styles.destinationCard}>
        <img src={italy} alt="" />
        <h2>name</h2>
      </div>
      <div className={styles.destinationCard}>
        <img src={italy} alt="" />
        <h2>name</h2>
      </div>
      <div className={styles.destinationCard}>
        <img src={italy} alt="" />
        <h2>name</h2>
      </div>
      <div className={styles.destinationCard}>
        <img src={italy} alt="" />
        <h2>name</h2>
      </div>
      <div className={styles.destinationCard}>
        <img src={italy} alt="" />
        <h2>name</h2>
      </div>
    </div>
  );
}

export default Destination;
