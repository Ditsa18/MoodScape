import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "/logo.png";
import FloatingBubbles from "../components/FloatingBubbles";
import MusicPlayer from "../components/MusicPlayer";

import { auth, db } from "../firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

export default function Journal() {
  const navigate = useNavigate();
  const location = useLocation();
  const moodKey = location.state?.mood || null;

  const [text, setText] = useState("");
  const [saving, setSaving] = useState(false);

  const saveJournal = async () => {
    const user = auth.currentUser;
    if (!user) return;

    // ✅ prevent empty journal save
    if (!text.trim()) {
      navigate("/discover", { state: { mood: moodKey } });
      return;
    }

    setSaving(true);

    await addDoc(collection(db, "journals"), {
      userId: user.uid,
      moodKey: moodKey,
      text: text,
      createdAt: serverTimestamp(),
    });

    navigate("/discover", { state: { mood: moodKey } });
  };

  const skipJournal = () => {
    navigate("/discover", { state: { mood: moodKey } });
  };

  return (
    <div className="relative min-h-screen bg-[#f5efe6] overflow-hidden">
      {/* Watermark */}
      <img
        src={logo}
        alt="bg"
        className="absolute inset-0 w-full h-full object-contain opacity-5 pointer-events-none"
      />

      <FloatingBubbles />

      {/* Diary Page */}
      <div
        className="relative z-10 max-w-3xl mx-auto mt-20 bg-[#f9f3ea] rounded-3xl shadow-xl p-12
        border border-[#e6dccf]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(to bottom, transparent, transparent 28px, #e0d6c8 29px)",
          lineHeight: "29px",
        }}
      >
        {/* Doodles */}
        <span className="absolute top-4 left-6 text-2xl">🌸</span>
        <span className="absolute top-6 right-6 text-2xl">🖊️</span>
        <span className="absolute bottom-6 left-6 text-2xl">🌿</span>
        <span className="absolute bottom-4 right-8 text-2xl">✨</span>

        <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">
          Write if you want to 💭
        </h2>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Let your thoughts flow here..."
          className="w-full h-64 bg-transparent resize-none outline-none text-lg text-gray-700"
        />

        <div className="flex gap-4 mt-8">
          <button
            onClick={skipJournal}
            className="flex-1 py-3 rounded-xl border border-gray-400 text-gray-600 hover:bg-gray-100"
          >
            Skip for today
          </button>

          <button
            onClick={saveJournal}
            disabled={saving}
            className="flex-1 py-3 rounded-xl bg-purple-600 text-white font-semibold hover:bg-purple-700"
          >
            {saving ? "Saving..." : "Save & Continue"}
          </button>
        </div>
      </div>

      <MusicPlayer />
    </div>
  );
}
