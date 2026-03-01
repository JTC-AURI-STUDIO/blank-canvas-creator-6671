interface DiceProps {
  value: number | null;
  isRolling: boolean;
  onRoll: () => void;
  disabled: boolean;
}

const diceFaces: Record<number, number[][]> = {
  1: [[1, 1]],
  2: [[0, 0], [2, 2]],
  3: [[0, 2], [1, 1], [2, 0]],
  4: [[0, 0], [0, 2], [2, 0], [2, 2]],
  5: [[0, 0], [0, 2], [1, 1], [2, 0], [2, 2]],
  6: [[0, 0], [0, 2], [1, 0], [1, 2], [2, 0], [2, 2]],
};

const Dice = ({ value, isRolling, onRoll, disabled }: DiceProps) => {
  const dots = value ? diceFaces[value] : [];

  return (
    <button
      onClick={onRoll}
      disabled={disabled}
      className={`w-16 h-16 md:w-20 md:h-20 bg-white rounded-2xl shadow-2xl border-2 border-[hsl(210,30%,80%)] flex items-center justify-center relative cursor-pointer transition-all hover:scale-110 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${
        isRolling ? "dice-rolling" : ""
      }`}
    >
      <div className="grid grid-rows-3 grid-cols-3 w-10 h-10 md:w-12 md:h-12">
        {Array.from({ length: 3 }).map((_, r) =>
          Array.from({ length: 3 }).map((_, c) => {
            const hasDot = dots.some(([dr, dc]) => dr === r && dc === c);
            return (
              <div key={`${r}-${c}`} className="flex items-center justify-center">
                {hasDot && (
                  <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-[hsl(210,60%,25%)] shadow-sm" />
                )}
              </div>
            );
          })
        )}
      </div>
      {!value && !isRolling && (
        <span className="absolute text-2xl">🎲</span>
      )}
    </button>
  );
};

export default Dice;
