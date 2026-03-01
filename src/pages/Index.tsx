import { useState } from "react";
import GameMenu from "@/components/game/GameMenu";
import GameBoard from "@/components/game/GameBoard";

export type GameMode = "pass-and-play" | "offline";

const Index = () => {
  const [gameMode, setGameMode] = useState<GameMode | null>(null);

  if (gameMode) {
    return <GameBoard mode={gameMode} onBack={() => setGameMode(null)} />;
  }

  return <GameMenu onSelectMode={setGameMode} />;
};

export default Index;
