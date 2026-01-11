import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "/logo.png";
import FloatingBubbles from "../components/FloatingBubbles";
import MusicPlayer from "../components/MusicPlayer";
import TopNav from "../components/TopNav"; // Added TopNav

import { auth, db } from "../firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

export default function Journal() {
  const navigate = useNavigate();
  const location = useLocation();
  const moodKey = location.state?.mood || null;

  const [text, setText] = useState("");
  const [saving, setSaving] = useState(false);
  const [darkMode, setDarkMode] = useState(false); // Added Dark Mode state

  const saveJournal = async () => {
    const user = auth.currentUser;
    if (!user) return;

    if (!text.trim()) {
      navigate("/discover", { state: { mood: moodKey } });
      return;
    }

    setSaving(true);

    try {
      await addDoc(collection(db, "journals"), {
        userId: user.uid,
        moodKey: moodKey,
        text: text,
        createdAt: serverTimestamp(),
      });
      navigate("/discover", { state: { mood: moodKey } });
    } catch (err) {
      console.error("Error saving journal:", err);
      setSaving(false);
    }
  };

  const skipJournal = () => {
    navigate("/discover", { state: { mood: moodKey } });
  };

  return (
    <div className={`relative min-h-screen transition-colors duration-700 overflow-hidden font-sans
      ${darkMode ? "bg-slate-900" : "bg-[#f5efe6]"}`}>
      
      {/* Watermark */}
      <img
        src={logo}
        alt="bg"
        className={`absolute inset-0 w-full h-full object-contain pointer-events-none transition-opacity duration-700
          ${darkMode ? "opacity-5 blur-xl" : "opacity-10 blur-lg"}`}
      />

      <FloatingBubbles />

      {/* Top Navigation */}
      <TopNav darkMode={darkMode} setDarkMode={setDarkMode} />

      {/* Diary Page */}
      <div
        className={`relative z-10 max-w-3xl mx-auto mt-32 rounded-3xl shadow-2xl p-8 md:p-12 border transition-all duration-700
          ${darkMode 
            ? "bg-slate-800 border-white/10 shadow-black/40" 
            : "bg-[#f9f3ea] border-[#e6dccf] shadow-xl"}`}
        style={{
          backgroundImage: darkMode
            ? "repeating-linear-gradient(to bottom, transparent, transparent 28px, rgba(255,255,255,0.05) 29px)"
            : "repeating-linear-gradient(to bottom, transparent, transparent 28px, #e0d6c8 29px)",
          lineHeight: "29px",
        }}
      >
        {/* Doodles */}
        <span className="absolute top-4 left-6 text-2xl opacity-60">🌸</span>
        <span className="absolute top-6 right-6 text-2xl opacity-60">🖊️</span>
        <span className="absolute bottom-6 left-6 text-2xl opacity-60">🌿</span>
        <span className="absolute bottom-4 right-8 text-2xl opacity-60">✨</span>

        <h2 className={`text-2xl font-semibold mb-6 text-center transition-colors
          ${darkMode ? "text-purple-300" : "text-gray-800"}`}>
          Write if you want to 💭
        </h2>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Let your thoughts flow here..."
          className={`w-full h-80 bg-transparent resize-none outline-none text-lg transition-colors
            ${darkMode ? "text-gray-200 placeholder-gray-600" : "text-gray-700 placeholder-gray-400"}`}
        />

        <div className="flex flex-col sm:flex-row gap-4 mt-8">
          <button
            onClick={skipJournal}
            className={`flex-1 py-3 rounded-xl border transition-all font-medium
              ${darkMode 
                ? "border-white/10 text-gray-400 hover:bg-white/5" 
                : "border-gray-400 text-gray-600 hover:bg-gray-100"}`}
          >
            Skip for today
          </button>

          <button
            onClick={saveJournal}
            disabled={saving}
            className={`flex-1 py-3 rounded-xl font-semibold transition-all
              ${darkMode 
                ? "bg-purple-600 text-white hover:bg-purple-500 shadow-lg shadow-purple-900/20" 
                : "bg-purple-600 text-white hover:bg-purple-700 shadow-md"}`}
          >
            {saving ? "Saving..." : "Save & Continue"}
          </button>
        </div>
      </div>

      <MusicPlayer />
    </div>
  );
}