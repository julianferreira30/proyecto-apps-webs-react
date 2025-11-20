import "./App.css";
import { Header } from "./components/Header";
import { Route, Routes } from "react-router-dom";
import GameDetails from "./pages/GameDetails";
import Profile from "./pages/Profile";
import AddGame from "./pages/AddGame";
import Review from "./pages/AddReview";
import GameReviews from "./components/GameReviews";
import Root from "./pages/Root";
import Register from "./pages/register";


function App() {
  return (
    <>
      <div>
        <Header />
        <div id="container">
          <Routes>
            <Route path="/" element={<Root />}/>
            <Route path="/game/:id" element={<div id="game-details"><GameDetails /> <GameReviews /></div>}/>
            <Route path="/game/review/:id" element={<Review />}/>
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/add-game" element={<AddGame />} />
          </Routes>
        </div>
      </div>
    </>
  );
}

export default App;