import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Bookings from "./components/Bookings";
import CalendarComponent from "./components/CalendarComponent";
import Home from "./components/Home";
import NavbarComp from "./components/NavbarComp";
import { PrimaryContextProvider } from "./context/PrimaryContext";
import Login from "./components/Login";

import Management from "./components/Management";
import ResidentProperty from "./components/ResidentProperty";

function App() {
  return (
    <PrimaryContextProvider>
      <BrowserRouter>
        <div className="App">
          <NavbarComp />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/properties" element={<ResidentProperty />} />
            <Route path="/calendar" element={<CalendarComponent />} />
            <Route path="/bookings" element={<Bookings />} />
            <Route path="/login" element={<Login />} />
            <Route path="/management" element={<Management />} />
          </Routes>
        </div>
      </BrowserRouter>
    </PrimaryContextProvider>
  );
}

export default App;
