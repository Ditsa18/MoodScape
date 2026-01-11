import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import FloatingBubbles from "../components/FloatingBubbles";
import MusicPlayer from "../components/MusicPlayer";
import TopNav from "../components/TopNav"; // Added TopNav
import logo from "/logo.png";

import { db } from "../firebase";
import {
  collection,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";
import { waitForAuth } from "../authListener";

export default function History() {
  const navigate = useNavigate();
  const [moods, setMoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false); // Added Dark Mode state

  useEffect(() => {
    let unsubscribe;

    const init = async () => {
      const user = await waitForAuth();
      if (!user) return;

      const q = query(
        collection(db, "moods"),
        where("userId", "==", user.uid)
      );

      unsubscribe = onSnapshot(q, (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        const sortedData = data.sort((a, b) => {
          const timeA = a.createdAt?.seconds || 0;
          const timeB = b.createdAt?.seconds || 0;
          return timeB - timeA;
        });

        setMoods(sortedData);
        setLoading(false);
      });
    };

    init();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const formatTime = (timestamp) => {
    if (!timestamp) return "";
    const date = timestamp.toDate();
    return date.toLocaleString([], {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center transition-colors duration-700
        ${darkMode ? "bg-slate-900 text-purple-400" : "bg-gradient-to-br from-purple-50 to-purple-200 text-gray-500"}`}>
        <p className="animate-pulse font-medium text-lg">Loading your memories…</p>
      </div>
    );
  }

  return (
    <div className={`relative min-h-screen transition-colors duration-700 overflow-x-hidden font-sans
      ${darkMode ? "bg-slate-900 text-white" : "bg-gradient-to-br from-purple-50 to-purple-200"}`}>
      
      {/* Watermark Logo */}
      <img
        src={logo}
        alt="bg"
        className={`absolute inset-0 w-full h-full object-contain pointer-events-none transition-opacity duration-700
          ${darkMode ? "opacity-5 blur-xl" : "opacity-10 blur-lg"}`}
      />

      <FloatingBubbles />

      {/* Top Navigation */}
      <TopNav darkMode={darkMode} setDarkMode={setDarkMode} />

      <div className="relative z-10 max-w-2xl mx-auto pt-32 px-6 pb-16">
        <header className="text-center mb-12">
          <h1 className={`text-4xl font-bold mb-3 tracking-tight ${darkMode ? "text-white" : "text-gray-800"}`}>
            Your Mood History
          </h1>
          <p className={`${darkMode ? "text-gray-400" : "text-gray-500"} font-medium`}>
            Every moment you've shared with yourself
          </p>
        </header>

        {moods.length === 0 ? (
          <div className={`backdrop-blur-xl rounded-3xl p-12 text-center shadow-sm border
            ${darkMode ? "bg-white/5 border-white/10" : "bg-white/70 border-white/50"}`}>
            <p className="text-gray-400 font-medium text-lg">
              No moods logged yet 🌱
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {moods.map((mood) => (
              <div
                key={mood.id}
                className={`backdrop-blur-xl rounded-2xl p-5 shadow-sm border flex items-center justify-between hover:shadow-md transition-all group
                  ${darkMode 
                    ? "bg-white/10 border-white/10 hover:bg-white/15" 
                    : "bg-white/70 border-white/50 hover:bg-white"}`}
              >
                <div className="flex items-center gap-5">
                  <div className="text-4xl group-hover:scale-110 transition-transform duration-300 drop-shadow-sm">
                    {mood.emoji}
                  </div>
                  <div>
                    <p className={`font-bold capitalize text-lg ${darkMode ? "text-white" : "text-gray-800"}`}>
                      {mood.moodKey}
                    </p>
                    <p className={`text-sm font-medium ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                      {formatTime(mood.createdAt)}
                    </p>
                  </div>
                </div>
                
                {/* Visual accent */}
                <div className={`h-8 w-1 rounded-full transition-colors
                  ${darkMode ? "bg-white/20 group-hover:bg-purple-500" : "bg-purple-100 group-hover:bg-purple-400"}`}>
                </div>
              </div>
            ))}
          </div>
        )}

        <button
          onClick={() => navigate("/home")}
          className={`mt-12 w-full py-4 rounded-2xl font-bold shadow-sm border transition-all duration-300 backdrop-blur-md
            ${darkMode 
              ? "bg-purple-600 text-white border-purple-500 hover:bg-purple-700 shadow-purple-900/20" 
              : "bg-white/80 text-purple-600 border-purple-100 hover:bg-purple-600 hover:text-white"}`}
        >
          Back to Home
        </button>
      </div>

      <MusicPlayer />
    </div>
  );
}