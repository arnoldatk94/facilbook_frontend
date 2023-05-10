import React, { useContext, useState } from "react";
import { PrimaryContext } from "../context/PrimaryContext";

export default function UserManagement() {
  const { properties, users, usersProperties, loggedInUser } =
    useContext(PrimaryContext);

  const [filters, setFilters] = useState({
    userName: "",
    propertyName: "",
    unitNo: "",
    isManagement: "",
  });

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

  return (
    <div>
      {loggedInUser && loggedInUser.id === 1 ? (
        <div>
          <h2>Welcome!</h2>
          <table className="my-table">
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
              </tr>
              <tr>
                <th>User Name</th>
                <th>Property Name</th>
                <th>Unit No</th>
                <th>Is Management</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsersProperties.map((up) => (
                <tr key={up.id}>
                  <td>{renderUserName(up.user_id)}</td>
                  <td>{renderPropertyName(up.property_id)}</td>
                  <td>{up.unit_no}</td>
                  <td>{up.is_management ? "Yes" : "No"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <h2>Restricted page</h2>
      )}
    </div>
  );
}
