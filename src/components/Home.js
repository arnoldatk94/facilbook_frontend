import "./Home.css";
import React, { useContext, useEffect, useState } from "react";
import { PrimaryContext } from "../context/PrimaryContext";
import axios from "axios";
import { BACKEND_URL } from "../constant";

export default function Home() {
  const [isEditing, setIsEditing] = useState(false);
  const [updatedUser, setUpdatedUser] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    email: "",
  });
  const { loggedInUser, loggedInUsersProperties, properties, updateUserData } =
    useContext(PrimaryContext);

  // const updateUserData = async () => {
  //   axios
  //     .put(`${BACKEND_URL}/users/`, {
  //       id: loggedInUser.id,
  //       phone: updatedUser.phone,
  //     })
  //     .then((response) => {
  //       console.log(response.data);
  //     })
  //     .catch((error) => {
  //       console.log(error.response.data);
  //     });
  // };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Update the backend with updatedUser state

    const phoneRegex = /^\d{8,}$/;
    if (!phoneRegex.test(updatedUser.phone)) {
      alert("Please enter a valid phone number with at least 8 digits.");
      return;
    }
    updateUserData(loggedInUser.id, updatedUser.phone);
    setIsEditing(false);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
  };

  useEffect(() => {
    if (loggedInUser !== null) {
      console.log("Logged In User: ", loggedInUser);
      console.log("Logged In User Properties: ", loggedInUsersProperties);
    } else {
      console.log("Not logged in");
    }
  }, [loggedInUser, loggedInUsersProperties]);

  const propertyMap = properties.reduce((map, property) => {
    map[property.id] = property.name;
    return map;
  }, {});

  return (
    <div>
      <div>
        <table className="my-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Edit</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                {loggedInUser &&
                  `${loggedInUser.first_name} ${loggedInUser.last_name}`}
              </td>
              <td>{loggedInUser && loggedInUser.email}</td>
              <td>
                {!isEditing ? (
                  loggedInUser && loggedInUser.phone
                ) : (
                  <input
                    type="text"
                    value={updatedUser.phone}
                    placeholder={loggedInUser.phone}
                    onChange={(e) =>
                      setUpdatedUser({
                        ...updatedUser,
                        phone: e.target.value,
                      })
                    }
                  />
                )}
              </td>
              <td>
                {!isEditing ? (
                  <button onClick={handleEditClick}>Edit</button>
                ) : (
                  <>
                    <button onClick={handleCancelClick}>Cancel</button>
                    <button onClick={handleSubmit}>Submit</button>
                  </>
                )}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      {/* property info */}
      <table className="my-table">
        <thead>
          <tr>
            <th>Property</th>
            <th>Unit Number</th>
          </tr>
        </thead>
        <tbody>
          {loggedInUsersProperties &&
            loggedInUsersProperties.map((property) => (
              <tr key={property.id}>
                <td>{propertyMap[property.property_id]}</td>
                <td>{property.unit_no}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}
