import { useContext } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { PrimaryContext } from "../context/PrimaryContext";
import "./Management.css";

export default function Management() {
  const { loggedInUser } = useContext(PrimaryContext);

  return (
    <>
      {loggedInUser && loggedInUser.id === 1 ? (
        <div>
          <ul className="nav nav-tabs">
            <li className="nav-item">
              <NavLink
                to="feedback"
                className="nav-link"
                activeclassname="active"
              >
                Feedback
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="users" className="nav-link" activeclassname="active">
                Users
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="user-properties"
                className="nav-link"
                activeclassname="active"
              >
                User Properties
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="new-properties"
                className="nav-link"
                activeclassname="active"
              >
                Manage Properties
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="new-facilities"
                className="nav-link"
                activeclassname="active"
              >
                Manage Facilities
              </NavLink>
            </li>
          </ul>

          <Outlet />
        </div>
      ) : (
        <div>You are not authorized to view this page.</div>
      )}
    </>
  );
}
