import { useState, useEffect } from "react";
import axios from "axios";
import styles from "../../styles/Admin.module.css";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  //fetch users from database
  const fetchUsers = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios("http://localhost:3000/api/admin/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const allUsers = await response.data;
      setUsers(allUsers);
    } catch (error) {
      console.error("Error fetching users: ", error);
    }
  };

  //search function
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  //filters users by userName for search
  const filteredUsers = users.filter((user) =>
    user.userName.toLowerCase().includes(searchTerm.toLocaleLowerCase())
  );

  const handleDeleteUser = async (userId) => {
    const token = localStorage.getItem("token");
    if (window.confirm("Are you sure you want to delete this account?")) {
      try {
        await axios.delete(`http://localhost:3000/api/admin/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
      } catch (error) {
        console.error("Error deleting user: ", error);
      }
    }
  };

  return (
    <>
      <div className={styles.adminContainer}>
        {" "}
        <h3>Manage Users</h3>
        <input
          type="text"
          className={styles.inputSearch}
          placeholder="Search by username..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <div className={styles.userCard}>
          <ul>
            {filteredUsers.map((user) => (
              <li key={user.id}>
                <img src={user.profileImg} alt="userImg" />
                <div className={styles.userDetail}>
                  <h1>{user.userName}</h1>
                  <h2>{user.email}</h2>

                  <button onClick={() => handleDeleteUser(user.id)}>
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};

export default Users;
