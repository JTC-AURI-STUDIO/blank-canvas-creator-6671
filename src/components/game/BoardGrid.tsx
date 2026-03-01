interface BoardGridProps {
  positions: number[];
  snakes: Record<number, number>;
  ladders: Record<number, number>;
}

const getCellNumber = (row: number, col: number): number => {
  const num = (9 - row) * 10;
  return row % 2 === 1 ? num - col : num - 9 + col;
};

const SNAKE_COLORS: Record<number, string> = {
  98: "#E53E3E", 95: "#38B2AC", 92: "#D53F8C", 83: "#2B6CB0",
  73: "#D53F8C", 69: "#E53E3E", 66: "#ED8936", 49: "#38A169",
  27: "#2B6CB0", 39: "#38A169",
};

const BoardGrid = ({ positions, snakes, ladders }: BoardGridProps) => {
  return (
    <div className="w-full aspect-square max-w-[420px] rounded-lg p-1 shadow-2xl"
      style={{
        background: "linear-gradient(135deg, #D4A574, #C4956A)",
        border: "4px solid #8B7355",
        boxShadow: "inset 0 0 20px rgba(0,0,0,0.2), 0 8px 32px rgba(0,0,0,0.4)",
      }}
    >
      <div className="grid grid-rows-[repeat(10,1fr)] w-full h-full border border-[#8B7355] rounded-sm overflow-hidden relative">
        {/* SVG overlay for snakes and ladders */}
        <svg className="absolute inset-0 w-full h-full z-10 pointer-events-none">
          {/* Ladders */}
          {Object.entries(ladders).map(([from, to]) => {
            const fromNum = parseInt(from);
            const fromPos = getGridPos(fromNum);
            const toPos = getGridPos(to);
            return (
              <g key={`ladder-${from}`}>
                <line x1={`${fromPos.x - 2}%`} y1={`${fromPos.y}%`} x2={`${toPos.x - 2}%`} y2={`${toPos.y}%`}
                  stroke="#5BC0BE" strokeWidth="3" />
                <line x1={`${fromPos.x + 2}%`} y1={`${fromPos.y}%`} x2={`${toPos.x + 2}%`} y2={`${toPos.y}%`}
                  stroke="#5BC0BE" strokeWidth="3" />
                {/* Rungs */}
                {Array.from({ length: 4 }).map((_, i) => {
                  const t = (i + 1) / 5;
                  const rx1 = fromPos.x - 2 + (toPos.x - 2 - (fromPos.x - 2)) * t;
                  const ry1 = fromPos.y + (toPos.y - fromPos.y) * t;
                  const rx2 = fromPos.x + 2 + (toPos.x + 2 - (fromPos.x + 2)) * t;
                  const ry2 = fromPos.y + (toPos.y - fromPos.y) * t;
                  return (
                    <line key={i} x1={`${rx1}%`} y1={`${ry1}%`} x2={`${rx2}%`} y2={`${ry2}%`}
                      stroke="#5BC0BE" strokeWidth="2" />
                  );
                })}
              </g>
            );
          })}
          {/* Snakes */}
          {Object.entries(snakes).map(([from, to]) => {
            const fromNum = parseInt(from);
            const fromPos = getGridPos(fromNum);
            const toPos = getGridPos(to);
            const color = SNAKE_COLORS[fromNum] || "#E53E3E";
            const midX = (fromPos.x + toPos.x) / 2 + (Math.random() > 0.5 ? 8 : -8);
            const midY = (fromPos.y + toPos.y) / 2;
            return (
              <g key={`snake-${from}`}>
                <path
                  d={`M ${fromPos.x} ${fromPos.y} Q ${midX} ${midY} ${toPos.x} ${toPos.y}`}
                  fill="none" stroke={color} strokeWidth="4" strokeLinecap="round"
                  style={{ filter: "drop-shadow(1px 1px 1px rgba(0,0,0,0.3))" }}
                />
                {/* Snake head */}
                <circle cx={`${fromPos.x}`} cy={`${fromPos.y}`} r="4" fill={color} stroke="#333" strokeWidth="0.5" />
                {/* Eyes */}
                <circle cx={`${fromPos.x - 1.2}`} cy={`${fromPos.y - 1.2}`} r="1" fill="yellow" />
                <circle cx={`${fromPos.x + 1.2}`} cy={`${fromPos.y - 1.2}`} r="1" fill="yellow" />
                <circle cx={`${fromPos.x - 1.2}`} cy={`${fromPos.y - 1.2}`} r="0.4" fill="black" />
                <circle cx={`${fromPos.x + 1.2}`} cy={`${fromPos.y - 1.2}`} r="0.4" fill="black" />
              </g>
            );
          })}
        </svg>

        {Array.from({ length: 10 }).map((_, row) => (
          <div key={row} className="grid grid-cols-10">
            {Array.from({ length: 10 }).map((_, col) => {
              const num = getCellNumber(row, col);
              const isLight = (row + col) % 2 === 0;
              const playersHere = positions
                .map((pos, idx) => (pos === num ? idx : -1))
                .filter((x) => x !== -1);

              return (
                <div
                  key={col}
                  className="relative flex flex-col items-center justify-center aspect-square"
                  style={{
                    background: isLight ? "#F5F0E8" : "#D4C5A9",
                  }}
                >
                  <span className="text-[8px] md:text-[10px] font-bold text-[#5C3A1E]/70 leading-none z-20 relative">
                    {num}
                  </span>

                  {/* Players */}
                  <div className="absolute bottom-0.5 left-0 right-0 flex justify-center gap-[2px] z-20">
                    {playersHere.map((pIdx) => (
                      <div
                        key={pIdx}
                        className="w-3 h-4 md:w-4 md:h-5 rounded-t-full shadow-md bounce-in"
                        style={{
                          background: pIdx === 0
                            ? "linear-gradient(to bottom, #F6E05E, #D69E2E)"
                            : "linear-gradient(to bottom, #63B3ED, #3182CE)",
                          border: "1px solid rgba(0,0,0,0.2)",
                        }}
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

function getGridPos(num: number): { x: number; y: number } {
  const row = 9 - Math.floor((num - 1) / 10);
  const colInRow = (num - 1) % 10;
  const col = (9 - row) % 2 === 1 ? 9 - colInRow : colInRow;
  return {
    x: col * 10 + 5,
    y: row * 10 + 5,
  };
}

export default BoardGrid;
