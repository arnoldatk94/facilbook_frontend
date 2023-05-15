import "./ResidentRequestLink.css";
import React, { useContext, useEffect, useState } from "react";
import { PrimaryContext } from "../context/PrimaryContext";

export default function ResidentRequestLink() {
  const {
    linkRequests,
    properties,
    addLinkRequest,
    loggedInUser,
    deleteLinkRequest,
  } = useContext(PrimaryContext);
  const [newRequest, setNewRequest] = useState({
    user_id: "",
    property_id: "",
    unit_no: "",
  });

  useEffect(() => {
    if (loggedInUser) {
      setNewRequest((prevState) => ({
        ...prevState,
        user_id: loggedInUser.id,
      }));
    }
  }, [loggedInUser]);

  const filteredRequests = linkRequests.filter(
    (request) => request.user_id === loggedInUser.id
  );

  const handleDeleteClick = (id) => {
    const shouldDelete = window.confirm(
      "Are you sure you want to delete this request?"
    );
    if (shouldDelete) {
      deleteLinkRequest(id);
    }
  };

  const handlePropertyChange = (e) => {
    setNewRequest((prevState) => ({
      ...prevState,
      property_id: e.target.value,
    }));
  };

  const handleUnitChange = (e) => {
    setNewRequest((prevState) => ({
      ...prevState,
      unit_no: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!newRequest.unit_no) {
      alert("Please enter a unit number");
      return;
    }

    addLinkRequest(newRequest);
    setNewRequest((prevState) => ({
      ...prevState,
      unit_no: "",
    }));
  };

  useEffect(() => {
    console.log(linkRequests);
  }, [linkRequests]);
  return (
    <div>
      <h2>Resident Request Link Form</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Select Property:
            <select id="property-select" onChange={handlePropertyChange}>
              <option value="">--Please select a property--</option>
              {properties.map((property) => (
                <option key={property.id} value={property.id}>
                  {property.name}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div>
          <label>
            <input
              type="text"
              id="unit-input"
              className="input-style"
              value={newRequest.unit_no}
              onChange={handleUnitChange}
              placeholder="Enter unit number"
            />
          </label>
        </div>
        <button type="submit">Submit</button>
      </form>

      <table className="my-requests">
        <thead>
          <tr>
            <th>Property</th>
            <th>Unit No.</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredRequests.length > 0 ? (
            filteredRequests.map((request) => (
              <tr key={request.id}>
                <td>
                  {
                    properties.find((prop) => prop.id === request.property_id)
                      ?.name
                  }
                </td>
                <td>{request.unit_no}</td>
                <td style={{ textAlign: "left" }}>
                  <button onClick={() => handleDeleteClick(request.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3">No pending requests</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
