import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "../constant";
import { useAuth0 } from "@auth0/auth0-react";

export const PrimaryContext = createContext();

export const PrimaryContextProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [properties, setProperties] = useState([]);
  const [usersProperties, setUsersProperties] = useState([]);
  const [facilities, setFacilities] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [linkRequests, setLinkRequests] = useState([]);

  // useEffect(() => {
  //   console.log(linkRequests);
  // }, [linkRequests]);

  // Auth0 Login and linking to backend
  const { getAccessTokenSilently, isAuthenticated, user } = useAuth0();
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [loggedInUsersProperties, setLoggedInUsersProperties] = useState(null);

  const addLinkRequest = async (data) => {
    try {
      const response = await axios.post(`${BACKEND_URL}/link_properties/`, {
        property_id: data.property_id,
        user_id: data.user_id,
        unit_no: data.unit_no,
      });
      setLinkRequests(response.data);
    } catch (error) {
      console.log(error);
    }
  };
  const updateLinkRequest = async (id, reqStatus) => {
    try {
      const response = await axios.put(`${BACKEND_URL}/link_properties/${id}`, {
        request_status: reqStatus,
      });
      setLinkRequests(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteLinkRequest = async (id) => {
    try {
      const response = await axios.delete(
        `${BACKEND_URL}/link_properties/${id}`
      );
      setLinkRequests(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const addFeedback = async (newFeedback) => {
    try {
      const response = await axios.post(`${BACKEND_URL}/feedbacks/`, {
        facility_id: newFeedback.facility_id,
        user_property_id: newFeedback.user_property_id,
        user_id: loggedInUser.id,
        property_id: newFeedback.property_id,
        comment: newFeedback.comment,
      });
      setFeedbacks(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  const replyFeedback = async (feedbackId, reply, completed) => {
    try {
      const response = await axios.put(
        `${BACKEND_URL}/feedbacks/${feedbackId}`,
        {
          reply,
          completed,
        }
      );
      setFeedbacks(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  const deleteFeedback = async (feedbackId) => {
    try {
      const response = await axios.delete(
        `${BACKEND_URL}/feedbacks/${feedbackId}`
      );
      setFeedbacks(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  const addFacility = async (newFacility) => {
    try {
      const response = await axios.post(`${BACKEND_URL}/facilities`, {
        property_id: newFacility.property_id,
        start_time: newFacility.start_time,
        end_time: newFacility.end_time,
        max_capacity: newFacility.max_capacity,
        booking_limit: newFacility.booking_limit,
        photoUrl: newFacility.photoUrl,
        name: newFacility.name,
      });
      setFacilities(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const updateFacility = async (facilityId, newFacilityRules) => {
    try {
      const response = await axios.put(
        `${BACKEND_URL}/facilities/${facilityId}`,
        {
          start_time: newFacilityRules.start_time,
          end_time: newFacilityRules.end_time,
          max_capacity: newFacilityRules.max_capacity,
          booking_limit: newFacilityRules.booking_limit,
          closed_for_maintenance: newFacilityRules.closed_for_maintenance,
        }
      );
      setFacilities(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  const addBookings = async (newBooking) => {
    try {
      const response = await axios.post(`${BACKEND_URL}/bookings/`, {
        start_time: newBooking.start_time,
        end_time: newBooking.end_time,
        user_id: newBooking.user_id,
        user_property_id: newBooking.user_property_id,
        property_id: newBooking.property_id,
        facility_id: parseInt(newBooking.facility_id),
      });

      const bookingsResponse = response;
      // console.log("bookingsResponse updated", bookingsResponse);
      const filteredBookings = bookingsResponse.data.filter((booking) =>
        loggedInUsersProperties.some(
          (property) => property.property_id === booking.property_id
        )
      );

      setBookings(filteredBookings);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteBooking = async (bookingId) => {
    try {
      const response = await axios.delete(
        `${BACKEND_URL}/bookings/${bookingId}`
      );
      const bookingsResponse = response;
      // console.log("bookingsResponse updated", bookingsResponse);
      const filteredBookings = loggedInUsersProperties
        ? bookingsResponse.data.filter((booking) =>
            loggedInUsersProperties.some(
              (property) => property.property_id === booking.property_id
            )
          )
        : bookingsResponse.data;
      setBookings(filteredBookings);

      setBookings(response.data);
    } catch (error) {
      console.log(error);
      // handle error
    }
  };

  const addUser = async (newUser) => {
    try {
      const response = await axios.post(`${BACKEND_URL}/users/add`, newUser);
      setUsers(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const deleteUser = async (id) => {
    try {
      const response = await axios.delete(`${BACKEND_URL}/users/${id}`);
      setUsers(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const updateUserData = async (id, phone) => {
    try {
      const response = await axios.put(`${BACKEND_URL}/users/`, {
        id: id,
        phone: parseInt(phone),
      });
      console.log("updated phone", response.data);
      setLoggedInUser(response.data);
    } catch (error) {
      console.log(error.response.data);
    }
  };

  const editManagementUserData = async (id, updatedUser) => {
    try {
      const response = await axios.put(`${BACKEND_URL}/users/${id}`, {
        first_name: updatedUser.first_name,
        last_name: updatedUser.last_name,
        phone: parseInt(updatedUser.phone) || "",
      });
      // console.log("updated user", response.data);
      setUsers(response.data);
    } catch (error) {
      console.log(error.response.data);
    }
  };

  const addNewUserProperty = async (formData) => {
    try {
      const response = await axios.post(`${BACKEND_URL}/users_properties/add`, {
        property_id: formData.propertyId,
        user_id: formData.userId,
        unit_no: formData.unitNo,
        is_management: formData.isManagement,
      });
      // console.log(response.data); // this logs the updated list of allUserProperties
      setUsersProperties(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  const deleteUserProperty = async (id) => {
    try {
      const response = await axios.delete(
        `${BACKEND_URL}/users_properties/${id}`
      );
      // console.log(response.data); // this logs the updated list of allUserProperties
      setUsersProperties(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  const addProperties = async (data) => {
    const response = await axios.post(`${BACKEND_URL}/properties`, data);
    setProperties(response.data);
  };

  const updateProperties = async (id, data) => {
    const response = await axios.put(`${BACKEND_URL}/properties/${id}`, data);
    setProperties(response.data);
  };

  // Retrieved logged in user details
  useEffect(() => {
    const fetchData = async () => {
      if (isAuthenticated) {
        const token = await getAccessTokenSilently();

        // Fetch user data
        const userResponse = await axios.post(
          `${BACKEND_URL}/users/`,
          {
            email: user.email,
            first_name: user.name,
            last_name: user.name,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const loggedInUser = userResponse.data;
        // console.log("context level", loggedInUser);
        setLoggedInUser(loggedInUser);

        // Fetch user properties
        const userPropertiesResponse = await axios.post(
          `${BACKEND_URL}/users_properties`,
          { userId: loggedInUser.id },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const loggedInUsersProperties = userPropertiesResponse.data;
        setLoggedInUsersProperties(loggedInUsersProperties);

        // Fetch bookings and filter by user properties
        const bookingsResponse = await axios.get(`${BACKEND_URL}/bookings`);
        // console.log("bookingsResponse", bookingsResponse);
        const filteredBookings = loggedInUsersProperties
          ? bookingsResponse.data.filter((booking) =>
              loggedInUsersProperties.some(
                (property) => property.property_id === booking.property_id
              )
            )
          : bookingsResponse.data;
        setBookings(filteredBookings);
      } else {
        setLoggedInUser(null);
        setLoggedInUsersProperties(null);
        setBookings([]);
      }
    };
    fetchData();
    // eslint-disable-next-line
  }, [getAccessTokenSilently, isAuthenticated]);

  // Gett all and load first
  useEffect(() => {
    const fetchUsers = async () => {
      const response = await axios.get(`${BACKEND_URL}/users`);
      setUsers(response.data);
    };

    const fetchProperties = async () => {
      const response = await axios.get(`${BACKEND_URL}/properties`);
      setProperties(response.data);
    };

    const fetchUsersProperties = async () => {
      const response = await axios.get(`${BACKEND_URL}/users_properties`);
      setUsersProperties(response.data);
    };

    const fetchLinkRequests = async () => {
      const response = await axios.get(`${BACKEND_URL}/link_properties`);
      setLinkRequests(response.data);
    };

    const fetchFacilities = async () => {
      const response = await axios.get(`${BACKEND_URL}/facilities`);
      setFacilities(response.data);
    };

    const fetchFeedbacks = async () => {
      const response = await axios.get(`${BACKEND_URL}/feedbacks`);
      setFeedbacks(response.data);
    };

    fetchUsers();
    fetchProperties();
    fetchUsersProperties();
    fetchFacilities();
    fetchFeedbacks();
    fetchLinkRequests();
  }, []);

  const contextValues = {
    users,
    properties,
    usersProperties,
    facilities,
    feedbacks,
    bookings,
    loggedInUser,
    loggedInUsersProperties,
    linkRequests,
    addBookings,
    deleteBooking,
    addUser,
    editManagementUserData,
    updateUserData,
    addFeedback,
    replyFeedback,
    updateFacility,
    addNewUserProperty,
    addProperties,
    addFacility,
    updateProperties,
    updateLinkRequest,
    deleteLinkRequest,
    addLinkRequest,
    deleteFeedback,
    deleteUserProperty,
    deleteUser,
  };

  return (
    <PrimaryContext.Provider value={contextValues}>
      {children}
    </PrimaryContext.Provider>
  );
};

export const PrimContext = () => {
  return useContext(PrimaryContext);
};
