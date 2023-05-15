import "./NewFacilities.css";

import React, { useContext, useEffect, useState } from "react";
import { PrimaryContext } from "../context/PrimaryContext";
import { storage } from "../firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import moment from "moment";

export default function NewFacilities() {
  const { properties, facilities, addFacility, updateFacility } =
    useContext(PrimaryContext);
  const [selectedPropertyId, setSelectedPropertyId] = useState("");
  const [name, setName] = useState("");
  const [maxCapacity, setMaxCapacity] = useState(0);
  const [bookingLimit, setBookingLimit] = useState(0);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [photo, setPhoto] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [selectedFacility, setSelectedFacility] = useState(null);
  const [editFacility, setEditFacility] = useState({
    start_time: null,
    end_time: null,
    max_capacity: null,
    booking_limit: null,
    closed_for_maintenance: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;
    setEditFacility((prevEditFacility) => ({
      ...prevEditFacility,
      [name]: newValue,
    }));
  };

  const handlePropertyChange = (event) => {
    setSelectedPropertyId(event.target.value);
  };

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleMaxCapacityChange = (event) => {
    setMaxCapacity(parseInt(event.target.value));
  };

  const handleBookingLimitChange = (event) => {
    setBookingLimit(parseInt(event.target.value));
  };

  const handleStartTimeChange = (event) => {
    setStartTime(event.target.value);
  };

  const handleEndTimeChange = (event) => {
    setEndTime(event.target.value);
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      name === "" ||
      maxCapacity === "" ||
      bookingLimit === "" ||
      startTime === "" ||
      endTime === "" ||
      selectedPropertyId === ""
    ) {
      alert("Please fill in all fields before submitting.");
      return;
    }

    if (photo === null) return;
    const imageRef = ref(storage, `facilities/${photo.name}`);
    try {
      await uploadBytes(imageRef, photo);
      const url = await getDownloadURL(imageRef);

      const newFacility = {
        property_id: selectedPropertyId,
        name,
        max_capacity: maxCapacity,
        booking_limit: bookingLimit,
        start_time: startTime,
        end_time: endTime,
        photoUrl: url,
      };

      console.log(JSON.stringify(newFacility));
      addFacility(newFacility);
    } catch (error) {
      console.log(error);
    }
  };

  const handleEditSubmit = async (e) => {
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

  useEffect(() => {
    console.log(facilities);
  }, [facilities]);
  return (
    <div>
      <form onSubmit={handleSubmit} style={{ margin: "auto" }}>
        <table className="form-table">
          <tbody>
            <tr>
              <td>
                <label htmlFor="property">Property</label>
              </td>
              <td>
                <select
                  id="property"
                  value={selectedPropertyId}
                  onChange={handlePropertyChange}
                >
                  <option value="">Select a property</option>
                  {properties.map((property) => (
                    <option key={property.id} value={property.id}>
                      {property.name}
                    </option>
                  ))}
                </select>
              </td>
            </tr>
            <tr>
              <td>
                <label htmlFor="name">Name</label>
              </td>
              <td>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={handleNameChange}
                />
              </td>
            </tr>
            <tr>
              <td>
                <label htmlFor="maxCapacity">Max Capacity</label>
              </td>
              <td>
                <input
                  id="maxCapacity"
                  type="number"
                  value={maxCapacity || ""}
                  onChange={handleMaxCapacityChange}
                />
              </td>
            </tr>
            <tr>
              <td>
                <label htmlFor="bookingLimit">Booking Limit</label>
              </td>
              <td>
                <input
                  id="bookingLimit"
                  type="number"
                  value={bookingLimit || ""}
                  onChange={handleBookingLimitChange}
                />
              </td>
            </tr>
            <tr>
              <td>
                <label htmlFor="startTime">Start Time</label>
              </td>
              <td>
                <input
                  id="startTime"
                  type="time"
                  value={startTime}
                  onChange={handleStartTimeChange}
                />
              </td>
            </tr>
            <tr>
              <td>
                <label htmlFor="endTime">End Time</label>
              </td>
              <td>
                <input
                  id="endTime"
                  type="time"
                  value={endTime}
                  onChange={handleEndTimeChange}
                />
              </td>
            </tr>
            <tr>
              <td>
                <label htmlFor="photo">Photo</label>
              </td>
              <td>
                <input
                  id="photo"
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                />
              </td>
            </tr>
            <tr>
              <td></td>
              <td>
                <button type="submit">Submit</button>
              </td>
            </tr>
          </tbody>
        </table>
      </form>

      {previewUrl && (
        <img src={previewUrl} alt="Preview" style={{ maxWidth: "400px" }} />
      )}

      <div className="card-container">
        {selectedPropertyId && (
          <>
            {facilities
              .filter(
                (facility) =>
                  facility.property_id === parseInt(selectedPropertyId)
              )
              .map((facility) => (
                <div
                  key={facility.id}
                  className="card"
                  onClick={() => {
                    setSelectedFacility(facility);
                  }}
                >
                  <img src={facility.photoUrl} alt={facility.name} />
                  <div className="card-body">
                    <h5 className="card-title">{facility.name}</h5>
                    <p className="card-text">
                      Booking limit: {facility.booking_limit}
                    </p>
                    <p className="card-text">
                      Max capacity: {facility.max_capacity}
                    </p>
                    <p className="card-text">
                      Opening hours: <br />
                      {moment(facility.start_time, "HH:mm:ss").format(
                        "h:mm a"
                      )}{" "}
                      <br />
                      {moment(facility.end_time, "HH:mm:ss").format("h:mm a")}
                    </p>
                    <p className="card-text">
                      Closed for maintenance:{" "}
                      {facility.closed_for_maintenance ? "Yes" : "No"}
                    </p>
                  </div>
                </div>
              ))}
          </>
        )}
      </div>

      {selectedFacility && (
        <form
          className="form-container"
          style={{ width: "50%", margin: "auto" }}
          onSubmit={handleEditSubmit}
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
          <button
            className="form-button"
            onClick={() => {
              console.log(editFacility);
            }}
          >
            Save
          </button>
        </form>
      )}
    </div>
  );
}
