interface BoardGridProps {
  positions: number[];
  snakes: Record<number, number>;
  ladders: Record<number, number>;
}

const getCellNumber = (row: number, col: number): number => {
  const num = (9 - row) * 10;
  return row % 2 === 1 ? num - col : num - 9 + col;
};

// Snake colors - vibrant and distinct
const SNAKE_STYLES: Record<number, { color: string; spotColor: string }> = {
  98: { color: "#22C55E", spotColor: "#16A34A" },
  95: { color: "#3B82F6", spotColor: "#2563EB" },
  92: { color: "#EC4899", spotColor: "#DB2777" },
  83: { color: "#F97316", spotColor: "#EA580C" },
  73: { color: "#EF4444", spotColor: "#DC2626" },
  69: { color: "#8B5CF6", spotColor: "#7C3AED" },
  66: { color: "#F59E0B", spotColor: "#D97706" },
  49: { color: "#14B8A6", spotColor: "#0D9488" },
  27: { color: "#EF4444", spotColor: "#DC2626" },
  39: { color: "#EC4899", spotColor: "#DB2777" },
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

// Generate a smooth curvy path between two points
function generateSnakePath(from: { x: number; y: number }, to: { x: number; y: number }, seed: number): string {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const dist = Math.sqrt(dx * dx + dy * dy);
  const curves = Math.max(2, Math.floor(dist / 15));
  
  let path = `M ${from.x} ${from.y}`;
  const amplitude = 6 + (seed % 4);
  
  for (let i = 0; i < curves; i++) {
    const t1 = (i + 0.5) / curves;
    const t2 = (i + 1) / curves;
    const mx = from.x + dx * t1;
    const my = from.y + dy * t1;
    const ex = from.x + dx * t2;
    const ey = from.y + dy * t2;
    const sign = i % 2 === 0 ? 1 : -1;
    // perpendicular offset
    const perpX = -dy / dist * amplitude * sign;
    const perpY = dx / dist * amplitude * sign;
    path += ` Q ${mx + perpX} ${my + perpY} ${ex} ${ey}`;
  }
  
  return path;
}

function generateLadderPoints(from: { x: number; y: number }, to: { x: number; y: number }) {
  const offset = 2;
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const dist = Math.sqrt(dx * dx + dy * dy);
  const perpX = (-dy / dist) * offset;
  const perpY = (dx / dist) * offset;
  
  const left1 = { x: from.x + perpX, y: from.y + perpY };
  const left2 = { x: to.x + perpX, y: to.y + perpY };
  const right1 = { x: from.x - perpX, y: from.y - perpY };
  const right2 = { x: to.x - perpX, y: to.y - perpY };
  
  const rungs = [];
  const rungCount = Math.max(3, Math.floor(dist / 8));
  for (let i = 1; i < rungCount; i++) {
    const t = i / rungCount;
    rungs.push({
      x1: left1.x + (left2.x - left1.x) * t,
      y1: left1.y + (left2.y - left1.y) * t,
      x2: right1.x + (right2.x - right1.x) * t,
      y2: right1.y + (right2.y - right1.y) * t,
    });
  }
  
  return { left1, left2, right1, right2, rungs };
}

const BoardGrid = ({ positions, snakes, ladders }: BoardGridProps) => {
  return (
    <div
      className="w-full aspect-square max-w-[430px] rounded-xl shadow-2xl overflow-hidden"
      style={{
        background: "#C4956A",
        border: "5px solid #8B6F47",
        boxShadow: "0 0 0 2px #6B5230, 0 8px 32px rgba(0,0,0,0.5), inset 0 2px 4px rgba(255,255,255,0.1)",
      }}
    >
      <div className="relative w-full h-full">
        {/* Grid cells */}
        <div className="grid grid-rows-[repeat(10,1fr)] w-full h-full">
          {Array.from({ length: 10 }).map((_, row) => (
            <div key={row} className="grid grid-cols-10">
              {Array.from({ length: 10 }).map((_, col) => {
                const num = getCellNumber(row, col);
                const isLight = (row + col) % 2 === 0;
                const isSnakeHead = snakes[num] !== undefined;
                const isSnakeTail = Object.values(snakes).includes(num);
                const isLadderBottom = ladders[num] !== undefined;
                const isLadderTop = Object.values(ladders).includes(num);
                const playersHere = positions
                  .map((pos, idx) => (pos === num ? idx : -1))
                  .filter((x) => x !== -1);

                let cellBg = isLight ? "#F7F0E3" : "#D9C9AA";
                if (num === 100) cellBg = "#FFD700";
                if (num === 1) cellBg = "#E8F5E9";

                return (
                  <div
                    key={col}
                    className="relative flex items-center justify-center"
                    style={{
                      background: cellBg,
                      borderRight: col < 9 ? "0.5px solid rgba(139,111,71,0.15)" : "none",
                      borderBottom: row < 9 ? "0.5px solid rgba(139,111,71,0.15)" : "none",
                    }}
                  >
                    {/* Cell number */}
                    <span
                      className="absolute top-[1px] left-[2px] font-extrabold leading-none select-none"
                      style={{
                        fontSize: "clamp(7px, 2.2vw, 11px)",
                        color: num === 100 ? "#7B6100" : "#8B6F47",
                        opacity: 0.8,
                      }}
                    >
                      {num}
                    </span>

                    {/* Snake/Ladder indicators */}
                    {isSnakeHead && (
                      <span className="absolute bottom-[1px] right-[1px] text-[clamp(8px,2.5vw,14px)] leading-none select-none">🐍</span>
                    )}
                    {isLadderBottom && (
                      <span className="absolute bottom-[1px] right-[1px] text-[clamp(8px,2.5vw,14px)] leading-none select-none">🪜</span>
                    )}

                    {/* Players */}
                    {playersHere.length > 0 && (
                      <div className="absolute inset-0 flex items-center justify-center gap-[1px] z-30">
                        {playersHere.map((pIdx) => (
                          <div
                            key={pIdx}
                            className="bounce-in"
                            style={{
                              width: "clamp(10px, 3vw, 18px)",
                              height: "clamp(14px, 4vw, 24px)",
                              borderRadius: "50% 50% 30% 30%",
                              background: pIdx === 0
                                ? "radial-gradient(circle at 40% 30%, #FDE68A, #D97706)"
                                : "radial-gradient(circle at 40% 30%, #93C5FD, #2563EB)",
                              border: "1.5px solid rgba(0,0,0,0.25)",
                              boxShadow: "0 2px 4px rgba(0,0,0,0.3), inset 0 1px 2px rgba(255,255,255,0.4)",
                            }}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {/* SVG overlay for snakes and ladders */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          style={{ zIndex: 15 }}
        >
          <defs>
            <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0.3" dy="0.3" stdDeviation="0.4" floodOpacity="0.35" />
            </filter>
          </defs>

          {/* Ladders */}
          {Object.entries(ladders).map(([from, to]) => {
            const fromPos = getGridPos(parseInt(from));
            const toPos = getGridPos(to);
            const lad = generateLadderPoints(fromPos, toPos);
            return (
              <g key={`ladder-${from}`} filter="url(#shadow)">
                {/* Side rails */}
                <line x1={lad.left1.x} y1={lad.left1.y} x2={lad.left2.x} y2={lad.left2.y}
                  stroke="#4DC9C2" strokeWidth="1.2" strokeLinecap="round" />
                <line x1={lad.right1.x} y1={lad.right1.y} x2={lad.right2.x} y2={lad.right2.y}
                  stroke="#4DC9C2" strokeWidth="1.2" strokeLinecap="round" />
                {/* Rungs */}
                {lad.rungs.map((r, i) => (
                  <line key={i} x1={r.x1} y1={r.y1} x2={r.x2} y2={r.y2}
                    stroke="#3DB8B0" strokeWidth="0.8" strokeLinecap="round" />
                ))}
                {/* Highlights on rails */}
                <line x1={lad.left1.x + 0.3} y1={lad.left1.y} x2={lad.left2.x + 0.3} y2={lad.left2.y}
                  stroke="rgba(255,255,255,0.3)" strokeWidth="0.4" />
                <line x1={lad.right1.x + 0.3} y1={lad.right1.y} x2={lad.right2.x + 0.3} y2={lad.right2.y}
                  stroke="rgba(255,255,255,0.3)" strokeWidth="0.4" />
              </g>
            );
          })}

          {/* Snakes */}
          {Object.entries(snakes).map(([from, to], idx) => {
            const fromNum = parseInt(from);
            const fromPos = getGridPos(fromNum);
            const toPos = getGridPos(to);
            const style = SNAKE_STYLES[fromNum] || { color: "#EF4444", spotColor: "#DC2626" };
            const snakePath = generateSnakePath(fromPos, toPos, fromNum);

            return (
              <g key={`snake-${from}`} filter="url(#shadow)">
                {/* Snake body - thicker outline */}
                <path d={snakePath} fill="none" stroke="rgba(0,0,0,0.2)" strokeWidth="3" strokeLinecap="round" />
                {/* Snake body - main */}
                <path d={snakePath} fill="none" stroke={style.color} strokeWidth="2.2" strokeLinecap="round" />
                {/* Snake body - highlight */}
                <path d={snakePath} fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="0.8" strokeLinecap="round"
                  strokeDasharray="2 3" />
                {/* Spots along body */}
                {Array.from({ length: 5 }).map((_, i) => {
                  const t = (i + 1) / 6;
                  const sx = fromPos.x + (toPos.x - fromPos.x) * t + Math.sin(i * 2) * 1.5;
                  const sy = fromPos.y + (toPos.y - fromPos.y) * t + Math.cos(i * 2) * 1.5;
                  return (
                    <circle key={i} cx={sx} cy={sy} r="0.6" fill={style.spotColor} opacity="0.6" />
                  );
                })}
                {/* Snake head */}
                <ellipse cx={fromPos.x} cy={fromPos.y} rx="2" ry="1.8" fill={style.color}
                  stroke="rgba(0,0,0,0.3)" strokeWidth="0.3" />
                {/* Eyes */}
                <circle cx={fromPos.x - 0.8} cy={fromPos.y - 0.6} r="0.6" fill="#FEFCE8" />
                <circle cx={fromPos.x + 0.8} cy={fromPos.y - 0.6} r="0.6" fill="#FEFCE8" />
                <circle cx={fromPos.x - 0.8} cy={fromPos.y - 0.6} r="0.25" fill="#1a1a1a" />
                <circle cx={fromPos.x + 0.8} cy={fromPos.y - 0.6} r="0.25" fill="#1a1a1a" />
                {/* Tongue */}
                <path d={`M ${fromPos.x} ${fromPos.y + 1.5} l -0.5 1 M ${fromPos.x} ${fromPos.y + 1.5} l 0.5 1`}
                  stroke="#EF4444" strokeWidth="0.25" fill="none" />
                {/* Tail */}
                <circle cx={toPos.x} cy={toPos.y} r="0.8" fill={style.color} opacity="0.7" />
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
};

export default BoardGrid;
