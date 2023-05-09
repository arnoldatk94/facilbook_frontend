import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import { useAuth0 } from "@auth0/auth0-react";
import { PrimaryContext } from "../context/PrimaryContext";

export default function Home() {
  const { loggedInUser } = useContext(PrimaryContext);
  const [accessToken, setAccessToken] = useState();
  const [userInfo, setUserInfo] = useState();
  const {
    user,
    isAuthenticated,
    isLoading,
    getAccessTokenSilently,
    loginWithRedirect,
    logout,
  } = useAuth0();

  const navigate = useNavigate();

  useEffect(() => {
    if (loggedInUser !== null) {
      console.log(loggedInUser);
    } else {
      navigate("/login");
    }
  }, [loggedInUser]);

  // useEffect(() => {
  //   console.log("is Authenticated", isAuthenticated);
  //   if (!isAuthenticated) {
  //     console.log("Not Logged in");
  //     // navigate("/login");
  //   } else {
  //     console.log("is Authenticated", isAuthenticated);
  //   }
  // }, [isAuthenticated]);

  return (
    <div>
      Homepage
      <div>
        <div>{isAuthenticated}</div>
        <Button
          variant="danger"
          onClick={() =>
            logout({ logoutParams: { returnTo: window.location.origin } })
          }
        >
          Log Out
        </Button>
        <Link to="/calendar">
          <Button>Go to Calendar</Button>
        </Link>
      </div>
    </div>
  );
}
