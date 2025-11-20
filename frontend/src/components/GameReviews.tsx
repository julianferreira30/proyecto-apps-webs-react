import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../store"; 
import { restoreSession } from "../reducers/userReducer";
import { Rating, Avatar } from '@mui/material';



const GameReviews = () => {
    // Store
    const dispatch = useDispatch<AppDispatch>();
    const game = useSelector((state: RootState) => state.games.selectedGame);
    const loadingGame = useSelector((state: RootState) => state.games.loading);


    // Carga de recursos
    useEffect(() => {
        dispatch(restoreSession());
        
    }, []);

    if (loadingGame) {
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