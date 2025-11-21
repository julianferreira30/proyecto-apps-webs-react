import { TextField, Box, Autocomplete, Fade, Button } from "@mui/material";
import React, { useEffect, useState } from "react";
import type { GameData } from "../types/games";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { type AppDispatch, type RootState } from "../store";
import { restoreSession, setShowLoginForm } from "../reducers/userReducer";
import { setError, setFilteredGames, setGames, updateOneGame } from "../reducers/gameReducer";
import { validateInputGenre, validateInputNumber, validateInputString, validateInputStringImage } from "../utils/validations";
import { setFilters, type Filter } from "../reducers/filterReducer";
import LoginIcon from '@mui/icons-material/Login';
import { SearchOff } from "@mui/icons-material";


// Opciones para categorias del formulario
const genreOptions = ["Acción", "Aventura", "Battle Royale", "Carrera", "Ciencia Ficción",
    "Deportes", "Estrategia", "Fantasia", "Indie", "Metroidvania", "MOBA", "Multiplayer",
    "Mundo Abierto", "Party Game", "Peleas", "Plataforma", "Rogue Like", "RPG", "Sandbox",
    "Shooter", "Sigilo", "Simulador", "Souls Like", "Superheroes", "Survival", "Tactical",
    "Team-Based", "Terror"
];

const currentYear = new Date().getFullYear();
const yearOptions = Array.from({length: currentYear - 1971}, (_, i) => 1972 + i).map((year) => year.toString())



const SetGame = () => {
    // Store Navegación y parámetros
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const { id } = useParams<{id: string}>();
    const games = useSelector((state: RootState) => state.games.games)
    const error = useSelector((state: RootState) => state.games.error);
    const loadingGames = useSelector((state: RootState) => state.games.loading);
    const user = useSelector((state: RootState) => state.user.user);
    const loadingUser = useSelector((state: RootState) => state.user.loading);
    const filters = useSelector((state: RootState) => state.filters.filters);


    // Estados locales
    const [name, setName] = useState("");
    const [releaseYear, setReleaseYear] = useState<string>("");
    const [creator, setCreator] = useState("");
    const [genres, setGenres] = useState<string[]>([]);
    const [image, setImage] = useState("");
    const [description, setDescription] = useState("");
    const [initialized, setInitialized] = useState(false);
    const [initialName, setInitialName] = useState("");


    // Errores y carga
    useEffect(() => {
        dispatch(restoreSession());
    }, [dispatch]);
    useEffect(() => {
        if (!loadingUser) {
            dispatch(setShowLoginForm(!user))
            return;
        };
    }, [loadingUser, user, dispatch])
    useEffect(() => {
        if (!user) {
            setInitialized(false);
            return;
        };

        const found = user.added.find((g) => g.id === id)
        if (found) {
            setName(found.name);
            setReleaseYear(found.release_year.toString());
            setCreator(found.creator);
            setGenres(found.genre);
            setImage(found.image);
            setDescription(found.description);
            setInitialName(found.name);
            setInitialized(true);
        } else {
            setInitialized(false);
        }
    }, [user, id])

    const nameError = name.trim().length > 100;
    const creatorError = creator.trim().length > 100;
    const pattern = /^https?:\/\/.*\.(png|jpg|jpeg|gif|bmp|webp|svg)$/i;
    const urlError = image.trim() ? !pattern.test(image.trim()) : false;
    const urlLenError = image.trim().length > 300;
    const descriptionError = description.trim().length > 500;

    if (loadingUser) {
        return;
    }
    if (!user) {
        return <div style={{marginTop:"10vw"}}>
            <p>Debes iniciar sesión para poder editar juegos</p>
            <LoginIcon />
        </div>
    }
    if (!initialized) {
        return <div style={{marginTop:"10vw"}}>
            <p>Juego no encontrado</p>
            <SearchOff />
        </div>
    }


    // Submit game
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        dispatch(setError(null));
        if (!validateInputString(name, 1, 100) || 
            !validateInputNumber(Number(releaseYear), 1972, new Date().getFullYear()) ||
            !validateInputGenre(genres) ||
            !validateInputStringImage(image) ||
            !validateInputString(description, 300, 500)) {
            dispatch(setError("Asegúrate de llenar los campos en forma correcta"));
            setTimeout(() => {
                dispatch(setError(null));
            }, 10000);
            return;
        }

        const newGame: Omit<GameData, "id" | "rating" | "reviews">= {
            name,
            release_year: Number(releaseYear),
            creator: creator,
            genre: genres,
            image,
            description
        };
        const updatedGame = await dispatch(updateOneGame(newGame, id!!));
        const updatedGames = games.map((game) => game.id === id ? updatedGame : game);
        dispatch(setGames(updatedGames))
        const newFiltered = updatedGames.filter((game) =>
        (filters.year === null || game.release_year === filters.year) &&
        (filters.genre === null || game.genre.includes(filters.genre)) &&
        (filters.creator === null || game.creator.includes(filters.creator)) &&
        (filters.rating === null || game.rating === filters.rating)
        );
        dispatch(setFilteredGames(newFiltered))
        
        setName(updatedGame.name);
        setReleaseYear(updatedGame.release_year.toString());
        setCreator(updatedGame.creator);
        setGenres(updatedGame.genre);
        setImage(updatedGame.image);
        setDescription(updatedGame.description);

        const initialFilter: Filter = {
            year: null,
            genre: null,
            creator: null,
            rating: null,
            sort: null,
        }
        dispatch(setFilters(initialFilter))

        navigate("/");
    }

    return (
        <div className="add-game">
        <Box className="add-game-box">
            <h1 className="add-game-title">Editar {initialName}</h1>
            <form className="add-game-form" onSubmit={handleSubmit}>
                <TextField 
                    className="add-game-text-input"
                    label="Nombre del juego" 
                    multiline
                    variant="filled" 
                    maxRows={4}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                {nameError && (
                    <Fade in={!!nameError} timeout={1000}>
                        <span className="error-add-game">
                        El nombre del juego debe tener menos de 100 caracteres
                        </span>
                    </Fade>
                )}

                <Autocomplete
                    className="add-game-autocomplete-input"
                    options={yearOptions}
                    value={releaseYear}
                    onChange={(_, value) => setReleaseYear(value!!)}
                    slotProps={{
                        paper: {
                        sx: {
                            backgroundColor: "#a1acb4",
                            "& .MuiAutocomplete-option": {
                            color: "#4c575e",
                            "&[aria-selected='true']": {
                                backgroundColor: "#3e5161",
                                color: "white",
                                fontWeight: "bolder"
                            },
                            "&.Mui-focused": {
                                backgroundColor: "#76858f",
                                color: "white"
                            },
                            },
                        },
                        },
                    }}
                    renderInput={(params) => <TextField 
                        {...params} 
                        label="Año de lanzamiento" 
                        variant="filled"
                        className="add-game-text-autocomplete"
                    />}
                />

                <TextField 
                    className="add-game-text-input"
                    label="Creador"
                    multiline 
                    variant="filled" 
                    value={creator}
                    maxRows={2}
                    onChange={(e) => setCreator(e.target.value)}
                />

                {creatorError && (
                    <Fade in={!!creatorError} timeout={1000}>
                        <span className="error-add-game">
                        Creador debe tener menos de 100 caracteres
                        </span>
                    </Fade>
                )}

                <Autocomplete
                    className="add-game-autocomplete-input"
                    multiple
                    options={genreOptions}
                    value={genres}
                    onChange={(_, value) => setGenres(value)}
                    filterSelectedOptions
                    slotProps={{
                        paper: {
                        sx: {
                            backgroundColor: "#a1acb4",
                            "& .MuiAutocomplete-option": {
                            color: "#4c575e",
                            "&[aria-selected='true']": {
                                backgroundColor: "#1f0055ff",
                                fontWeight: "bolder"
                            },
                            "&.Mui-focused": {
                                backgroundColor: "#a1acb4",
                            },
                            },
                        },
                        },
                    }}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Géneros"
                            variant="filled"
                            className="add-game-text-autocomplete"
                        />)}
                />

                <TextField 
                    className="add-game-text-input"
                    label="URL de imagen" 
                    multiline
                    maxRows={7}
                    variant="filled"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                />

                {urlError && (
                    <Fade in={!!urlError} timeout={1000}>
                        <span className="error-add-game">
                        Asegúrate de que la url comience con http:// o https:// y termine con una extensión de imagen como .jpg, .png, .gif, etc.
                        </span>
                    </Fade>
                )}

                {urlLenError && (
                    <Fade in={!!urlLenError} timeout={1000}>
                        <span className="error-add-game">
                        La url debe tener menos de 300 caracteres
                        </span>
                    </Fade>
                )}

                <TextField 
                    className="add-game-text-input"
                    label="Descripción (mínimo 300 caracteres)" 
                    multiline
                    variant="filled"
                    maxRows={10}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />

                {descriptionError && (
                    <Fade in={!!descriptionError} timeout={1000}>
                        <span className="error-add-game">
                        La descripción debe tener menos de 500 caracteres
                        </span>
                    </Fade>
                )}

                <div className="add-game-submit-container">
                    <Button type="submit" variant="contained" disabled={loadingGames} className="add-game-submit">{loadingGames ? "Editando..." : "Editar juego"}</Button>
                </div>
                {error && 
                    <Fade in={!!error} timeout={1000}>
                    <span className="error-add-game">
                        {error}
                    </span>
                    </Fade>}
            </form>
        </Box>
        </div>
    )
};

export default SetGame;