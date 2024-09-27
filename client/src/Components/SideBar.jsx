import styles from "../styles/SideBar.module.css";
import axios from "axios";
import italy from "./Images/italy.jpg";

import { useEffect, useState } from "react";

function SideBar({ loggedIn }) {
  const [user, setUser] = useState(null);
  const [userImg, setUserImg] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        // Fetch user's data
        const response = await axios.get(
          "http://localhost:3000/api/auth/account/users",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const accountData = await response.data[0];

        setUser(accountData);

        {
          accountData.profileImg
            ? setUserImg(
                <img src={accountData.profileImg} alt="Profile Image" />
              )
            : setUserImg(<img src={italy} alt="Default Profile Image" />);
        }
      } catch (error) {
        console.error("Error fetching user account data", error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className={styles.sideBarContainer}>
      {/* USER DATA */}
      {user ? (
        <>
          <div className={styles.profileBitContainer}>
            <div className={styles.profileBitImg}>{userImg}</div>

            <div className={styles.profileBit}>
              <h2>
                {" "}
                {user.firstName} {user.lastName}{" "}
              </h2>
              <p>{user.bio}</p>
            </div>
          </div>
        </>
      ) : null}

      {/* SIDE NAV */}
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
