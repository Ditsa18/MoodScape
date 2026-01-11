import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import FloatingBubbles from "../components/FloatingBubbles";
import MusicPlayer from "../components/MusicPlayer";
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

  useEffect(() => {
    let unsubscribe;

    const init = async () => {
      const user = await waitForAuth();
      if (!user) return;

      // Removed orderBy to ensure it works without manual Firebase Indexes
      const q = query(
        collection(db, "moods"),
        where("userId", "==", user.uid)
      );

      unsubscribe = onSnapshot(q, (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Manual sort: Newest dates at the top
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
      <div className="min-h-screen flex items-center justify-center text-gray-500 bg-gradient-to-br from-purple-50 to-purple-200">
        <p className="animate-pulse font-medium">Loading your memories…</p>
      </div>
    );
  }

  return (
    // Background matched to Stats/Favorites
    <div className="relative min-h-screen bg-gradient-to-br from-purple-50 to-purple-200 overflow-hidden font-sans">
      {/* Watermark Logo */}
      <img
        src={logo}
        alt="bg"
        className="absolute inset-0 w-full h-full object-contain opacity-10 blur-lg pointer-events-none"
      />

      <FloatingBubbles />

      <div className="relative z-10 max-w-2xl mx-auto pt-24 px-6 pb-16">
        <h1 className="text-3xl font-bold text-gray-800 mb-2 text-center">
          Your Mood History
        </h1>
        <p className="text-center text-gray-500 mb-10">
          Every moment you've shared with yourself
        </p>

        {moods.length === 0 ? (
          <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-12 text-center shadow-sm border border-white/50">
            <p className="text-gray-500 font-medium">
              No moods logged yet 🌱
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {moods.map((mood) => (
              <div
                key={mood.id}
                className="bg-white/70 backdrop-blur-xl rounded-2xl p-5 shadow-sm border border-white/50 flex items-center justify-between hover:shadow-md transition-shadow group"
              >
                <div className="flex items-center gap-5">
                  <div className="text-4xl group-hover:scale-110 transition-transform duration-300">
                    {mood.emoji}
                  </div>
                  <div>
                    <p className="font-bold capitalize text-gray-800 text-lg">
                      {mood.moodKey}
                    </p>
                    <p className="text-sm text-gray-500 font-medium">
                      {formatTime(mood.createdAt)}
                    </p>
                  </div>
                </div>
                {/* Visual accent */}
                <div className="h-8 w-1 bg-purple-100 rounded-full group-hover:bg-purple-300 transition-colors"></div>
              </div>
            ))}
          </div>
        )}

        <button
          onClick={() => navigate("/home")}
          className="mt-12 w-full py-4 rounded-2xl bg-white/80 backdrop-blur-md text-purple-600 font-bold border border-purple-100 shadow-sm hover:bg-purple-600 hover:text-white transition-all duration-300"
        >
          Back to Home
        </button>
      </div>

      <MusicPlayer />
    </div>
  );
}