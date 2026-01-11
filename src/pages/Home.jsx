import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import FloatingBubbles from "../components/FloatingBubbles";
import MusicPlayer from "../components/MusicPlayer";
import TopNav from "../components/TopNav"; // Import your new component
import logo from "/logo.png";

import {
  FaceSmileIcon,
  ChartBarIcon,
  ClockIcon,
  BookmarkIcon,
} from "@heroicons/react/24/solid";

import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

export default function Home() {
  const [darkMode, setDarkMode] = useState(false);
  const [nickname, setNickname] = useState("");
  const [loadingName, setLoadingName] = useState(true);
  const [stickyNote, setStickyNote] = useState(null);

  const navigate = useNavigate();
  const user = auth.currentUser;

  const stickyNotes = [
    "You’re doing your best 💖",
    "Your feelings matter 🫶",
    "Be gentle with yourself 🌸",
    "One step at a time 💕",
    "You are safe here 🤍",
  ];

  // Fetch nickname from Firestore
  useEffect(() => {
    const fetchNickname = async () => {
      if (!user) return;
      try {
        const snap = await getDoc(doc(db, "users", user.uid));
        if (snap.exists()) {
          setNickname(snap.data().nickname);
        }
      } catch (err) {
        console.error("Nickname fetch error:", err);
      } finally {
        setLoadingName(false);
      }
    };
    fetchNickname();
  }, [user]);

  // Sticky note loop
  useEffect(() => {
    const interval = setInterval(() => {
      const random = stickyNotes[Math.floor(Math.random() * stickyNotes.length)];
      setStickyNote(random);
      setTimeout(() => setStickyNote(null), 4000);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className={`relative min-h-screen flex items-center justify-center overflow-hidden transition-colors duration-[2000ms]
      ${darkMode ? "bg-[#1b1428]" : "bg-gradient-to-br from-purple-50 to-purple-200"}`}
    >
      {/* Background Logo */}
      <img
        src={logo}
        alt="bg"
        className={`absolute inset-0 w-full h-full object-contain pointer-events-none select-none transition-opacity duration-1000
        ${darkMode ? "opacity-[0.03] blur-[3px]" : "opacity-10 blur-lg"}`}
      />

      <FloatingBubbles />

      {/* REUSABLE TOP NAVIGATION (Logout & Dark Mode) */}
      <TopNav darkMode={darkMode} setDarkMode={setDarkMode} />

      {/* Main Card */}
      <div className="relative z-10 w-full max-w-md bg-white/70 backdrop-blur-xl rounded-3xl p-10 shadow-2xl border border-white/50 text-center mx-4">
        <h2 className="text-3xl font-bold mb-2 text-gray-800 tracking-tight">
          {loadingName ? "Welcome 🌱" : `Hi, ${nickname} 🌱`}
        </h2>

        <p className="text-sm italic mb-8 text-gray-500 font-medium">
          How are you feeling today?
        </p>

        <div className="mb-8 bg-white/50 rounded-2xl py-4 px-2 shadow-inner text-gray-600 border border-purple-100/50">
          You haven’t checked in today 💭
        </div>

        {/* Check-in Button */}
        <button
          onClick={() => navigate("/mood-select")}
          className="w-full py-4 mb-8 bg-purple-600 text-white font-bold rounded-2xl shadow-lg shadow-purple-200 hover:bg-purple-700 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
        >
          <FaceSmileIcon className="w-6 h-6" />
          Check in with your mood
        </button>

        {/* Navigation Grid */}
        <div className="grid grid-cols-3 gap-4 text-xs font-bold text-purple-600">
          <button
            onClick={() => navigate("/history")}
            className="flex flex-col items-center gap-2 group"
          >
            <div className="p-3 bg-purple-100 rounded-2xl group-hover:bg-purple-600 group-hover:text-white transition-all duration-300">
              <ClockIcon className="w-6 h-6" />
            </div>
            <span>History</span>
          </button>

          <button
            onClick={() => navigate("/favorites")}
            className="flex flex-col items-center gap-2 group"
          >
            <div className="p-3 bg-purple-100 rounded-2xl group-hover:bg-purple-600 group-hover:text-white transition-all duration-300">
              <BookmarkIcon className="w-6 h-6" />
            </div>
            <span>Favorites</span>
          </button>

          <button
            onClick={() => navigate("/stats")}
            className="flex flex-col items-center gap-2 group"
          >
            <div className="p-3 bg-purple-100 rounded-2xl group-hover:bg-purple-600 group-hover:text-white transition-all duration-300">
              <ChartBarIcon className="w-6 h-6" />
            </div>
            <span>Stats</span>
          </button>
        </div>
      </div>

      {/* 💖 Sticky Heart Note */}
      {stickyNote && (
        <div className="absolute top-28 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-md text-pink-600 px-6 py-3 rounded-full shadow-xl border border-pink-100 animate-bounce z-20 font-medium">
          💖 {stickyNote}
        </div>
      )}

      <MusicPlayer />
    </div>
  );
}