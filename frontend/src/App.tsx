import { useState } from 'react'
import './App.css'
import GameDisplay from "../src/components/gameDisplay";
import { mockGames } from "../../backend/data/mockGames"
import type { Game } from "../src/model/game";

function App() {
  const [games, setGames] = useState<Game[]>(mockGames)

  setGames

  return (
    <>
      <div>
          <h1>GameBoxd</h1>
          {games.map(e => <GameDisplay game={e}/>)}
      </div>
    </>
  )
}

export default App
