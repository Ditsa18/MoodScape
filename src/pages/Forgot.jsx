import { useState } from "react";
import { Link } from "react-router-dom";
import FloatingBubbles from "../components/FloatingBubbles";
import MusicPlayer from "../components/MusicPlayer";
import logo from "/logo.png";
import { EnvelopeIcon, MoonIcon } from "@heroicons/react/24/solid";

import { auth } from "../firebase";
import { sendPasswordResetEmail } from "firebase/auth";

export default function Forgot() {
  const [darkMode, setDarkMode] = useState(false);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    try {
      if (!email) {
        alert("Please enter your email");
        return;
      }

      setLoading(true);

      await sendPasswordResetEmail(auth, email);

      alert("📩 Password reset email sent! Check your inbox.");
    } catch (err) {
      if (err.code === "auth/user-not-found") {
        alert("No account found with this email");
      } else {
        alert(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`relative min-h-screen flex items-center justify-center overflow-hidden transition duration-[2000ms]
      ${darkMode ? "bg-[#1b1428]" : "bg-gradient-to-br from-purple-50 to-purple-200"}`}
    >
      {/* BG */}
      <img
        src={logo}
        alt="bg"
        className={`absolute inset-0 w-full h-full object-contain pointer-events-none select-none
        ${darkMode ? "opacity-[0.03] blur-[3px]" : "opacity-10 blur-lg"}`}
      />

      <FloatingBubbles />

      <button
        onClick={() => setDarkMode(!darkMode)}
        className="fixed top-6 right-6 z-20 w-12 h-12 bg-white rounded-full shadow flex items-center justify-center"
      >
        <MoonIcon className="w-6 h-6 text-gray-700" />
      </button>

      <div className="relative z-10 w-full max-w-md bg-white/70 backdrop-blur-xl rounded-2xl p-10 shadow-lg shadow-[0_0_35px_rgba(168,85,247,0.35)] border border-white/50">
        <h2 className={`text-3xl font-semibold text-center mb-3 ${darkMode ? "text-gray-100" : "text-gray-800"}`}>
          Reset Password
        </h2>

        <p className={`text-sm italic text-center mb-6 ${darkMode ? "text-gray-300" : "text-gray-500"}`}>
          Enter your email — we will send a reset link
        </p>

        <div className="mb-6 flex items-center border rounded-xl bg-white px-3 shadow-sm">
          <EnvelopeIcon className="w-5 h-5 text-gray-500" />
          <input
            type="email"
            placeholder="Email"
            className="w-full px-3 py-3 bg-transparent focus:outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <button
          onClick={handleReset}
          disabled={loading}
          className={`w-full py-3 rounded-xl shadow-lg transition 
          ${loading ? "bg-gray-400" : "bg-purple-600 hover:bg-purple-700 text-white font-semibold"}`}
        >
          {loading ? "Sending..." : "Send Reset Email"}
        </button>

        <p className="mt-6 text-center text-sm">
          <Link to="/login" className="text-purple-600 font-semibold hover:underline">
            Back to Login
          </Link>
        </p>
      </div>

      <MusicPlayer />
    </div>
  );
}
