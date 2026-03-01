const SNAKES: Record<number, number> = {
  99: 54, 70: 55, 52: 42, 25: 2, 95: 72, 92: 51,
};
const LADDERS: Record<number, number> = {
  6: 25, 11: 40, 46: 90, 60: 85, 17: 69, 71: 92,
};

interface BoardGridProps {
  positions: number[];
  playerColors: string[];
}

const getCellNumber = (row: number, col: number): number => {
  const num = (9 - row) * 10;
  return row % 2 === 1 ? num - col : num - 9 + col;
};

const getCellColor = (num: number): string => {
  if (num === 100) return "hsl(45, 100%, 55%)";
  if (SNAKES[num]) return "hsl(0, 60%, 65%)";
  if (LADDERS[num]) return "hsl(145, 60%, 55%)";
  return (Math.floor((num - 1) / 10) + num) % 2 === 0
    ? "hsl(210, 50%, 55%)"
    : "hsl(199, 60%, 70%)";
};

const BoardGrid = ({ positions, playerColors }: BoardGridProps) => {
  return (
    <div className="w-full aspect-square max-w-[400px] bg-[hsl(210,60%,30%)] rounded-2xl p-1.5 shadow-2xl border-2 border-[hsl(210,50%,50%)]">
      <div className="grid grid-rows-10 w-full h-full gap-[1px]">
        {Array.from({ length: 10 }).map((_, row) => (
          <div key={row} className="grid grid-cols-10 gap-[1px]">
            {Array.from({ length: 10 }).map((_, col) => {
              const num = getCellNumber(row, col);
              const bg = getCellColor(num);
              const hasSnakeHead = SNAKES[num] !== undefined;
              const hasLadderBottom = LADDERS[num] !== undefined;
              const playersHere = positions
                .map((pos, idx) => (pos === num ? idx : -1))
                .filter((x) => x !== -1);

              return (
                <div
                  key={col}
                  className="relative rounded-sm flex flex-col items-center justify-center text-[9px] md:text-xs font-bold transition-all"
                  style={{ background: bg }}
                >
                  <span className="text-white/80 leading-none drop-shadow">{num}</span>
                  {hasSnakeHead && <span className="absolute text-[10px] md:text-sm top-0 right-0">🐍</span>}
                  {hasLadderBottom && <span className="absolute text-[10px] md:text-sm top-0 right-0">🪜</span>}

                  {/* Players */}
                  <div className="absolute bottom-0 left-0 right-0 flex justify-center gap-[1px]">
                    {playersHere.map((pIdx) => (
                      <div
                        key={pIdx}
                        className="w-2.5 h-2.5 md:w-3.5 md:h-3.5 rounded-full border border-white shadow-md bounce-in"
                        style={{ background: playerColors[pIdx] }}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BoardGrid;
