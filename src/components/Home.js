import "./Home.css";
import React, { useContext, useState } from "react";
import { PrimaryContext } from "../context/PrimaryContext";
import ResidentRequestLink from "./ResidentRequestLink";
import { Button } from "react-bootstrap";

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

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
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

  const propertyMap = properties.reduce((map, property) => {
    map[property.id] = property.name;
    return map;
  }, {});

  const propertyColorMap = properties.reduce((map, property) => {
    map[property.id] = property.color;
    return map;
  }, {});

  return loggedInUser ? (
    <div>
      <div>
        {/* Profile Table */}
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
                  <Button onClick={handleEditClick}>Edit</Button>
                ) : (
                  <>
                    <Button variant="danger" onClick={handleCancelClick}>
                      Cancel
                    </Button>
                    <Button variant="success" onClick={handleSubmit}>
                      Submit
                    </Button>
                  </>
                )}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div>
        {/* property info */}
        <table className="property-table">
          <thead>
            <tr>
              <th>Property</th>
              <th>Unit Number</th>
            </tr>
          </thead>
          <tbody>
            {loggedInUsersProperties &&
              loggedInUsersProperties.map((property) => (
                <tr
                  key={property.id}
                  style={{
                    backgroundColor: propertyColorMap[property.property_id],
                  }}
                >
                  <td>{propertyMap[property.property_id]}</td>
                  <td>{property.unit_no}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      <ResidentRequestLink />
    </div>
  ) : (
    <div>
      <p>Please log in</p>
    </div>
  );
}
