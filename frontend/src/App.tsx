import "./App.css";
import { Header } from "./components/Header";
import { Route, Routes } from "react-router-dom";
import GameDetails from "./pages/GameDetails";
import Profile from "./pages/Profile";
import AddGame from "./pages/AddGame";
import Root from "./pages/Root";
import Register from "./pages/Register";
import SetGame from "./pages/SetGame";


function App() {
  return (
    <>
      <div>
        <Header />
        <div id="container">
          <Routes>
            <Route path="/" element={<Root />}/>
            <Route path="/game/:id" element={<GameDetails />}/>
            <Route path="/register" element={<Register />} />
            <Route path="/profile/:field" element={<Profile />} />
            <Route path="/add-game" element={<AddGame />} />
            <Route path="/set-game/:id" element={<SetGame />} />
          </Routes>
        </div>
      </div>
    </>
  );
}

export default App;