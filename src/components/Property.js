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
  const [selectedFacility, setSelectedFacility] = useState(null);
  const [editFacility, setEditFacility] = useState({
    start_time: null,
    end_time: null,
    max_capacity: null,
    booking_limit: null,
    closed_for_maintenance: false,
  });

  // useEffect(() => {
  //   console.log(selectedFacility);
  // }, [selectedFacility]);

  // useEffect(() => {
  //   console.log(editFacility);
  // }, [editFacility]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;
    setEditFacility((prevEditFacility) => ({
      ...prevEditFacility,
      [name]: newValue,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateFacility(selectedFacility.id, editFacility);
      setSelectedFacility(null);
      setEditFacility({
        start_time: null,
        end_time: null,
        max_capacity: null,
        booking_limit: null,
        closed_for_maintenance: false,
      });
    } catch (err) {
      console.error(err);
    }
  };

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
  };

  // useEffect(() => {
  //   console.log(feedbacks);
  // }, [feedbacks]);

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

  const handlePropertyClick = (propertyId) => {
    setSelectedPropertyId(propertyId);
  };

  const handleFacilityClick = (facility) => {
    setSelectedFacility((prevFacility) => {
      if (prevFacility === facility) {
        return null; // set to null if already selected
      } else {
        return facility; // set to new facility
      }
    });
  };

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

  // useEffect(() => {
  //   console.log(managementFeedback);
  // }, [managementFeedback]);

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
        <div className="property-header">
          <h3>{selectedProperty.name}</h3>
        </div>
      )}

      <div className="facilities-container">
        {[...filteredFacilities].map((facility) => (
          <div
            key={facility.id}
            className="facility"
            onClick={() => {
              handleFacilityClick(facility);
            }}
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

      {selectedFacility && (
        <form
          className="form-container"
          style={{ width: "50%", margin: "auto" }}
          onSubmit={handleSubmit}
        >
          <p className="form-header">{selectedFacility.name}</p>
          <div className="form-input">
            <label className="form-label" htmlFor="start_time">
              Start Time:
            </label>
            <input
              className="form-field"
              type="time"
              id="start_time"
              name="start_time"
              value={editFacility.start_time || ""}
              onChange={handleChange}
            />
          </div>
          <div className="form-input">
            <label className="form-label" htmlFor="end_time">
              End Time:
            </label>
            <input
              className="form-field"
              type="time"
              id="end_time"
              name="end_time"
              value={editFacility.end_time || ""}
              onChange={handleChange}
            />
          </div>
          <div className="form-input">
            <label className="form-label" htmlFor="max_capacity">
              Max Capacity:
            </label>
            <input
              className="form-field"
              type="number"
              id="max_capacity"
              name="max_capacity"
              value={editFacility.max_capacity || ""}
              onChange={handleChange}
            />
          </div>
          <div className="form-input">
            <label className="form-label" htmlFor="booking_limit">
              Booking Limit:
            </label>
            <input
              className="form-field"
              type="number"
              id="booking_limit"
              name="booking_limit"
              value={editFacility.booking_limit || ""}
              onChange={handleChange}
            />
          </div>
          <div className="form-input">
            <label className="form-label" htmlFor="closed_for_maintenance">
              Closed for Maintenance:
            </label>
            <div className="form-checkbox">
              <input
                type="checkbox"
                id="closed_for_maintenance"
                name="closed_for_maintenance"
                checked={editFacility.closed_for_maintenance}
                onChange={handleChange}
              />
              <label htmlFor="closed_for_maintenance">Yes</label>
            </div>
          </div>
          <button className="form-button" type="submit">
            Save
          </button>
        </form>
      )}

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
                  const facility = facilities.find(
                    (f) => f.id === feedback.facility_id
                  );
                  const userProperty = usersProperties.find(
                    (up) => up.id === feedback.user_property_id
                  );
                  const user = users.find((u) => u.id === feedback.user_id);

                  return (
                    <tr key={feedback.id}>
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
                        {moment(feedback.updatedAt)
                          .tz("Asia/Singapore")
                          .format("DD-MMM-YYYY h:mm a")}
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
