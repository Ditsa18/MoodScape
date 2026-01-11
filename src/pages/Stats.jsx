import { useEffect, useState } from "react";
import FloatingBubbles from "../components/FloatingBubbles";
import MusicPlayer from "../components/MusicPlayer";
import logo from "/logo.png";

import { auth, db } from "../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { waitForAuth } from "../authListener";

export default function Stats() {
  const [moods, setMoods] = useState([]);
  const [loading, setLoading] = useState(true);

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
    const data = snapshot.docs.map((doc) => doc.data());

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
  const today = new Date().toISOString().split("T")[0];
  const todaysMoods = moods.filter((m) => m.date === today);

  /* 🔥 Streak calculation */
  const uniqueDates = [
    ...new Set(moods.map((m) => m.date)),
  ].sort((a, b) => new Date(b) - new Date(a));

  let streak = 0;
  let current = new Date();

  for (let date of uniqueDates) {
    const d = new Date(date);
    if (
      d.toDateString() === current.toDateString()
    ) {
      streak++;
      current.setDate(current.getDate() - 1);
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

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-purple-50 to-purple-200 overflow-hidden">
      {/* Watermark */}
      <img
        src={logo}
        alt="bg"
        className="absolute inset-0 w-full h-full object-contain opacity-10 blur-lg pointer-events-none"
      />

      <FloatingBubbles />

      <div className="relative z-10 max-w-3xl mx-auto px-6 pt-24 pb-16">
        <h1 className="text-3xl font-semibold text-gray-800 mb-2 text-center">
          Your Mood Stats
        </h1>
        <p className="text-center text-gray-500 mb-10">
          A gentle look at your patterns
        </p>

        {/* Mood Distribution */}
        <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 shadow mb-8">
          <h2 className="font-semibold text-gray-800 mb-4">
            Mood Distribution
          </h2>

          {moodEntries.length === 0 && (
            <p className="text-gray-500 text-sm">
              No moods logged yet.
            </p>
          )}

          {moodEntries.map(([mood, count]) => (
            <div key={mood} className="mb-3">
              <div className="flex justify-between text-sm text-gray-700 mb-1">
                <span>{mood}</span>
                <span>{count}</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full">
                <div
                  className="h-2 bg-purple-500 rounded-full"
                  style={{
                    width: `${(count / moods.length) * 100}%`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Highlight */}
        <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 shadow mb-8 text-center">
          <h2 className="font-semibold text-gray-800 mb-2">
            Most frequent mood
          </h2>
          <p className="text-xl">
            {mostFrequent ? mostFrequent : "—"}
          </p>
        </div>

        {/* Today */}
        <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 shadow mb-8">
          <h2 className="font-semibold text-gray-800 mb-2">
            Today
          </h2>
          <p className="text-gray-700 mb-2">
            {todaysMoods.length} check-in(s) today
          </p>
          <div className="flex gap-2 text-2xl">
            {todaysMoods.map((m, i) => (
              <span key={i}>{m.emoji}</span>
            ))}
          </div>
        </div>

        {/* Streak */}
        <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 shadow mb-8 text-center">
          <p className="text-2xl">🔥 {streak}-day streak</p>
        </div>

        {/* Sticky Insight */}
        <div className="bg-pink-100 text-pink-800 rounded-3xl px-8 py-6 shadow-lg text-center text-lg">
          {insight}
        </div>
      </div>

      <MusicPlayer />
    </div>
  );
}
