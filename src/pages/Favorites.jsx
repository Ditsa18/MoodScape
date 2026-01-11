import { useEffect, useState, useRef } from "react";
import FloatingBubbles from "../components/FloatingBubbles";
import MusicPlayer from "../components/MusicPlayer";
import logo from "/logo.png";
import { 
  TrashIcon, 
  BookOpenIcon, 
  SparklesIcon, 
  FunnelIcon, 
  ChevronDownIcon,
  MusicalNoteIcon,
  VideoCameraIcon
} from "@heroicons/react/24/solid";

import { auth, db } from "../firebase";
import {
  collection,
  query,
  where,
  onSnapshot,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

export default function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [selectedMood, setSelectedMood] = useState("All");
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const moodOptions = [
    "All", "happy", "sad", "neutral", "anxious", "tired", 
    "calm", "grateful", "excited", "stressed", "lonely", 
    "confident", "overwhelmed", "focused"
  ];

  // Close custom dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    let unsubscribeFirestore = null;

    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (!user) {
        setFavorites([]);
        return;
      }

      // Query without orderBy to prevent the index error
      const q = query(
        collection(db, "favorites"),
        where("userId", "==", user.uid)
      );

      unsubscribeFirestore = onSnapshot(q, (snapshot) => {
        const data = snapshot.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }));

        // Manual sort by date (newest first)
        const sortedData = data.sort((a, b) => {
          const timeA = a.createdAt?.seconds || 0;
          const timeB = b.createdAt?.seconds || 0;
          return timeB - timeA;
        });

        setFavorites(sortedData);
      });
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeFirestore) unsubscribeFirestore();
    };
  }, []);

  const removeFavorite = async (id) => {
    try {
      await deleteDoc(doc(db, "favorites", id));
    } catch (err) {
      console.error("Error removing favorite:", err);
    }
  };

  const filteredByMood = selectedMood === "All" 
    ? favorites 
    : favorites.filter(f => f.mood?.toLowerCase() === selectedMood.toLowerCase());

  const songs = filteredByMood.filter((f) => f.type === "song");
  const movies = filteredByMood.filter((f) => f.type === "movie");
  const books = filteredByMood.filter((f) => f.type === "book");

  return (
    // Updated background to match Stats page
    <div className="relative min-h-screen bg-gradient-to-br from-purple-50 to-purple-200 overflow-hidden font-sans">
      {/* Watermark Logo matching Stats page */}
      <img
        src={logo}
        alt="bg"
        className="absolute inset-0 w-full h-full object-contain opacity-10 blur-lg pointer-events-none"
      />

      <FloatingBubbles />

      <div className="relative z-10 max-w-6xl mx-auto pt-24 px-6 pb-20">
        <div className="flex flex-col md:flex-row items-center justify-between mb-16 gap-8 text-center md:text-left">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 tracking-tight">
              My Treasures 💖
            </h1>
            <p className="text-gray-500 mt-2 font-medium">Your handpicked mood-boosters.</p>
          </div>

          {/* --- CUSTOM DROPDOWN --- */}
          <div className="relative w-full max-w-[280px]" ref={dropdownRef}>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center justify-between w-full bg-white/70 backdrop-blur-xl border border-white/50 text-gray-800 py-3.5 px-6 rounded-2xl shadow-sm hover:bg-white transition-all font-bold text-base capitalize group"
            >
              <div className="flex items-center gap-3">
                <FunnelIcon className="w-5 h-5 text-purple-600 group-hover:scale-110 transition-transform" />
                <span>{selectedMood === "All" ? "Filter Mood" : selectedMood}</span>
              </div>
              <ChevronDownIcon className={`w-5 h-5 text-purple-400 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
            </button>

            {isOpen && (
              <div className="absolute mt-2 w-full bg-white/90 backdrop-blur-2xl border border-white/50 rounded-2xl shadow-xl z-50 py-2 overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="max-h-[300px] overflow-y-auto no-scrollbar">
                  {moodOptions.map((mood) => (
                    <button
                      key={mood}
                      onClick={() => {
                        setSelectedMood(mood);
                        setIsOpen(false);
                      }}
                      className={`w-full text-left px-6 py-3 text-sm font-bold capitalize transition-all duration-200
                        ${selectedMood === mood 
                          ? "bg-purple-500 text-white" 
                          : "text-gray-600 hover:bg-purple-50 hover:text-purple-700 hover:pl-9"}
                      `}
                    >
                      {mood}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {filteredByMood.length === 0 ? (
          <div className="text-center py-32 bg-white/50 rounded-3xl backdrop-blur-xl border border-white/50 shadow-sm">
            <SparklesIcon className="w-16 h-16 mx-auto text-purple-200 mb-6" />
            <h3 className="text-xl font-bold text-gray-400 italic">No items for this mood yet.</h3>
          </div>
        ) : (
          <div className="space-y-24">
            {/* 📚 Books */}
            {books.length > 0 && (
              <section>
                <SectionHeader title="Books" icon={<BookOpenIcon className="w-6 h-6 text-blue-500" />} />
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {books.map((book) => (
                    <FavoriteCard key={book.id} item={book} onRemove={removeFavorite} />
                  ))}
                </div>
              </section>
            )}

            {/* 🎧 Songs */}
            {songs.length > 0 && (
              <section>
                <SectionHeader title="Songs" icon={<MusicalNoteIcon className="w-6 h-6 text-pink-500" />} />
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {songs.map((song) => (
                    <FavoriteCard key={song.id} item={song} onRemove={removeFavorite} />
                  ))}
                </div>
              </section>
            )}

            {/* 🎬 Movies */}
            {movies.length > 0 && (
              <section>
                <SectionHeader title="Movies" icon={<VideoCameraIcon className="w-6 h-6 text-purple-500" />} />
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {movies.map((movie) => (
                    <FavoriteCard key={movie.id} item={movie} onRemove={removeFavorite} />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </div>
      <MusicPlayer />
    </div>
  );
}

function SectionHeader({ title, icon }) {
  return (
    <h2 className="text-2xl font-bold mb-8 flex items-center gap-3 text-gray-800 px-2">
      <div className="p-2 bg-white/50 rounded-xl shadow-sm">{icon}</div> 
      {title}
    </h2>
  );
}

function FavoriteCard({ item, onRemove }) {
  return (
    <div className="bg-white/70 backdrop-blur-xl p-6 rounded-2xl shadow-sm border border-white/50 hover:shadow-md hover:-translate-y-1 transition-all duration-300 group relative">
      <div className="flex justify-between items-center mb-4">
        <span className="px-3 py-1 bg-purple-50 text-purple-600 rounded-lg text-[10px] font-bold uppercase tracking-widest border border-purple-100">
          {item.mood || "general"}
        </span>
      </div>

      <a
        href={item.link}
        target="_blank"
        rel="noreferrer"
        className="text-xl font-bold block mb-6 text-gray-800 leading-tight group-hover:text-purple-600 transition-colors"
      >
        {item.title}
      </a>

      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <button
          onClick={() => onRemove(item.id)}
          className="flex items-center gap-2 text-red-400 hover:text-red-600 text-[11px] font-bold transition-all"
        >
          <TrashIcon className="w-4 h-4" />
          REMOVE
        </button>
      </div>
    </div>
  );
}