import { useState } from "react";
import "./App.css";
import GameDisplay from "../src/components/gameDisplay";
import { mockGames } from "../../backend/data/mockGames";
// import type { Game } from "../src/model/game";

function App() {
  // const [games, setGames] = useState<Game[]>(mockGames);
  const [selectedGameIndex, setSelectedGameIndex] = useState<number | null>(
    null
  );
  const selectedGame =
    selectedGameIndex !== null ? mockGames[selectedGameIndex] : null;
  // setGames;

  return (
    <>
      <div>
        <h1>GameBoxd</h1>
        {!selectedGame ? (
          <div>
            {mockGames.map((game, index) => (
              <GameDisplay
                key={index}
                game={game}
                onClick={() => setSelectedGameIndex(index)}
              />
            ))}
          </div>
        ) : (
          <div>
            <GameDisplay game={selectedGame} detailed />
            <button onClick={() => setSelectedGameIndex(null)}>
              Volver a la lista
            </button>
          </div>
        )}
      </div>
    </>
  );
}

export default App;
