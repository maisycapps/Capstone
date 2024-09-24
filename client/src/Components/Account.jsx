import italy from "./Images/italy.jpg";
import styles from "../styles/Account.module.css";

function Account() {
  return (
    <div className={styles.accountCard}>
      <div className={styles.account}>
        <img src={italy} alt="User Account" />
        <h1>CAPSTONE</h1>
      </div>
    </div>
  );
}

export default Account;
