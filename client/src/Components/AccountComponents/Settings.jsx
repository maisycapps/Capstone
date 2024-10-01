import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styles from "../../styles/AccountSubs.module.css";

const Settings = ({user, setUpdateUser, setLoggedIn}) => {

    const navigate = useNavigate();

    const [bio, setBio] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [userName, setUserName] = useState("");
    const [email, setEmail] = useState("");
    const [profileImg, setProfileImg] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        try {
          const token = localStorage.getItem("token");
          const id = user.id;

          await axios.patch(
            "http://localhost:3000/api/auth/account",
            { firstName, lastName, userName, email, bio, profileImg },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
    
          console.log("account successfully edited")
          setUpdateUser(true);

          navigate("/account")
        
        } catch (error) {
          console.error(error)
        }
    };

    const handleDelete = async (e) => {
        e.preventDefault();

        try {
          const token = localStorage.getItem("token");
        
          const id = user.id;
          console.log("id", id)
        
          await axios.delete(
            "http://localhost:3000/api/auth/account",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          console.log("account successfully deleted")
          setLoggedIn(false)
        } catch (error) {
            console.error(error)
        }
    }

    return ( 
        <>
          <div className={styles.settingsBody}>
            <h3>Account Settings</h3> 

            <form onSubmit={handleSubmit}>
                <div className={styles.settingsForm}>
                    <label>First Name</label>
                    <input type="text" name="firstName" onChange={(e) => setFirstName(e.target.value)}/>

                    <label>Last Name</label>
                    <input type="text" name="lastName" onChange={(e) => setLastName(e.target.value)}/>

                    <label>Username</label>
                    <input type="text" name="userName" onChange={(e) => setUserName(e.target.value)}/>

                    <label>Email</label>
                    <input type="email" name="email" onChange={(e) => setEmail(e.target.value)}/>

                    <label>Profile Image</label>
                    <input type="url" name="profileImg" onChange={(e) => setProfileImg(e.target.value)}/>

                    <label>Bio</label>
                    <input type="text" name="Bio" onChange={(e) => setBio(e.target.value)}/>

                    <div className={styles.buttonContainer}>
                    <button type="submit">Save Changes</button>
                    </div>
                </div>
            </form>
            <div className={styles.deleteSection}>
            <h3>Delete Account</h3> 
            <p className={styles.warning}>this action is permanent</p>
            <div className={styles.buttonContainer}>
            <button onClick={handleDelete}>Delete Account</button>
            </div>
            </div>
          </div>
        </>
)
}
 
export default Settings;