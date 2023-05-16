import "./CalendarComponent.css";

import React, { useContext, useEffect, useState } from "react";
import { PrimaryContext } from "../context/PrimaryContext";
import moment from "moment-timezone";
import "moment/locale/en-sg";
import { Calendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import NewBooking from "./NewBooking";

const localizer = momentLocalizer(moment);

export default function CalendarComponent() {
  const {
    users,
    properties,
    usersProperties,
    facilities,
    bookings,
    loggedInUser,
    loggedInUsersProperties,
  } = useContext(PrimaryContext);
  const [localBookings, setLocalBookings] = useState([]);
  // States to select events
  const [selectedProperty, setSelectedProperty] = useState("");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedDay, setSelectedDay] = useState(new Date());

  // Click on event, then click on day to navigate to specific date
  function handleNavigate(date) {
    setSelectedDay(date);
  }

  // Click event, then click day
  const handleSelectEvent = (event) => {
    setSelectedDay(event.startTime);
    setSelectedEvent(event);
    console.log(event);
  };

  // Format booking in state
  const formatBookingsData = (
    bookings,
    users,
    facilities,
    usersProperties,
    properties
  ) => {
    if (!bookings || !bookings.length) {
      return [];
    }
    return bookings.map((booking) => {
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

  // Check length then load on start
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
        properties
      );
      setLocalBookings(formattedBookings);
    }
  }, [users, properties, usersProperties, facilities, bookings]);

  useEffect(() => {
    const formattedBookings = formatBookingsData(
      bookings,
      users,
      facilities,
      usersProperties,
      properties
    );
    setLocalBookings(formattedBookings);
  }, [bookings, users, facilities, usersProperties, properties]);

  // Filter by property
  const handlePropertyChange = (event) => {
    setSelectedProperty(event.target.value);
  };

  const filteredBookings =
    selectedProperty === ""
      ? localBookings
      : localBookings.filter(
          (booking) => booking.property === selectedProperty
        );

  const filteredProperties = properties.filter((property) =>
    loggedInUsersProperties?.some(
      (userProperty) => userProperty.property_id === property?.id
    )
  );

  return (
    <div>
      {/* Dropdown filter */}
      <div>
        {loggedInUser ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
            }}
          >
            <label htmlFor="property-filter">Filter by property:</label>
            <select
              id="property-filter"
              name="property-filter"
              value={selectedProperty}
              onChange={handlePropertyChange}
            >
              <option value="">All</option>
              {filteredProperties.map((property) => (
                <option key={property.id} value={property.name}>
                  {property.name}
                </option>
              ))}
            </select>
          </div>
        ) : null}
      </div>

      <NewBooking />
      {/* Calendar goes here */}
      <div style={{ height: "90vh" }}>
        <Calendar
          localizer={localizer}
          events={filteredBookings}
          startAccessor={(event) => moment(event.startTime).toDate()}
          endAccessor={(event) => moment(event.endTime).toDate()}
          titleAccessor={(event) =>
            `${event.property}\n${event.facility}\n${event.unitNo}\n${event.user}`
          }
          views={["month", "week", "day"]}
          style={{ height: 500, margin: "50px" }}
          date={selectedDay}
          onNavigate={handleNavigate}
          onSelectEvent={handleSelectEvent}
          eventPropGetter={(event) => ({
            style: { backgroundColor: event.color, color: "#4a4a4a" },
          })}
        />
        {selectedEvent && (
          <div
            className="selected-event"
            style={{ backgroundColor: selectedEvent.color }}
          >
            <h2>Selected Event</h2>
            <p>{selectedEvent.property}</p>
            <p>{selectedEvent.facility}</p>
            <p>{selectedEvent.unitNo}</p>
            <p>Start: {moment(selectedEvent.startTime).format("h:mm a")}</p>
            <p>End: {moment(selectedEvent.endTime).format("h:mm a")}</p>

            <button onClick={() => setSelectedEvent(null)}>Close</button>
          </div>
        )}
      </div>
    </div>
  );
}
