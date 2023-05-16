import React, { useContext } from "react";
import { Button } from "react-bootstrap";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { useAuth0 } from "@auth0/auth0-react";
import { PrimaryContext } from "../context/PrimaryContext";
import "./NavbarComp.css";

export default function NavbarComp() {
  const { loginWithRedirect, logout, isAuthenticated } = useAuth0();
  const { loggedInUser } = useContext(PrimaryContext);

  return (
    <Navbar className="navbar-gradient" expand="lg">
      <Container>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Navbar.Brand href="/">FacilBook</Navbar.Brand>

            <Nav.Link href="/calendar">Calendar</Nav.Link>
            <Nav.Link href="/bookings">Bookings</Nav.Link>
            <Nav.Link href="/properties">Properties</Nav.Link>
            {loggedInUser && loggedInUser.id === 1 && (
              <Nav.Link href="/management">Management</Nav.Link>
            )}
          </Nav>
          <Nav>
            {isAuthenticated ? (
              <Button
                variant="danger"
                onClick={() =>
                  logout({ logoutParams: { returnTo: window.location.origin } })
                }
              >
                Log Out
              </Button>
            ) : (
              <Button variant="success" onClick={() => loginWithRedirect()}>
                Log In
              </Button>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
