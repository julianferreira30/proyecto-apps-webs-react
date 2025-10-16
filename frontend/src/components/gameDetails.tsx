import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { GameData } from "../types/games";
import type { User } from "../types/users";
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import FavoriteIcon from '@mui/icons-material/Favorite';
import CreateIcon from '@mui/icons-material/Create';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import userService from "../services/users";

interface GameDetailsProps {
  games: GameData[];
  user: User | null;
  setUser: (u: User) => void;
}

const GameDetails = ({ games, user, setUser }: GameDetailsProps) => {
  const { id } = useParams<{id: string}>();
  const navigate = useNavigate();

  const game = games.find((g) => g.id.toString() == id);

  if (!game) {
    return <p>Juego no encontrado</p>
  }

  const genreLabel = game.genre.length > 1 ? "Géneros" : "Género";
  const formattedGenres = game.genre.join(", ");

  const [isFavourite, setIsFavourite] = useState(false);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setIsFavourite(user.favourites.some((g) => g.id === game.id));
      setIsInWishlist(user.wishlist.some((g) => g.id === game.id));
    }
  }, [user, game.id])

  const toggleFavourite = async () => {
    if (!user){
      return;
    }
    setLoading(true);
    let updatedFavourites;
    if (isFavourite) {
      updatedFavourites = await userService.removeFromFavorites(game.id);
    } else {
      updatedFavourites = await userService.addToFavorites(game.id);
    }
    setUser({...user, favourites: updatedFavourites});
    setIsFavourite(!isFavourite);
    setLoading(false)
  }

  const toggleWishlist = async () => {
    if (!user){
      return;
    }
    setLoading(true)
    let updatedWishlist;
    if (isInWishlist) {
      updatedWishlist = await userService.removeFromWishlist(game.id)
    } else {
      updatedWishlist = await userService.addToWishlist(game.id)
    }
    setUser({...user, wishlist: updatedWishlist});
    setIsFavourite(!isInWishlist);
    setLoading(false);
  }

  return (
    <>
        <div style={{ textAlign: "right", marginTop: "80px" }}>
        <Button
          onClick={() => navigate("/")}
          variant="outlined"
          sx={{
            color: "white",
            border:"none",
            backgroundColor: "black"
          }}
        >
          Volver a la lista
        </Button>
      </div>
      <div className="card-details"
        style={{
          display: "flex",
          marginTop: "20px",
          justifyContent: "center",
          height: "400px",
          width: "1000px",
          padding: "20px",
        }}
      >
        <div style={{ flexShrink: 0 }}>
          <img
            src={game.image}
            alt={game.name}
            style={{ width: "264px", height: "352px", objectFit: "cover" }}
          />
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            padding: "0 30px",
            flexGrow: 1,
            alignItems: "flex-start",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: "10px",
              marginBottom: "10px",
            }}
          >
            <h1
              style={{
                margin: 0,
                fontSize: "2rem",
                fontWeight: 600,
              }}
            >
              {game.name}
            </h1>
            <p
              style={{
                margin: 0,
                fontSize: "1.2rem",
                color: "#ccc",
              }}
            >
              {game.release_year}
            </p>
          </div>

          <p style={{ margin: "5px 0" }}>Creador: {game.creator}</p>
          <p style={{ margin: "5px 0" }}>
            {genreLabel}: {formattedGenres}
          </p>
          <p style={{ margin: "5px 0" }}>Calificación: {game.rating}</p>
          <p style={{ margin: "5px 0", textAlign:"left"}}>{game.description}</p>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            padding: "20px",
            flexDirection: "column",
            alignItems: "flex-start",
          }}
        >
          { user && <ButtonGroup
            orientation="vertical"
            variant="contained"
            aria-label="Vertical button group"
            sx={{
              backgroundColor: "rgba(114, 114, 114, 1)",
              '& .MuiButton-root': {
                fontSize: "1rem",
                padding: "10px 20px",
                color: "white",
                borderColor:"white",
              },
              '& .MuiButton-root:hover': {
                backgroundColor: "rgba(90, 90, 90, 1)",
              },
            }}
          >
            <Button sx={{backgroundColor:"black"}} onClick={toggleFavourite} disabled={loading}>
              Favorito <FavoriteIcon fontSize="small" sx={{ ml: 2, color: isFavourite ? "red" : "white" }} />
            </Button>
            <Button sx={{backgroundColor:"black"}} onClick={toggleWishlist} disabled={loading}>
              Wishlist <BookmarkIcon fontSize="small" sx={{ ml: 2, color: isInWishlist ? "yellow" : "white" }} />
            </Button>
            <Button sx={{backgroundColor:"black"}}>
              Review <CreateIcon fontSize="small" sx={{ ml: 2 }} />
            </Button>
          </ButtonGroup>}
        </div>
      </div>
    </>
  );
};

export default GameDetails;