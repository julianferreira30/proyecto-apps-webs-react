import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import type { AppDispatch, RootState } from "../store"; 
import { getOneGame } from "../reducers/gameReducer";
import { restoreSession } from "../reducers/userReducer";
import { Rating, Avatar } from '@mui/material';


/**
 * Componente que permite ver las reviews hechas a un videojuego seleccionado por el usuario.
 * 
 * @component
 * @remarks
 * - Las reviews pueden ser vistas por todos los usuarios logueados y no logueados.
 * - Solo los usuarios logueados pueden dar like a otras reviews.
 * 
 * @returns Lista con todas las reviews dadas de los distintos usuarios sobre el juego.
 */
const GameReviews = () => {
    // Store
    const { id } = useParams<{id: string}>();
    const dispatch = useDispatch<AppDispatch>();
    const game = useSelector((state: RootState) => state.games.selectedGame);
    const loadingUser = useSelector((state: RootState) => state.user.loading);
    const loadingGame = useSelector((state: RootState) => state.games.loading);

    // Carga de recursos
    useEffect(() => {
        dispatch(getOneGame(id!));
        dispatch(restoreSession());
        
    }, []);

    if (loadingGame || loadingUser) {
        return;
    };

    if (!game) {
        return;
    };

    return (
        <div className="game-reviews">
            <div className="game-reviews-container">
                {game.reviews.length > 0 ? (game.reviews.map((r) => (
                <div className="game-reviews-review">
                    <div className="game-reviews-review-header">
                        <div className="game-reviews-info-user"> 
                            <Avatar className="game-reviews-profile-image" src={r.author_profile_image} />
                            <div className="game-reviews-username">
                                <p className="game-reviews-made-by">Review hecha por</p><h3>{r.author_name}</h3>
                            </div>
                        </div>
                        <Rating className="game-reviews-rating" name="half-rating-read" value={r.rating} precision={0.5} readOnly />
                    </div>
                    <div className="game-reviews-content">
                        {r.content}
                    </div>
                </div>
                ))) : (
                    <p className="game-reviews-no-reviews">Ningún usuario ha hecho una review del juego</p>
                )}
            </div>
        </div>
    )
}

export default GameReviews;