import styles from "../styles/Friends.module.css";
import { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import italy from "./Images/italy.jpg";
import { Link } from "react-router-dom";

const Friends = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [following, setFollowing] = useState([]);
  const [followingList, setFollowingList] = useState([]);
  const [loggedIn, setLoggedIn] = useState(false);
  const [loggedInUserId, setLoggedInUserId] = useState(null);

  //checks if user is logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setLoggedIn(true);
      const decodedToken = jwtDecode(token); //decode token to get userId
      setLoggedInUserId(decodedToken.userId); //set userId
    } else {
      setLoggedIn(false);
    }
  }, []);

  //fetch user components
  useEffect(() => {
    fetchUsers();
    if (loggedIn) {
      fetchFollowing(); //fetch following list if user is logged in
    }
  }, [loggedIn]);

  //fetch all users
  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/users");
      const randomUsers = response.data.sort(() => 0.5 - Math.random()); //randomize list of users
      setUsers(randomUsers);
      setFilteredUsers(randomUsers);
    } catch (error) {
      console.error("Error fetching users: ", error);
    }
  };

  //fetch followed accounts
  const fetchFollowing = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:3000/api/auth/account/following",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const followedUserIds = response.data.map(
        (follow) => follow.following.id
      ); // Track followed user IDs
      const followedUsers = response.data.map((follow) => follow.following); // Get full info of followed users

      setFollowing(followedUserIds);
      setFollowingList(followedUsers);
    } catch (error) {
      console.error("Error fetching following list: ", error);
    }
  };

  //handle for 'follow' user button
  const handleFollow = async (userId) => {
    try {
      const token = localStorage.getItem("token");

      //perform follow request
      await axios.post(
        `http://localhost:3000/api/auth/account/users/${userId}/follows`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      //fetch full details of user after following
      const response = await axios.get(
        `http://localhost:3000/api/users/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      //set user details from response
      const followedUser = response.data;

      console.log(`Followed user with ID: ${userId}`);
      setFollowing((prev) => [...prev, userId]); // Add the user ID to the following list
      setFollowingList((prev) => [...prev, followedUser]); // Add the user to the followingList array
    } catch (error) {
      console.error("Error following user: ", error);
    }
  };

  //handle 'unfollow' user button
  const handleUnfollow = async (userId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `http://localhost:3000/api/auth/account/users/${userId}/follows`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log(`UnFollowed user with ID: ${userId}`);
      setFollowing((prev) => prev.filter((id) => id !== userId)); //remove userId from following
      setFollowingList((prev) => prev.filter((user) => user.id !== userId)); //update following list
    } catch (error) {
      console.error("Error unfollowing user: ", error);
    }
  };

  //filter users by search term
  useEffect(() => {
    if (searchTerm === "") {
      setFilteredUsers(users);
    } else {
      setFilteredUsers(
        users.filter((user) =>
          user.userName.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [searchTerm, users]);

  return (
    <>
      {/* search users */}
      <div className={styles.container}>
        <div className={styles.friendsFilterContainer}>
          <h1>Search Users</h1>
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className={styles.friendFilterCard}>
            {/* conditionally renders if user isnt found */}
            {filteredUsers.length === 0 ? (
              <p>No user found...</p>
            ) : (
              <ul>
                {/* maps through users */}
                {filteredUsers
                  .filter((user) => user.id !== loggedInUserId) //filters out logged in user in search
                  .map((user) => (
                    <>
                      <li key={`user-${user.id}`}>
                        {/* link to user profile */}
                        <Link to={`/profile/${user.id}`}>
                          {/* conditionally renders pfp if doesnt exsist */}
                          {user.profileImg ? (
                            <img
                              src={user.profileImg}
                              alt="Profile Image"
                              className={styles.profile}
                            />
                          ) : (
                            <img
                              src={italy}
                              alt="Default Profile Image"
                              className={styles.profile}
                            />
                          )}
                        </Link>
                        {user.userName}
                        {/* conditionally renders follow unfollow button if logged in */}
                        {loggedIn && (
                          <>
                            {following.includes(user.id) ? (
                              <button
                                onClick={() => handleUnfollow(user.id)}
                                className={styles.btnFilter}
                              >
                                Unfollow
                              </button>
                            ) : (
                              <button
                                onClick={() => handleFollow(user.id)}
                                className={styles.btnFilter}
                              >
                                Follow
                              </button>
                            )}
                          </>
                        )}
                      </li>
                      <li>{`${user.firstName} ${user.lastName}`}</li>
                    </>
                  ))}
              </ul>
            )}
          </div>
        </div>

        {/*conditionally renders a list of accounts the logged in user follows if logged in */}
        {loggedIn && (
          <div className={styles.friendsFollowContainer}>
            <h1>Following</h1>
            <div className={styles.friendFollowCard}>
              {followingList.length > 0 ? (
                <>
                  <ul>
                    {followingList.map((user) => (
                      <>
                        <li key={`following-${user.id}`}>
                          {/* link to user profile */}
                          <Link to={`/profile/${user.id}`}>
                            {/* conditionally renders pfp if doesnt exsist */}
                            {user.profileImg ? (
                              <img
                                src={user.profileImg}
                                alt="Profile Image"
                                className={styles.profile}
                              />
                            ) : (
                              <img
                                src={italy}
                                alt="Default Profile Image"
                                className={styles.profile}
                              />
                            )}
                          </Link>
                          {user.userName}
                        </li>
                        <li>{`${user.firstName} ${user.lastName}`}</li>
                      </>
                    ))}
                  </ul>
                </>
              ) : (
                <p>You are not following anyone yet.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Friends;
