import React, { useContext, useEffect, useMemo, useState } from "react";
// import "./Bookings.css";

import { PrimaryContext } from "../context/PrimaryContext";

export default function Bookings() {
  const [localBookings, setLocalBookings] = useState([]);
  const [filteredData, setFilteredData] = useState(localBookings);
  const {
    users,
    properties,
    usersProperties,
    facilities,
    bookings,
    loggedInUser,
    deleteBooking,
  } = useContext(PrimaryContext);

  useEffect(() => {
    console.log(loggedInUser);
  });

  // Format booking in state
  // const formatBookingsData = (
  //   bookings,
  //   users,
  //   facilities,
  //   usersProperties,
  //   properties
  // ) => {
  //   return bookings.map((booking) => {
  //     const user = users.find((user) => user.id === booking.user_id);
  //     const facility = facilities.find(
  //       (facility) => facility.id === booking.facility_id
  //     );
  //     const userProperty = usersProperties.find(
  //       (property) => property.id === booking.user_property_id
  //     );
  //     const property = properties.find(
  //       (property) => property.id === booking.property_id
  //     );

  //     return {
  //       user: `${user.first_name} ${user.last_name}`,
  //       facility: facility.name,
  //       property: property.name,
  //       unitNo: userProperty.unit_no,
  //       startTime: new Date(booking.start_time),
  //       endTime: new Date(booking.end_time),
  //       color: property.color,
  //       booking_id: booking.id,
  //     };
  //   });
  // };

  const formatBookingsData = (
    bookings,
    users,
    facilities,
    usersProperties,
    properties,
    loggedInUser
  ) => {
    return bookings
      .filter((booking) => {
        if (loggedInUser.id !== 1) {
          return booking.user_id === loggedInUser.id;
        }
        return true;
      })
      .map((booking) => {
        const user = users.find((user) => user.id === booking.user_id);
        const facility = facilities.find(
          (facility) => facility.id === booking.facility_id
        );
        const userProperty = usersProperties.find(
          (property) => property.id === booking.user_property_id
        );
        const property = properties.find(
          (property) => property.id === booking.property_id
        );

        return {
          user: `${user.first_name} ${user.last_name}`,
          facility: facility.name,
          property: property.name,
          unitNo: userProperty.unit_no,
          startTime: new Date(booking.start_time),
          endTime: new Date(booking.end_time),
          color: property.color,
          booking_id: booking.id,
        };
      });
  };

  useEffect(() => {
    if (
      users.length > 0 &&
      properties.length > 0 &&
      usersProperties.length > 0 &&
      facilities.length > 0 &&
      bookings.length > 0
    ) {
      const formattedBookings = formatBookingsData(
        bookings,
        users,
        facilities,
        usersProperties,
        properties,
        loggedInUser
      );
      setLocalBookings(formattedBookings);
    }
  }, [users, properties, usersProperties, facilities, bookings]);

  useEffect(() => {
    setFilteredData(localBookings);
  }, [localBookings]);

  useEffect(() => {
    console.log(filteredData);
  });

  const handleFilterChange = (e) => {
    const value = e.target.value.toLowerCase();
    const filteredRows = localBookings.filter((row) =>
      Object.values(row).some(
        (cellValue) =>
          cellValue !== null &&
          cellValue.toString().toLowerCase().includes(value)
      )
    );
    setFilteredData(filteredRows);
  };

  const handleDelete = (row) => {
    const shouldDelete = window.confirm(
      "Are you sure you want to delete this booking?"
    );
    if (shouldDelete) {
      deleteBooking(row.booking_id);
    }
  };

  return (
    <div>
      <div>
        <table className="my-table">
          <thead>
            <tr>
              <th>Property</th>
              <th>Facility</th>
              <th>Unit Number</th>
              <th>User</th>
              <th>Start Time</th>
              <th>End Time</th>
              <th rowSpan="2">Delete</th>
            </tr>
            <tr>
              <td>
                <input
                  type="text"
                  onChange={handleFilterChange}
                  name="property"
                />
              </td>
              <td>
                <input
                  type="text"
                  onChange={handleFilterChange}
                  name="facility"
                />
              </td>
              <td>
                <input
                  type="text"
                  onChange={handleFilterChange}
                  name="unitNo"
                />
              </td>
              <td>
                <input type="text" onChange={handleFilterChange} name="user" />
              </td>
              <td>
                <input
                  type="text"
                  onChange={handleFilterChange}
                  name="startTime"
                />
              </td>
              <td>
                <input
                  type="text"
                  onChange={handleFilterChange}
                  name="endTime"
                />
              </td>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((booking, index) => (
              <tr key={index} style={{ backgroundColor: booking.color }}>
                <td>{booking.property}</td>
                <td>{booking.facility}</td>
                <td>{booking.unitNo}</td>
                <td>{booking.user}</td>
                <td>
                  {`${booking.startTime.toLocaleString("en-SG", {
                    month: "numeric",
                    day: "numeric",
                    year: "numeric",
                    hour: "numeric",
                    minute: "numeric",
                    hour12: true,
                  })}`}
                </td>
                <td>
                  {`${booking.endTime.toLocaleString("en-SG", {
                    month: "numeric",
                    day: "numeric",
                    year: "numeric",
                    hour: "numeric",
                    minute: "numeric",
                    hour12: true,
                  })}`}
                </td>

                <td>
                  <button onClick={() => handleDelete(booking)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
