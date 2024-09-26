import SideBar from "./SideBar";
import MainContent from "./MainContent";
import Friends from "./Friends";
import styles from "../styles/Overview.module.css";

function Overview({loggedIn}) {
  return (
    <div className={styles.OverviewContainer}>
      <SideBar loggedIn={loggedIn} />
      <MainContent />
      <Friends />
    </div>
  );
}

export default Overview;
