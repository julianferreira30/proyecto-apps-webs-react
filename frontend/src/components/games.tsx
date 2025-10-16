import type { GameData } from "../types/games";

interface GamesProps {
  game: GameData;
  onClick?: () => void;
}

const Games = ({ game, onClick }: GamesProps) => {
  return (
    <div className="card" onClick={onClick}>
      <p><img src={game.image} style={{maxWidth: "264px", maxHeight: "352px"}}/></p>
      <p>Nombre: {game.name}</p>
      <p>Autor: {game.creator}</p>
    </div>
  );
};

export default Games;
