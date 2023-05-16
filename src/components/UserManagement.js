import React, { useContext, useState } from "react";
import { Button } from "react-bootstrap";
import { PrimaryContext } from "../context/PrimaryContext";
import RequestLinking from "./RequestLinking";
import "./UserManagement.css";

export default function UserManagement() {
  const {
    properties,
    users,
    usersProperties,
    addNewUserProperty,
    deleteUserProperty,
  } = useContext(PrimaryContext);

  const handleDeleteClick = (id) => {
    if (
      window.confirm(
        "Are you sure you want to delete this property and all related bookings and feedback?"
      )
    ) {
      deleteUserProperty(id);
    }
  };

  const [filters, setFilters] = useState({
    userName: "",
    propertyName: "",
    unitNo: "",
    isManagement: "",
  });
  const [formData, setFormData] = useState({
    propertyId: "",
    userId: "",
    unitNo: "",
    isManagement: false,
  });

  const handleFormChange = (event) => {
    const target = event.target;
    const name = target.name;
    const value = target.type === "checkbox" ? target.checked : target.value;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // console.log("formData", formData);
    addNewUserProperty(formData);
  };

  const handleFilterChange = (filterKey) => (event) => {
    setFilters({
      ...filters,
      [filterKey]: event.target.value.toLowerCase(),
    });
  };

  const renderUserName = (userId) => {
    const user = users.find((u) => u.id === userId);
    if (user) {
      return `${user.first_name} ${user.last_name}`;
    }
    return "";
  };

  const renderPropertyName = (propertyId) => {
    const property = properties.find((p) => p.id === propertyId);
    if (property) {
      return property.name;
    }
    return "";
  };

  const filteredUsersProperties = usersProperties.filter((up) => {
    const user = users.find((u) => u.id === up.user_id);
    const property = properties.find((p) => p.id === up.property_id);
    const fullName = `${user.first_name} ${user.last_name}`.toLowerCase();
    const propertyName = property.name.toLowerCase();
    const unitNo = up.unit_no.toLowerCase();
    const isManagement = up.is_management ? "yes" : "no";

    return (
      fullName.includes(filters.userName) &&
      propertyName.includes(filters.propertyName) &&
      unitNo.includes(filters.unitNo) &&
      isManagement.includes(filters.isManagement)
    );
  });

  const propertyColors = {};
  properties.forEach((property) => {
    propertyColors[property.id] = property.color;
  });

  return (
    <div>
      <div>
        <form onSubmit={handleSubmit} className="my-form">
          <label>
            <select
              name="userId"
              value={formData.userId}
              onChange={handleFormChange}
            >
              <option value="">Select a user</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.first_name} {user.last_name}
                </option>
              ))}
            </select>
          </label>
          <label>
            <select
              name="propertyId"
              value={formData.propertyId}
              onChange={handleFormChange}
            >
              <option value="">Select a property</option>
              {properties.map((property) => (
                <option key={property.id} value={property.id}>
                  {property.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            <input
              type="text"
              name="unitNo"
              placeholder="Unit No:"
              value={formData.unitNo}
              onChange={handleFormChange}
            />
          </label>
          <label>
            Is Management:
            <input
              type="checkbox"
              name="isManagement"
              checked={formData.isManagement}
              onChange={handleFormChange}
            />
          </label>
          <button type="submit">Add User Property</button>
        </form>
        <RequestLinking />
        <table className="my-user-table">
          <thead>
            <tr>
              <th>
                <input
                  type="text"
                  placeholder="Search by User"
                  value={filters.userName}
                  onChange={handleFilterChange("userName")}
                />
              </th>
              <th>
                <input
                  type="text"
                  placeholder="Search by Property"
                  value={filters.propertyName}
                  onChange={handleFilterChange("propertyName")}
                />
              </th>
              <th>
                <input
                  type="text"
                  placeholder="Search by Unit No."
                  value={filters.unitNo}
                  onChange={handleFilterChange("unitNo")}
                />
              </th>
              <th>
                <input
                  type="text"
                  placeholder="Search by Management"
                  value={filters.isManagement}
                  onChange={handleFilterChange("isManagement")}
                />
              </th>
              <th rowSpan={2} style={{ textAlign: "center" }}>
                Delete
              </th>
            </tr>
            <tr>
              <th>Resident</th>
              <th>Property</th>
              <th>Unit No</th>
              <th>Management</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsersProperties.map((up) => (
              <tr
                key={up.id}
                style={{ backgroundColor: propertyColors[up.property_id] }}
              >
                <td>{renderUserName(up.user_id)}</td>
                <td>{renderPropertyName(up.property_id)}</td>
                <td>{up.unit_no}</td>
                <td>{up.is_management ? "Yes" : "No"}</td>
                <td>
                  <Button
                    variant="danger"
                    onClick={() => {
                      handleDeleteClick(up.id);
                    }}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
