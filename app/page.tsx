"use client";

import { useRef, useState, useCallback } from "react";
import DomeGallery from "./DomeGallery";

function playHeartbeatSound() {
  try {
    const ctx = new AudioContext();

    const playBeat = (time: number, freq: number, duration: number, gain: number) => {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, time);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.5, time + duration);
      g.gain.setValueAtTime(gain, time);
      g.gain.exponentialRampToValueAtTime(0.001, time + duration);
      osc.connect(g);
      g.connect(ctx.destination);
      osc.start(time);
      osc.stop(time + duration);
    };

    const now = ctx.currentTime;
    // First beat (lub)
    playBeat(now, 80, 0.15, 0.4);
    playBeat(now, 40, 0.2, 0.3);
    // Second beat (dub) — slightly delayed
    playBeat(now + 0.22, 70, 0.12, 0.3);
    playBeat(now + 0.22, 35, 0.18, 0.25);
    // Third gentler beat
    playBeat(now + 0.7, 60, 0.1, 0.2);
    playBeat(now + 0.7, 30, 0.15, 0.15);

    setTimeout(() => ctx.close(), 2000);
  } catch {
    // audio not supported — fail silently
  }
}

export default function Home() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isFramed, setIsFramed] = useState(false);

  const handleHeartClick = useCallback(() => {
    const video = videoRef.current;
    if (!video || isFramed) return;

    // Unmute & play audio
    video.muted = false;
    video.play().catch(() => { });

    // Play heartbeat effect
    playHeartbeatSound();

    // Transition heart → frame
    setIsFramed(true);
  }, [isFramed]);

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Video Hero */}
      <section className="relative w-full h-screen overflow-hidden">
        <video
          ref={videoRef}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${isFramed ? "opacity-100" : "opacity-0"
            }`}
          src="/video.mp4"
          autoPlay
          muted
          playsInline
          loop
        />

        {/* Dark gradient overlay */}
        <div
          className={`absolute inset-0 bg-linear-to-b from-black/10 via-transparent to-[#0a0a0a] transition-opacity duration-1000 ${isFramed ? "opacity-0" : "opacity-100"
            }`}
        />

        {/* Flexbox Overlay for Perfect Centering */}
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center pointer-events-none">
          {/* Heart Container - mb-48 shifts it upwards from center */}
          <div className="pointer-events-auto mb-48 relative">
            <button
              onClick={handleHeartClick}
              disabled={isFramed}
              className={`outline-none transition-all duration-1000 ease-in-out ${isFramed ? "scale-[3] cursor-default" : "scale-100 cursor-pointer"
                }`}
              style={{
                background: "none",
                border: "none",
                padding: 0,
              }}
              aria-label="Play video with sound"
            >
              {/* Box for pulse animation (only active when not framed) */}
              <div className={`${!isFramed ? "heart-pulse" : ""}`}>
                <svg
                  width="140"
                  height="140"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="transition-all duration-1000 ease-in-out"
                  style={{
                    filter: isFramed ? "drop-shadow(0 0 5px rgba(255,45,85,0.8))" : "none",
                  }}
                >
                  <defs>
                    <radialGradient id="heartGrad" cx="50%" cy="40%" r="60%">
                      <stop offset="0%" stopColor="#ff6b8a" />
                      <stop offset="100%" stopColor="#ff2d55" />
                    </radialGradient>
                  </defs>
                  <path
                    d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 
                       2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09
                       C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5
                       c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                    className="transition-all duration-1000 ease-in-out"
                    fill={isFramed ? "transparent" : "url(#heartGrad)"}
                    fillOpacity={isFramed ? 0 : 1}
                    stroke={isFramed ? "#ff2d55" : "none"}
                    strokeWidth={isFramed ? 1.5 : 0}
                    strokeOpacity={isFramed ? 1 : 0}
                  />
                </svg>
              </div>

              {/* Tap hint */}
              {!isFramed && (
                <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs text-white/60 whitespace-nowrap opacity-80 animate-pulse">
                  TIKLA
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Bottom text - Always visible now */}
        <div className="absolute bottom-16 left-0 right-0 z-30 text-center px-6">
          <p className="shimmer-text text-3xl font-bold text-amber-50 tracking-widest">
            MINIK KELEBEGIMMM
          </p>
        </div>
      </section>

      {/* Photo Gallery */}
      <section className="relative w-full h-screen">
        <DomeGallery
          fit={1}
          minRadius={600}
          maxVerticalRotationDeg={20}
          segments={24}
          dragDampening={5}
        />
      </section>
    </div>
  );
}
