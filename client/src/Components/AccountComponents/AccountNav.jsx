import { NavLink } from "react-router-dom";
import styles from "../../styles/Account.module.css"
import { useState, useEffect } from "react";

const AccountNav = () => {

    return ( 
        <>          
            <NavLink className={styles.navElements} to="followers">Followers</NavLink>
            <NavLink className={styles.navElements} to="following">Following</NavLink>
            <NavLink className={styles.navElements} to="myposts">Posts</NavLink>
            <NavLink className={styles.navElements} to="mytrips">Trips</NavLink>
            <NavLink className={styles.navElements} to="settings">Edit Account</NavLink>
        </>   
    );
}
 
export default AccountNav;