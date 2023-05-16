import React, { useContext, useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import { PrimaryContext } from "../context/PrimaryContext";

import "./ResidentProperty.css";
import moment from "moment";
import { Button } from "react-bootstrap";

export default function ResidentProperty() {
  const {
    properties,
    facilities,
    feedbacks,
    users,
    usersProperties,
    addFeedback,
    loggedInUser,
    deleteFeedback,
  } = useContext(PrimaryContext);
  const [selectedPropertyId, setSelectedPropertyId] = useState(null);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [selectedFacilityId, setSelectedFacilityId] = useState(null);
  const [selectedUnit, setSelectedUnit] = useState("");
  const [newFeedback, setNewFeedback] = useState({
    facility_id: "",
    user_property_id: "",
    user_id: "",
    property_id: "",
    comment: "",
  });

  useEffect(() => {
    console.log(selectedFacilityId);
  }, [selectedFacilityId]);

  useEffect(() => {
    if (loggedInUser !== null) {
      setNewFeedback((prevFeedback) => ({
        ...prevFeedback,
        user_id: parseInt(loggedInUser.id),
      }));
    }
  }, [loggedInUser]);

  // Call filterProperties when properties or loggedInUser changes
  useEffect(() => {
    const filterProperties = () => {
      const filtered = properties.filter((property) =>
        usersProperties.some(
          (up) =>
            up.property_id === property.id && up.user_id === loggedInUser.id
        )
      );
      setFilteredProperties(filtered);
    };
    if (properties !== null && loggedInUser !== null) filterProperties();
  }, [properties, loggedInUser, usersProperties]);

  const propertyStyle = (color) => ({
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    backgroundColor: color,
    cursor: "pointer",
  });

  const imageStyle = {
    height: "300px",
    width: "100%",
    objectFit: "cover",
    marginBottom: "0px",
  };

  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 3,
  };

  const handleDeleteClick = (id) => {
    if (window.confirm("Are you sure you want to delete this comment?")) {
      deleteFeedback(id);
    }
  };

  const handlePropertyClick = (propertyId) => {
    setSelectedUnit("");
    setSelectedFacilityId(null);
    setSelectedPropertyId(propertyId);
    setNewFeedback((prevFeedback) => ({
      ...prevFeedback,
      property_id: parseInt(propertyId),
      facility_id: "",
    }));
  };

  const handleFacilityClick = (facilityId) => {
    setSelectedFacilityId(facilityId);
    setSelectedUnit("");
    setNewFeedback((prevFeedback) => ({
      ...prevFeedback,
      facility_id: parseInt(facilityId),
    }));
  };

  const handleUnitClick = (e) => {
    setSelectedUnit(e.target.value);
    setNewFeedback((prevFeedback) => ({
      ...prevFeedback,
      user_property_id: e.target.value === "" ? "" : parseInt(e.target.value),
    }));
  };

  const handleCommentChange = (e) => {
    setNewFeedback((prevFeedback) => ({
      ...prevFeedback,
      comment: e.target.value,
    }));
  };

  const handleSubmit = () => {
    if (!newFeedback.comment) {
      alert("Please enter a comment before submitting");
      return;
    }
    addFeedback(newFeedback);
  };

  const units = usersProperties.filter(
    (up) =>
      up.property_id === selectedPropertyId && up.user_id === loggedInUser.id
  );

  const selectedProperty = properties.find(
    (property) => property.id === selectedPropertyId
  );

  function textStyle(color) {
    return {
      fontSize: "14px",
      fontWeight: "normal",
      margin: "0",
      backgroundColor: color,
      padding: "5px",
    };
  }

  const filteredFacilities =
    selectedPropertyId !== null
      ? new Set(
          facilities.filter(
            (facility) => facility.property_id === selectedPropertyId
          )
        )
      : new Set();

  return (
    <>
      <Slider {...settings}>
        {filteredProperties.map((property) => (
          <div
            key={property.id}
            style={propertyStyle(property.color)}
            onClick={() => handlePropertyClick(property.id)}
          >
            <img
              src={property.photoUrl}
              alt={property.name}
              style={imageStyle}
            />
            <h3 style={{ ...textStyle(property.color), fontWeight: "bold" }}>
              {property.name}
            </h3>
            <p style={{ ...textStyle(property.color), fontWeight: "normal" }}>
              {property.address}
            </p>
          </div>
        ))}
      </Slider>

      {selectedProperty && (
        <div
          className="property-header"
          style={{ backgroundColor: selectedProperty.color, marginTop: "20px" }}
        >
          <div>
            <h3>{selectedProperty.name}</h3>
            <h6>Click on facility to provide feedback</h6>
          </div>
        </div>
      )}

      <div className="facilities-container">
        {[...filteredFacilities].map((facility) => (
          <div
            key={facility.id}
            className="facility"
            style={
              facility.id === selectedFacilityId
                ? { border: "2px solid black" }
                : {}
            }
            onClick={() => handleFacilityClick(facility.id)}
          >
            <img
              src={facility.photoUrl}
              alt={facility.name}
              className="facility__image"
            />
            <h3 className="facility__title">{facility.name}</h3>
            <p className="facility__booking-limit">
              Booking Limit: {facility.booking_limit} hrs
            </p>
            <p className="facility__booking-limit">
              Max Capacity: {facility.max_capacity}
            </p>
            <p className="facility__booking-limit">
              Opening hours: <br />
              {moment(facility.start_time, "HH:mm:ss").format("h:mm a")} <br />
              {moment(facility.end_time, "HH:mm:ss").format("h:mm a")}
            </p>
            <p className="facility__booking-limit">
              {facility.closed_for_maintenance
                ? "Under Maintenance"
                : "Available"}
            </p>
          </div>
        ))}
      </div>

      {/* Choose Unit table */}
      <div className="resident-property-container">
        {newFeedback.property_id &&
          !isNaN(newFeedback.property_id) &&
          newFeedback.facility_id &&
          !isNaN(newFeedback.facility_id) && (
            <div className="resident-property-section">
              <label className="resident-property-label">
                <select value={selectedUnit} onChange={handleUnitClick}>
                  <option value={""}>Select Unit</option>
                  {units.map((unit) => (
                    <option key={unit.id} value={unit.id}>
                      {unit.unit_no}
                    </option>
                  ))}
                </select>
              </label>
              {selectedUnit && (
                <label className="resident-property-label">
                  <textarea
                    value={newFeedback.comment}
                    placeholder="Feedback:"
                    onChange={handleCommentChange}
                  />
                </label>
              )}
            </div>
          )}
        {selectedUnit && <Button onClick={handleSubmit}>Submit</Button>}
      </div>

      {/* Feedback table */}
      {selectedPropertyId !== null && (
        <table className="my-feedback">
          <thead>
            <tr>
              <th>Facility Name</th>
              <th>Unit No</th>
              <th>User Name</th>
              <th>Comment</th>
              <th>Created At</th>
              <th>Reply</th>
              <th>Updated At</th>
              <th>Completed</th>
              <th>Delete comment</th>
            </tr>
          </thead>
          <tbody>
            {feedbacks &&
              feedbacks
                .filter(
                  (feedback) => feedback.property_id === selectedPropertyId
                )
                .map((feedback) => {
                  // determine whether the feedback is completed
                  const isCompleted = feedback.completed;

                  // define a class for the row based on whether the feedback is completed or not
                  const rowClass = isCompleted ? "completed-row" : "";
                  const facility = facilities.find(
                    (f) => f.id === feedback.facility_id
                  );
                  const userProperty = usersProperties.find(
                    (up) => up.id === feedback.user_property_id
                  );
                  const user = users.find((u) => u.id === feedback.user_id);

                  return (
                    <tr key={feedback.id} className={rowClass}>
                      <td>{facility ? facility.name : ""}</td>
                      <td>{userProperty ? userProperty.unit_no : ""}</td>
                      <td>
                        {user ? `${user.first_name} ${user.last_name}` : ""}
                      </td>
                      <td>{feedback.comment}</td>
                      <td>
                        {moment(feedback.createdAt)
                          .tz("Asia/Singapore")
                          .format("DD-MMM-YYYY h:mm a")}
                      </td>
                      <td>{feedback.reply}</td>
                      <td>
                        {feedback.reply &&
                          moment(feedback.updatedAt)
                            .tz("Asia/Singapore")
                            .format("DD-MMM-YYYY h:mm a")}
                      </td>
                      <td>{feedback.completed ? "Yes" : "No"}</td>
                      <td>
                        {feedback.user_id === loggedInUser.id && (
                          <Button
                            variant="danger"
                            onClick={() => {
                              handleDeleteClick(feedback.id);
                            }}
                          >
                            Delete
                          </Button>
                        )}
                      </td>
                    </tr>
                  );
                })}
          </tbody>
        </table>
      )}
    </>
  );
}
