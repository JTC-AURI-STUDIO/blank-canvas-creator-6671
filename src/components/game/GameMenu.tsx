import { Users, Monitor, Smartphone } from "lucide-react";
import type { GameMode } from "@/pages/Index";

interface GameMenuProps {
  onSelectMode: (mode: GameMode) => void;
}

const GameMenu = ({ onSelectMode }: GameMenuProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[hsl(199,80%,60%)] via-[hsl(199,80%,50%)] to-[hsl(210,70%,40%)] flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background rays effect */}
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

      {/* Guest user */}
      <div className="absolute top-4 left-4 flex items-center gap-2">
        <div className="w-12 h-12 rounded-full bg-[hsl(145,70%,40%)] border-2 border-[hsl(145,70%,30%)] flex items-center justify-center shadow-lg">
          <Users className="w-6 h-6 text-white" />
        </div>
        <span className="text-white font-bold text-sm drop-shadow-lg">Jogador</span>
      </div>

      {/* Title */}
      <div className="relative z-10 mb-8">
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
        {/* Pass & Play */}
        <button
          onClick={() => onSelectMode("pass-and-play")}
          className="w-full bg-gradient-to-r from-[hsl(280,60%,50%)] to-[hsl(300,60%,55%)] hover:from-[hsl(280,60%,55%)] hover:to-[hsl(300,60%,60%)] text-white font-bold text-xl py-5 px-6 rounded-2xl shadow-lg border-2 border-[hsl(280,50%,40%)] transition-all hover:scale-105 active:scale-95 flex items-center justify-between"
        >
          <span>🎲 Jogar a Dois</span>
          <Users className="w-8 h-8" />
        </button>

        <div className="grid grid-cols-2 gap-4">
          {/* Play Offline */}
          <button
            onClick={() => onSelectMode("offline")}
            className="bg-gradient-to-br from-[hsl(199,70%,60%)] to-[hsl(199,70%,45%)] hover:from-[hsl(199,70%,65%)] hover:to-[hsl(199,70%,50%)] text-white font-bold text-lg py-5 px-4 rounded-2xl shadow-lg border-2 border-[hsl(199,60%,40%)] transition-all hover:scale-105 active:scale-95 flex flex-col items-center gap-2"
          >
            <Smartphone className="w-8 h-8" />
            <span>Solo</span>
          </button>

          {/* Vs Computer */}
          <button
            onClick={() => onSelectMode("vs-computer")}
            className="bg-gradient-to-br from-[hsl(320,70%,55%)] to-[hsl(330,70%,45%)] hover:from-[hsl(320,70%,60%)] hover:to-[hsl(330,70%,50%)] text-white font-bold text-lg py-5 px-4 rounded-2xl shadow-lg border-2 border-[hsl(330,60%,40%)] transition-all hover:scale-105 active:scale-95 flex flex-col items-center gap-2"
          >
            <Monitor className="w-8 h-8" />
            <span>Vs CPU</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameMenu;
