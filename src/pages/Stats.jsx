import { useEffect, useState } from "react";
import FloatingBubbles from "../components/FloatingBubbles";
import MusicPlayer from "../components/MusicPlayer";
import TopNav from "../components/TopNav"; // Added TopNav
import logo from "/logo.png";

import { auth, db } from "../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { waitForAuth } from "../authListener";

export default function Stats() {
  const [moods, setMoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false); // Added Dark Mode state

  /* 🔥 Fetch moods from Firestore */
  useEffect(() => {
    const fetchMoods = async () => {
      const user = await waitForAuth();
      if (!user) return;

      const q = query(
        collection(db, "moods"),
        where("userId", "==", user.uid)
      );

      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((doc) => {
        const d = doc.data();
        // Ensure date exists; if not provided as a string, extract from createdAt
        return {
          ...d,
          dateString: d.date || (d.createdAt ? d.createdAt.toDate().toISOString().split("T")[0] : null)
        };
      });

      setMoods(data);
      setLoading(false);
    };

    fetchMoods();
  }, []);

  /* 🧮 Mood counts */
  const moodCounts = {};
  moods.forEach((m) => {
    moodCounts[m.moodKey] = (moodCounts[m.moodKey] || 0) + 1;
  });

  const moodEntries = Object.entries(moodCounts);

  /* ⭐ Most frequent mood */
  const mostFrequent =
    moodEntries.length > 0
      ? moodEntries.reduce((a, b) => (a[1] > b[1] ? a : b))[0]
      : null;

  /* 📅 Today’s moods */
  const todayStr = new Date().toISOString().split("T")[0];
  const todaysMoods = moods.filter((m) => m.dateString === todayStr);

  /* 🔥 Streak calculation */
  const uniqueDates = [
    ...new Set(moods.map((m) => m.dateString).filter(Boolean)),
  ].sort((a, b) => new Date(b) - new Date(a));

  let streak = 0;
  let current = new Date();

  for (let date of uniqueDates) {
    const d = new Date(date);
    if (d.toDateString() === current.toDateString()) {
      streak++;
      current.setDate(current.getDate() - 1);
    } else if (d > current) {
      continue; // Skip if date is in the future
    } else {
      break;
    }
  }

  /* 💌 Gentle insight */
  const insight =
    moods.length === 0
      ? "Your journey will start here 🌱"
      : mostFrequent === "happy"
      ? "You’ve been feeling happier lately ☀️"
      : mostFrequent === "anxious"
      ? "You check in even during anxious moments — that’s strength 💛"
      : "You’re showing up for yourself 🤍";

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center transition-colors duration-700
        ${darkMode ? "bg-slate-900 text-purple-400" : "bg-gradient-to-br from-purple-50 to-purple-200 text-gray-500"}`}>
        <p className="animate-pulse font-medium text-lg">Gathering your patterns...</p>
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

      <div className="relative z-10 max-w-3xl mx-auto px-6 pt-32 pb-16">
        <header className="text-center mb-12">
          <h1 className={`text-4xl font-bold mb-3 tracking-tight ${darkMode ? "text-white" : "text-gray-800"}`}>
            Your Mood Stats
          </h1>
          <p className={`${darkMode ? "text-gray-400" : "text-gray-500"} font-medium`}>
            A gentle look at your patterns
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
           {/* Highlight Card */}
          <div className={`backdrop-blur-xl rounded-3xl p-8 text-center shadow-sm border transition-all
            ${darkMode ? "bg-white/5 border-white/10" : "bg-white/70 border-white/50"}`}>
            <h2 className={`font-bold uppercase tracking-widest text-xs mb-3 ${darkMode ? "text-purple-400" : "text-purple-600"}`}>
              Most Frequent
            </h2>
            <p className="text-3xl font-bold capitalize">
              {mostFrequent ? mostFrequent : "—"}
            </p>
          </div>

          {/* Streak Card */}
          <div className={`backdrop-blur-xl rounded-3xl p-8 text-center shadow-sm border transition-all
            ${darkMode ? "bg-white/5 border-white/10" : "bg-white/70 border-white/50"}`}>
            <h2 className={`font-bold uppercase tracking-widest text-xs mb-3 ${darkMode ? "text-orange-400" : "text-orange-600"}`}>
              Current Streak
            </h2>
            <p className="text-3xl font-bold italic text-orange-500">
              🔥 {streak} {streak === 1 ? 'Day' : 'Days'}
            </p>
          </div>
        </div>

        {/* Mood Distribution */}
        <div className={`backdrop-blur-xl rounded-3xl p-8 shadow-sm border mb-8 transition-all
          ${darkMode ? "bg-white/5 border-white/10" : "bg-white/70 border-white/50"}`}>
          <h2 className={`text-xl font-bold mb-6 ${darkMode ? "text-white" : "text-gray-800"}`}>
            Mood Distribution
          </h2>

          {moodEntries.length === 0 ? (
            <p className="text-gray-400 text-sm italic">No moods logged yet.</p>
          ) : (
            <div className="space-y-5">
              {moodEntries.map(([mood, count]) => (
                <div key={mood}>
                  <div className="flex justify-between text-sm font-bold capitalize mb-2">
                    <span className={darkMode ? "text-gray-300" : "text-gray-700"}>{mood}</span>
                    <span className={darkMode ? "text-purple-400" : "text-purple-600"}>{count}</span>
                  </div>
                  <div className={`h-3 rounded-full overflow-hidden ${darkMode ? "bg-white/10" : "bg-gray-100"}`}>
                    <div
                      className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-1000"
                      style={{
                        width: `${(count / moods.length) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Today's Check-ins */}
        <div className={`backdrop-blur-xl rounded-3xl p-8 shadow-sm border mb-8 transition-all
          ${darkMode ? "bg-white/5 border-white/10" : "bg-white/70 border-white/50"}`}>
          <h2 className={`text-xl font-bold mb-2 ${darkMode ? "text-white" : "text-gray-800"}`}>Today</h2>
          <p className={`${darkMode ? "text-gray-400" : "text-gray-500"} mb-6 font-medium`}>
            {todaysMoods.length} check-in(s) today
          </p>
          <div className="flex flex-wrap gap-4">
            {todaysMoods.length > 0 ? (
              todaysMoods.map((m, i) => (
                <span key={i} className="text-4xl hover:scale-125 transition-transform duration-300 cursor-default drop-shadow-sm">
                  {m.emoji}
                </span>
              ))
            ) : (
              <span className="text-gray-400 italic">No check-ins today yet...</span>
            )}
          </div>
        </div>

        {/* Sticky Insight */}
        <div className={`rounded-3xl px-8 py-8 shadow-xl text-center text-lg font-medium transition-all transform hover:scale-[1.02] duration-300
          ${darkMode 
            ? "bg-purple-900/40 text-purple-100 border border-purple-500/30" 
            : "bg-white text-purple-700 border border-purple-100"}`}>
          <span className="mr-2">✨</span> {insight}
        </div>
      </div>

      <MusicPlayer />
    </div>
  );
}