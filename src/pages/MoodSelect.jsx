import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import FloatingBubbles from "../components/FloatingBubbles";
import MusicPlayer from "../components/MusicPlayer";
import TopNav from "../components/TopNav"; // Added TopNav
import logo from "/logo.png";
import { HeartIcon } from "@heroicons/react/24/solid";

import { auth, db } from "../firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

/* 🌈 Mood system - Updated with Dark Mode compatible gradients */
const MOODS = [
  {
    key: "happy",
    label: "Happy",
    emoji: "😊",
    theme: "from-yellow-100 via-pink-100 to-orange-200",
    darkTheme: "from-yellow-900/40 via-pink-900/40 to-orange-900/40",
    aura: "shadow-yellow-300/60",
    music: "/music/happy.mp3",
    notes: ["That joy suits you", "Let yourself smile", "Moments like these matter"],
  },
  {
    key: "sad",
    label: "Sad",
    emoji: "😢",
    theme: "from-blue-100 via-indigo-100 to-purple-200",
    darkTheme: "from-blue-900/40 via-indigo-900/40 to-purple-900/40",
    aura: "shadow-blue-300/60",
    music: "/music/sad.mp3",
    notes: ["It’s okay to feel this", "You’re not alone", "Take all the time you need"],
  },
  {
    key: "neutral",
    label: "Neutral",
    emoji: "😐",
    theme: "from-gray-100 via-slate-100 to-purple-100",
    darkTheme: "from-gray-800 via-slate-800 to-slate-900",
    aura: "shadow-gray-300/60",
    music: "/music/neutral.mp3",
    notes: ["Just being is enough", "No pressure right now", "It’s okay to feel steady"],
  },
  {
    key: "anxious",
    label: "Anxious",
    emoji: "😰",
    theme: "from-teal-100 via-cyan-100 to-blue-200",
    darkTheme: "from-teal-900/40 via-cyan-900/40 to-blue-900/40",
    aura: "shadow-cyan-300/60",
    music: "/music/anxious.mp3",
    notes: ["Breathe slowly", "You’re safe here", "This will pass"],
  },
  {
    key: "tired",
    label: "Tired",
    emoji: "😴",
    theme: "from-purple-100 via-indigo-100 to-slate-200",
    darkTheme: "from-purple-900/40 via-indigo-900/40 to-slate-900/40",
    aura: "shadow-purple-300/60",
    music: "/music/tired.mp3",
    notes: ["Rest is allowed", "You’ve done enough", "Pause without guilt"],
  },
  {
    key: "calm",
    label: "Calm",
    emoji: "😌",
    theme: "from-sky-100 via-blue-100 to-teal-200",
    darkTheme: "from-sky-900/40 via-blue-900/40 to-teal-900/40",
    aura: "shadow-sky-300/60",
    music: "/music/calm.mp3",
    notes: ["Hold onto this stillness", "Peace feels good", "Just breathe"],
  },
  {
    key: "grateful",
    label: "Grateful",
    emoji: "🤗",
    theme: "from-amber-100 via-orange-100 to-yellow-200",
    darkTheme: "from-amber-900/40 via-orange-900/40 to-yellow-900/40",
    aura: "shadow-amber-300/60",
    music: "/music/grateful.mp3",
    notes: ["Small things matter", "Gratitude softens everything", "Notice this moment"],
  },
  {
    key: "excited",
    label: "Excited",
    emoji: "🤩",
    theme: "from-pink-200 via-purple-200 to-fuchsia-300",
    darkTheme: "from-pink-900/40 via-purple-900/40 to-fuchsia-900/40",
    aura: "shadow-pink-300/60",
    music: "/music/excited.mp3",
    notes: ["Your energy is beautiful", "Let it flow", "Something good is coming"],
  },
  {
    key: "stressed",
    label: "Stressed",
    emoji: "🤯",
    theme: "from-cyan-100 via-sky-100 to-slate-200",
    darkTheme: "from-cyan-900/40 via-sky-900/40 to-slate-900/40",
    aura: "shadow-sky-300/60",
    music: "/music/stressed.mp3",
    notes: ["One thing at a time", "You don’t need to fix everything", "Pause"],
  },
  {
    key: "lonely",
    label: "Lonely",
    emoji: "🥺",
    theme: "from-indigo-100 via-purple-100 to-slate-200",
    darkTheme: "from-indigo-900/40 via-purple-900/40 to-slate-900/40",
    aura: "shadow-indigo-300/60",
    music: "/music/lonely.mp3",
    notes: ["You matter", "I’m glad you’re here", "This won’t last forever"],
  },
  {
    key: "confident",
    label: "Confident",
    emoji: "😎",
    theme: "from-emerald-100 via-green-100 to-lime-200",
    darkTheme: "from-emerald-900/40 via-green-900/40 to-lime-900/40",
    aura: "shadow-emerald-300/60",
    music: "/music/confident.mp3",
    notes: ["Own this feeling", "Stand tall", "You earned this"],
  },
  {
    key: "overwhelmed",
    label: "Overwhelmed",
    emoji: "😵‍💫",
    theme: "from-rose-100 via-pink-100 to-purple-200",
    darkTheme: "from-rose-900/40 via-pink-900/40 to-purple-900/40",
    aura: "shadow-rose-300/60",
    music: "/music/overwhelmed.mp3",
    notes: ["It’s okay to feel a lot", "Slow things down", "One breath at a time"],
  },
  {
    key: "focused",
    label: "Focused",
    emoji: "🎯",
    theme: "from-slate-100 via-gray-100 to-blue-200",
    darkTheme: "from-slate-800 via-gray-800 to-blue-900",
    aura: "shadow-slate-300/60",
    music: "/music/focused.mp3",
    notes: ["You’re in the zone", "Clarity feels good", "Stay present"],
  },
];

export default function MoodSelect() {
  const navigate = useNavigate();
  const [selectedMood, setSelectedMood] = useState(null);
  const [bgTheme, setBgTheme] = useState("from-purple-50 to-purple-200");
  const [sticky, setSticky] = useState(null);
  const [audio, setAudio] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const secondStickyTimeout = useRef(null);

  const toggleMusic = () => {
    if (!audio) return;
    isPlaying ? audio.pause() : audio.play();
    setIsPlaying(!isPlaying);
  };

  const playMoodMusic = (src) => {
    if (audio) audio.pause();
    const newAudio = new Audio(src);
    newAudio.volume = 0.45;
    newAudio.loop = true;
    newAudio.play();
    setAudio(newAudio);
    setIsPlaying(true);
  };

  const showStickyTwice = (notes) => {
    const pick = () => notes[Math.floor(Math.random() * notes.length)];
    setSticky(pick());
    setTimeout(() => setSticky(null), 4500);

    clearTimeout(secondStickyTimeout.current);
    secondStickyTimeout.current = setTimeout(() => {
      setSticky(pick());
      setTimeout(() => setSticky(null), 4500);
    }, 7000);
  };

  const saveMood = async (mood) => {
    const user = auth.currentUser;
    if (!user) return;
    await addDoc(collection(db, "moods"), {
      userId: user.uid,
      moodKey: mood.key,
      emoji: mood.emoji,
      createdAt: serverTimestamp(),
    });
  };

  const handleSelect = async (mood) => {
    setSelectedMood(mood.key);
    setBgTheme(darkMode ? mood.darkTheme : mood.theme);
    localStorage.setItem("lastMood", mood.key);
    playMoodMusic(mood.music);
    showStickyTwice(mood.notes);
    await saveMood(mood);
  };

  // Update theme if darkMode changes while a mood is already selected
  useEffect(() => {
    if (selectedMood) {
      const current = MOODS.find(m => m.key === selectedMood);
      setBgTheme(darkMode ? current.darkTheme : current.theme);
    } else {
      setBgTheme(darkMode ? "from-slate-900 to-slate-950" : "from-purple-50 to-purple-200");
    }
  }, [darkMode, selectedMood]);

  useEffect(() => {
    return () => audio && audio.pause();
  }, [audio]);

  return (
    <div className={`relative min-h-screen bg-gradient-to-br ${bgTheme} transition-all duration-[1500ms] overflow-x-hidden font-sans`}>
      <img
        src={logo}
        alt="bg"
        className={`absolute inset-0 w-full h-full object-contain pointer-events-none transition-opacity duration-1000
          ${darkMode ? "opacity-5 blur-xl" : "opacity-10 blur-lg"}`}
      />

      <FloatingBubbles />
      
      {/* Top Navigation */}
      <TopNav darkMode={darkMode} setDarkMode={setDarkMode} />

      {sticky && (
        <div className={`fixed right-8 top-1/4 z-50 px-10 py-7 rounded-3xl shadow-2xl text-lg animate-in slide-in-from-right duration-500 backdrop-blur-md
          ${darkMode ? "bg-slate-800/90 text-purple-200 border border-white/10" : "bg-white/95 text-gray-800 border border-purple-100"}`}>
          {sticky}
        </div>
      )}

      <div className="text-center pt-32 mb-14">
        <h1 className={`text-3xl font-bold tracking-tight mb-2 ${darkMode ? "text-white" : "text-gray-800"}`}>
          How are you feeling right now?
        </h1>
        <p className={`${darkMode ? "text-gray-400" : "text-gray-500"} font-medium`}>
          There’s no right or wrong answer.
        </p>
      </div>

      <div className="max-w-5xl mx-auto grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-10 px-6 mb-20 place-items-center">
        {MOODS.map((mood) => (
          <button
            key={mood.key}
            onClick={() => handleSelect(mood)}
            className="flex flex-col items-center gap-4 group transition-transform hover:scale-110"
          >
            <div className={`w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br flex items-center justify-center transition-all duration-500 shadow-xl
              ${darkMode ? mood.darkTheme : mood.theme}
              ${mood.aura}
              ${selectedMood === mood.key ? "ring-4 ring-purple-500 scale-110" : "group-hover:shadow-2xl"}`}>
              <span className="text-4xl drop-shadow-md">{mood.emoji}</span>
            </div>
            <span className={`text-sm font-bold capitalize tracking-wide transition-colors
              ${selectedMood === mood.key ? "text-purple-500" : darkMode ? "text-gray-400" : "text-gray-600"}`}>
              {mood.label}
            </span>
          </button>
        ))}
      </div>

      <div className="max-w-sm mx-auto px-6 pb-20">
        <button
          disabled={!selectedMood}
          onClick={() => navigate("/journal", { state: { mood: selectedMood } })}
          className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all duration-300 shadow-lg
            ${selectedMood 
              ? "bg-purple-600 text-white hover:bg-purple-500 hover:-translate-y-1 shadow-purple-900/20" 
              : "bg-gray-300 text-gray-500 cursor-not-allowed"}`}
        >
          <HeartIcon className="w-5 h-5" />
          Continue
        </button>
      </div>

      <MusicPlayer isPlaying={isPlaying} onToggle={toggleMusic} />
    </div>
  );
}