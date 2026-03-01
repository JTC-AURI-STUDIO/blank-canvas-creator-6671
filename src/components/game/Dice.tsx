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
      className={`w-14 h-14 md:w-16 md:h-16 bg-white rounded-xl shadow-xl border-2 border-[#8B7355] flex items-center justify-center cursor-pointer transition-all hover:scale-110 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${
        isRolling ? "dice-rolling" : ""
      }`}
    >
      {value && !isRolling ? (
        <div className="grid grid-rows-3 grid-cols-3 w-9 h-9 md:w-10 md:h-10">
          {Array.from({ length: 3 }).map((_, r) =>
            Array.from({ length: 3 }).map((_, c) => {
              const hasDot = dots.some(([dr, dc]) => dr === r && dc === c);
              return (
                <div key={`${r}-${c}`} className="flex items-center justify-center">
                  {hasDot && (
                    <div className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full bg-[#E53E3E] shadow-sm" />
                  )}
                </div>
              );
            })
          )}
        </div>
      ) : (
        <span className="text-xl">🎲</span>
      )}
    </button>
  );
};

export default Dice;
