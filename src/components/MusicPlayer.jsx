import { useRef, useState } from "react";

export default function MusicPlayer() {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);

  const toggle = () => {
    if (!playing) audioRef.current.play();
    else audioRef.current.pause();
    setPlaying(!playing);
  };

  return (
    <>
      <audio ref={audioRef} src="/music/calm.mp3" loop></audio>

      <button
        onClick={toggle}
        className="fixed bottom-6 right-6 z-20 w-12 h-12 bg-white shadow-md rounded-full flex items-center justify-center text-xl"
      >
        {playing ? "⏸️" : "🔊"}
      </button>
    </>
  );
}
