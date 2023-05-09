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
  const [bookings, setBookings] = useState([]);

  // Auth0 Login and linking to backend
  const { getAccessTokenSilently, isAuthenticated, user } = useAuth0();
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [loggedInUsersProperties, setLoggedInUsersProperties] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (isAuthenticated) {
        const token = await getAccessTokenSilently();
        const response = await axios.post(
          `${BACKEND_URL}/users/`,
          { email: user.email },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setLoggedInUser(response.data);
      }
    };
    fetchData();
  }, [getAccessTokenSilently, isAuthenticated]);

  useEffect(() => {
    const fetchUsersProperties = async () => {
      if (loggedInUser) {
        const token = await getAccessTokenSilently();
        const response = await axios.post(
          `${BACKEND_URL}/users_properties`,
          { userId: loggedInUser.id },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setLoggedInUsersProperties(response.data);
      }
    };

    fetchUsersProperties();
  }, [loggedInUser, getAccessTokenSilently]);

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

    const fetchFacilities = async () => {
      const response = await axios.get(`${BACKEND_URL}/facilities`);
      setFacilities(response.data);
    };

    const fetchBookings = async () => {
      const response = await axios.get(`${BACKEND_URL}/bookings`);
      setBookings(response.data);
    };

    fetchUsers();
    fetchProperties();
    fetchUsersProperties();
    fetchFacilities();
    fetchBookings();
  }, []);

  const contextValues = {
    users,
    properties,
    usersProperties,
    facilities,
    bookings,
    loggedInUser,
    loggedInUsersProperties,
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
