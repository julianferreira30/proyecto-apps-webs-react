import { Box, Button, Divider, Rating } from "@mui/material";
import Avatar from '@mui/material/Avatar';
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { type AppDispatch, type RootState } from "../store";
import { restoreSession, setShow, setShowLoginForm, setShowSelectSetGame } from "../reducers/userReducer";
import type { GameData } from "../types/games";
import type { Review } from "../types/review";
import BlindIcon from '@mui/icons-material/Blind';
import { useEffect } from "react";
import { getGames } from "../reducers/gameReducer";
import LoginIcon from '@mui/icons-material/Login';
import SelectSetGame from "../components/SelectSetGame";


const Profile = () => {
    // Parámetros y navegación
    const { field } = useParams<{field: string}>()
    const navigate = useNavigate();


    // Store
    const dispatch = useDispatch<AppDispatch>();
    const user = useSelector((state: RootState) => state.user.user);
    const show = useSelector((state: RootState) => state.user.show);
    const loading = useSelector((state: RootState) => state.user.loading);
    const games = useSelector((state: RootState) => state.games.games);
    const showSelectSetGame = useSelector((state: RootState) => state.user.showSelectSetGame);


    // Errores y carga
    useEffect(() => {
        dispatch(getGames());
        dispatch(restoreSession());
    }, []);
    useEffect(() => {
        if (field) {
            dispatch(setShow(field));
        }
    }, [field, user]);
    if (!user && !loading) {
        dispatch(setShowLoginForm(true));
        return <div>
                <p style={{marginTop:"10vw"}}>Debes Iniciar sesión para poder ver tu perfil</p>
                <LoginIcon />
            </div>;
    }

    if (loading) {
        dispatch(setShowLoginForm(false));
        return;
    }

    if (!field) {
        return;
    }

    const isGameData = (element: GameData | Review) => {
        return "image" in element && "name" in element;
    }
    const getGame = (id: string) =>  games?.find((g) => g.id === id);

    return (
        <div className="profile-container">
            <div className="profile-wrapper">
                <div className="profile-header">
                    <div className="profile-header-left">
                        <Avatar
                            alt="Remy Sharp"
                            src={user?.profile_image}
                            className="profile-image"
                        />
                        <div className="profile-name">
                            <h2>{user?.username}</h2>
                            <p>{user?.name}</p>
                        </div>
                        <Button className="profile-set-games" onClick={() => dispatch(setShowSelectSetGame(true))}>Editar un juego que añadí</Button>
                    </div>
                    <Box className="profile-header-right">
                        <div>
                            <p className="profile-header-resume">{user?.played.length}</p>
                            <p className="profile-header-resume">Jugados</p>
                        </div>
                        <Divider orientation="vertical" variant="middle" flexItem className="profile-header-divider"/>
                        <div>
                            <p className="profile-header-resume">{user?.reviews.length}</p>
                            <p className="profile-header-resume">Reviews</p>
                        </div>
                    </Box>
                </div>

                <div className="profile-sections">
                    <div className="profile-sections-container">
                        <Button 
                            className={`profile-sections-button ${field === "played" && "selected"}`}
                            onClick={() => navigate("/profile/played")}
                        >
                            Jugados
                        </Button>
                        <Button 
                            className={`profile-sections-button ${field === "favorites" && "selected"}`}
                            onClick={() => navigate("/profile/favorites")}
                        >
                            Favoritos
                        </Button>
                        <Button 
                            className={`profile-sections-button ${field === "wishlist" && "selected"}`}
                            onClick={() => navigate("/profile/wishlist")}
                        >
                            Wishlist
                        </Button>
                        <Button 
                            className={`profile-sections-button ${field === "reviews" && "selected"}`}
                            onClick={() => navigate("/profile/reviews")}
                        >
                            Reviews
                        </Button>
                    </div>
                </div>

                    { show?.length !== 0 ?
                        <div className="games-container">
                        {show?.map((element, index) => {
                            if (isGameData(element)) {
                                return <div className="games-card" key={index} onClick={() => navigate(`/game/${element.id}`)}>
                                    <img src={element.image} alt="No se encontró la imágen" className="games-image"/>
                                    <h2 className="games-name">{element.name.length > 35 ? element.name.slice(0,30).concat("...") : element.name}</h2>
                                </div> 
                            } else {
                                console.log("Buscando juego con id:", element.game);
                                console.log("Resultado:", getGame(element.game));
                                console.log("Reviews:", show);
                                return <div key={index} className="profile-reviews">
                                    <div>
                                        <img
                                        src={getGame(element.game)?.image}
                                        alt="No se encontró la imágen"
                                        className="profile-reviews-game-image"
                                        />
                                    </div>
                                    <div className="profile-reviews-right">
                                        <div className="profile-reviews-game">
                                            <h2>{getGame(element.game)?.name}</h2>
                                            <p>{getGame(element.game)?.release_year}</p>
                                        </div>
                                        <div className="profile-reviews-rating">
                                            <p>Calificación</p>
                                            <Rating className="profile-reviews-stars" name="half-rating-read" value={element.rating} precision={0.5} readOnly />
                                        </div>
                                        <div className="profile-reviews-content">
                                            {element.content}
                                        </div>
                                    </div>
                                </div>
                            }
                        })}
                        </div> : <div>
                            <p className="games-no">No hay nada para mostrar</p>
                            <BlindIcon className="games-no-sad"/>
                            </div>
                    }
            </div>
            {showSelectSetGame && (
                <div className="game-details-overlay">
                    <SelectSetGame />
                </div>
            )}
        </div>
    );
};

export default Profile;