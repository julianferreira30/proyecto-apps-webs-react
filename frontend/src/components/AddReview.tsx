import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../store";
import { createNewReview, setError, setShowReviewForm } from "../reducers/reviewReducer";
import { restoreSession, setShowLoginForm } from "../reducers/userReducer";
import { validateInputString } from "../utils/validations";
import { Rating, TextField, IconButton, Fade, Button } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";



const AddReview = () => {
    // Store
    const dispatch = useDispatch<AppDispatch>();
    const game = useSelector((state: RootState) => state.games.selectedGame);
    const loadingGame = useSelector((state: RootState) => state.games.loading);
    const user = useSelector((state: RootState) => state.user.user);
    const loadingUser = useSelector((state: RootState) => state.user.loading);
    const error = useSelector((state: RootState) => state.reviews.error);

    // Estados locales
    const [rating, setRating] = useState(0);
    const [content, setContent] = useState("");


    // Errores y carga
    if (loadingGame || loadingUser) {
        return;
    };
    if (!game) {
        return <div className="add-review-container"><p style={{marginTop:"100px"}}>No es posible hacer una review a un juego inexistente</p></div>;
    };
    if (!user) {
        dispatch(setShowLoginForm(true));
        return <div className="add-review-container"><p style={{marginTop:"100px"}}>No es posible hacer una review sin un usuario</p></div>;
    };

    const contentError = content.length > 1000;


    // Submit review
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        dispatch(setError(null));
        if (!validateInputString(content, 1, 1000)) {
            dispatch(setError("Error en el contenido"));
            setTimeout(() => {
                dispatch(setError(null));
            }, 3000);
            return;
        }
        await dispatch(createNewReview({rating, content, game: game.id}));
        dispatch(restoreSession());
        dispatch(setShowReviewForm(false))
    }

    return (
        <div className="add-review-container">
            <form onSubmit={handleSubmit} className="add-review-form">
                <div className="add-review-header">
                    <div className="add-review-header-content">
                        <h3 className="add-review-header-text">Yo jugué...</h3>
                        <IconButton onClick={() => dispatch(setShowReviewForm(false))} size="small" className="add-review-header-close"><CloseIcon className="add-review-close"/></IconButton>
                    </div>
                </div>
                <div className="add-review-content">
                    <div className="add-review-image-container">
                        <img src={game.image} 
                            alt={"No es posible procesar la imágen"}
                            className="add-review-image">
                        </img>
                    </div>
                    <div className="add-review-details">
                        <div className="add-review-game">
                            <h2 className="add-review-game-name">{game.name.length > 25 ? game.name.slice(0,25).concat("...") : game.name}</h2> 
                            <p className="add-review-game-year">{game.release_year}</p>
                        </div>
                        <div className="add-review-rating">
                            <p className="add-review-rating-p">Calificación</p>
                            <Rating name="half-rating"
                                className="add-review-rating-r"
                                value={rating} 
                                onChange={(_, newValue) => setRating(newValue ?? 0)}
                                defaultValue={0} 
                                precision={0.5} />
                        </div>
                        <div className="add-review-comment">
                            <TextField
                                label="Añade un comentario..."
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                multiline
                                required
                                rows={8}
                                variant="filled"
                            />
                        </div>
                        {contentError && (
                            <Fade in={!!contentError} timeout={1000}>
                                <span className="add-review-error">
                                El comentario debe tener menos de 1000 caracteres
                                </span>
                            </Fade>
                        )}
                        {error && <span className="add-review-error">
                            {error}
                        </span>}
                    </div>
                </div>
                <div className="add-review-submit-container">
                    <Button className="add-review-submit" type="submit" variant="contained">Guardar</Button>
                </div>
            </form>
        </div>
    )
};

export default AddReview;