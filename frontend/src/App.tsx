import { useState, useEffect } from "react";
import "./App.css";
import Games from "./components/games";
import { Header } from "./components/Header";
import type { GameData } from "../src/types/games";
import gamesService from "./services/games";
import loginService from "./services/login"
import type { User } from "./types/users";
import { Route, Routes, useNavigate } from "react-router-dom";
import Register from "./components/register";
import GameFilters, { type FilterState } from "./components/gameFilter";
import GameDetails from "./components/gameDetails";
import Profile from "./components/profile";
import AddGame from "./components/addGame";

function App() {
  const [games, setGames] = useState<GameData[]>([]);
  const [filteredGames, setFilteredGames] = useState<GameData[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [filters, setFilters] = useState<FilterState>({
    year: null,
    genre: null,
    platform: null,
    rating: null,
  })
  const [showLoginForm, setShowLoginForm] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    gamesService.getAllGames()
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

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters)
    const newFiltered = games.filter((game) =>
    (newFilters.year === null || game.release_year === newFilters.year) &&
    (newFilters.genre === null || game.genre.includes(newFilters.genre)) &&
    (newFilters.platform === null || game.creator.includes(newFilters.platform)) &&
    (newFilters.rating === null || game.rating === newFilters.rating)
    );
    setFilteredGames(newFiltered);
  };

  const addGameToState = (newGame: GameData) => {
    const updatedGames = [...games, newGame];
    setGames(updatedGames);
    const newFiltered = updatedGames.filter((game) =>
    (filters.year === null || game.release_year === filters.year) &&
    (filters.genre === null || game.genre.includes(filters.genre)) &&
    (filters.platform === null || game.creator.includes(filters.platform)) &&
    (filters.rating === null || game.rating === filters.rating)
    );
    setFilteredGames(newFiltered);
  }

  const years = Array.from(new Set(games.map((g) => g.release_year))).sort((a,b) => b-a);
  const genres = Array.from(new Set(games.flatMap(g => g.genre)));
  const platforms = Array.from(new Set(games.flatMap(g => g.creator || [])));
  const ratings = Array.from(new Set(games.map(g => g.rating)));

  return (
    <>
      <div>
        <Header title="GameBoxd" user={user} onLogout={handleLogout} onLogin={handleLogin} showLoginForm={showLoginForm} setShowLoginForm={setShowLoginForm}/>
        <div>
          <Routes>
            <Route path="/" element={
              <>
              {games.length > 0 && <div style={{paddingTop:"100px"}}><GameFilters years={years} genres={genres} platforms={platforms} ratings={ratings} filters={filters} onFilterChange={handleFilterChange} /></div>}
              <div style={{ marginTop:"50px", display: "flex", gap: "20px",justifyContent: "center",alignItems: "center", flexWrap:"wrap"}}>
                {filteredGames.length === 0 ? <p style={{marginTop:"190px"}}>No hay juegos para mostrar</p> : (filteredGames.map((game, index) => (
                  <Games
                    key={index}
                    game={game}
                    onClick={() => navigate(`/game/${game.id}`)}
                  />
                )))}
              </div>
              </>
            }/>
            <Route path="/game/:id" element={<GameDetails games={games} user={user} fromProfile={false} setUser={setUser} openLogin={() => setShowLoginForm(true)}/>}/>
            <Route path="/perfil/game/:id" element={<GameDetails games={games} user={user} fromProfile={true} setUser={setUser} openLogin={() => setShowLoginForm(true)}/>}/>
            <Route path="/register" element={<Register onLogin={handleLogin}/>} />
            <Route path="/perfil" element={<Profile user={user} openLogin={() => setShowLoginForm(true)}/>} />
            <Route path="/add-game" element={<AddGame user={user} addGameToState={addGameToState} openLogin={() => setShowLoginForm(true)}/>} />
          </Routes>
        </div>
      </div>
    </>
  );
}

export default App;
