import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Bookings from "./components/Bookings";
import CalendarComponent from "./components/CalendarComponent";
import Home from "./components/Home";
import NavbarComp from "./components/NavbarComp";
import { PrimaryContextProvider } from "./context/PrimaryContext";

import Management from "./components/Management";
import ResidentProperty from "./components/ResidentProperty";
import Feedback from "./components/Feedback";
import User from "./components/User";
import UserManagement from "./components/UserManagement";
import NewProperties from "./components/NewProperties";
import NewFacilities from "./components/NewFacilities";

function App() {
  return (
    <PrimaryContextProvider>
      <BrowserRouter>
        <div className="App">
          <h1>Circle CI Test</h1>
          <NavbarComp />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/properties" element={<ResidentProperty />} />
            <Route path="/calendar" element={<CalendarComponent />} />
            <Route path="/bookings" element={<Bookings />} />
            <Route path="/management" element={<Management />}>
              <Route path="feedback" element={<Feedback />} />
              <Route path="users" element={<User />} />
              <Route path="user-properties" element={<UserManagement />} />
              <Route path="new-properties" element={<NewProperties />} />
              <Route path="new-facilities" element={<NewFacilities />} />
            </Route>
          </Routes>
        </div>
      </BrowserRouter>
    </PrimaryContextProvider>
  );
}

export default App;
