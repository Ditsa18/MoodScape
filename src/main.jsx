import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import Landing from "./pages/Landing.jsx";
import Signup from "./pages/Signup.jsx";
import Login from "./pages/Login.jsx";
import Forgot from "./pages/Forgot.jsx";
import VerifyReset from "./pages/VerifyReset";
import ResetPassword from "./pages/ResetPassword";
import OtpVerifySignup from "./pages/OtpVerifySignup.jsx";
import OtpVerifyLogin from "./pages/OtpVerifyLogin.jsx";
import Home from "./pages/Home.jsx"
import MoodSelect from "./pages/MoodSelect.jsx";
import Journal from "./pages/Journal.jsx";
import History from "./pages/History.jsx";
import Stats from "./pages/Stats.jsx";
import Discover from "./pages/Discover.jsx";
import Favorites from "./pages/Favorites.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot" element={<Forgot />} />
        <Route path="/verify-reset" element={<VerifyReset />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/verify-signup" element={<OtpVerifySignup />} />
        <Route path="/verify-login" element={<OtpVerifyLogin />} />
        <Route path="/home" element={<Home />} />
        <Route path="/mood-select" element={<MoodSelect />} />
        <Route path="/journal" element={<Journal />} />
        <Route path="/history" element={<History />} />
        <Route path="/stats" element={<Stats />} />
        <Route path="/discover" element={<Discover />} />
        <Route path="/favorites" element={<Favorites />} />

      </Routes>
    </BrowserRouter>
  </StrictMode>
);
