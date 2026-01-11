import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import FloatingBubbles from "../components/FloatingBubbles";
import MusicPlayer from "../components/MusicPlayer";
import logo from "/logo.png";

import {
  MoonIcon,
  FaceSmileIcon,
  ArrowRightOnRectangleIcon,
  ChartBarIcon,
  ClockIcon,
  XMarkIcon,
  BookmarkIcon, // Added for Favorites link
} from "@heroicons/react/24/solid";

import { auth, db } from "../firebase";
import { signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

export default function Home() {
  const [darkMode, setDarkMode] = useState(false);
  const [nickname, setNickname] = useState("");
  const [loadingName, setLoadingName] = useState(true);

  const [stickyNote, setStickyNote] = useState(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const navigate = useNavigate();
  const user = auth.currentUser;

  // 💗 Sticky notes
  const stickyNotes = [
    "You’re doing your best 💖",
    "Your feelings matter 🫶",
    "Be gentle with yourself 🌸",
    "One step at a time 💕",
    "You are safe here 🤍",
  ];

  // 🔥 Fetch nickname
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

  // 💖 Sticky note loop
  useEffect(() => {
    const interval = setInterval(() => {
      const random =
        stickyNotes[Math.floor(Math.random() * stickyNotes.length)];
      setStickyNote(random);

      setTimeout(() => setStickyNote(null), 4000);
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  // 🚪 Logout
  const confirmLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  return (
    <div
      className={`relative min-h-screen flex items-center justify-center overflow-hidden transition duration-[2000ms]
      ${darkMode ? "bg-[#1b1428]" : "bg-gradient-to-br from-purple-50 to-purple-200"}`}
    >
      {/* Background */}
      <img
        src={logo}
        alt="bg"
        className={`absolute inset-0 w-full h-full object-contain pointer-events-none select-none
        ${darkMode ? "opacity-[0.03] blur-[3px]" : "opacity-10 blur-lg"}`}
      />

      <FloatingBubbles />

      {/* Top Controls */}
      <div className="fixed top-6 right-6 z-20 flex gap-3">
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="w-12 h-12 bg-white rounded-full shadow flex items-center justify-center hover:scale-105 transition"
        >
          <MoonIcon className={`w-6 h-6 ${darkMode ? "text-yellow-400" : "text-gray-700"}`} />
        </button>

        <button
          onClick={() => setShowLogoutModal(true)}
          className="w-12 h-12 bg-white rounded-full shadow flex items-center justify-center hover:scale-105 transition"
        >
          <ArrowRightOnRectangleIcon className="w-6 h-6 text-red-500" />
        </button>
      </div>

      {/* Main Card */}
      <div className="relative z-10 w-full max-w-md bg-white/70 backdrop-blur-xl rounded-2xl p-10 shadow-lg border border-white/50 text-center">
        <h2 className="text-3xl font-semibold mb-2 text-gray-800">
          {loadingName ? "Welcome 🌱" : `Hi, ${nickname} 🌱`}
        </h2>

        <p className="text-sm italic mb-8 text-gray-500">
          How are you feeling today?
        </p>

        <div className="mb-8 bg-white rounded-xl p-4 shadow-sm text-gray-700">
          You haven’t checked in today 💭
        </div>

        {/* Check-in Button */}
        <button
          onClick={() => navigate("/mood-select")}
          className="w-full py-4 mb-6 bg-purple-600 text-white font-semibold rounded-xl shadow-lg hover:bg-purple-700 transition flex items-center justify-center gap-2"
        >
          <FaceSmileIcon className="w-6 h-6" />
          Check in with your mood
        </button>

        {/* Navigation Grid */}
        <div className="grid grid-cols-3 gap-2 text-xs font-medium text-purple-600">
          <button
            onClick={() => navigate("/history")}
            className="flex flex-col items-center gap-1 hover:text-purple-800 transition"
          >
            <div className="p-2 bg-purple-100 rounded-full"><ClockIcon className="w-5 h-5" /></div>
            History
          </button>

          <button
            onClick={() => navigate("/favorites")} // New Route for saved Books/Songs/Movies
            className="flex flex-col items-center gap-1 hover:text-purple-800 transition"
          >
            <div className="p-2 bg-purple-100 rounded-full"><BookmarkIcon className="w-5 h-5" /></div>
            Favorites
          </button>

          <button
            onClick={() => navigate("/stats")}
            className="flex flex-col items-center gap-1 hover:text-purple-800 transition"
          >
            <div className="p-2 bg-purple-100 rounded-full"><ChartBarIcon className="w-5 h-5" /></div>
            Stats
          </button>
        </div>
      </div>

      {/* 💖 Sticky Heart Note */}
      {stickyNote && (
        <div className="absolute top-24 left-1/2 -translate-x-1/2 bg-pink-100 text-pink-800 px-6 py-4 rounded-full shadow-lg rotate-[-4deg] animate-bounce">
          💖 {stickyNote}
        </div>
      )}

      {/* 🚪 Logout Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-6 w-[90%] max-w-sm shadow-xl relative">
            <button
              onClick={() => setShowLogoutModal(false)}
              className="absolute top-3 right-3"
            >
              <XMarkIcon className="w-6 h-6 text-gray-500" />
            </button>

            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Log out?
            </h3>

            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to leave your calm space for now?
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 py-2 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-100"
              >
                Stay
              </button>

              <button
                onClick={confirmLogout}
                className="flex-1 py-2 rounded-xl bg-red-500 text-white hover:bg-red-600"
              >
                Log out
              </button>
            </div>
          </div>
        </div>
      )}

      <MusicPlayer />
    </div>
  );
}