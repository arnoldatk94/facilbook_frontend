import React, { useContext, useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import { PrimaryContext } from "../context/PrimaryContext";

import "./Property.css";
import moment from "moment";
import { Button } from "react-bootstrap";

export default function Property() {
  const {
    properties,
    facilities,
    feedbacks,
    users,
    usersProperties,
    replyFeedback,
    updateFacility,
  } = useContext(PrimaryContext);
  const [selectedPropertyId, setSelectedPropertyId] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editCommentId, setEditCommentId] = useState();
  const [managementFeedback, setManagementFeedback] = useState({
    reply: "",
    completed: false,
  });

  const updateComment = (feedback) => {
    replyFeedback(
      feedback,
      managementFeedback.reply,
      managementFeedback.completed
    );
    setManagementFeedback({ reply: "", completed: false });
    turnOffEdit();
  };

  const turnOnEdit = (id) => {
    setEditMode(true);
    setEditCommentId(id);
  };

  const turnOffEdit = () => {
    setEditMode(false);
    setEditCommentId();
    setManagementFeedback({ reply: "", completed: false });
  };

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
    infinite: properties.length > 3,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 3,
  };

  function textStyle(color) {
    return {
      fontSize: "14px",
      fontWeight: "normal",
      margin: "0",
      backgroundColor: color,
      padding: "5px",
    };
  }

  const handlePropertyClick = (propertyId) => {
    setSelectedPropertyId(propertyId);
  };

  const selectedProperty = properties.find(
    (property) => property.id === selectedPropertyId
  );

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
        {properties.map((property) => (
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
          style={{ backgroundColor: selectedProperty.color }}
        >
          <h3>{selectedProperty.name}</h3>
        </div>
      )}

      <div className="facilities-container">
        {[...filteredFacilities].map((facility) => (
          <div key={facility.id} className="facility">
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

      {selectedPropertyId !== null && (
        <table className="my-table">
          <thead>
            <tr>
              <th>Facility Name</th>
              <th>User Property Unit No</th>
              <th>User Name</th>
              <th>Comment</th>
              <th>Created At</th>
              <th>Reply</th>
              <th>Updated At</th>
              <th>Completed</th>
              <th>Edit</th>
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
                      <td>
                        {editCommentId === feedback.id ? (
                          <input
                            type="text"
                            value={managementFeedback.reply}
                            onChange={(e) =>
                              setManagementFeedback({
                                ...managementFeedback,
                                reply: e.target.value,
                              })
                            }
                          />
                        ) : (
                          feedback.reply
                        )}
                      </td>
                      <td>
                        {feedback.reply !== "" && feedback.reply !== null
                          ? moment(feedback.updatedAt)
                              .tz("Asia/Singapore")
                              .format("DD-MMM-YYYY h:mm a")
                          : null}
                      </td>

                      <td>
                        {editCommentId === feedback.id ? (
                          <div>
                            <label>
                              <input
                                type="radio"
                                name="completed"
                                value="true"
                                checked={managementFeedback.completed}
                                onChange={(e) =>
                                  setManagementFeedback({
                                    ...managementFeedback,
                                    completed: e.target.value === "true",
                                  })
                                }
                              />
                              Yes
                            </label>
                            <label>
                              <input
                                type="radio"
                                name="completed"
                                value="false"
                                checked={!managementFeedback.completed}
                                onChange={(e) =>
                                  setManagementFeedback({
                                    ...managementFeedback,
                                    completed: e.target.value === "true",
                                  })
                                }
                              />
                              No
                            </label>
                          </div>
                        ) : feedback.completed ? (
                          "Yes"
                        ) : (
                          "No"
                        )}
                      </td>

                      <td>
                        {editCommentId === feedback.id ? (
                          <>
                            <Button
                              variant="success"
                              onClick={() => {
                                updateComment(feedback.id);
                              }}
                            >
                              Save
                            </Button>
                            <Button variant="danger" onClick={turnOffEdit}>
                              Cancel
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button
                              variant="success"
                              onClick={() => {
                                turnOnEdit(feedback.id);
                              }}
                            >
                              Edit
                            </Button>
                          </>
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
