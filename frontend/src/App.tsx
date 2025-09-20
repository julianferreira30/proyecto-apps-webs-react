import { useState, useEffect } from "react";
import "./App.css";
import GameDisplay from "../src/components/gameDisplay";
import { Header } from "./components/Header";
import type { Game } from "../src/model/game";
import getAllGames from "./services/games";

function App() {
  const [games, setGames] = useState<Game[]>([]);
  const [selectedGameIndex, setSelectedGameIndex] = useState<number | null>(
    null
  );

  useEffect(() => {
    getAllGames()
    .then((data) => {
      setGames(data)
    })
    .catch((error) => {console.error("Error al obtener los juegos:", error)})
  })

  const selectedGame =
    selectedGameIndex !== null ? games[selectedGameIndex] : null;

  return (
    <>
      <div>
        <Header title="GameBoxd" />
        {!selectedGame ? (
          <div style={{ marginTop: "80px" }}>
            {games.map((game, index) => (
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
