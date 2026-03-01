import { Users, Smartphone } from "lucide-react";
import type { GameMode } from "@/pages/Index";

interface GameMenuProps {
  onSelectMode: (mode: GameMode) => void;
}

const GameMenu = ({ onSelectMode }: GameMenuProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[hsl(199,80%,60%)] via-[hsl(199,80%,50%)] to-[hsl(210,70%,40%)] flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background rays */}
      <div className="absolute inset-0 opacity-10">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="absolute top-1/2 left-1/2 w-[200%] h-1"
            style={{
              background: "linear-gradient(90deg, transparent, white, transparent)",
              transform: `rotate(${i * 30}deg)`,
              transformOrigin: "0% 50%",
            }}
          />
        ))}
      </div>

      {/* Title */}
      <div className="relative z-10 mb-12">
        <div className="bg-gradient-to-b from-[hsl(210,60%,35%)] to-[hsl(210,70%,25%)] rounded-2xl p-6 shadow-2xl border-2 border-[hsl(210,50%,50%)]">
          <h1 className="text-5xl md:text-6xl font-extrabold text-center leading-tight">
            <span className="bg-gradient-to-b from-[hsl(45,100%,70%)] to-[hsl(35,100%,50%)] bg-clip-text text-transparent drop-shadow-lg"
              style={{ WebkitTextStroke: "1px hsl(30, 80%, 40%)" }}>
              🐍 Snake
            </span>
            <br />
            <span className="bg-gradient-to-b from-[hsl(45,100%,70%)] to-[hsl(35,100%,50%)] bg-clip-text text-transparent drop-shadow-lg"
              style={{ WebkitTextStroke: "1px hsl(30, 80%, 40%)" }}>
              Board
            </span>
          </h1>
        </div>
      </div>

      {/* Menu buttons */}
      <div className="relative z-10 w-full max-w-sm space-y-4">
        <button
          onClick={() => onSelectMode("offline")}
          className="w-full bg-gradient-to-r from-[hsl(199,70%,50%)] to-[hsl(199,70%,40%)] hover:from-[hsl(199,70%,55%)] hover:to-[hsl(199,70%,45%)] text-white font-bold text-xl py-5 px-6 rounded-2xl shadow-lg border-2 border-[hsl(199,60%,35%)] transition-all hover:scale-105 active:scale-95 flex items-center justify-between"
        >
          <span>🎲 Jogar Offline</span>
          <Smartphone className="w-8 h-8" />
        </button>

        <button
          onClick={() => onSelectMode("pass-and-play")}
          className="w-full bg-gradient-to-r from-[hsl(280,60%,50%)] to-[hsl(300,60%,55%)] hover:from-[hsl(280,60%,55%)] hover:to-[hsl(300,60%,60%)] text-white font-bold text-xl py-5 px-6 rounded-2xl shadow-lg border-2 border-[hsl(280,50%,40%)] transition-all hover:scale-105 active:scale-95 flex items-center justify-between"
        >
          <span>👥 Jogar com Amigo</span>
          <Users className="w-8 h-8" />
        </button>
      </div>
    </div>
  );
};

export default GameMenu;
