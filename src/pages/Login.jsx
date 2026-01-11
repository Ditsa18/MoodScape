import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import FloatingBubbles from "../components/FloatingBubbles";
import MusicPlayer from "../components/MusicPlayer";
import logo from "/logo.png";

import { EnvelopeIcon, KeyIcon, MoonIcon } from "@heroicons/react/24/solid";

import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

export default function Login() {
  const [darkMode, setDarkMode] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  // ✅ PASSWORD LOGIN ONLY
  const handleLogin = async () => {
    try {
      if (!email || !password) {
        alert("Fill all fields!");
        return;
      }

      await signInWithEmailAndPassword(auth, email, password);

      alert("🎉 Login successful!");
      navigate("/home");
    } catch (err) {
      if (err.code === "auth/user-not-found") {
        alert("User does not exist. Sign up first.");
      } else if (err.code === "auth/wrong-password") {
        alert("Incorrect password");
      } else {
        alert(err.message);
      }
    }
  };

  return (
    <div
      className={`relative min-h-screen flex items-center justify-center overflow-hidden transition duration-[2000ms]
      ${darkMode ? "bg-[#1b1428]" : "bg-gradient-to-br from-purple-50 to-purple-200"}`}
    >
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

      <div className="relative z-10 w-full max-w-md bg-white/70 backdrop-blur-xl rounded-2xl p-10 shadow-lg border border-white/50">
        <h2
          className={`text-3xl font-semibold text-center mb-3 ${
            darkMode ? "text-gray-100" : "text-gray-800"
          }`}
        >
          Login
        </h2>

        <p
          className={`text-sm italic text-center mb-6 ${
            darkMode ? "text-gray-300" : "text-gray-500"
          }`}
        >
          Welcome back — enter your credentials
        </p>

        {/* Email */}
        <div className="mb-4 flex items-center border rounded-xl bg-white px-3 shadow-sm">
          <EnvelopeIcon className="w-5 h-5 text-gray-500" />
          <input
            type="email"
            placeholder="Email"
            className="w-full px-3 py-3 focus:outline-none bg-transparent"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* Password */}
        <div className="mb-6 flex items-center border rounded-xl bg-white px-3 shadow-sm">
          <KeyIcon className="w-5 h-5 text-gray-500" />
          <input
            type="password"
            placeholder="Password"
            className="w-full px-3 py-3 focus:outline-none bg-transparent"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button
          onClick={handleLogin}
          className="w-full py-3 bg-purple-600 text-white font-semibold rounded-xl shadow-lg hover:bg-purple-700 transition"
        >
          Login
        </button>

        <p className="mt-6 text-center text-sm">
          <Link to="/forgot" className="text-purple-600 font-semibold hover:underline">
            Forgot password?
          </Link>
        </p>

        <p className="mt-3 text-center text-sm">
          No account?{" "}
          <Link to="/signup" className="text-purple-600 font-semibold hover:underline">
            Sign up
          </Link>
        </p>
      </div>

      <MusicPlayer />
    </div>
  );
}
