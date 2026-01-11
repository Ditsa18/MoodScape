import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import FloatingBubbles from "../components/FloatingBubbles";
import MusicPlayer from "../components/MusicPlayer";
import logo from "/logo.png";

import {
  EnvelopeIcon,
  KeyIcon,
  UserIcon,
  MoonIcon,
} from "@heroicons/react/24/solid";

import { auth, db } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

// 🔐 OTP helpers
import { generateOTP, saveOTP } from "../utils/otp";

export default function Signup() {
  const [darkMode, setDarkMode] = useState(false);
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSignup = async () => {
    try {
      if (!nickname || !email || !password) {
        alert("Fill all fields");
        return;
      }

      setLoading(true);

      // 🔥 Create Firebase user (email + password stored securely)
      const userCred = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // 🧠 Store nickname in Firestore
      await setDoc(doc(db, "users", userCred.user.uid), {
        nickname,
        email,
        createdAt: new Date(),
      });

      // 🔐 Generate OTP on website
      const otp = generateOTP();
      saveOTP("signupOTP", otp);

      // ⚠️ DEV MODE: show OTP
      alert(`Your OTP is: ${otp}`);

      navigate("/verify-signup");
    } catch (err) {
      if (err.code === "auth/email-already-in-use") {
        alert("Email already exists — please Login");
        navigate("/login");
      } else {
        alert(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`relative min-h-screen flex items-center justify-center overflow-hidden transition-all duration-[2000ms]
      ${darkMode ? "bg-[#1b1428]" : "bg-gradient-to-br from-purple-50 to-purple-200"}`}
    >
      {/* Watermark Logo */}
      <img
        src={logo}
        alt="Moodscape Watermark"
        className={`absolute inset-0 w-full h-full object-contain pointer-events-none select-none
        transition-opacity duration-[2000ms]
        ${darkMode ? "opacity-[0.03] blur-[3px]" : "opacity-10 blur-lg"}`}
      />

      <FloatingBubbles />

      {/* Dark Mode */}
      <button
        onClick={() => setDarkMode(!darkMode)}
        className="fixed top-6 right-6 z-20 w-12 h-12 bg-white rounded-full shadow flex items-center justify-center"
      >
        <MoonIcon className="w-6 h-6 text-gray-700" />
      </button>

      {/* Signup Card */}
      <div className="relative z-10 w-full max-w-md bg-white/70 backdrop-blur-xl rounded-2xl p-10
      shadow-[0_0_35px_rgba(168,85,247,0.35)] border border-white/50">
        
        <h2 className={`text-3xl font-semibold text-center mb-3 
        ${darkMode ? "text-gray-100" : "text-gray-800"}`}>
          Create Your Account
        </h2>

        <p className={`text-sm italic text-center mb-6 
        ${darkMode ? "text-gray-300" : "text-gray-500"}`}>
          ✍ Begin your emotional journal
        </p>

        {/* Nickname */}
        <div className="mb-4 flex items-center border rounded-xl bg-white px-3 shadow-sm">
          <UserIcon className="w-5 h-5 text-gray-500" />
          <input
            type="text"
            placeholder="Nickname"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            className="w-full px-3 py-3 bg-transparent focus:outline-none"
          />
        </div>

        {/* Email */}
        <div className="mb-4 flex items-center border rounded-xl bg-white px-3 shadow-sm">
          <EnvelopeIcon className="w-5 h-5 text-gray-500" />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-3 bg-transparent focus:outline-none"
          />
        </div>

        {/* Password */}
        <div className="mb-6 flex items-center border rounded-xl bg-white px-3 shadow-sm">
          <KeyIcon className="w-5 h-5 text-gray-500" />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-3 bg-transparent focus:outline-none"
          />
        </div>

        {/* Generate OTP */}
        <button
          disabled={loading}
          onClick={handleSignup}
          className={`w-full py-3 rounded-xl shadow-lg transition 
          ${loading ? "bg-gray-400" : "bg-purple-600 hover:bg-purple-700 text-white font-semibold"}`}
        >
          {loading ? "Sending..." : "Generate OTP"}
        </button>

        <p className={`mt-6 text-sm text-center 
        ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
          Already have an account?{" "}
          <Link to="/login" className="text-purple-600 font-semibold hover:underline">
            Login
          </Link>
        </p>
      </div>

      <MusicPlayer />
    </div>
  );
}
