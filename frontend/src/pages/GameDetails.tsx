import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import type { RootState, AppDispatch } from "../store";
import { Button, ButtonGroup, Rating, Chip, Slide } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import CreateIcon from '@mui/icons-material/Create';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import { setError, setShowLoginForm, toggleFavourite, togglePlayed, toggleWishlist } from "../reducers/userReducer";
import { getOneGame } from "../reducers/gameReducer";
import { setShowReviewForm } from "../reducers/reviewReducer";
import Review from "./AddReview";
import GameReviews from "../components/GameReviews";


/**
 * Componente que muestra todos los detalles de un juego y permite agregar estos juegos a jugados, favoritos, wishlist y
 * hacer reviews si un usuario esta logueado.
 * 
 * @component
 * @remarks
 * - Si el usuario no esta logueado solo puede ver los detalles de un juego (titulo, año, creador, género, imagen, descripción,
 * calificación y reviews)
 * - Si el usuario esta logueado puede agregar este juego a jugados, favoritos, wishlist y hacer una review de este.
 * 
 * @returns pantalla de todos los detalles de un juego.
 */
const GameDetails = () => {
  // Store
  const { id } = useParams<{id: string}>();
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(getOneGame(id!));
  }, []);

  const showReviewForm = useSelector((state: RootState) => state.reviews.showReviewForm);
  const game = useSelector((state: RootState) => state.games.selectedGame);
  const user = useSelector((state: RootState) => state.user.user);
  const loadingUser = useSelector((state: RootState) => state.user.loading);
  const loadingGame = useSelector((state: RootState) => state.games.loading);
  const error = useSelector((state: RootState) => state.user.error);

  // Carga y errores
  if (loadingGame || loadingUser) {
    return;
  };

  if (!game) {
    return <p style={{marginTop:"90px"}}>Juego no encontrado</p>
  };

  // Favoritos, jugados y wishlist
  const isInPlayed = user?.played.some((g) => g.id === game.id);
  const isInFavourite = user?.favorites.some((g) => g.id === game.id);
  const isInWishlist = user?.wishlist.some((g) => g.id === game.id);

  const played = (gameId: string) => {
    dispatch(setError(null));
    if (user) {
      dispatch(togglePlayed(gameId, user))
      setTimeout(() => {
        dispatch(setError(null))
      }, 5000)
    }
  }

  return (
    <div className="game-details">
        <div className="game-details-container">
        <Slide in={!!error} timeout={500}>
            <span className="game-details-error">
                {error}
            </span>
        </Slide>
        <div className="game-details-card">
            <div className="game-details-image-container">
            <img
                src={game.image}
                alt="No es posible procesar la imágen"
                className="game-details-image"
            />
            </div>

            <div className="game-details-text-container">
            <div className="game-details-header">
                <h1 className="game-details-name">{game.name}</h1>
                <p className="game-details-year">{game.release_year}</p>
            </div>

            <div className="game-details-description-container">
                <div className="game-details-description-left">
                <h3 className="game-details-creator">{"Creado por ".concat(game.creator)}</h3>
                <p className="game-details-description">{game.description}</p>
                <p className="game-details-genre-text">Géneros</p>
                <hr className="game-details-separation-genre"></hr>
                <div>
                    {game.genre.map((g) => (
                    <Chip
                    key={g}
                    label={g}
                    className="game-details-genre"
                    />
                ))}
                </div>
                </div>

                <div className="game-details-description-right">
                <ButtonGroup
                    orientation="vertical"
                    variant="contained"
                    aria-label="Vertical button group"
                    className="game-details-vertical-buttongroup"
                >
                    <Button
                    className="game-details-rating-button"
                    disabled={true}
                    >
                    <div className="game-details-rating-container">
                        <p className="game-details-rating-label">Calificación</p>
                        <div className="game-details-rating-row">
                        <Rating
                            sx={{fontSize: "2vw"}}
                            name="half-rating-read"
                            value={game.rating}
                            precision={0.5}
                            readOnly
                        />
                        <p className="game-details-rating-text">{game.rating.toFixed(1)}</p>
                        </div>
                    </div>
                    </Button>
                    {user && (<>
                    <Button
                    className="game-details-my-rating-button"
                    disabled={true}
                    >
                    <div className="game-details-my-rating">
                        <p className="game-details-rating-small">Mi calificación</p>
                        <div className="game-details-rating-row">
                        <Rating
                           className="game-details-rating-read"
                            sx={{fontSize: "2vw"}}
                            name="half-rating-read"
                            value={
                            user.reviews.find((r) => r.game === game.id)?.rating
                            }
                            precision={0.5}
                            readOnly
                        />
                        {user.reviews.find((r) => r.game === game.id)?.rating && 
                        <p className="game-details-rating-text">{user.reviews.find((r) => r.game === game.id)?.rating.toFixed(1)}</p>}
                        </div>
                    </div>
                    </Button>

                    <ButtonGroup
                    orientation="horizontal"
                    variant="contained"
                    aria-label="Horizontal button group"
                    className="game-details-horizontal-buttongroup"
                    >
                    <Button
                        className="game-details-played-button"
                        onClick={() => played(game.id)}
                        disabled={loadingUser}
                    >
                        <SportsEsportsIcon
                        sx={{color: isInPlayed ? "#00AC9F" : "white", fontSize: "2vw"}}
                        />
                        <p className={`game-details-icon ${isInPlayed ? "active" : ""}`}>Jugado</p>
                    </Button>

                    <Button
                        className="game-details-favourite-button"
                        onClick={() => dispatch(toggleFavourite(game.id, user))}
                        disabled={loadingUser}
                    >
                        <FavoriteIcon
                        sx={{color: isInFavourite ? "#DF0024" : "white", fontSize: "2vw"}}
                        />
                        <p className={`game-details-icon ${isInFavourite ? "active" : ""}`}>Favorito</p>
                    </Button>

                    <Button
                        className="game-details-wishlist-button"
                        onClick={() => dispatch(toggleWishlist(game.id, user))}
                        disabled={loadingUser}
                    >
                        <BookmarkIcon
                        sx={{color: isInWishlist ? "#F3C300" : "white", fontSize: "2vw"}}
                        />
                        <p className={`game-details-icon ${isInWishlist ? "active" : ""}`}>Wishlist</p>
                    </Button>
                    </ButtonGroup>

                    <Button
                    onClick={() => dispatch(setShowReviewForm(true))}
                    disabled={loadingUser}
                    className="game-details-review-button"
                    >
                    Review <CreateIcon sx={{fontSize: "2vw"}}/>
                    </Button></>)}
                    {!user && (
                    <Button
                        onClick={() => dispatch(setShowLoginForm(true))}
                        disabled={loadingUser}
                        className="game-details-login"
                    >
                        Iniciar sesión
                    </Button>
                    )}
                </ButtonGroup>
                </div>
            </div>
            </div>
        </div>

        <p className="game-details-reviews-text">Reviews</p>
        <hr className="game-details-separation-reviews"></hr>

        {showReviewForm && (
            <div className="game-details-overlay">
            <Review />
            </div>
        )}
        </div>
        <div>
            <GameReviews />
        </div>
    </div>
  );
};

export default GameDetails;