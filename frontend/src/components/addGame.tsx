import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Autocomplete from '@mui/material/Autocomplete';
import React, { useState } from "react";
import type { GameData } from "../types/games";
import gamesService from "../services/games";
import { useNavigate } from "react-router-dom";
import type { User } from "../types/users";

interface AddGameProps {
  user: User | null;
  addGameToState?: (newGame: GameData) => void;
  openLogin: () => void;
}

const genreOptions = ["Action", "Adventure", "RPG", 
    "Platform", "Sandbox", "Survival", "Shooter", 
    "Sci-Fi", "Fantasy", "Open World", "Multiplayer", 
    "Team-Based", "MOBA", "Strategy", "Tactical", 
    "Battle Royale", "Indie", "Rogue like", "souls like"];

const currentYear = new Date().getFullYear();
const yearOptions = Array.from({length: currentYear - 1971}, (_, i) => 1972 + i).map((year) => year.toString())

const AddGame = ({user,addGameToState, openLogin}: AddGameProps) => {
    if (!user) {
        openLogin();
        return <p style={{marginTop:"90px"}}>Debes Iniciar sesión para poder agregar juegos</p>;
    };

    const [name, setName] = useState("");
    const [releaseYear, setReleaseYear] = useState<string | null>(null);
    const [creator, setCreator] = useState("");
    const [genres, setGenres] = useState<string[]>([]);
    const [image, setImage] = useState("");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const navigate = useNavigate();

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setErrorMessage(null);
        if (!name || !releaseYear || genres.length === 0 || !image || !description) {
            setErrorMessage("Por favor complete todos los campos obligatorios*")
            return;
        };
        const newGame: Omit<GameData, "id" | "rating">= {
            name,
            release_year: Number(releaseYear),
            creator: creator === "" ? "Desconocido" : creator,
            genre: genres,
            image,
            description
        };
        setLoading(true);
        gamesService.createGame(newGame).then((data) => {
            setName("");
            setReleaseYear(null);
            setCreator("");
            setGenres([]);
            setImage("");
            setDescription("");
            addGameToState?.(data)
        }).catch((error) => {
            console.error(error);
            setErrorMessage("Error al agregar el juego.");
        });
        setLoading(false);
        navigate("/");
    }

    return (
        <Box sx={{alignItems:"center", display:"flex", flexDirection:"column", marginTop:"30px"}}>
            <h1>Añadir nuevo Juego</h1>
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem", width: "300px" }}>
                <TextField 
                    label="Nombre del juego" 
                    multiline
                    required
                    maxRows={4}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    sx={{
                    input: { color: "white" },
                    label: { color: "white" },
                    fieldset: { borderColor: "white" },
                    "& .MuiInputBase-input": { color: "white" },
                    "& .MuiInputLabel-root": { color: "white" },
                    "& .MuiOutlinedInput-root fieldset": { borderColor: "white" },
                }}/>

                <Autocomplete
                    options={yearOptions}
                    value={releaseYear}
                    onChange={(_, value) => setReleaseYear(value)}
                    sx={{
                        input: { color: "white" },
                        label: { color: "white" },
                        fieldset: { borderColor: "white" },
                    }}
                    renderInput={(params) => <TextField {...params} label="Año de lanzamiento" required />}
                />

                <TextField 
                    label="Creador" 
                    variant="outlined" 
                    value={creator}
                    onChange={(e) => setCreator(e.target.value)}
                    sx={{
                    input: { color: "white" },
                    label: { color: "white" },
                    fieldset: { borderColor: "white" },
                }}/>

                <Autocomplete
                    multiple
                    options={genreOptions}
                    value={genres}
                    onChange={(_, value) => setGenres(value)}
                    filterSelectedOptions
                    sx={{
                        input: { color: "white" },
                        label: { color: "white" },
                        fieldset: { borderColor: "white" },
                    }}
                    slotProps={{
                        chip: {
                            sx: {
                                backgroundColor:"white", 
                                color:"black",
                                fontWeight: 500,
                            }
                        }
                    }}
                    renderInput={(params) => (
                    <TextField
                        {...params}
                        label="Géneros"
                        sx={{color:"white"}}
                    />
                    )}
                />

                <TextField 
                    label="URL de imagen" 
                    required
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    sx={{
                    input: { color: "white" },
                    label: { color: "white" },
                    fieldset: { borderColor: "white" },
                }}/>

                <TextField 
                    label="Descripción" 
                    multiline
                    required
                    maxRows={6}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    sx={{
                    input: { color: "white" },
                    label: { color: "white" },
                    fieldset: { borderColor: "white" },
                    "& .MuiInputBase-input": { color: "white" },
                    "& .MuiInputLabel-root": { color: "white" },
                    "& .MuiOutlinedInput-root fieldset": { borderColor: "white" },
                }}/>

                {errorMessage && <span style={{color:"red"}}>{errorMessage}</span>}

                <Button type="submit" variant="contained" disabled={loading} style={{backgroundColor: "black"}}>{loading ? "Agregando..." : "Agregar juego"}</Button>
            </form>
        </Box>
    )
};

export default AddGame;