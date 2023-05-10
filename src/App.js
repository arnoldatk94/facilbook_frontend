import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Bookings from "./components/Bookings";
import CalendarComponent from "./components/CalendarComponent";
import Home from "./components/Home";
import NavbarComp from "./components/NavbarComp";
import { PrimaryContextProvider } from "./context/PrimaryContext";
import Login from "./components/Login";
import UserManagement from "./components/UserManagement";

function App() {
  return (
    <PrimaryContextProvider>
      <BrowserRouter>
        <div className="App">
          <NavbarComp />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/calendar" element={<CalendarComponent />} />
            <Route path="/bookings" element={<Bookings />} />
            <Route path="/login" element={<Login />} />
            <Route path="/usermanagement" element={<UserManagement />} />
          </Routes>
        </div>
      </BrowserRouter>
    </PrimaryContextProvider>
  );
}

export default App;
