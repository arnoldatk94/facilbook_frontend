import "./RequestLinking.css";

import React, { useContext, useEffect, useState } from "react";
import { PrimaryContext } from "../context/PrimaryContext";
import { Button } from "react-bootstrap";

export default function RequestLinking() {
  const {
    linkRequests,
    properties,
    users,
    updateLinkRequest,
    deleteLinkRequest,
  } = useContext(PrimaryContext);
  const [userFilter, setUserFilter] = useState("");
  const [propertyFilter, setPropertyFilter] = useState("");
  const [unitFilter, setUnitFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [editting, setEditting] = useState(null);
  const [editingStatus, setEditingStatus] = useState("pending");

  const handleClearClick = (e) => {
    const confirmed = window.confirm(
      "Are you sure you want to clear this request?"
    );
    if (confirmed) {
      deleteLinkRequest(e.id);
    }
  };

  const handleUserFilterChange = (event) => {
    setUserFilter(event.target.value);
  };

  const handlePropertyFilterChange = (event) => {
    setPropertyFilter(event.target.value);
  };

  const handleUnitFilterChange = (event) => {
    setUnitFilter(event.target.value);
  };

  const handleStatusFilterChange = (event) => {
    setStatusFilter(event.target.value);
  };

  const handleClearFilters = () => {
    setUserFilter("");
    setPropertyFilter("");
    setUnitFilter("");
    setStatusFilter("");
  };

  const handleCancelClick = () => {
    setEditting(null);
  };

  const handleSaveClick = (request) => {
    console.log(request.id);
    console.log(editingStatus);
    updateLinkRequest(request.id, editingStatus);
    setEditting(null);
  };

  const filteredRequests = linkRequests.filter(
    (request) =>
      request.unit_no.toLowerCase().includes(unitFilter.toLowerCase()) &&
      users
        .find((user) => user.id === request.user_id)
        .first_name.toLowerCase()
        .includes(userFilter.toLowerCase()) &&
      properties
        .find((property) => property.id === request.property_id)
        .name.toLowerCase()
        .includes(propertyFilter.toLowerCase()) &&
      request.request_status.toLowerCase().includes(statusFilter.toLowerCase())
  );

  const handleEditClick = (id) => {
    // handle edit Button click
    setEditting(id);
  };

  return (
    <div>
      <table className="my-table">
        <thead>
          <tr>
            <th>
              <input
                type="text"
                placeholder="Filter by User"
                value={userFilter}
                onChange={handleUserFilterChange}
              />
            </th>
            <th>
              <input
                type="text"
                placeholder="Filter by Property"
                value={propertyFilter}
                onChange={handlePropertyFilterChange}
              />
            </th>
            <th>
              <input
                type="text"
                placeholder="Filter by Unit"
                value={unitFilter}
                onChange={handleUnitFilterChange}
              />
            </th>
            <th>
              <input
                type="text"
                placeholder="Filter by Status"
                value={statusFilter}
                onChange={handleStatusFilterChange}
              />
            </th>
            <th>
              <Button variant="secondary" onClick={handleClearFilters}>
                Clear
              </Button>
            </th>
            <th>Clear Completed request?</th>
          </tr>
        </thead>
        <tbody>
          {filteredRequests.map((request) => (
            <tr key={request.id}>
              <td>
                {users.find((user) => user.id === request.user_id).first_name}{" "}
                {users.find((user) => user.id === request.user_id).last_name}
              </td>
              <td>
                {
                  properties.find(
                    (property) => property.id === request.property_id
                  ).name
                }
              </td>
              <td>{request.unit_no}</td>
              <td>
                {editting && editting.id === request.id ? (
                  <select
                    value={editingStatus}
                    onChange={(e) => setEditingStatus(e.target.value)}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Denied">Denied</option>
                    <option value="Completed">Completed</option>
                  </select>
                ) : (
                  request.request_status
                )}
              </td>
              <td>
                {editting && editting.id === request.id ? (
                  <>
                    <Button
                      variant="success"
                      onClick={() => handleSaveClick(request)}
                    >
                      Save
                    </Button>
                    <Button variant="danger" onClick={handleCancelClick}>
                      Cancel
                    </Button>
                  </>
                ) : (
                  <Button onClick={() => handleEditClick(request)}>Edit</Button>
                )}
              </td>
              <td>
                {request.request_status === "Completed" ||
                request.request_status === "Denied" ? (
                  <Button
                    onClick={() => {
                      handleClearClick(request);
                    }}
                  >
                    Clear
                  </Button>
                ) : null}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
