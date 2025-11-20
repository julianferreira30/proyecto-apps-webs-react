import { Box, Button, Divider, Rating } from "@mui/material";
import Avatar from '@mui/material/Avatar';
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { type AppDispatch, type RootState } from "../store";
import { setShow, setShowLoginForm } from "../reducers/userReducer";
import type { GameData } from "../types/games";
import type { Review } from "../types/review";

const Profile = () => {
    // Parámetros y navegación
    const { field } = useParams<{field: string}>()
    const navigate = useNavigate();


    // Store
    const dispatch = useDispatch<AppDispatch>();
    const user = useSelector((state: RootState) => state.user.user);
    const show = useSelector((state: RootState) => state.user.show);
    const loading = useSelector((state: RootState) => state.user.loading);


    // Errores y carga
    if (!user && !loading) {
        dispatch(setShowLoginForm(true));
        return <p className="profile-login-required">Debes iniciar sesión para ver tu perfil.</p>;
    }

    if (loading) {
        dispatch(setShowLoginForm(false));
        return;
    }

    if (!field) {
        return;
    }

    dispatch(setShow(field));

    const isGameData = (element: GameData | Review) => {
        return "image" in element && "name" in element;
    }

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
                        <Button className="profile-set-games">Editar un juego añadido</Button>
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
                        (show?.map((element, index) => {
                            if (isGameData(element)) {
                               return <div className="games-card" key={index} onClick={() => navigate(`/game/${element.id}`)}>
                                    <img src={element.image} alt="No se encontró la imágen" className="games-image"/>
                                    <h2 className="games-name">{element.name.length > 35 ? element.name.slice(0,30).concat("...") : element.name}</h2>
                                </div> 
                            } else {
                                return <div className="game-reviews-review">
                                    <div className="game-reviews-review-header">
                                        <div className="game-reviews-info-user"> 
                                            <Avatar className="game-reviews-profile-image" src={element.author_profile_image} />
                                            <div className="game-reviews-username">
                                                <p className="game-reviews-made-by">Review hecha por</p><h3>{element.author_name}</h3>
                                            </div>
                                        </div>
                                        <Rating className="game-reviews-rating" name="half-rating-read" value={element.rating} precision={0.5} readOnly />
                                    </div>
                                    <div className="game-reviews-content">
                                        {element.content}
                                    </div>
                                </div>
                            }
                        })) : <p className="profile-empty-msg">No hay nada para mostrar</p>
                    }
            </div>
        </div>
    );
};

export default Profile;