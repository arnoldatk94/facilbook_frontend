import "./NewBooking.css";
import React, { useContext, useEffect, useState } from "react";
import { PrimaryContext } from "../context/PrimaryContext";
import moment from "moment";
import { Button } from "react-bootstrap";

export default function NewBooking() {
  const [newBooking, setNewBooking] = useState({
    property_id: "",
    facility_id: "",
    user_id: "",
    user_property_id: "",
    start_time: "",
    end_time: "",
  });
  const {
    properties,
    facilities,
    bookings,
    loggedInUser,
    loggedInUsersProperties,
    addBookings,
  } = useContext(PrimaryContext);
  const [showPopup, setShowPopup] = useState(false);

  // To use form
  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setNewBooking({ ...newBooking, [name]: value });
  };

  const formatTime = (timeString) => {
    const date = new Date(`1970-01-01T${timeString}`);
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };
  // Submit form
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!newBooking.property_id || !newBooking.facility_id) {
      alert("Please select a property and facility.");
      return;
    }

    const existingBooking = bookings.find(
      (booking) =>
        booking.user_id === loggedInUser.id &&
        booking.facility_id === parseInt(newBooking.facility_id) &&
        new Date(booking.start_time).toLocaleDateString() ===
          new Date(newBooking.start_time).toLocaleDateString()
    );
    if (existingBooking) {
      window.alert(
        "You have already made a booking on this day for this facility. Please cancel the prior booking before making a new one."
      );
      return;
    }

    if (!newBooking.start_time || !newBooking.end_time) {
      alert("Please select a start time and end time.");
      return;
    }
    const selectedFacility = facilities.find(
      (facility) => facility.id === parseInt(newBooking.facility_id)
    );

    const startHour = moment(newBooking.start_time).hour();
    const endHour = moment(newBooking.end_time).hour();
    const facilityStartTime = moment(
      selectedFacility.start_time,
      "HH:mm:ss"
    ).hour();
    const facilityEndTime = moment(
      selectedFacility.end_time,
      "HH:mm:ss"
    ).hour();

    const startMinute = moment(newBooking.start_time).minute();
    const endMinute = moment(newBooking.end_time).minute();

    if (
      startHour < facilityStartTime ||
      startHour >= facilityEndTime ||
      endHour >= facilityEndTime
    ) {
      // Display an error message to the user
      alert(
        `Facility can only be booked between ${formatTime(
          selectedFacility.start_time
        )} and ${formatTime(selectedFacility.end_time)}.`
      );
    } else if (
      endMinute - startMinute + (endHour - startHour) * 60 >
      selectedFacility.booking_limit * 60
    ) {
      alert(
        `Facility can only be booked up to ${selectedFacility.booking_limit} hours per booking.`
      );
    } else if (endHour === startHour && endMinute <= startMinute) {
      alert(
        `Please ensure your booking start time doesn't start later than your end time.`
      );
    }

    // break code here
    else {
      const overlappingBooking = bookings.find((booking) => {
        const existingStartTime = moment(booking.start_time);
        const existingEndTime = moment(booking.end_time);
        const newStartTime = moment(newBooking.start_time);
        const newEndTime = moment(newBooking.end_time);

        return (
          booking.facilityId === selectedFacility.id &&
          (newStartTime.isBetween(existingStartTime, existingEndTime) ||
            newEndTime.isBetween(existingStartTime, existingEndTime) ||
            existingStartTime.isBetween(newStartTime, newEndTime) ||
            existingEndTime.isBetween(newStartTime, newEndTime))
        );
      });

      if (overlappingBooking) {
        alert("Booking overlaps with an existing booking");
      } else {
        // Proceed with booking
        addBookings(newBooking);
      }
    }
  };

  useEffect(() => {
    const addUserToBooking = () => {
      if (loggedInUser !== null) {
        setNewBooking((prevBooking) => {
          return { ...prevBooking, user_id: loggedInUser.id };
        });
      }
    };
    if (loggedInUser !== null) {
      addUserToBooking();
    }
  }, [loggedInUser]);

  // Function to handle property selection
  const handlePropertySelection = (event) => {
    const propertyIndex = event.target.value;
    setNewBooking((prevState) => ({
      ...prevState,
      facility_id: "",
      property_id: loggedInUsersProperties[propertyIndex]?.property_id || "",
      user_property_id: loggedInUsersProperties[propertyIndex]?.id || "",
    }));
  };

  // Function to render dropdown menu
  const renderPropertyDropdown = () => {
    return (
      <select onChange={handlePropertySelection}>
        <option value={null}>Select Property and Unit</option>
        {loggedInUsersProperties &&
          loggedInUsersProperties.map((property, index) => (
            <option key={index} value={index}>
              {properties.find((p) => p.id === property.property_id).name},{" "}
              {property.unit_no}
            </option>
          ))}
      </select>
    );
  };

  const handleFacilitySelection = (event) => {
    const facilityId = event.target.value;
    setNewBooking((prevState) => ({
      ...prevState,
      facility_id: facilityId,
    }));
    setShowPopup(true);
  };

  const renderFacilityDropdown = () => {
    if (!newBooking.user_property_id) {
      // If user hasn't selected a property yet, don't show the dropdown
      return null;
    }
    const propertyFacilities = facilities.filter(
      (facility) => facility.property_id === newBooking.property_id
    );
    const selectedFacility = propertyFacilities.find(
      (facility) => facility.id === parseInt(newBooking.facility_id)
    );
    return (
      <div>
        <select
          onChange={handleFacilitySelection}
          name="facility_id"
          value={newBooking.facility_id}
        >
          <option value="">Select a Facility</option>
          {propertyFacilities.map((facility) => (
            <option
              key={facility.id}
              value={parseInt(facility.id)}
              disabled={facility.closed_for_maintenance}
            >
              {facility.name}
              {facility.closed_for_maintenance
                ? "(Closed for maintenance)"
                : ""}
            </option>
          ))}
        </select>
        {showPopup && selectedFacility && (
          <div className="booking-details">
            <p>Start Time: {formatTime(selectedFacility.start_time)}</p>
            <p>End Time: {formatTime(selectedFacility.end_time)}</p>
            <p>Booking Limit: {selectedFacility.booking_limit}</p>
            <p>Max Capacity: {selectedFacility.max_capacity}</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div>
      {loggedInUser && (
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="property">Property and Unit</label>
            <div>
              {renderPropertyDropdown()}
              {renderFacilityDropdown()}
            </div>
          </div>
          <div>
            <label htmlFor="start_time">Start Time</label>
            <input
              type="datetime-local"
              id="start_time"
              name="start_time"
              value={newBooking.start_time}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label htmlFor="end_time">End Time</label>
            <input
              type="datetime-local"
              id="end_time"
              name="end_time"
              value={newBooking.end_time}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <Button variant="success" type="submit">
              Submit
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
