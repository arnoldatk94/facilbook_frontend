import { useAuth0 } from "@auth0/auth0-react";
import React, { useEffect } from "react";
import { Button } from "react-bootstrap";

export default function Login() {
  const {
    user,
    isAuthenticated,
    isLoading,
    getAccessTokenSilently,
    loginWithRedirect,
    logout,
  } = useAuth0();

  // Code results in infinite loop as isAuthenticated doesn't get updated fast enough before user is redirected to login
  // useEffect(() => {
  //   if (isAuthenticated) {
  //     console.log("Line 25");
  //   } else {
  //     console.log("Line 27");
  //     loginWithRedirect();
  //   }
  // }, []);

  return (
    <div>
      <Button variant="success" onClick={() => loginWithRedirect()}>
        Log In
      </Button>
      <Button variant="danger" onClick={() => logout()}>
        Log Out
      </Button>
    </div>
  );
}
