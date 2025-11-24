import { useSelector } from "react-redux";
import type { RootState } from "../store"; 
import { useNavigate } from "react-router-dom";
import BlindIcon from '@mui/icons-material/Blind';



const Games = () => {
  // Navegación
  const navigate = useNavigate();


  // Store
  const filteredGames = useSelector((state: RootState) => state.games.filteredGames);
  const loading = useSelector((state: RootState) => state.games.loading);
  
  return (
    <div className="games">
      <div className={filteredGames.length === 0 ? "no-container" : "games-container"}>
        {filteredGames.length === 0 && !loading ? 
        <div>
          <p className="games-no">No hay juegos para mostrar</p>
          <BlindIcon className="games-no-sad"/>
        </div> : 
        (filteredGames.map((game, index) => (
          <div className="games-card" key={index} onClick={() => navigate(`/game/${game.id}`)}>
            <img src={game.image} alt="No se encontró la imágen" className="games-image"/>
            <h2 className="games-name">{game.name.length > 35 ? game.name.slice(0,30).concat("...") : game.name}</h2>
          </div>
        )))}
      </div>
    </div>
  );
};

export default Games;