import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import FloatingBubbles from "../components/FloatingBubbles";
import MusicPlayer from "../components/MusicPlayer";
import logo from "/logo.png";
import { HeartIcon } from "@heroicons/react/24/solid";

import { auth, db } from "../firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

/* 🌈 Mood system */
const MOODS = [
  {
    key: "happy",
    label: "Happy",
    emoji: "😊",
    theme: "from-yellow-100 via-pink-100 to-orange-200",
    aura: "shadow-yellow-300/60",
    music: "/music/happy.mp3",
    notes: ["That joy suits you", "Let yourself smile", "Moments like these matter"],
  },
  {
    key: "sad",
    label: "Sad",
    emoji: "😢",
    theme: "from-blue-100 via-indigo-100 to-purple-200",
    aura: "shadow-blue-300/60",
    music: "/music/sad.mp3",
    notes: ["It’s okay to feel this", "You’re not alone", "Take all the time you need"],
  },
  {
    key: "neutral",
    label: "Neutral",
    emoji: "😐",
    theme: "from-gray-100 via-slate-100 to-purple-100",
    aura: "shadow-gray-300/60",
    music: "/music/neutral.mp3",
    notes: ["Just being is enough", "No pressure right now", "It’s okay to feel steady"],
  },
  {
    key: "anxious",
    label: "Anxious",
    emoji: "😰",
    theme: "from-teal-100 via-cyan-100 to-blue-200",
    aura: "shadow-cyan-300/60",
    music: "/music/anxious.mp3",
    notes: ["Breathe slowly", "You’re safe here", "This will pass"],
  },
  {
    key: "tired",
    label: "Tired",
    emoji: "😴",
    theme: "from-purple-100 via-indigo-100 to-slate-200",
    aura: "shadow-purple-300/60",
    music: "/music/tired.mp3",
    notes: ["Rest is allowed", "You’ve done enough", "Pause without guilt"],
  },
  {
    key: "calm",
    label: "Calm",
    emoji: "😌",
    theme: "from-sky-100 via-blue-100 to-teal-200",
    aura: "shadow-sky-300/60",
    music: "/music/calm.mp3",
    notes: ["Hold onto this stillness", "Peace feels good", "Just breathe"],
  },
  {
    key: "grateful",
    label: "Grateful",
    emoji: "🤗",
    theme: "from-amber-100 via-orange-100 to-yellow-200",
    aura: "shadow-amber-300/60",
    music: "/music/grateful.mp3",
    notes: ["Small things matter", "Gratitude softens everything", "Notice this moment"],
  },
  {
    key: "excited",
    label: "Excited",
    emoji: "🤩",
    theme: "from-pink-200 via-purple-200 to-fuchsia-300",
    aura: "shadow-pink-300/60",
    music: "/music/excited.mp3",
    notes: ["Your energy is beautiful", "Let it flow", "Something good is coming"],
  },
  {
    key: "stressed",
    label: "Stressed",
    emoji: "🤯",
    theme: "from-cyan-100 via-sky-100 to-slate-200",
    aura: "shadow-sky-300/60",
    music: "/music/stressed.mp3",
    notes: ["One thing at a time", "You don’t need to fix everything", "Pause"],
  },
  {
    key: "lonely",
    label: "Lonely",
    emoji: "🥺",
    theme: "from-indigo-100 via-purple-100 to-slate-200",
    aura: "shadow-indigo-300/60",
    music: "/music/lonely.mp3",
    notes: ["You matter", "I’m glad you’re here", "This won’t last forever"],
  },
  {
    key: "confident",
    label: "Confident",
    emoji: "😎",
    theme: "from-emerald-100 via-green-100 to-lime-200",
    aura: "shadow-emerald-300/60",
    music: "/music/confident.mp3",
    notes: ["Own this feeling", "Stand tall", "You earned this"],
  },
  {
    key: "overwhelmed",
    label: "Overwhelmed",
    emoji: "😵‍💫",
    theme: "from-rose-100 via-pink-100 to-purple-200",
    aura: "shadow-rose-300/60",
    music: "/music/overwhelmed.mp3",
    notes: ["It’s okay to feel a lot", "Slow things down", "One breath at a time"],
  },
  {
    key: "focused",
    label: "Focused",
    emoji: "🎯",
    theme: "from-slate-100 via-gray-100 to-blue-200",
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

  const secondStickyTimeout = useRef(null);

  /* 🎵 Toggle mood music */
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

  /* 🔥 SAVE MOOD */
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
    setBgTheme(mood.theme);

    // ⭐ IMPORTANT FOR JOURNAL
    localStorage.setItem("lastMood", mood.key);

    playMoodMusic(mood.music);
    showStickyTwice(mood.notes);
    await saveMood(mood);
  };

  useEffect(() => {
    return () => audio && audio.pause();
  }, [audio]);

  return (
    <div className={`relative min-h-screen bg-gradient-to-br ${bgTheme} transition-all duration-[2000ms] overflow-hidden`}>
      <img
        src={logo}
        alt="bg"
        className="absolute inset-0 w-full h-full object-contain opacity-10 blur-lg pointer-events-none"
      />

      <FloatingBubbles />

      {sticky && (
        <div className="fixed right-8 top-1/3 z-30 bg-white/95 px-10 py-7 rounded-3xl shadow-2xl text-lg">
          {sticky}
        </div>
      )}

      <div className="text-center pt-24 mb-14">
        <h1 className="text-3xl font-semibold">
          How are you feeling right now?
        </h1>
        <p className="text-gray-500 mt-2">
          There’s no right or wrong answer.
        </p>
      </div>

      <div className="max-w-5xl mx-auto grid grid-cols-3 sm:grid-cols-4 gap-14 px-6 mb-16 place-items-center">
        {MOODS.map((mood) => (
          <button
            key={mood.key}
            onClick={() => handleSelect(mood)}
            className="flex flex-col items-center gap-4 hover:scale-110 transition"
          >
            <div className={`w-24 h-24 rounded-full bg-gradient-to-br ${mood.theme}
              shadow-2xl ${mood.aura}
              flex items-center justify-center
              ${selectedMood === mood.key && "ring-4 ring-purple-500 animate-pulse"}`}>
              <span className="text-4xl">{mood.emoji}</span>
            </div>
            <span className="text-sm">{mood.label}</span>
          </button>
        ))}
      </div>

      <div className="max-w-xl mx-auto px-6 pb-10">
        <button
          disabled={!selectedMood}
          onClick={() =>
  navigate("/journal", {
    state: { mood: selectedMood },
  })
}
          className={`w-full py-4 rounded-xl font-semibold flex items-center justify-center gap-2
          ${selectedMood ? "bg-purple-600 text-white" : "bg-gray-300 text-gray-500"}`}
        >
          <HeartIcon className="w-5 h-5" />
          Continue
        </button>
      </div>

      <MusicPlayer isPlaying={isPlaying} onToggle={toggleMusic} />
    </div>
  );
}
