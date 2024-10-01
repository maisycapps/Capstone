import React, { useState, useEffect } from "react";
import styles from "../styles/Admin.module.css";
import Users from "./AdminComponents/UsersTab";
import Posts from "./AdminComponents/PostsTab";
import Trips from "./AdminComponents/TripsTab";
import Destinations from "./AdminComponents/DestinationsTab";

const Admin = () => {
  const [activeTab, setActiveTab] = useState("users");

  const renderTabContent = () => {
    switch (activeTab) {
      case "users":
        return <Users />;
      case "posts":
        return <Posts />;
      case "trips":
        return <Trips />; // Placeholder for now
      case "destinations":
        return <Destinations />; // Placeholder for now
      default:
        return <div>Select a tab</div>;
    }
  };

  return (
    <>
      <div className={styles.adminContainer}>
        {" "}
        <div>
          <h2>Admin Dashboard</h2>
          <div className={styles.adminTabs}>
            <button onClick={() => setActiveTab("users")}>Users</button>
            <button onClick={() => setActiveTab("posts")}>Posts</button>
            <button onClick={() => setActiveTab("trips")}>Trips</button>
            <button onClick={() => setActiveTab("destinations")}>
              Destinations
            </button>
          </div>

          <div className="admin-content">{renderTabContent()}</div>
        </div>
      </div>
    </>
  );
};

export default Admin;
