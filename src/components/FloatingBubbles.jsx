import React from "react";

const emojis = ["😊", "✨", "🌙", "💜", "🎶", "🫧", "🌿", "💗", "🌧"];

export default function FloatingBubbles() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
      {[...Array(28)].map((_, index) => {
        const size = Math.random() * 50 + 20;
        const hasEmoji = Math.random() > 0.65;

        return (
          <span
            key={index}
            className="absolute animate-bubble rounded-full flex items-center justify-center"
            style={{
              width: size,
              height: size,
              left: `${Math.random() * 100}%`,
              top: `calc(100% + ${Math.random() * 80}px)`,
              animationDelay: `${index * 0.6}s`,
              animationDuration: `${Math.random() * 8 + 10}s`,
              background: hasEmoji ? "rgba(255,255,255,0.18)" : "rgba(255,255,255,0.35)",
              borderRadius: "50%",
              border: hasEmoji ? "none" : "1px solid rgba(255,255,255,0.4)",
              filter: "blur(0.5px)",
              fontSize: hasEmoji ? `${size * 0.45}px` : 0,
            }}
          >
            {hasEmoji ? emojis[Math.floor(Math.random() * emojis.length)] : ""}
          </span>
        );
      })}
    </div>
  );
}
