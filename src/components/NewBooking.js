import React, { useContext, useEffect, useState } from "react";
import { PrimaryContext } from "../context/PrimaryContext";

export default function NewBooking() {
  const [isLoggedIn, setLoggedIn] = useState(true);
  const hardcodedUser = 2;
  const [newBooking, setNewBooking] = useState({
    property_id: "",
    facility_id: "",
    user_id: hardcodedUser,
    user_property_id: "",
    start_time: "",
    end_time: "",
  });
  const {
    users,
    properties,
    usersProperties,
    facilities,
    bookings,
    loggedInUser,
    loggedInUsersProperties,
  } = useContext(PrimaryContext);

  useEffect(() => {
    if (loggedInUser && loggedInUser.id) {
      console.log("User Id", loggedInUser.id);
      console.log(loggedInUsersProperties);
    } else {
      console.log("Not logged in");
    }
  }, [loggedInUser, loggedInUsersProperties]);

  useEffect(() => {
    console.log(newBooking);
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewBooking({ ...newBooking, [name]: value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Here you can do something with the newBooking state, like sending it to an API or storing it in a database
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label htmlFor="property_id">Property:</label>
        <select
          id="property_id"
          name="property_id"
          value={newBooking.property_id}
          onChange={handleInputChange}
        >
          <option value="">Select a property</option>
          {properties.map((property) => (
            <option key={property.id} value={property.id}>
              {property.name}
            </option>
          ))}
        </select>

        {newBooking.property_id && (
          <div>
            <label htmlFor="facility_id">Facility:</label>
            <select
              id="facility_id"
              name="facility_id"
              value={newBooking.facility_id}
              onChange={handleInputChange}
            >
              <option value="">Select a facility</option>
              {facilities
                .filter(
                  (facility) => facility.property_id === newBooking.property_id
                )
                .map((facility) => (
                  <option key={facility.id} value={facility.id}>
                    {facility.name}
                  </option>
                ))}
            </select>
          </div>
        )}

        <input
          type="datetime-local"
          id="start_time"
          name="start_time"
          value={newBooking.start_time}
          onChange={handleInputChange}
        />

        <input
          type="datetime-local"
          id="end_time"
          name="end_time"
          value={newBooking.end_time}
          onChange={handleInputChange}
        />

        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
