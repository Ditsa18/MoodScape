import { useState } from "react";
import { useNavigate } from "react-router-dom";
import FloatingBubbles from "../components/FloatingBubbles";
import MusicPlayer from "../components/MusicPlayer";
import logo from "/logo.png";
import { MoonIcon } from "@heroicons/react/24/solid";

export default function OtpVerifySignup() {
  const [otp, setOtp] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const navigate = useNavigate();

  return (
    <div
      className={`relative min-h-screen flex items-center justify-center overflow-hidden transition duration-[2000ms]
      ${darkMode ? "bg-[#1b1428]" : "bg-gradient-to-br from-purple-50 to-purple-200"}
      `}
    >
      <img
        src={logo}
        className={`absolute inset-0 w-full h-full object-contain pointer-events-none select-none ${
          darkMode ? "opacity-[0.03] blur-[3px]" : "opacity-10 blur-lg"
        }`}
      />

      <FloatingBubbles />

      <button
        onClick={() => setDarkMode(!darkMode)}
        className="fixed top-6 right-6 z-20 w-12 h-12 rounded-full bg-white shadow-md flex items-center justify-center"
      >
        <MoonIcon className="w-6 h-6 text-gray-700" />
      </button>

      <div className="relative z-10 w-full max-w-md bg-white/70 backdrop-blur-xl rounded-2xl p-10 shadow-lg shadow-[0_0_35px_rgba(168,85,247,0.35)] border border-white/50">
        <h2 className={`text-3xl font-semibold text-center mb-6 ${
          darkMode ? "text-gray-100" : "text-gray-800"
        }`}>
          Verify Email ✧
        </h2>

        <input
          type="text"
          maxLength={6}
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          placeholder="Enter 6-digit OTP"
          className="w-full text-center tracking-widest text-lg p-3 rounded-xl bg-white border shadow"
        />

        <button
          onClick={() => navigate("/mood-select")}
          className="mt-6 w-full py-3 bg-purple-600 text-white font-semibold rounded-xl shadow hover:bg-purple-700"
        >
          Verify OTP
        </button>
      </div>

      <MusicPlayer />
    </div>
  );
}
