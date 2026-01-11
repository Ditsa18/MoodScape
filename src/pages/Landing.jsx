import { useState } from "react";
import FloatingBubbles from "../components/FloatingBubbles";
import MusicPlayer from "../components/MusicPlayer";
import hero from "../../public/logo.png";

import {
  ArrowRightOnRectangleIcon,
  UserPlusIcon,
  MoonIcon,
} from "@heroicons/react/24/solid";

export default function Landing() {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div
      className={`relative min-h-screen overflow-hidden flex items-center justify-center transition-all duration-[2000ms]
      ${darkMode ? "bg-[#1b1428]" : "bg-gradient-to-br from-indigo-100 to-purple-200"}
      `}
    >
      {/* Watermark Hero Image */}
      <img
        src={hero}
        alt="Moodscape Hero"
        className={`absolute inset-0 w-full h-full object-contain opacity-10 blur-lg pointer-events-none select-none transition-opacity duration-[2000ms]
        ${darkMode ? "opacity-5" : "opacity-10"}
        `}
      />

      {/* Floating Bubbles */}
      <FloatingBubbles />

      {/* Dark Mode Toggle */}
      <button
        onClick={() => setDarkMode(!darkMode)}
        className="fixed top-6 right-6 z-20 w-12 h-12 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-gray-200 transition"
      >
        <MoonIcon className="w-6 h-6 text-gray-700" />
      </button>

      {/* Center Content */}
      <div className="relative z-10 text-center p-6">
        <h1
          className={`text-5xl font-bold mb-4 ${
            darkMode ? "text-white" : "text-gray-800"
          }`}
        >
          Welcome to Moodscape ✨
        </h1>

        <p
          className={`text-lg mb-8 ${
            darkMode ? "text-gray-300" : "text-gray-700"
          }`}
        >
          Track your emotional journey and reconnect with yourself.
        </p>

        {/* CTA Buttons */}
        <div className="flex items-center justify-center gap-4 mb-4">
          <a
            href="/signup"
            className="px-6 py-3 rounded-xl bg-purple-600 text-white font-semibold shadow-lg hover:bg-purple-700 transition flex items-center gap-2"
          >
            <UserPlusIcon className="w-5 h-5" />
            Get Started
          </a>

          <a
            href="/login"
            className="px-6 py-3 rounded-xl bg-white/60 backdrop-blur text-purple-700 font-medium border border-purple-300 shadow hover:bg-white/80 transition flex items-center gap-2"
          >
            <ArrowRightOnRectangleIcon className="w-5 h-5" />
            Login
          </a>
        </div>

        {/* Emotional journaling line */}
        <p
          className={`text-sm italic ${
            darkMode ? "text-gray-400" : "text-gray-600"
          }`}
        >
          “Your emotions are valid — let’s understand them together.”
        </p>
      </div>

      {/* Music Button */}
      <MusicPlayer />
    </div>
  );
}
