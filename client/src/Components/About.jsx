import styles from "../styles/About.module.css";
import italy from "./Images/italy.jpg";
import girltime from "./Images/girltime.jpg";
import hiking from "./Images/hiking.jpg";
import trail from "./Images/trail.jpg";
import meditation from "./Images/meditation.jpg";
import airBalloons from "./Images/airBalloons.jpg";
import girlBoat from "./Images/girlBoat.jpg";
import guyMountain from "./Images/guyMountain.jpg";
import penguins from "./Images/penguins.jpg";
import plane from "./Images/plane.jpg";
import train from "./Images/train.jpg";
import boats from "./Images/boats.jpeg";

function About() {
  return (
    <div className={styles.aboutContainer}>
      <h1 className={styles.aboutTitle}>ABOUT</h1>
      <div className={styles.aboutHeader}>
        <img src={italy} alt="about" className={styles.aboutImage} />
        <div className={styles.aboutText}>
          <h1>
            Copilot 🎈 is a Social interaction platform where individuals can
            connect with people, and make friends, plan trips, and share
            memories together.
          </h1>
          <p>
            Developed by Jordan Harris, Maisy Capps, and Mathew Correa, Copilot
            aims to bring people together through shared adventures, offering
            features that allow users to organize trips, follow friends, and
            engage with travel posts, making it a hub for both social and travel
            enthusiasts.
          </p>
        </div>
      </div>
      <h1 className={styles.slog}>Social Interaction Made Easy </h1>

      <div className={styles.memorize}>
        <div className={styles.imgDisplay}>
          <img src={airBalloons} alt="" />
        </div>
        <div className={styles.imgDisplay}>
          <img src={plane} alt="" />
        </div>
        <div className={styles.imgDisplay}>
          <img src={meditation} alt="" />
        </div>
        <div className={styles.imgDisplay}>
          <img src={train} alt="" />
        </div>
        <div className={styles.imgDisplay}>
          <img src={trail} alt="" />
        </div>
        <div className={styles.imgDisplay}>
          <img src={guyMountain} alt="" />
        </div>
        <div className={styles.imgDisplay}>
          <img src={hiking} alt="" />
        </div>
        <div className={styles.imgDisplay}>
          <img src={girlBoat} alt="" />
        </div>
        <div className={styles.imgDisplay}>
          <img src={penguins} alt="" />
        </div>

        <div className={styles.imgDisplay}>
          <img src={boats} alt="" />
        </div>
      </div>
    </div>
  );
}

export default About;
