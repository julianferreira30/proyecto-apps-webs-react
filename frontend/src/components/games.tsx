import type { GameData } from "../types/games";

interface GamesProps {
  game?: GameData;
  onClick?: () => void;
}

const Games = ({ game, onClick }: GamesProps) => {
  if (!game) {
    return;
  }
  return (
    <div className="card" onClick={onClick}>
      <p style={{margin:"10px"}}><img src={game.image} style={{maxWidth: "264px", maxHeight: "352px"}}/></p>
      <h2 style={{margin:"0px"}}>{game.name}</h2>
      <p style={{margin:"10px"}}>{game.creator}</p>
    </div>
  );
};

export default Games;
