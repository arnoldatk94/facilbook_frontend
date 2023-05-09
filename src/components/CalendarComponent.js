import React, { useContext, useEffect, useState } from "react";
import "./CalendarComponent.css";
import { PrimaryContext } from "../context/PrimaryContext";
import moment from "moment-timezone";
import "moment/locale/en-sg";
import { Calendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import NewBooking from "./NewBooking";

const localizer = momentLocalizer(moment);

export default function CalendarComponent() {
  const { users, properties, usersProperties, facilities, bookings } =
    useContext(PrimaryContext);
  const [localBookings, setLocalBookings] = useState([]);
  // States to select events
  const [selectedProperty, setSelectedProperty] = useState("");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedDay, setSelectedDay] = useState(new Date());
  // Hard code user_id

  // Click on event, then click on day to navigate to specific date
  function handleNavigate(date) {
    setSelectedDay(date);
  }

  // Click event, then click day
  const handleSelectEvent = (event) => {
    setSelectedDay(event.startTime);
    setSelectedEvent(event);
  };

  // Format booking in state
  const formatBookingsData = (
    bookings,
    users,
    facilities,
    usersProperties,
    properties
  ) => {
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
      };
    });
  };

  // Check length then load
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

  const handlePropertyChange = (event) => {
    setSelectedProperty(event.target.value);
  };

  const filteredBookings =
    selectedProperty === ""
      ? localBookings
      : localBookings.filter(
          (booking) => booking.property === selectedProperty
        );

  return (
    <div>
      {/* Dropdown filter */}
      {/* <div>
        <label htmlFor="property-filter">Filter by property:</label>
        <select
          id="property-filter"
          name="property-filter"
          value={selectedProperty}
          onChange={handlePropertyChange}
        >
          <option value="">All</option>
          {properties.map((property) => (
            <option key={property.id} value={property.name}>
              {property.name}
            </option>
          ))}
        </select>
      </div> */}

      {/* Calendar goes here */}
      <div style={{ height: "90vh" }}>
        <NewBooking />
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
          <div style={{ backgroundColor: selectedEvent.color }}>
            <h2>Selected Event</h2>
            <p>{selectedEvent.property}</p>
            <p>{selectedEvent.facility}</p>
            <p>{selectedEvent.unitNo}</p>
            <p>Start: {moment(selectedEvent.startTime).format("lll")}</p>
            <p>End: {moment(selectedEvent.endTime).format("lll")}</p>
            <button onClick={() => setSelectedEvent(null)}>Cancel</button>
          </div>
        )}
      </div>
    </div>
  );
}
