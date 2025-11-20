import { useSelector } from "react-redux";
import type { RootState } from "../store"; 
import { useNavigate } from "react-router-dom";
import BlindIcon from '@mui/icons-material/Blind';


/**
 * Componente que permite ver todos los juegos en una lista, ya sea de un usuario o los que se encuentran en la base de datos.
 * @param GameProps - Propiedades de la vista de los juegos.
 * 
 * @component
 * @remarks
 * - Solo un usuario logueado puede cambiar el parametro fromShow a true.
 * 
 * @returns Tablero con cartas de cada juego disponible en la lista de juegos a ver.
 */
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
        (filteredGames.map((game) => (
          <div className="games-card" onClick={() => navigate(`/game/${game.id}`)}>
            <img src={game.image} alt="No es posible procesar la imágen" className="games-image"/>
            <h2 className="games-name">{game.name.length > 35 ? game.name.slice(0,30).concat("...") : game.name}</h2>
          </div>
        )))}
      </div>
    </div>
  );
};

export default Games;