import { useState, useCallback } from "react";
import { ArrowLeft } from "lucide-react";
import type { GameMode } from "@/pages/Index";
import Dice from "./Dice";
import BoardGrid from "./BoardGrid";

interface GameBoardProps {
  mode: GameMode;
  onBack: () => void;
}

const SNAKES: Record<number, number> = {
  98: 40, 95: 56, 92: 70, 83: 58, 73: 15, 69: 47, 66: 45, 49: 30, 27: 7, 39: 22,
};

const LADDERS: Record<number, number> = {
  4: 25, 13: 28, 21: 81, 33: 53, 44: 65, 52: 72, 63: 84, 76: 96,
};

const GameBoard = ({ mode, onBack }: GameBoardProps) => {
  const [positions, setPositions] = useState([0, 0]);
  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [diceValue, setDiceValue] = useState<number | null>(null);
  const [isRolling, setIsRolling] = useState(false);
  const [winner, setWinner] = useState<number | null>(null);
  const [message, setMessage] = useState("Player 1, lance o dado!");
  const isSolo = mode === "offline";

  const playerNames = isSolo ? ["Player 1", "Player 2"] : ["Player 1", "Player 2"];

  const movePlayer = useCallback((player: number, steps: number) => {
    setPositions(prev => {
      const current = prev[player];
      let next = current + steps;
      if (next > 100) return prev;

      const newPositions = [...prev];
      newPositions[player] = next;

      if (next === 100) {
        setTimeout(() => setWinner(player), 500);
        return newPositions;
      }

      setTimeout(() => {
        if (SNAKES[next]) {
          setMessage(`🐍 ${playerNames[player]} caiu na cobra! ${next} → ${SNAKES[next]}`);
          setPositions(p => { const np = [...p]; np[player] = SNAKES[next]; return np; });
        } else if (LADDERS[next]) {
          setMessage(`🪜 ${playerNames[player]} subiu na escada! ${next} → ${LADDERS[next]}`);
          setPositions(p => { const np = [...p]; np[player] = LADDERS[next]; return np; });
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

      const nextPlayer = currentPlayer === 0 ? 1 : 0;
      setTimeout(() => {
        if (winner !== null) return;
        setCurrentPlayer(nextPlayer);
        setMessage(`${playerNames[nextPlayer]}, lance o dado!`);
      }, 1200);
    }, 500);
  }, [isRolling, winner, currentPlayer, movePlayer, playerNames]);

  const resetGame = () => {
    setPositions([0, 0]);
    setCurrentPlayer(0);
    setDiceValue(null);
    setWinner(null);
    setMessage("Player 1, lance o dado!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#8B5E3C] to-[#6B4226] flex flex-col items-center relative">
      {/* Header */}
      <div className="w-full flex items-center px-4 py-3 bg-gradient-to-b from-[#5C3A1E] to-[#7A4F30] border-b-2 border-[#4A2E14]">
        <button onClick={onBack} className="w-12 h-12 rounded-full bg-[hsl(220,60%,45%)] border-3 border-[hsl(45,100%,55%)] flex items-center justify-center text-white hover:scale-110 transition-transform shadow-lg">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div className="flex-1 flex justify-center">
          <div className="bg-[#5C3A1E] px-8 py-2 rounded-full border-2 border-[#8B7355]">
            <span className="text-white font-extrabold text-lg">
              {mode === "offline" ? "Offline Mode" : "Pass & Play"}
            </span>
          </div>
        </div>
        <div className="w-12" />
      </div>

      {/* Message */}
      <div className="w-full text-center py-2 bg-[#7A4F30]/80">
        <p className="text-white font-bold text-sm drop-shadow-lg">
          {winner !== null ? `🏆 ${playerNames[winner]} venceu!` : message}
        </p>
      </div>

      {/* Board */}
      <div className="flex-1 flex items-center justify-center p-3 w-full">
        <BoardGrid positions={positions} snakes={SNAKES} ladders={LADDERS} />
      </div>

      {/* Bottom area - Players & Dice */}
      <div className="w-full bg-gradient-to-b from-[#6B4226] to-[#5C3A1E] px-4 py-3 border-t-2 border-[#8B7355]">
        <div className="flex items-center justify-between max-w-lg mx-auto">
          {/* Player 1 */}
          <div className="flex items-center gap-2">
            {currentPlayer === 0 && (
              <Dice value={diceValue} isRolling={isRolling} onRoll={rollDice} disabled={isRolling || winner !== null} />
            )}
            <div className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm transition-all ${
              currentPlayer === 0 ? "bg-[hsl(170,60%,35%)] text-white scale-105 shadow-lg" : "bg-[hsl(170,30%,25%)] text-white/60"
            }`}>
              <div className="w-6 h-6 rounded-full bg-[hsl(45,100%,55%)] flex items-center justify-center text-[10px]">👤</div>
              Player 1
            </div>
          </div>

          {/* Player 2 */}
          <div className="flex items-center gap-2">
            <div className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm transition-all ${
              currentPlayer === 1 ? "bg-[hsl(170,60%,35%)] text-white scale-105 shadow-lg" : "bg-[hsl(170,30%,25%)] text-white/60"
            }`}>
              <div className="w-6 h-6 rounded-full bg-[hsl(200,70%,50%)] flex items-center justify-center text-[10px]">👤</div>
              Player 2
            </div>
            {currentPlayer === 1 && (
              <Dice value={diceValue} isRolling={isRolling} onRoll={rollDice} disabled={isRolling || winner !== null} />
            )}
          </div>
        </div>

        {winner !== null && (
          <div className="flex justify-center mt-3">
            <button
              onClick={resetGame}
              className="bg-gradient-to-r from-[hsl(45,100%,55%)] to-[hsl(35,100%,50%)] text-[hsl(30,80%,20%)] font-extrabold text-lg py-3 px-8 rounded-2xl shadow-lg border-2 border-[hsl(35,80%,40%)] hover:scale-105 active:scale-95 transition-all bounce-in"
            >
              🔄 Jogar Novamente
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default GameBoard;
