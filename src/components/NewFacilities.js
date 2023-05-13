import "./NewFacilities.css";

import React, { useContext, useEffect, useState } from "react";
import { PrimaryContext } from "../context/PrimaryContext";
import { storage } from "../firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

export default function NewFacilities() {
  const { properties, facilities, addFacility } = useContext(PrimaryContext);
  const [selectedPropertyId, setSelectedPropertyId] = useState("");
  const [name, setName] = useState("");
  const [maxCapacity, setMaxCapacity] = useState(0);
  const [bookingLimit, setBookingLimit] = useState(0);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [photo, setPhoto] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

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

  useEffect(() => {
    console.log(facilities);
  }, [facilities]);
  return (
    <div>
      <h2>New Facility</h2>
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

      {/* <form onSubmit={handleSubmit} className="form-container">
        <div>
          <label htmlFor="property">Property</label>
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
        </div>
        <div>
          <label htmlFor="name">Name</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={handleNameChange}
          />
        </div>
        <div>
          <label htmlFor="maxCapacity">Max Capacity</label>
          <input
            id="maxCapacity"
            type="number"
            value={maxCapacity || ""}
            onChange={handleMaxCapacityChange}
          />
        </div>
        <div>
          <label htmlFor="bookingLimit">Booking Limit</label>
          <input
            id="bookingLimit"
            type="number"
            value={bookingLimit || ""}
            onChange={handleBookingLimitChange}
          />
        </div>
        <div>
          <label htmlFor="startTime">Start Time</label>
          <input
            id="startTime"
            type="time"
            value={startTime}
            onChange={handleStartTimeChange}
          />
        </div>
        <div>
          <label htmlFor="endTime">End Time</label>
          <input
            id="endTime"
            type="time"
            value={endTime}
            onChange={handleEndTimeChange}
          />
        </div>
        <div>
          <label htmlFor="photo">Photo</label>
          <input
            id="photo"
            type="file"
            accept="image/*"
            onChange={handlePhotoChange}
          />
        </div>
        <div>
          <button type="submit">Submit</button>
        </div>
      </form> */}
      {previewUrl && (
        <img src={previewUrl} alt="Preview" style={{ maxWidth: "400px" }} />
      )}
    </div>
  );
}
