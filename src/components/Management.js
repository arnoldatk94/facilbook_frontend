import React, { useContext, useState } from "react";
import { PrimaryContext } from "../context/PrimaryContext";
import Property from "./Property";
import User from "./User";
import UserManagement from "./UserManagement";
import "./Management.css";
import NewProperties from "./NewProperties";
import NewFacilities from "./NewFacilities";

export default function Management() {
  const { loggedInUser } = useContext(PrimaryContext);
  const [activeTab, setActiveTab] = useState("properties");

  const renderActiveTab = () => {
    switch (activeTab) {
      case "properties":
        return <Property />;
      case "users":
        return <User />;
      case "userProperties":
        return <UserManagement />;
      case "newProperties":
        return <NewProperties />;
      case "newFacilities":
        return <NewFacilities />;
      default:
        return null;
    }
  };

  return (
    <div>
      {loggedInUser && loggedInUser.id === 1 ? (
        <div>
          <h2>Welcome!</h2>
          <ul className="nav nav-tabs">
            <li
              className={`nav-item ${
                activeTab === "properties" ? "active" : ""
              }`}
              onClick={() => setActiveTab("properties")}
            >
              <a className="nav-link" href="#">
                Properties
              </a>
            </li>
            <li
              className={`nav-item ${activeTab === "users" ? "active" : ""}`}
              onClick={() => setActiveTab("users")}
            >
              <a className="nav-link" href="#">
                Users
              </a>
            </li>
            <li
              className={`nav-item ${
                activeTab === "userProperties" ? "active" : ""
              }`}
              onClick={() => setActiveTab("userProperties")}
            >
              <a className="nav-link" href="#">
                User Properties
              </a>
            </li>
            <li
              className={`nav-item ${
                activeTab === "newProperties" ? "active" : ""
              }`}
              onClick={() => setActiveTab("newProperties")}
            >
              <a className="nav-link" href="#">
                New Properties
              </a>
            </li>
            <li
              className={`nav-item ${
                activeTab === "newFacilities" ? "active" : ""
              }`}
              onClick={() => setActiveTab("newFacilities")}
            >
              <a className="nav-link" href="#">
                New Facilities
              </a>
            </li>
          </ul>

          {renderActiveTab()}
        </div>
      ) : (
        <h2>Restricted page</h2>
      )}
    </div>
  );
}
