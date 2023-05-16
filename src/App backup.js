import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Bookings from "./components/Bookings";
import CalendarComponent from "./components/CalendarComponent";
import Home from "./components/Home";
import NavbarComp from "./components/NavbarComp";
import { PrimaryContextProvider } from "./context/PrimaryContext";

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
            <Route path="/management" element={<Management />} />
            {/* within management, nest route to render additional components within Management
            Management needs outlet  */}
          </Routes>
        </div>
      </BrowserRouter>
    </PrimaryContextProvider>
  );
}

export default App;
