import { useState } from "react";
import { useNavigate } from "react-router-dom";
import FloatingBubbles from "../components/FloatingBubbles";
import MusicPlayer from "../components/MusicPlayer";
import logo from "/logo.png";
import { KeyIcon, MoonIcon } from "@heroicons/react/24/solid";

import { auth } from "../firebase";
import { updatePassword } from "firebase/auth";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const navigate = useNavigate();

  const handleReset = async () => {
    try {
      if (!password || password.length < 6) {
        alert("Password must be at least 6 characters");
        return;
      }

      if (!auth.currentUser) {
        alert("Session expired. Login again.");
        navigate("/login");
        return;
      }

      await updatePassword(auth.currentUser, password);

      alert("🎉 Password updated successfully!");
      navigate("/login");
    } catch (err) {
      alert(err.message);
    }
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
          Set New Password ✧
        </h2>

        <div className="flex items-center border rounded-xl bg-white px-3 shadow-sm">
          <KeyIcon className="w-5 h-5 text-gray-500" />
          <input
            type="password"
            placeholder="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-3 bg-transparent focus:outline-none"
          />
        </div>

        <button
          onClick={handleReset}
          className="mt-6 w-full py-3 bg-purple-600 text-white font-semibold rounded-xl shadow hover:bg-purple-700">
          Update Password
        </button>
      </div>

      <MusicPlayer />
    </div>
  );
}
