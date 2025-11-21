import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../store";
import { setShowLoginForm, setShowSelectSetGame } from "../reducers/userReducer";
import { IconButton, Box } from "@mui/material";
import BlindIcon from '@mui/icons-material/Blind';
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from "react-router-dom";



const SelectSetGame = () => {
    // Navegación
    const navigate = useNavigate();


    // Store
    const dispatch = useDispatch<AppDispatch>();
    const user = useSelector((state: RootState) => state.user.user);
    const loadingUser = useSelector((state: RootState) => state.user.loading);


    // Errores y carga
    if (loadingUser) {
        return;
    };
    if (!user) {
        dispatch(setShowLoginForm(true));
        return;
    };

    const gamesAdded = user.added;
    const handleClick = (id: string) => {
        navigate(`/set-game/${id}`);
        dispatch(setShowSelectSetGame(false));
    }

    return (
        <div className="select-set-game-container">
            <Box className="select-set-game-box">
                <div className="select-set-game-header">
                    <div className="select-set-game-header-content">
                        <h3 className="select-set-game-header-text">Seleciona un juego para editarlo</h3>
                        <IconButton onClick={() => dispatch(setShowSelectSetGame(false))} size="small" className="select-set-game-header-close">
                            <CloseIcon className="select-set-game-close"/>
                        </IconButton>
                    </div>
                </div>
                <div className="select-set-game-content">
                    {gamesAdded.length === 0 && !loadingUser ? 
                    <div>
                    <p className="games-no">No hay juegos para mostrar</p>
                    <BlindIcon className="games-no-sad"/>
                    </div> : 
                    (gamesAdded.map((game, index) => (
                    <div className="games-card" key={index} onClick={() => handleClick(game.id)}>
                        <img src={game.image} alt="No se encontró la imágen" className="games-image"/>
                        <h2 className="games-name">{game.name.length > 35 ? game.name.slice(0,30).concat("...") : game.name}</h2>
                    </div>
                    )))}
                </div>
            </Box>
        </div>
    )
};

export default SelectSetGame;