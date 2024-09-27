import styles from "../styles/About.module.css";
import italy from "./Images/italy.jpg";
import girltime from "./Images/girltime.jpg";
import hiking from "./Images/hiking.jpg";
import trail from "./Images/trail.jpg";
import meditation from "./Images/meditation.jpg";

function About() {
  return (
    <div className={styles.aboutContainer}>
      <h1 className={styles.aboutTitle}>ABOUT</h1>
      <div className={styles.aboutHeader}>
        <img src={italy} alt="about" className={styles.aboutImage} />
        <div className={styles.aboutText}>
          <h1>
            Tripy 🎈 is a Social interaction platform where individuals can
            connect with people and make friends organize trips share memorize
            together
          </h1>

          <p>
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Unde ut
            eligendi odit autem, ipsam dolores eos totam quisquam ipsa ratione
            nesciunt modi, inventore dolore id? Amet delectus neque blanditiis
            numquam, pariatur qui quo debitis quas, dolorem et quisquam ratione
            tempora?
          </p>
        </div>
      </div>
      <h1 className={styles.slog}>Social Interaction Made Easy </h1>

      <div className={styles.memorize}>
        <div className={styles.imgDisplay}>
          <img src={girltime} alt="" />
        </div>
        <div className={styles.imgDisplay}>
          <img src={hiking} alt="" />
        </div>
        <div className={styles.imgDisplay}>
          <img src={meditation} alt="" />
        </div>
        <div className={styles.imgDisplay}>
          <img src={trail} alt="" />
        </div>
      </div>
    </div>
  );
}

export default About;
