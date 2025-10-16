import { useState, useEffect } from "react";
import "./App.css";
import GameDisplay from "../src/components/gameDisplay";
import { Header } from "./components/Header";
import type { GameData } from "../src/types/games";
import getAllGames from "./services/games";
import loginService from "./services/login"
import type { User } from "./types/users";
import { Route, Routes } from "react-router-dom";
import Register from "./components/register";
import GameFilters, { type FilterState } from "./components/gameFilter";

function App() {
  const [games, setGames] = useState<GameData[]>([]);
  const [selectedGameIndex, setSelectedGameIndex] = useState<number | null>(null);
  const [filteredGames, setFilteredGames] = useState<GameData[]>([]);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    getAllGames()
      .then((data) => {
        setGames(data);
        setFilteredGames(data)
      })
      .catch((error) => {
        console.error("Error al obtener los juegos:", error);
      });
  }, []);

  useEffect(() => {
    loginService.restoreLogin().then((u) => {
      setUser(u);
    }).catch((error) => {
      console.error("Error al iniciar sesión", error);
    });
  }, []);

  const handleLogout = async () => {
    await loginService.logout();
    setUser(null);
  };

  const handleLogin = async (userData: User) => {
    setUser(userData)
  }

  const selectedGame = selectedGameIndex !== null ? games[selectedGameIndex] : null;

  const handleFilterChange = (filters: FilterState) => {
    const newFiltered = games.filter(game =>
    (filters.year === null || game.release_year === filters.year) &&
    (filters.genre === null || game.genre.includes(filters.genre)) &&
    (filters.platform === null || game.creator.includes(filters.platform)) &&
    (filters.rating === null || game.rating === filters.rating)
    );
    setFilteredGames(newFiltered);
  };

  const years = Array.from(new Set(games.map((g) => g.release_year))).sort((a,b) => b-a);
  const genres = Array.from(new Set(games.flatMap(g => g.genre)));
  const platforms = Array.from(new Set(games.flatMap(g => g.creator || [])));
  const ratings = Array.from(new Set(games.map(g => g.rating)));

  return (
    <>
      <div>
        <Header title="GameBoxd" user={user} onLogout={handleLogout} onLogin={handleLogin} />
        <div>
          <Routes>
            <Route path="/" element={
              !selectedGame ? (
                <>
                <GameFilters years={years} genres={genres} platforms={platforms} ratings={ratings} onFilterChange={handleFilterChange} />
                <div className="games-container" style={{ marginTop: "50px" }}>
                  {filteredGames.map((game, index) => (
                    <GameDisplay
                      key={index}
                      game={game}
                      onClick={() => setSelectedGameIndex(index)}
                    />
                  ))}
                </div>
                </>
              ) : (
                <div>
                  <GameDisplay game={selectedGame} detailed />
                  <button onClick={() => setSelectedGameIndex(null)}>
                    Volver a la lista
                  </button>
                </div>
              )}/>
            <Route path="/register" element={<Register onLogin={handleLogin}/>} />
          </Routes>
        </div>
      </div>
    </>
  );
}

export default App;
