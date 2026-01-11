import { useState } from "react";
import { useNavigate } from "react-router-dom";
import FloatingBubbles from "../components/FloatingBubbles";
import MusicPlayer from "../components/MusicPlayer";
import logo from "/logo.png";
import { MoonIcon } from "@heroicons/react/24/solid";

// 🔐 OTP helpers
import { getOTP, clearOTP, generateOTP, saveOTP } from "../utils/otp";

export default function VerifyReset() {
  const [otp, setOtp] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const navigate = useNavigate();

  const handleVerify = () => {
    const storedOTP = getOTP("resetOTP");

    if (!storedOTP) {
      alert("OTP expired. Please resend OTP.");
      return;
    }

    if (otp !== storedOTP) {
      alert("❌ Incorrect OTP");
      return;
    }

    clearOTP("resetOTP");
    alert("OTP verified ✅");
    navigate("/reset-password");
  };

  const handleResend = () => {
    const newOTP = generateOTP();
    saveOTP("resetOTP", newOTP);

    // ⚠️ DEV MODE
    alert(`Your new OTP is: ${newOTP}`);
  };

  return (
    <div className={`relative min-h-screen flex items-center justify-center overflow-hidden transition duration-[2000ms]
      ${darkMode ? "bg-[#1b1428]" : "bg-gradient-to-br from-purple-50 to-purple-200"}`}>

      <img src={logo}
        className={`absolute inset-0 w-full h-full object-contain pointer-events-none select-none
        ${darkMode ? "opacity-[0.03] blur-[3px]" : "opacity-10 blur-lg"}`} />

      <FloatingBubbles />

      <button onClick={() => setDarkMode(!darkMode)}
        className="fixed top-6 right-6 z-20 w-12 h-12 bg-white rounded-full shadow flex items-center justify-center">
        <MoonIcon className="w-6 h-6 text-gray-700" />
      </button>

      <div className="relative z-10 w-full max-w-md bg-white/70 backdrop-blur-xl rounded-2xl p-10 shadow-lg border border-white/50">
        <h2 className="text-3xl font-semibold text-center mb-6">
          Verify OTP ✧
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
          onClick={handleVerify}
          className="mt-6 w-full py-3 bg-purple-600 text-white font-semibold rounded-xl shadow hover:bg-purple-700">
          Verify OTP
        </button>

        <button
          onClick={handleResend}
          className="mt-4 w-full text-sm text-purple-600 font-semibold hover:underline">
          Resend OTP
        </button>
      </div>

      <MusicPlayer />
    </div>
  );
}
