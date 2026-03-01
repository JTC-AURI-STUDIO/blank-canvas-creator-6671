import { useState, useEffect, useCallback } from "react";
import { ArrowLeft, RotateCcw } from "lucide-react";
import type { GameMode } from "@/pages/Index";
import Dice from "./Dice";
import BoardGrid from "./BoardGrid";

interface GameBoardProps {
  mode: GameMode;
  onBack: () => void;
}

// Snakes: head -> tail (go down)
const SNAKES: Record<number, number> = {
  99: 54,
  70: 55,
  52: 42,
  25: 2,
  95: 72,
  92: 51,
};

// Ladders: bottom -> top (go up)
const LADDERS: Record<number, number> = {
  6: 25,
  11: 40,
  46: 90,
  60: 85,
  17: 69,
  71: 92,
};

const GameBoard = ({ mode, onBack }: GameBoardProps) => {
  const [positions, setPositions] = useState([0, 0]); // 0 = not on board yet
  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [diceValue, setDiceValue] = useState<number | null>(null);
  const [isRolling, setIsRolling] = useState(false);
  const [winner, setWinner] = useState<number | null>(null);
  const [message, setMessage] = useState("🎲 Jogador 1, lance o dado!");
  const isSolo = mode === "offline";
  const isVsCpu = mode === "vs-computer";

  const playerNames = isSolo ? ["Você"] : ["Jogador 1", isVsCpu ? "CPU" : "Jogador 2"];
  const playerColors = ["hsl(145, 70%, 50%)", "hsl(0, 70%, 55%)"];
  const playerEmojis = ["🟢", "🔴"];

  const movePlayer = useCallback((player: number, steps: number) => {
    setPositions(prev => {
      const current = prev[player];
      let next = current + steps;

      if (next > 100) return prev; // can't go past 100

      const newPositions = [...prev];
      newPositions[player] = next;

      // Check for win
      if (next === 100) {
        setTimeout(() => setWinner(player), 500);
        return newPositions;
      }

      // Check snakes and ladders after a delay
      setTimeout(() => {
        if (SNAKES[next]) {
          setMessage(`🐍 ${playerNames[player]} caiu na cobra! De ${next} para ${SNAKES[next]}`);
          setPositions(p => {
            const np = [...p];
            np[player] = SNAKES[next];
            return np;
          });
        } else if (LADDERS[next]) {
          setMessage(`🪜 ${playerNames[player]} subiu na escada! De ${next} para ${LADDERS[next]}`);
          setPositions(p => {
            const np = [...p];
            np[player] = LADDERS[next];
            return np;
          });
        }
      }, 600);

      return newPositions;
    });
  }, [playerNames]);

  const rollDice = useCallback(() => {
    if (isRolling || winner !== null) return;

    setIsRolling(true);
    const value = Math.floor(Math.random() * 6) + 1;

    setTimeout(() => {
      setDiceValue(value);
      setIsRolling(false);
      movePlayer(currentPlayer, value);

      const nextPlayer = isSolo ? 0 : (currentPlayer === 0 ? 1 : 0);

      setTimeout(() => {
        if (winner !== null) return;
        setCurrentPlayer(nextPlayer);
        setMessage(`🎲 ${playerNames[nextPlayer]}, lance o dado!`);
      }, 1200);
    }, 500);
  }, [isRolling, winner, currentPlayer, isSolo, movePlayer, playerNames]);

  // CPU auto-roll
  useEffect(() => {
    if (isVsCpu && currentPlayer === 1 && !isRolling && winner === null) {
      const timer = setTimeout(() => rollDice(), 1500);
      return () => clearTimeout(timer);
    }
  }, [currentPlayer, isVsCpu, isRolling, winner, rollDice]);

  const resetGame = () => {
    setPositions([0, 0]);
    setCurrentPlayer(0);
    setDiceValue(null);
    setWinner(null);
    setMessage("🎲 Jogador 1, lance o dado!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[hsl(199,80%,60%)] via-[hsl(199,80%,50%)] to-[hsl(210,70%,40%)] flex flex-col items-center p-2 md:p-4 relative overflow-hidden">
      {/* Header */}
      <div className="w-full max-w-lg flex items-center justify-between mb-2">
        <button onClick={onBack} className="w-10 h-10 rounded-xl bg-[hsl(210,60%,35%)] border-2 border-[hsl(210,50%,50%)] flex items-center justify-center text-white hover:scale-110 transition-transform">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h2 className="text-white font-extrabold text-lg drop-shadow-lg">🐍 Snake Board</h2>
        <button onClick={resetGame} className="w-10 h-10 rounded-xl bg-[hsl(210,60%,35%)] border-2 border-[hsl(210,50%,50%)] flex items-center justify-center text-white hover:scale-110 transition-transform">
          <RotateCcw className="w-5 h-5" />
        </button>
      </div>

      {/* Player info */}
      <div className="w-full max-w-lg flex justify-between mb-2 px-2">
        {playerNames.map((name, i) => (
          <div
            key={i}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-white font-bold text-sm transition-all ${
              currentPlayer === i ? "scale-110 pulse-glow" : "opacity-70"
            }`}
            style={{ background: playerColors[i] }}
          >
            {playerEmojis[i]} {name}: {positions[i]}
          </div>
        ))}
      </div>

      {/* Message */}
      <div className="w-full max-w-lg text-center mb-2">
        <p className="text-white font-bold text-sm drop-shadow-lg bg-[hsl(210,60%,30%/0.7)] rounded-xl py-1.5 px-3">
          {winner !== null ? `🏆 ${playerNames[winner]} venceu!` : message}
        </p>
      </div>

      {/* Board */}
      <div className="w-full max-w-lg flex-1 flex flex-col items-center">
        <BoardGrid positions={positions} playerColors={playerColors} />
      </div>

      {/* Dice area */}
      <div className="w-full max-w-lg flex flex-col items-center gap-2 mt-2 pb-4">
        <Dice
          value={diceValue}
          isRolling={isRolling}
          onRoll={rollDice}
          disabled={isRolling || winner !== null || (isVsCpu && currentPlayer === 1)}
        />
        {winner !== null && (
          <button
            onClick={resetGame}
            className="bg-gradient-to-r from-[hsl(45,100%,55%)] to-[hsl(35,100%,50%)] text-[hsl(30,80%,20%)] font-extrabold text-lg py-3 px-8 rounded-2xl shadow-lg border-2 border-[hsl(35,80%,40%)] hover:scale-105 active:scale-95 transition-all bounce-in"
          >
            🔄 Jogar Novamente
          </button>
        )}
      </div>
    </div>
  );
};

export default GameBoard;
